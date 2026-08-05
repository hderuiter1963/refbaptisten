// Telt paginaweergaves (niet: unieke bezoekers — geen cookies/IP-opslag,
// simpel en privacyvriendelijk) per week en per maand in Vercel KV.
// Draait via de Vercel-adapter als Edge Middleware, dus ook vóór statisch
// geserveerde pagina's — niet alleen voor de ene serverless route
// (/api/contact/) die de rest van de site heeft.
//
// Let op: redirects voor oude WordPress-URL's staan niet hier, maar als
// losse .astro-bestanden in src/pages/ (elk met `Astro.redirect(...)`) —
// zie REDIRECTS.md voor de achtergrond.
import { defineMiddleware } from 'astro:middleware';
import { kv } from '@vercel/kv';

// Alles wat geen "pagina" is (assets, API's, feeds) telt niet mee.
const SKIP_RE = /\.(css|js|mjs|png|jpe?g|gif|svg|webp|avif|ico|pdf|woff2?|ttf|xml|txt|json|map)$/i;

export const onRequest = defineMiddleware(async (context, next) => {
	const { pathname } = context.url;
	const isPageRequest =
		context.request.method === 'GET' && !pathname.startsWith('/api/') && !pathname.startsWith('/_astro/') && !SKIP_RE.test(pathname);

	if (isPageRequest) {
		// Bewust niet awaiten: de telling mag de eigenlijke pagina niet vertragen.
		// Fouten (bv. KV nog niet gekoppeld) mogen de site nooit breken.
		trackPageview().catch(() => {});
	}

	return next();
});

async function trackPageview() {
	const now = new Date();
	const monthKey = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
	const weekKey = isoWeekKey(now);

	await Promise.all([
		kv.incr(`pv:month:${monthKey}`),
		kv.sadd('pv:months', monthKey),
		kv.incr(`pv:week:${weekKey}`),
		kv.sadd('pv:weeks', weekKey),
		kv.incr('pv:total'),
	]);
}

// ISO-8601 weeknummer (bv. "2026-W32"), zodat weken maandag-zondag lopen
// en consistent zijn ongeacht tijdzone-eigenaardigheden.
function isoWeekKey(date: Date): string {
	const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
	const dayNum = d.getUTCDay() || 7;
	d.setUTCDate(d.getUTCDate() + 4 - dayNum);
	const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
	return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}
