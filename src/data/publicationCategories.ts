// Metadata voor de 4 subcategorieën onder "Publicaties". De `slug` komt
// overeen met de `category`-waarde in src/content/publications/*.md en met
// de bestandsnaam van de bijbehorende hub-pagina in src/pages/.

export interface PublicationCategory {
	slug: 'doop' | 'praktisch-theologisch' | 'systematisch-theologisch' | 'historische-achtergrond';
	title: string;
	href: string;
}

export const publicationCategories: PublicationCategory[] = [
	{ slug: 'doop', title: 'Artikelen m.b.t. de doop', href: '/doop-publicaties/' },
	{ slug: 'praktisch-theologisch', title: 'Praktisch Theologische onderwerpen', href: '/praktisch-theologische-onderwerpen/' },
	{ slug: 'systematisch-theologisch', title: 'Systematisch Theologische onderwerpen', href: '/systematisch-theologische-onderwerpen/' },
	{ slug: 'historische-achtergrond', title: 'Historische achtergrond', href: '/historische-achtergrond/' },
];
