// Bewaart de persoonlijke DomiNations-collectie (/dominations/, tab "Mijn
// collectie") in Vercel KV, zodat die een browser-reset overleeft en op meerdere
// apparaten beschikbaar is. Beveiligd met één wachtwoord.
//
// Vereiste environment variable (instellen in Vercel: Settings → Environment
// Variables, NIET in git — de repo is openbaar):
//   DOMINATIONS_PASSWORD   het wachtwoord voor de pagina
//
// Het wachtwoord gaat mee in de header `x-dn-key`. Na 10 foute pogingen
// binnen 15 minuten (per IP) wordt verder proberen tijdelijk geblokkeerd.

import type { APIRoute } from 'astro';
import { kv } from '@vercel/kv';
import { createHash, timingSafeEqual } from 'node:crypto';

export const prerender = false;

const DATA_KEY = 'dn:mine';
const MAX_BYTES = 100_000;

const json = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const digest = (s: string) => createHash('sha256').update(s).digest();

async function authorize(request: Request): Promise<Response | null> {
	const expected = process.env.DOMINATIONS_PASSWORD || import.meta.env.DOMINATIONS_PASSWORD;
	if (!expected) return json({ ok: false, error: 'Wachtwoord is nog niet ingesteld op de server.' }, 503);

	const ip = (request.headers.get('x-forwarded-for') ?? 'onbekend').split(',')[0].trim();
	const failKey = `dn:fail:${ip}`;
	try {
		const fails = (await kv.get<number>(failKey)) ?? 0;
		if (fails >= 10) return json({ ok: false, error: 'Te veel pogingen, probeer het later opnieuw.' }, 429);
	} catch {
		// KV niet bereikbaar: de wachtwoordcheck blijft gewoon gelden.
	}

	const given = request.headers.get('x-dn-key') ?? '';
	if (timingSafeEqual(digest(given), digest(expected))) return null;

	try {
		const n = await kv.incr(failKey);
		if (n === 1) await kv.expire(failKey, 900);
	} catch {}
	return json({ ok: false, error: 'Wachtwoord onjuist.' }, 401);
}

export const GET: APIRoute = async ({ request }) => {
	const denied = await authorize(request);
	if (denied) return denied;
	try {
		return json({ ok: true, mine: (await kv.get(DATA_KEY)) ?? null });
	} catch {
		return json({ ok: false, error: 'Opslag (KV) is niet bereikbaar.' }, 502);
	}
};

export const PUT: APIRoute = async ({ request }) => {
	const denied = await authorize(request);
	if (denied) return denied;

	const text = await request.text();
	if (text.length > MAX_BYTES) return json({ ok: false, error: 'Te groot.' }, 413);
	let mine: any;
	try {
		mine = JSON.parse(text);
	} catch {
		return json({ ok: false, error: 'Ongeldige data.' }, 400);
	}
	if (!mine || !Array.isArray(mine.c) || !Array.isArray(mine.a)) return json({ ok: false, error: 'Ongeldige data.' }, 400);

	try {
		await kv.set(DATA_KEY, { c: mine.c, a: mine.a, aOff: mine.aOff ?? [], lim: mine.lim ?? {} });
		return json({ ok: true });
	} catch {
		return json({ ok: false, error: 'Opslag (KV) is niet bereikbaar.' }, 502);
	}
};
