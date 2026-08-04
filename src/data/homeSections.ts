import type { ScrollItem } from '../components/ScrollSection.astro';

// "Geschiedenis" — scrollbare sectie op de homepage. Voeg later gewoon een
// nieuw item toe aan deze array om een extra kaart te tonen.
export const geschiedenis: ScrollItem[] = [
	{
		image: '/images/home/geschiedenis-spurgeon.jpg',
		alt: 'Historische sepia-foto',
		text: `De wortels gaan terug tot de <strong>17e eeuw</strong>, toen gelovigen in Engeland op basis van Gods Woord gemeenten vormden die zowel vasthielden aan de <strong>reformatorische geloofsleer</strong> als aan de <strong>doop op geloof</strong>. Deze zogeheten <strong>Particular Baptists</strong> legden hun geloof vast in&hellip;`,
		href: '/historische-achtergrond/',
	},
];

// "Reformatorisch Baptist: Wie bepaalt?" — zelfde patroon.
export const wieBepaalt: ScrollItem[] = [
	{
		image: '/images/home/wie-bepaalt-richting.png',
		alt: 'Verkeersborden die verschillende richtingen op wijzen',
		text: `<strong>Niemand "boven" de gemeenten</strong> bepaalt dit. Reformed Baptists zijn congregationalistisch; er is geen paus, synode of wereldraad die het etiket uitdeelt. Identiteit wordt dus <strong>confessioneel</strong> (wat je belijdt) en <strong>kerkelijk</strong> (hoe je gemeente functioneert) bepaald.`,
		href: '/reformatorisch-baptisten/',
	},
];
