# Refbaptisten — statische site (Astro)

Statische opvolger van de bestaande WordPress-site, gebouwd met
[Astro](https://astro.build). Bedoeld om uiteindelijk te hosten bij Hostnet.

## Projectstructuur

```
public/
  docs/                 ← PDF's/downloads (rechtstreeks bereikbaar op /docs/...)
  favicon.svg
src/
  components/           ← Header, Footer, Nav
  content/
    pages/               ← gewone tekstpagina's (.md), 1 bestand = 1 pagina/URL
    documents/            ← metadata voor de documenten op de "Documenten"-pagina
  data/
    navigation.ts         ← hoofdmenu & footer-links (1 plek om aan te passen)
  layouts/
    BaseLayout.astro      ← <html>, head, header/footer
    PageLayout.astro      ← titel + container voor gewone content-pagina's
  pages/
    index.astro           ← homepage
    documenten.astro       ← overzicht van alle documenten/PDF's
    [...slug].astro         ← rendert automatisch elke pagina uit content/pages/
  styles/
    global.css             ← alle basisstyling (kleuren als CSS-variabelen bovenin)
```

Een nieuwe pagina toevoegen = een nieuw `.md`-bestand in `src/content/pages/`
aanmaken (bestandsnaam = URL-slug) en een link toevoegen in
`src/data/navigation.ts` als die in het menu moet komen.

## Commando's

| Commando          | Werking                                    |
| :----------------- | :------------------------------------------ |
| `npm install`        | dependencies installeren                     |
| `npm run dev`          | lokale dev-server (met live reload)          |
| `npm run build`         | statische site bouwen naar `dist/`           |
| `npm run preview`        | de gebouwde `dist/` lokaal bekijken          |

## Status

Dit is nog een skelet met placeholder-content. Zie de projectgeschiedenis
voor de volgende stappen (content overzetten, PDF's toevoegen, URL's
controleren, uploaden naar Hostnet).
