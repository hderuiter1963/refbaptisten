// Centrale plek voor de hoofdnavigatie en footer-links.
// Weerspiegelt de hoofdmenu-structuur van de bestaande site. Items met
// `children` krijgen automatisch een uitklapmenu (zie Nav.astro).

export interface NavLink {
	label: string;
	href: string;
	children?: NavLink[];
}

export const mainNav: NavLink[] = [
	{ label: 'Home', href: '/' },
	{
		label: 'Verbond & Doop',
		href: '/verbond-doop/',
		children: [
			{ label: 'Werkverbond', href: '/genesis-3/' },
			{ label: 'Verbond Noach', href: '/verbond-noach/' },
			{ label: 'Verbond Abraham', href: '/verbond-abraham/' },
			{ label: 'Oude Verbond', href: '/oude-verbond/' },
			{ label: 'Nieuwe Verbond', href: '/nieuwe-verbond/' },
			{ label: 'Doop', href: '/doop/' },
		],
	},
	{
		label: 'Kinderdoop',
		href: '/kinderdoop/',
		children: [
			{ label: 'Doopformulier', href: '/doopformulier/' },
			{ label: 'Heidelbergse catechismus', href: '/heidelbergse-catechismus/' },
			{ label: 'Geloofsbelijdenis', href: '/geloofsbelijdenis/' },
		],
	},
	{
		label: 'Publicaties',
		href: '/publicaties/',
		children: [
			{ label: 'Artikelen m.b.t. de doop', href: '/doop-publicaties/' },
			{ label: 'Praktisch Theologische onderwerpen', href: '/praktisch-theologische-onderwerpen/' },
			{ label: 'Systematisch Theologische onderwerpen', href: '/systematisch-theologische-onderwerpen/' },
			{ label: 'Historische achtergrond', href: '/historische-achtergrond/' },
		],
	},
	{ label: 'Gemeenten', href: '/gemeenten/' },
];

export const footerNav: NavLink[] = [{ label: 'Berichten', href: '/berichten/' }];

export const siteMeta = {
	title: 'Reformatorische Baptisten',
	// TODO: vul aan zodra bekend (stond niet op de homepage van de huidige site)
	email: '',
	phone: '',
	address: '',
};
