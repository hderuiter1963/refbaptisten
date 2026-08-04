import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// De 4 subcategorieën onder "Publicaties" (zie src/data/publicationCategories.ts).
const publicationCategory = z.enum([
	'doop',
	'praktisch-theologisch',
	'systematisch-theologisch',
	'historische-achtergrond',
]);

// Eenvoudige tekstpagina's (Over ons, Contact, Kerkdiensten, ...).
// Elke pagina is een Markdown-bestand in src/content/pages/, met de
// bestandsnaam als URL-slug (bv. over-ons.md -> /over-ons/).
const pages = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		// volgorde in overzichten/navigatie (laag = eerst); optioneel
		order: z.number().optional(),
		// Optionele "Bijbelteksten"-zijbalk, zoals op de Verbond & Doop-pagina's
		// van de oorspronkelijke site (hoofdtekst + bijbehorende schriftteksten).
		scripture: z
			.array(
				z.object({
					ref: z.string(),
					text: z.string(),
				})
			)
			.optional(),
	}),
});

// Berichten/artikelen (vervangt de WordPress "Recente berichten"-widget).
// Elk bestand is 1 bericht; de bestandsnaam is de URL-slug, gelijk aan de
// oorspronkelijke WordPress-URL zodat oude links blijven werken.
const posts = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		description: z.string().optional(),
		// Sommige berichten horen óók bij een Publicaties-categorie (zelfde
		// artikel, geen aparte publications-entry nodig — dat zou op dezelfde
		// URL botsen).
		category: publicationCategory.optional(),
		image: z.string().optional(),
	}),
});

// Artikelen onder "Publicaties", ingedeeld in 4 subcategorieën. Elk bestand
// is 1 artikel; de bestandsnaam is de URL-slug, gelijk aan de oorspronkelijke
// WordPress-URL zodat oude links blijven werken.
const publications = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/publications' }),
	schema: z.object({
		title: z.string(),
		category: publicationCategory,
		date: z.coerce.date().optional(),
		description: z.string().optional(),
		image: z.string().optional(),
	}),
});

// Downloadbare documenten/PDF's die in public/docs/ staan.
// Handig om ze overzichtelijk te tonen op een "Documenten"-pagina.
const documents = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/documents' }),
	schema: z.object({
		title: z.string(),
		// pad relatief aan public/, bv. /docs/jaarverslag-2025.pdf
		file: z.string(),
		description: z.string().optional(),
		date: z.coerce.date().optional(),
	}),
});

export const collections = { pages, posts, publications, documents };
