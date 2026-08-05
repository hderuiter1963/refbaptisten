// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
	site: 'https://www.refbaptisten.nl',

	// WordPress-permalinks eindigen doorgaans op een slash (bv. /over-ons/).
	// 'always' houdt dat aan zodat oude links zoveel mogelijk blijven werken.
	trailingSlash: 'always',
	build: {
		format: 'directory',
	},

	// De site blijft verder volledig statisch; alleen src/pages/api/contact.ts
	// (die zelf `export const prerender = false` heeft) draait als losse
	// serverless function op Vercel, voor het contactformulier.
	adapter: vercel(),

	// Oude WordPress-URL's die niet (meer) op dezelfde plek staan.
	// Zie REDIRECTS.md voor de volledige toelichting per regel.
	redirects: {
		// Teaser-pagina's / dubbele of verkorte URL's, samengevoegd tot 1 pagina.
		'/de-doop-van-het-kind-belofte-of-verwarring/': {
			status: 301,
			destination: '/de-doop-van-het-kind-belofte-of-verwarring-een-baptistische-reflectie-op-kerkelijke-verdeeldheid/',
		},
		'/maarten-luther-over-de-doop-een-kritische-beschouwing/': {
			status: 301,
			destination: '/maarten-luther-en-de-doop/',
		},
		'/776-2/': {
			status: 301,
			destination: '/geen-kiem-maar-keuze-een-bijbelse-kritiek-op-calvijns-kinderdooptheologie/',
		},
		'/de-kinderdoop-getoetst-aan-de-schrift-exegese-of-eisegese/': {
			status: 301,
			destination: '/kinderdoop-exegese-of-eisegese/',
		},
		'/850-2/': {
			status: 301,
			destination: '/doop-van-jezus-en-de-rode-lijn-in-de-schrift/',
		},
		'/exegese-doen-reformatorisch-baptists/': {
			status: 301,
			destination: '/exegese-doen-reformatorisch-baptist/',
		},
		// Niet overgezette pagina's — naar de meest relevante bestaande plek.
		'/missie-en-visie/': { status: 301, destination: '/' },
		'/auteur/': { status: 301, destination: '/' },
		'/media/': { status: 301, destination: '/' },
		'/lezingen/': { status: 301, destination: '/' },
		'/845-2/': { status: 301, destination: '/praktisch-theologische-onderwerpen/' },
	},
});
