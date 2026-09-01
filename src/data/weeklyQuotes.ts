// "Citaat van de week" op de homepage — een korte, roterende Bijbeltekst of
// belijdenisregel. Bijbelteksten zijn in de HSV-vertaling, gelijk aan de
// vertaling die de rest van de site al gebruikt (zie bv. src/content/pages/
// doop.md), en woordelijk gecontroleerd tegen herzienestatenvertaling.nl.
// De belijdenisregels zijn de eigen samenvattingsformuleringen van deze site
// uit src/content/publications/samenvatting-van-de-1689-baptist-confession.md
// (geen citaat uit de belijdenis zelf, maar onze eigen samenvatting ervan).
export interface WeeklyQuote {
	text: string;
	ref: string;
}

export const weeklyQuotes: WeeklyQuote[] = [
	// De 5 sola's, elk met een bijbehorende bijbeltekst.
	{
		text: 'Uw woord is een lamp voor mijn voet en een licht op mijn pad.',
		ref: 'Psalm 119:105 — Sola Scriptura',
	},
	{
		text: 'Want uit genade bent u zalig geworden, door het geloof, en dat niet uit u, het is de gave van God; niet uit werken, opdat niemand zou roemen.',
		ref: 'Efeze 2:8-9 — Sola Gratia',
	},
	{
		text: 'Want de gerechtigheid van God wordt daarin geopenbaard uit geloof tot geloof, zoals geschreven is: Maar de rechtvaardige zal uit het geloof leven.',
		ref: 'Romeinen 1:17 — Sola Fide',
	},
	{
		text: 'En de zaligheid is in geen ander, want er is onder de hemel geen andere Naam onder de mensen gegeven waardoor wij zalig moeten worden.',
		ref: 'Handelingen 4:12 — Solus Christus',
	},
	{
		text: 'Want uit Hem, en door Hem, en tot Hem zijn alle dingen. Hem zij de heerlijkheid, tot in eeuwigheid. Amen.',
		ref: 'Romeinen 11:36 — Soli Deo Gloria',
	},
	{
		text: 'Want zo lief heeft God de wereld gehad, dat Hij Zijn eniggeboren Zoon gegeven heeft, opdat ieder die in Hem gelooft, niet verloren gaat, maar eeuwig leven heeft.',
		ref: 'Johannes 3:16',
	},
	// Uit de eigen samenvatting van de 1689 Baptistische Geloofsbelijdenis.
	{
		text: 'De Bijbel is het volmaakte, gezaghebbende Woord van God. Alles wat nodig is voor geloof en leven is daarin geopenbaard.',
		ref: '1689 Baptistische Geloofsbelijdenis — De Schrift',
	},
	{
		text: 'God verkiest uit genade mensen tot zaligheid – niet op grond van hun werken, maar naar Zijn welbehagen. Het geloof is een gave van God.',
		ref: '1689 Baptistische Geloofsbelijdenis — Genade en verkiezing',
	},
	{
		text: 'Alleen door het verzoenend werk van Jezus Christus, Gods Zoon, is er redding mogelijk. Hij stierf voor Zijn volk, droeg hun straf, en stond op uit de dood.',
		ref: '1689 Baptistische Geloofsbelijdenis — Verlossing door Christus',
	},
	{
		text: 'Christenen worden opgeroepen tot een heilig leven, in afhankelijkheid van Gods genade, met liefde tot God en de naaste.',
		ref: '1689 Baptistische Geloofsbelijdenis — Het leven als christen',
	},
];
