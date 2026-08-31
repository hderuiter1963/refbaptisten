# Refbaptisten — statische site (Astro)

Statische opvolger van de voormalige WordPress-site refbaptisten.nl, gebouwd
met [Astro](https://astro.build) en gehost op [Vercel](https://vercel.com)
(domein `www.refbaptisten.nl`, DNS bij Hostnet — zie "Hosting" hieronder).

Zie [BESLISSINGEN.md](./BESLISSINGEN.md) voor het waarom achter de
belangrijkste keuzes (migratie, hosting, contactformulier, statistieken,
CMS, enz.) en [REDIRECTS.md](./REDIRECTS.md) voor de oude-URL-redirects.

## Projectstructuur

```
public/
  docs/                    ← PDF's/downloads (rechtstreeks bereikbaar op /docs/...)
  images/                  ← alle content-afbeeldingen, per sectie in submappen
  favicon.svg / .ico       ← site-icoon (favicon.ico is een gerasterde kopie van de svg)
  apple-touch-icon.png
  robots.txt               ← verwijst naar de automatisch gegenereerde sitemap
src/
  components/              ← Header, Nav, Footer, ArticleCard, ScrollSection, AuthorBio, ...
  content/
    pages/                 ← gewone tekstpagina's (.md), 1 bestand = 1 pagina/URL
    posts/                 ← berichten ("Recente berichten" op de homepage + /berichten/)
    publications/          ← artikelen onder "Publicaties", ingedeeld in 4 categorieën
    documents/             ← metadata voor de PDF's op de "Documenten"-pagina
  content.config.ts        ← schema's (Zod) voor bovenstaande 4 collections
  data/
    navigation.ts           ← hoofdmenu (incl. dropdowns) & footer-links, siteMeta
    publicationCategories.ts ← de 4 Publicaties-subcategorieën
    home.ts / homeSections.ts / author.ts ← homepage-content (feature cards, scroll-secties, auteursbio)
  layouts/
    BaseLayout.astro        ← <html>, head (incl. OG/Twitter-tags, favicon), header/footer
    PageLayout.astro        ← titel + container voor gewone content-pagina's
    PostLayout.astro        ← titel + datum voor berichten
    PublicationLayout.astro ← titel + categorie-link voor publicatie-artikelen
  pages/
    index.astro              ← homepage (eigen hero, niet uit een content-bestand)
    [...slug].astro           ← rendert automatisch elke pagina/bericht/publicatie-artikel
    documenten.astro, doop-publicaties.astro, praktisch-theologische-onderwerpen.astro,
    systematisch-theologische-onderwerpen.astro, historische-achtergrond.astro
                               ← categorie-overzichten met eigen listing-logica
    contact.astro, api/contact.ts ← contactformulier (zie "Contactformulier" hieronder)
    statistiek.astro          ← verborgen paginaweergave-teller, zie "Statistiek" hieronder
    404.astro                 ← aangepaste foutpagina
    776-2.astro, 845-2.astro, missie-en-visie.astro, ...
                               ← losse redirect-pagina's voor oude WordPress-URL's, zie REDIRECTS.md
  middleware.ts              ← telt paginaweergaves voor /statistiek/ (geen redirects, zie REDIRECTS.md)
  styles/
    global.css                ← alle basisstyling (kleuren als CSS-variabelen bovenin)
```

Een nieuwe pagina toevoegen = een nieuw `.md`-bestand in `src/content/pages/`
(of `posts/`/`publications/`) aanmaken (bestandsnaam = URL-slug) en, als die
in het menu moet komen, een link toevoegen in `src/data/navigation.ts`.

## Afbeeldingen — standaardformaten

Vaste conventie voor nieuwe content, zodat alles netjes uitgelijnd blijft:

- **Losse afbeelding in lopende tekst** (`.prose img`): max-width 30rem (480px).
- **Kaarten in een 2-koloms scroll-sectie** (`.scroll-card`, zoals Geschiedenis
  / Wie bepaalt op de homepage): 32rem breed.
- **Kaarten in een grid met wisselend aantal items** (`.card-grid--large`,
  zoals de homepage-featurecards en de Publicaties-artikelkaarten): 22rem breed.

`.card-grid` gebruikt Flexbox (niet Grid) zodat een onvolledige laatste rij
gecentreerd blijft in plaats van links uit te lijnen.

## Commando's

| Commando                | Werking                                      |
| :----------------------- | :-------------------------------------------- |
| `npm install`             | dependencies installeren                       |
| `astro dev --background`  | lokale dev-server op de achtergrond starten (zie AGENTS.md/CLAUDE.md) |
| `astro dev stop/status/logs` | achtergrond dev-server beheren              |
| `npm run build`            | statische site + serverless functions bouwen naar `dist/` / `.vercel/output/` |

`astro preview` werkt niet met de Vercel-adapter — gebruik de dev-server voor lokaal testen.

## Hosting

De site draait op Vercel (gekoppeld aan de GitHub-repo, elke push naar `main`
deployt automatisch). Het domein `www.refbaptisten.nl` wijst via een DNS-record
bij Hostnet naar Vercel; bij Hostnet is verder alleen de domeinregistratie nog
actief (geen hosting/e-mail meer nodig).

## Oude URL's / redirects

Zie [REDIRECTS.md](./REDIRECTS.md) voor de volledige lijst en de technische
toelichting waarom dit als losse pagina's (`src/pages/776-2.astro` e.d.) is
geïmplementeerd in plaats van via Astro's `redirects`-config.

## Statistiek

`/statistiek/` (niet in het menu, alleen via de directe URL) toont het aantal
paginaweergaves per week/maand, opgeslagen in Vercel KV (Upstash Redis). Er
worden geen unieke bezoekers, cookies of IP-adressen bijgehouden — alleen een
teller per pagina-verzoek. De pagina staat op `noindex` en is uitgesloten van
de sitemap.

## Contactformulier

`contact.astro` / `api/contact.ts` sturen een e-mail via SMTP naar het eigen
Outlook-adres van de eigenaar, zonder externe formulierdienst. **Momenteel
niet gelinkt in de navigatie**: Microsoft blokkeert basic SMTP-auth voor dit
account (ook met een app-wachtwoord), waardoor verzenden nu mislukt. Code en
pagina blijven intact voor als dit later opgepakt wordt (bv. via een andere
mailprovider).

## SEO / metadata

- `@astrojs/sitemap` genereert automatisch `sitemap-index.xml`, met een
  `filter` in `astro.config.mjs` die de verborgen statistiekpagina, het
  (nog) ongelinkte contactformulier en de redirect-pagina's uitsluit.
- `public/robots.txt` verwijst naar de sitemap en sluit `/statistiek/` uit.
- `BaseLayout.astro` zet per pagina Open Graph- en Twitter-Card-tags (titel,
  beschrijving, canonical URL, afbeelding — met een sitebrede standaard-
  afbeelding als een pagina er zelf geen heeft).
- `404.astro` toont een eigen foutpagina in plaats van Vercel's standaardpagina.
