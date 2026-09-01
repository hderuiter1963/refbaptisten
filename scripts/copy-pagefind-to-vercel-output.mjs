// De Vercel-adapter (@astrojs/vercel) kopieert dist/client al naar
// .vercel/output/static tijdens `astro build` — vóórdat dit postbuild-
// script (dat pas draait ná de volledige "npm run build") de Pagefind-
// zoekindex genereert in dist/client/pagefind. Zonder deze kopieerstap zou
// de index dus wél lokaal bestaan, maar nooit in de daadwerkelijk
// gedeployde output belanden: /pagefind/... zou dan 404 geven in productie
// (precies wat er gebeurde vóór deze fix — zie git-historie).
import { access, cp } from 'node:fs/promises';

const vercelStaticDir = '.vercel/output/static';

try {
	await access(vercelStaticDir);
} catch {
	// Geen Vercel-adapter-output aanwezig (bv. een kale `astro build` zonder
	// adapter-copy, of een andere build-omgeving) — dan is er niets te doen.
	process.exit(0);
}

await cp('dist/client/pagefind', `${vercelStaticDir}/pagefind`, { recursive: true });
console.log('Pagefind-index gekopieerd naar .vercel/output/static/pagefind');
