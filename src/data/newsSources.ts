// Externe RSS-bronnen voor het "Reformed Baptists wereldwijd"-blok op de
// homepage. Bewust een kleine, handmatig gecureerde lijst i.p.v. een grote
// automatische aggregator — zo blijft duidelijk welke bronnen we vertrouwen.
//
// Let op bij het toevoegen van een nieuwe bron: test eerst of de feed-URL
// zonder browser-achtige headers bereikbaar is (sommige sites, zoals
// founders.org, zitten achter Cloudflare-botbescherming en blokkeren de
// build-server — die zijn dus niet bruikbaar hier).
export interface NewsSource {
	name: string;
	feedUrl: string;
	homepage: string;
}

export const newsSources: NewsSource[] = [
	{
		name: 'Reformed Baptist Network',
		feedUrl: 'https://reformedbaptistnetwork.com/feed/',
		homepage: 'https://reformedbaptistnetwork.com/',
	},
	{
		name: 'Reformed Baptist Blog',
		feedUrl: 'https://reformedbaptistblog.com/feed/',
		homepage: 'https://reformedbaptistblog.com/',
	},
	{
		name: 'A Reformed Baptist in Namibia',
		feedUrl: 'https://jrieck.blogspot.com/feeds/posts/default?alt=rss',
		homepage: 'https://jrieck.blogspot.com/',
	},
	{
		name: '9Marks',
		feedUrl: 'https://9marks.org/feed/',
		homepage: 'https://9marks.org/',
	},
	{
		// Sola 5: netwerk van (o.a. reformed baptist) gemeenten in Zuidelijk
		// Afrika — Zuid-Afrika, Malawi e.o. Erg actief, dus een goede
		// aanvulling naast de rustigere Namibische stem hierboven.
		name: 'Sola 5 (Zuidelijk Afrika)',
		feedUrl: 'https://sola5.org/feed/',
		homepage: 'https://sola5.org/',
	},
];
