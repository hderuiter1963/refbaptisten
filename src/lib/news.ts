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

// Standaard: precies 1 item per bron (zie newsSources.ts) — zo hoeft dit
// getal niet handmatig bijgewerkt te worden als er een bron bij komt of
// afgaat, en blijft de verdeling over bronnen altijd eerlijk.
export async function getWorldNews(limit = newsSources.length): Promise<WorldNewsItem[]> {
	const perSource = await Promise.all(newsSources.map(fetchSource));
	const sortByDateDesc = (items: WorldNewsItem[]) =>
		[...items].sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));

	// Ronde-tegen-ronde i.p.v. gewoon de N meest recente van alle bronnen
	// samen: anders domineert de meest actieve bron (bv. een netwerk dat
	// wekelijks post) het hele blokje en verdwijnt de bewust toegevoegde
	// variatie (bv. de stem uit Namibië) uit beeld.
	const queues = perSource.map(sortByDateDesc);
	const picked: WorldNewsItem[] = [];
	let round = 0;
	while (picked.length < limit && queues.some((q) => q.length > round)) {
		for (const queue of queues) {
			if (picked.length >= limit) break;
			if (queue[round]) picked.push(queue[round]);
		}
		round += 1;
	}
	// De ronde-tegen-ronde selectie hierboven bepaalt alleen wélke items
	// meedoen (eerlijk verdeeld over bronnen); voor het tonen sorteren we
	// die selectie alsnog op datum, nieuwste eerst.
	return sortByDateDesc(picked);
}
