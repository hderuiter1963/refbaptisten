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
	// Nederlandse vertaling van title/snippet (alleen gezet als vertalen lukte).
	translated?: { title: string; snippet: string };
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

// Vertaalt titel + samenvatting naar het Nederlands via de Claude API, in één
// aanroep voor alle getoonde items. Gebeurt bewust build-time (2x per week via
// de cron) zodat de site statisch blijft. Zonder ANTHROPIC_API_KEY, bij een
// fout of bij onverwachte uitvoer blijft het Engels: de build faalt hier nooit op.
const TRANSLATE_MODEL = 'claude-haiku-4-5-20251001';

async function translateItems(items: WorldNewsItem[]): Promise<WorldNewsItem[]> {
	const apiKey = process.env.ANTHROPIC_API_KEY;
	if (!apiKey || items.length === 0) return items;

	try {
		const input = items.map((item, id) => ({ id, title: item.title, snippet: item.snippet }));
		const response = await fetch('https://api.anthropic.com/v1/messages', {
			method: 'POST',
			signal: AbortSignal.timeout(30000),
			headers: {
				'content-type': 'application/json',
				'x-api-key': apiKey,
				'anthropic-version': '2023-06-01',
			},
			body: JSON.stringify({
				model: TRANSLATE_MODEL,
				max_tokens: 2000,
				system:
					'Je vertaalt Engelstalige titels en korte samenvattingen van reformed-baptistische ' +
					'artikelen naar helder, natuurlijk Nederlands voor een kerkelijke website. Gebruik ' +
					'gangbare Nederlandse kerkelijke termen (covenant = verbond, elder = ouderling/oudste, ' +
					'gospel = evangelie, Reformed Baptist = reformatorisch baptist). Laat eigennamen en ' +
					'bronnamen ongemoeid. Voeg niets toe en laat niets weg; een afgekapte samenvatting ' +
					'(eindigend op …) blijft afgekapt. Antwoord uitsluitend met een JSON-array ' +
					'[{"id":number,"title":string,"snippet":string}] in dezelfde volgorde, zonder uitleg.',
				messages: [{ role: 'user', content: JSON.stringify(input) }],
			}),
		});
		if (!response.ok) throw new Error(`HTTP ${response.status}`);

		const data = await response.json();
		const text: string = data.content?.[0]?.text ?? '';
		const parsed = JSON.parse(text.slice(text.indexOf('['), text.lastIndexOf(']') + 1)) as {
			id: number;
			title: string;
			snippet: string;
		}[];

		return items.map((item, i) => {
			const t = parsed.find((p) => p.id === i);
			return t && typeof t.title === 'string' && typeof t.snippet === 'string'
				? { ...item, translated: { title: t.title.trim(), snippet: t.snippet.trim() } }
				: item;
		});
	} catch (err) {
		console.warn('Wereldnieuws: vertalen mislukt, toon originele tekst:', err);
		return items;
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
	const latest = perSource
		.flat()
		.sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0))
		.slice(0, limit);
	return translateItems(latest);
}
