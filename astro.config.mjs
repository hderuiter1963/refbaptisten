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

	// Let op: de redirects voor oude WordPress-URL's staan NIET hier, maar in
	// src/middleware.ts — de `redirects`-optie hier bleek in de praktijk ná
	// Vercel's eigen trailing-slash-normalisatie te komen, waardoor bv.
	// /776-2/ alsnog op een 404 uitkwam. Zie REDIRECTS.md voor de lijst.
});
