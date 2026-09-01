// Bepaalt welk citaat uit weeklyQuotes.ts deze week getoond wordt. Puur een
// functie van de datum (ISO-weeknummer + jaar) — geen state, geen opslag
// nodig, en dankzij de wekelijkse rebuild (zie vercel.json) verandert het
// vanzelf elke week, ook zonder dat er verder iets aan de site verandert.
import { weeklyQuotes, type WeeklyQuote } from '../data/weeklyQuotes';

function getIsoWeek(date: Date): number {
	const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
	// Verschuif naar de donderdag van deze week (ISO 8601-definitie), dan
	// telt de jaarwisseling altijd bij het juiste jaar.
	const dayNum = d.getUTCDay() || 7;
	d.setUTCDate(d.getUTCDate() + 4 - dayNum);
	const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function getQuoteOfTheWeek(date: Date = new Date()): WeeklyQuote {
	const weekId = date.getUTCFullYear() * 100 + getIsoWeek(date);
	return weeklyQuotes[weekId % weeklyQuotes.length];
}
