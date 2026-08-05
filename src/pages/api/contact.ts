// Serverless functie (draait alleen deze route server-side op Vercel, de
// rest van de site blijft statisch — zie `prerender = false` hieronder).
// Verstuurt het contactformulier via SMTP met Nodemailer, geen externe
// formulier-dienst nodig.
//
// Vereiste environment variables (instellen in Vercel: Settings →
// Environment Variables, NIET in dit bestand of in git):
//   SMTP_HOST   bv. smtp-mail.outlook.com
//   SMTP_PORT   bv. 587
//   SMTP_USER   het volledige e-mailadres, bv. hderuiter@outlook.com
//   SMTP_PASS   app-wachtwoord van dat account
//   CONTACT_TO  (optioneel) ontvangend adres; standaard gelijk aan SMTP_USER

import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const prerender = false;

function isValidEmail(value: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export const POST: APIRoute = async ({ request }) => {
	let data: Record<string, string>;
	try {
		const form = await request.formData();
		data = Object.fromEntries(form.entries()) as Record<string, string>;
	} catch {
		return new Response(JSON.stringify({ ok: false, error: 'Ongeldig formulier.' }), { status: 400 });
	}

	const name = (data.name ?? '').trim();
	const email = (data.email ?? '').trim();
	const message = (data.message ?? '').trim();
	// Honeypot: onzichtbaar veld voor mensen (via CSS), bots vullen het vaak
	// blindelings in. Staat het gevuld? Dan doen we alsof het gelukt is,
	// zonder daadwerkelijk een mail te versturen.
	const honeypot = (data.website ?? '').trim();

	if (honeypot) {
		return new Response(JSON.stringify({ ok: true }), { status: 200 });
	}

	if (!name || !email || !message) {
		return new Response(JSON.stringify({ ok: false, error: 'Vul alle velden in.' }), { status: 400 });
	}
	if (!isValidEmail(email)) {
		return new Response(JSON.stringify({ ok: false, error: 'Ongeldig e-mailadres.' }), { status: 400 });
	}

	const SMTP_HOST = import.meta.env.SMTP_HOST;
	const SMTP_PORT = Number(import.meta.env.SMTP_PORT ?? 587);
	const SMTP_USER = import.meta.env.SMTP_USER;
	const SMTP_PASS = import.meta.env.SMTP_PASS;
	const CONTACT_TO = import.meta.env.CONTACT_TO || SMTP_USER;

	if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
		console.error('Contactformulier: SMTP-omgevingsvariabelen ontbreken.');
		return new Response(JSON.stringify({ ok: false, error: 'Serverconfiguratie ontbreekt. Probeer het later opnieuw.' }), { status: 500 });
	}

	const transporter = nodemailer.createTransport({
		host: SMTP_HOST,
		port: SMTP_PORT,
		secure: SMTP_PORT === 465,
		auth: { user: SMTP_USER, pass: SMTP_PASS },
	});

	try {
		await transporter.sendMail({
			from: SMTP_USER, // moet het geauthenticeerde adres zijn, anders weigert de provider het
			to: CONTACT_TO,
			replyTo: `${name} <${email}>`,
			subject: `Contactformulier: bericht van ${name}`,
			text: `Naam: ${name}\nE-mail: ${email}\n\n${message}`,
			html: `<p><strong>Naam:</strong> ${escapeHtml(name)}</p><p><strong>E-mail:</strong> ${escapeHtml(email)}</p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
		});
	} catch (err) {
		console.error('Contactformulier: versturen mislukt', err);
		return new Response(JSON.stringify({ ok: false, error: 'Versturen is mislukt. Probeer het later opnieuw.' }), { status: 502 });
	}

	return new Response(JSON.stringify({ ok: true }), { status: 200 });
};

function escapeHtml(value: string): string {
	return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);
}
