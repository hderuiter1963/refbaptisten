# Beslissingen en keuzes — refbaptisten.nl

Overzicht van de belangrijkere keuzes tijdens de omzetting van WordPress naar
deze statische Astro-site, en waarom. Voor de technische structuur zie
[README.md](./README.md); voor de oude-URL-redirects specifiek zie
[REDIRECTS.md](./REDIRECTS.md).

## Migratie & content

- **Content is overgezet, niet herschreven.** Elke pagina/artikel is
  rechtstreeks van de live WordPress-site gescrapet (ruwe HTML → Markdown),
  niet samengevat of geparafraseerd door AI — voor theologische teksten is
  letterlijke nauwkeurigheid belangrijker dan gemak.
- **Niet alles is overgezet.** Losse WP-widgets/subapplicaties (bv. de oude
  "Recente berichten"-widget) zijn vervangen door een directe oplossing
  binnen Astro zelf. Sommige oude pagina's (Missie & visie, Auteur, Media,
  Lezingen) zijn bewust niet meegenomen; die URL's redirecten nu naar de
  meest relevante bestaande pagina (zie REDIRECTS.md).
- **Menu-items geschrapt op verzoek:** "Lezingen/Preken" en "Berichten"
  staan niet meer in het hoofdmenu (berichten staan al op de homepage/onder
  `/berichten/`).
- **Publicaties-indeling:** 4 categorieën (Doop — 7 artikelen, Praktisch
  Theologisch — 2, Systematisch Theologisch — 1, Historische achtergrond —
  1), bewust **alle** artikelen per categorie meegenomen, niet ingekort.

## Ontwerp

- **Homepage is herontworpen, geen 1-op-1 kopie** van de oude WordPress-
  homepage: recente berichten rechtstreeks uit de content (geen widget),
  scrollbare kaartsecties voor Geschiedenis / "Reformatorisch Baptist: wie
  bepaalt?", statische featurecards en een auteursbio onderaan.
- **Stijlrichting: strak & minimalistisch**, met een hero die echte
  tekst-overlay gebruikt (geen tekst die in een afbeelding is "gebakken").
- **Vaste afbeeldingsformaten** (zie ook README.md): 30rem voor losse
  afbeeldingen in lopende tekst, 22rem voor kaarten in een wisselend-aantal
  grid (featurecards, publicatiekaarten), 32rem voor de 2-koloms
  scroll-kaarten op de homepage. Kaartgrids gebruiken Flexbox i.p.v. CSS
  Grid, zodat een onvolledige laatste rij gecentreerd blijft i.p.v. links
  uitgelijnd raakt.
- **Publicatiekaarten:** titel is niet klikbaar; in plaats daarvan staat er
  "Lees verder" aan het einde van de tekst — consistent met de homepage.

## Hosting

- **Van Hostnet naar Vercel**, met behoud van het domein
  `www.refbaptisten.nl` (DNS aangepast bij Hostnet, domeinregistratie blijft
  daar staan). Reden: Hostnet-hosting (~€200/jaar) was niet meer nodig zodra
  de site statisch is en op Vercel draait; bij Hostnet is nu alleen de
  domeinnaam actief.
- **Deploy-workflow:** GitHub-repo, elke push naar `main` deployt
  automatisch via Vercel — geen handmatige upload-stap.

## Contactformulier — gepauzeerd

- Gebouwd zonder externe formulierdienst: eigen serverless functie
  (Nodemailer) die mailt naar het eigen Outlook-adres.
- **Geblokkeerd door Microsoft:** basic SMTP-auth is uitgeschakeld voor het
  account, ook met een app-wachtwoord — een platform-blokkade, niet iets
  dat met code op te lossen is.
- **Besluit:** voorlopig laten rusten. Code en pagina blijven in de repo
  staan, maar de link is uit de footer-navigatie gehaald tot dit (eventueel
  via een andere mailprovider) alsnog wordt opgepakt.

## Statistiekenpagina

- **Verborgen pagina** (`/statistiek/`), bewust niet in het menu — alleen
  bereikbaar via de directe URL.
- **Alleen paginaweergaves, geen unieke bezoekers.** Expliciete keuze:
  simpeler en privacyvriendelijker — geen cookies, geen IP-adressen, geen
  bezoekers-tracking, puur een teller per opgevraagde pagina.
- Opslag via Vercel KV (Upstash Redis), geteld per week en per maand.

## Oude URL's / redirects

Zie [REDIRECTS.md](./REDIRECTS.md) voor de volledige lijst. Kort samengevat:
11 oude WordPress-URL's zijn als losse `.astro`-pagina's geïmplementeerd
(elk met een eigen `Astro.redirect(...)`) in plaats van via Astro's
ingebouwde `redirects`-config — die laatste bleek in combinatie met
`trailingSlash: 'always'` op Vercel altijd een 404-status te forceren, ook
als de juiste `Location`-header al klopte.

## SEO / vindbaarheid

Basispakket toegevoegd: eigen favicon (was nog het standaard Astro-logo),
automatische `sitemap.xml`, `robots.txt`, Open Graph/Twitter-tags per
pagina (met een sitebrede standaardafbeelding als een pagina er zelf geen
heeft), en een eigen 404-pagina i.p.v. Vercel's standaardpagina.

## Afbeeldingsoptimalisatie — bewust beperkt gehouden

Volledige optimalisatie via Astro's `astro:assets`-pijplijn (automatische
webp/avif-conversie voor élke afbeelding) is **niet** gedaan: dat vereist
alle ~25 afbeeldingen te verplaatsen naar `src/` en elke Markdown-
verwijzing te herschrijven — een relatief risicovolle refactor voor
beperkte extra winst, aangezien de meeste afbeeldingen al redelijk
passend van formaat waren. Wél opgelost: de twee headerfoto's bleken
1024px-PNG's te zijn terwijl ze als 34px-rondjes worden getoond; die zijn
vervangen door kleine, losse JPEG's.

## Content-beheer / CMS

Overwogen: een git-based CMS (Sveltia CMS of Decap CMS) zodat de eigenaar
zelf artikelen kan toevoegen via een formulier in de browser, zonder
tussenkomst. **Besluit: voorlopig niet doen** — de huidige workflow
(wijzigingen doorgeven, worden direct in de bestanden verwerkt) voldoet
prima gezien het publicatietempo. Zou later alsnog opgepakt kunnen worden
als zelfstandig kunnen publiceren wél gewenst is.

## Overig

- **Auteur is sinds augustus 2026 met sabbatical**: een korte mededeling
  hierover staat naast de auteursfoto op de homepage (`src/data/author.ts`,
  veld `note` — leeg maken om te verbergen).
