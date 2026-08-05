// 1. Verwerkt oude WordPress-URL's naar hun nieuwe plek (zie REDIRECTS.md).
//    Dit gebeurt hier i.p.v. via astro.config.mjs `redirects`, omdat die
//    laatste in de praktijk na Vercel's eigen trailing-slash-normalisatie
//    kwam te staan — waardoor bv. /776-2/ alsnog op een 404 uitkwam.
//    Middleware draait als Edge Middleware vóór die routing, dus dit werkt
//    altijd, ongeacht met/zonder trailing slash.
// 2. Telt paginaweergaves (niet: unieke bezoekers — geen cookies/IP-opslag)
//    per week en per maand in Vercel KV, voor de /statistiek/-pagina.
import { defineMiddleware } from 'astro:middleware';
import { kv } from '@vercel/kv';

// Normaliseer (geen trailing slash) → nieuwe bestemming.
const REDIRECTS: Record<string, string> = {
	// Teaser-pagina's / dubbele of verkorte URL's, samengevoegd tot 1 pagina.
	'/de-doop-van-het-kind-belofte-of-verwarring': '/de-doop-van-het-kind-belofte-of-verwarring-een-baptistische-reflectie-op-kerkelijke-verdeeldheid/',
	'/maarten-luther-over-de-doop-een-kritische-beschouwing': '/maarten-luther-en-de-doop/',
	'/776-2': '/geen-kiem-maar-keuze-een-bijbelse-kritiek-op-calvijns-kinderdooptheologie/',
	'/de-kinderdoop-getoetst-aan-de-schrift-exegese-of-eisegese': '/kinderdoop-exegese-of-eisegese/',
	'/850-2': '/doop-van-jezus-en-de-rode-lijn-in-de-schrift/',
	'/exegese-doen-reformatorisch-baptists': '/exegese-doen-reformatorisch-baptist/',
	// Niet overgezette pagina's — naar de meest relevante bestaande plek.
	'/missie-en-visie': '/',
	'/auteur': '/',
	'/media': '/',
	'/lezingen': '/',
	'/845-2': '/praktisch-theologische-onderwerpen/',
};

// Alles wat geen "pagina" is (assets, API's, feeds) telt niet mee voor de
// bezoekersstatistiek.
const SKIP_RE = /\.(css|js|mjs|png|jpe?g|gif|svg|webp|avif|ico|pdf|woff2?|ttf|xml|txt|json|map)$/i;

export const onRequest = defineMiddleware(async (context, next) => {
	const { pathname } = context.url;
	const withoutTrailingSlash = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;

	const destination = REDIRECTS[withoutTrailingSlash];
	if (destination) {
		return context.redirect(destination, 301);
	}

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
