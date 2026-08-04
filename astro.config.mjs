// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// TODO: zet dit op het definitieve domein zodra bekend (nodig voor sitemap/canonical urls)
	site: 'https://www.refbaptisten.nl',

	// WordPress-permalinks eindigen doorgaans op een slash (bv. /over-ons/).
	// 'always' houdt dat aan zodat oude links zoveel mogelijk blijven werken.
	trailingSlash: 'always',
	build: {
		format: 'directory',
	},
});
