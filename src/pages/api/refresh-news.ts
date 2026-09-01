// Serverless functie die de site opnieuw laat bouwen, zodat het
// "Reformed Baptists wereldwijd"-blok op de homepage (zie src/lib/news.ts)
// ook ververst in stille periodes waarin er verder niets aan de site
// verandert. Wordt wekelijks aangeroepen door de cron job in vercel.json.
//
// Vereiste environment variables (instellen in Vercel: Settings →
// Environment Variables, NIET in dit bestand of in git):
//   DEPLOY_HOOK_URL  de Vercel Deploy Hook-URL die een build van `main`
//                    start (Project → Settings → Git → Deploy Hooks)
//   CRON_SECRET      willekeurige sleutel; Vercel voegt deze automatisch
//                    toe als "Authorization: Bearer <CRON_SECRET>" header
//                    wanneer de cron job dit endpoint aanroept, zodat we
//                    kunnen verifiëren dat het verzoek echt van Vercel komt
//                    en niet van een willekeurige bezoeker die deze URL raadt.

import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
	const authHeader = request.headers.get('authorization');
	if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
		return new Response('Unauthorized', { status: 401 });
	}

	const deployHookUrl = process.env.DEPLOY_HOOK_URL;
	if (!deployHookUrl) {
		return new Response(JSON.stringify({ ok: false, error: 'DEPLOY_HOOK_URL ontbreekt.' }), { status: 500 });
	}

	try {
		const response = await fetch(deployHookUrl, { method: 'POST' });
		return new Response(JSON.stringify({ ok: response.ok, status: response.status }), {
			status: response.ok ? 200 : 502,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (err) {
		console.error('refresh-news: kon deploy hook niet aanroepen', err);
		return new Response(JSON.stringify({ ok: false, error: 'Deploy hook-aanroep mislukt.' }), { status: 502 });
	}
};
