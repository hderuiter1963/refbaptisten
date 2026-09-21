// Haalt berichten op uit externe RSS-feeds voor het "Reformed Baptists
// wereldwijd"-blok op de homepage (zie src/data/newsSources.ts).
//
// Bewust build-time (statisch) i.p.v. bij elk bezoek: de site blijft zo
// volledig statisch (zie astro.config.mjs) en snel, en is niet afhankelijk
// van de beschikbaarheid van externe sites tijdens een bezoek. De inhoud
// ververst vanzelf bij elke nieuwe build/deploy.
import Parser from 'rss-parser';
import { newsSources, type NewsSource } from '../data/newsSources';

export interface WorldNewsItem {
	title: string;
	link: string;
	sourceName: string;
	sourceHomepage: string;
	date: Date | null;
	snippet: string;
}

const parser = new Parser({ timeout: 8000 });

// Verwijdert HTML-tags en overtollige witruimte uit een RSS-samenvatting, en
// knipt af tot een korte tegeltekst. We tonen bewust alleen een korte
// samenvatting + link naar de bron, geen volledige artikelen (auteursrecht).
function toSnippet(html: string | undefined, maxLength = 140): string {
	if (!html) return '';
	const text = html
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
	if (text.length <= maxLength) return text;
	return `${text.slice(0, maxLength).trimEnd()}…`;
}

async function fetchSource(source: NewsSource): Promise<WorldNewsItem[]> {
	try {
		const feed = await parser.parseURL(source.feedUrl);
		return (feed.items ?? []).map((item) => ({
			title: item.title?.trim() ?? '(zonder titel)',
			link: item.link ?? source.homepage,
			sourceName: source.name,
			sourceHomepage: source.homepage,
			date: item.isoDate ? new Date(item.isoDate) : item.pubDate ? new Date(item.pubDate) : null,
			snippet: toSnippet(item.contentSnippet ?? item.content ?? item.summary),
		}));
	} catch (err) {
		// Eén trage/onbereikbare bron mag de build niet laten falen — het
		// wereldnieuws-blok verschijnt dan gewoon met de overige bronnen
		// (of helemaal niet als alle bronnen falen).
		console.warn(`Wereldnieuws: kon feed van "${source.name}" niet ophalen:`, err);
		return [];
	}
}

// Simpelweg de N meest recente items over alle bronnen samen, nieuwste
// eerst — ongeacht welke bron dat is. Een bron met al even niets nieuws
// (bv. Reformed Baptist Blog) valt dus vanzelf weg zodra andere bronnen
// recentere artikelen hebben, en komt vanzelf terug zodra die bron weer
// wat nieuws post. (Eerder verdeelden we bewust eerlijk over bronnen,
// maar dat hield ook oudere artikelen zichtbaar terwijl er elders al
// nieuwere waren — dat was niet de bedoeling.)
export async function getWorldNews(limit: number): Promise<WorldNewsItem[]> {
	const perSource = await Promise.all(newsSources.map(fetchSource));
	return perSource
		.flat()
		.sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0))
		.slice(0, limit);
}
