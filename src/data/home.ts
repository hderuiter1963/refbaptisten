// Statische homepage-content: verandert zelden, dus geen content collection
// maar gewoon direct hier bewerken.

export interface FeatureCard {
	image: string;
	alt: string;
	title: string;
	text: string;
}

export const featureCards: FeatureCard[] = [
	{
		image: '/images/home/card-fundamenteel-gesprek.jpg',
		alt: 'Groep mensen in gesprek',
		title: 'Fundamenteel gesprek',
		text: 'Spreken over de doop is voor velen vaak een gevoelige aangelegenheid. Het is niet de bedoeling om ons te verliezen in de bekende en soms verhitte tegenstelling: de doop als verbondsteken voor gezinnen óf als geloofsdoop voor het individu. Het gaat veel meer om de diepere laag daaronder, namelijk het wezen van de doop: betekenis voor geloof & geweten.',
	},
	{
		image: '/images/home/card-verbondsleer.jpg',
		alt: 'Hand die naar een kruis reikt bij zonsondergang',
		title: 'Verbondsleer',
		text: 'De leer van Calvijn over de verbonden is discutabel. Calvijn beargumenteert dat het verbond met Israël is overgegaan naar de kerk. Echter, leert de Bijbel niet dat alle verbonden gesloten zijn met het huis van Israël en Juda. Hoe kunnen de gelovigen uit de "heidenen" participeren in de beloften gegeven aan Abraham, want in Christus zijn we mede-erfgenaam van de beloften.',
	},
	{
		image: '/images/home/card-doop-sacrament.jpg',
		alt: 'Oude dooptuin/baptisterium ruïne',
		title: 'Doop sacrament',
		text: 'Sacramenten zijn zeer belangrijke onderdelen van de christelijke leer. Daar waar de Rooms katholieke kerk er zeven kent, kent de reformatie er twee: doop en avondmaal. Sacrament wil aangeven dat er iets gebeurd bij het uitvoeren van het sacrament. Bij het avondmaal "de verkondiging van de dood van Jezus, totdat Hij komt." Maar wat gebeurt er tijdens de doop?',
	},
];

export interface VooruitblikItem {
	title: string;
	text: string;
}

export const vooruitblik: VooruitblikItem[] = [
	{
		title: 'Kerkelijke denominaties',
		text: 'bezinning op kerkstructuren. Na de reformatie is het christelijk landschap uiteengevallen in duizenden kerkgenootschappen. Was dit nu de bedoeling? Moeten we naar vrije kerken of juist terug naar Rome?',
	},
];
