import { getCollection } from 'astro:content';
import type { PublicationCategory } from '../data/publicationCategories';

// Een categorie-hub toont zowel echte 'publications'-entries als 'posts' die
// toevallig ook bij die categorie horen (zie content.config.ts) — dat
// voorkomt duplicaten op dezelfde URL. Deze helper haalt beide op, normaliseert
// ze naar hetzelfde vorm en sorteert op datum (nieuwste eerst).

export interface CategoryItem {
	id: string;
	title: string;
	description?: string;
	image?: string;
	date?: Date;
}

export async function getCategoryItems(category: PublicationCategory['slug']): Promise<CategoryItem[]> {
	const [publications, posts] = await Promise.all([getCollection('publications'), getCollection('posts')]);

	const fromPublications: CategoryItem[] = publications
		.filter((p) => p.data.category === category)
		.map((p) => ({ id: p.id, title: p.data.title, description: p.data.description, image: p.data.image, date: p.data.date }));

	const fromPosts: CategoryItem[] = posts
		.filter((p) => p.data.category === category)
		.map((p) => ({ id: p.id, title: p.data.title, description: p.data.description, image: p.data.image, date: p.data.date }));

	return [...fromPublications, ...fromPosts].sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0));
}
