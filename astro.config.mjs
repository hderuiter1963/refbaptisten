// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// Losse redirect-pagina's voor oude WordPress-URL's (src/pages/*.astro, elk
// met `Astro.redirect(...)`) — zie REDIRECTS.md. Deze horen niet in de
// sitemap: ze zijn geen bestemming, alleen een doorverwijzing.
const REDIRECT_SLUGS = [
	'de-doop-van-het-kind-belofte-of-verwarring',
	'maarten-luther-over-de-doop-een-kritische-beschouwing',
	'776-2',
	'de-kinderdoop-getoetst-aan-de-schrift-exegese-of-eisegese',
	'850-2',
	'exegese-doen-reformatorisch-baptists',
	'missie-en-visie',
	'auteur',
	'media',
	'lezingen',
	'845-2',
];

// https://astro.build/config
export default defineConfig({
	site: 'https://www.refbaptisten.nl',

	// WordPress-permalinks eindigen doorgaans op een slash (bv. /over-ons/).
	// 'always' houdt dat aan zodat oude links zoveel mogelijk blijven werken.
	trailingSlash: 'always',
	build: {
		format: 'directory',
	},

	// De site blijft verder volledig statisch; alleen src/pages/api/contact.ts,
	// src/pages/statistiek.astro en de losse redirect-pagina's voor oude
	// WordPress-URL's (die zelf `export const prerender = false` hebben)
	// draaien als serverless functions op Vercel.
	//
	// Let op: redirects voor oude URL's staan NIET in de `redirects`-optie
	// hieronder (die bestaat wel, maar Astro compileert de source-patterns
	// altijd zónder trailing slash, terwijl deze site trailingSlash:'always'
	// gebruikt — het resultaat matcht dan nooit een binnenkomend verzoek en
	// valt terug op Vercel's generieke catch-all, die de status altijd naar
	// 404 dwingt). In plaats daarvan is elke oude URL een eigen .astro-bestand
	// in src/pages/ dat zelf `Astro.redirect(...)` aanroept — zie REDIRECTS.md.
	adapter: vercel(),

	integrations: [
		sitemap({
			// Uitgesloten: de verborgen statistiekpagina, het (nog) niet
			// gelinkte contactformulier, en alle losse redirect-pagina's voor
			// oude WordPress-URL's — die verwijzen alleen door en zijn zelf
			// geen bestemming, dus horen niet in de sitemap.
			filter: (page) => {
				const path = new URL(page).pathname;
				if (path === '/statistiek/' || path === '/contact/') return false;
				return !REDIRECT_SLUGS.some((slug) => path === `/${slug}/`);
			},
		}),
	],
});
