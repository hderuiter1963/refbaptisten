# Redirect-lijst: refbaptisten.nl → nieuwe site

Gebaseerd op de actuele sitemap van de live WordPress-site (42 unieke URL's),
vergeleken met de nieuwe Astro-site. Alle URL's zijn relatief aan het domein
(bv. `/verbond-doop/`).

## 1. URL's die ongewijzigd blijven (geen redirect nodig)

Deze pagina's staan op precies dezelfde URL op de nieuwe site:

```
/
/verbond-doop/
/genesis-3/
/verbond-noach/
/verbond-abraham/
/oude-verbond/
/nieuwe-verbond/
/doop/
/gemeenten/
/kinderdoop/
/doopformulier/
/heidelbergse-catechismus/
/geloofsbelijdenis/
/is-de-doop-sacramenteel/
/hoe-zit-het-nu-met-het-genadeverbond/
/geen-kiem-maar-keuze-een-bijbelse-kritiek-op-calvijns-kinderdooptheologie/
/publicaties/
/doop-publicaties/
/maarten-luther-en-de-doop/
/de-doop-van-het-kind-belofte-of-verwarring-een-baptistische-reflectie-op-kerkelijke-verdeeldheid/
/kinderdoop-exegese-of-eisegese/
/doop-van-jezus-en-de-rode-lijn-in-de-schrift/
/muziek-en-zang-in-de-gemeente/
/grondbeginselen-van-christelijke-ethiek-een-reformatorisch-baptistisch-perspectief-1689-lbc/
/samenvatting-van-de-1689-baptist-confession/
/praktisch-theologische-onderwerpen/
/historische-achtergrond/
/leiding-in-de-gemeente-bezinning-op-man-en-vrouw/
/systematisch-theologische-onderwerpen/
/exegese-doen-reformatorisch-baptist/
/reformatorisch-baptisten/
```

## 2. Oude URL → nieuwe URL (301-redirect instellen)

Dit zijn "teaser"-pagina's die op de oude site apart bestonden naast het
volledige artikel (met een "lees verder"-link), of dubbele/verkorte URL's
voor dezelfde inhoud. Op de nieuwe site is dit samengevoegd tot 1 pagina.

| Oude URL | Nieuwe URL |
| --- | --- |
| `/de-doop-van-het-kind-belofte-of-verwarring/` | `/de-doop-van-het-kind-belofte-of-verwarring-een-baptistische-reflectie-op-kerkelijke-verdeeldheid/` |
| `/maarten-luther-over-de-doop-een-kritische-beschouwing/` | `/maarten-luther-en-de-doop/` |
| `/776-2/` | `/geen-kiem-maar-keuze-een-bijbelse-kritiek-op-calvijns-kinderdooptheologie/` |
| `/de-kinderdoop-getoetst-aan-de-schrift-exegese-of-eisegese/` | `/kinderdoop-exegese-of-eisegese/` |
| `/850-2/` | `/doop-van-jezus-en-de-rode-lijn-in-de-schrift/` |
| `/exegese-doen-reformatorisch-baptists/` *(let op: meervoud "baptists")* | `/exegese-doen-reformatorisch-baptist/` |

## 3. Oude URL's die niet zijn overgezet

Deze pagina's/artikelen zijn (nog) niet meegenomen naar de nieuwe site. Om
te voorkomen dat bezoekers en zoekmachines op een 404 stuiten, raad ik aan
deze door te sturen naar de meest relevante bestaande pagina in plaats van
ze te laten breken:

| Oude URL | Voorgestelde redirect | Toelichting |
| --- | --- | --- |
| `/missie-en-visie/` | `/` | Inhoud niet overgezet |
| `/auteur/` | `/` | Auteursbio staat nu op de homepage |
| `/media/` | `/` | Inhoud niet overgezet |
| `/lezingen/` | `/` | Sectie "Lezingen/Preken" is op jouw verzoek vervallen |
| `/845-2/` ("Samenkomsten (eredienst)") | `/praktisch-theologische-onderwerpen/` | Inhoud niet overgezet; thematisch dichtstbij |

**Let op:** dit zijn alleen de URL's die ik ben tegengekomen tijdens het
migreren (nav-menu + alles wat daaronder hangt). De "Publicaties"-sectie had
op de live site oorspronkelijk tientallen losse artikelen die je bewust hebt
laten vervallen — voor zover ik kon nagaan stonden die *niet* apart in de
sitemap onder een eigen categorie-indeling, dus zie ik geen extra
"vergeten" URL's. Mocht je zelf nog links tegenkomen die niet in deze lijst
staan, geef ze door dan voeg ik ze toe.

## Status: geïmplementeerd ✅

Deze site draait niet bij Hostnet maar bij Vercel, dus geen `.htaccess`
nodig. Alle 11 redirects hierboven staan als echte 301-redirects in
`astro.config.mjs` (zie de `redirects`-instelling) en worden bij elke
deploy automatisch door Vercel toegepast.
