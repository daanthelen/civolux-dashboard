# Civolux Dashboard

Dit is een [Next.js](https://nextjs.org) webapplicatie die als doel heeft inzicht te creeëren in de circulariteit van bouwmaterialen. Deze inzichten worden aangeboden op vier manieren:
1. Dashboard met bouwmateriaal gegegvens
2. Sloopvoorspellingen d.m.v. een Random Forest Classifier
3. Twinbuildings
4. Gebouwclusters d.m.v. KMeans Clustering

Voor deze vier inzichten communiceert de webapp met de Python API. Alle inzichten hebben hun eigen pagina:

### Dashboard

Op deze pagina worden enkele grafieken met materiaal gegevens getoond, zoals een tabel met de totale hoeveelheid per bouwmateriaal, een barchart met het gemiddelde per bouwmateriaal, per gebouw, en een taartdiagram met de verdeling van de totale hoeveelheid van alle bouwmaterialen.

Deze bouwmaterialen worden bij iedere request opnieuw berekend, hierdoor kan het erg lang duren voordat de gegevens worden getoond.

### Sloopvoorspellingen

Op deze pagina kunnen alle gebouwen die een sloopkans hebben van meer dan 90% worden opgehaald en getoond in een lijst, en als markers op een interactieve kaart. Voor de markers wordt de MapLibre Marker gebruikt, wat voor elke marker een HTML-element toevoegt aan de DOM.

Voor deze gebouwen worden ook de materiaal-gegevens opgehaald. Deze gegevens worden getoond in een barchart bij het hoveren over een marker (indien materiaal-gegevens voor dat gebouw beschikbaar zijn). Deze materiaal-gegevens tonen de verdeling van materialen binnen dat gebouw.

Omdat er geen filters beschikbaar zijn (datum, locatie, materialen) worden altijd alle sloopkandidaten opgehaald, dit zijn er enkele duizenden. Om de prestatieverminderingen enigszins te dempen wordt deze lijst nu afgekapt bij duizend.

### Twinbuildings

Op deze pagina kan voor een adres alle gebouwen die op het opgegeven gebouw lijken (twinbuildings) worden opgehaald en getoond in een lijst, en als markers op een interactieve kaart. Ook voor deze markers wordt de MapLibre Marker gebruikt. Iedere marker toont een popup met informatie over dat gebouw bij het hoveren. Deze informatie bevat het bouwjaar en de oppervlakte. De lijst is gesorteerd op de afstand vanaf het referentie gebouw, oplopend. De gebruiker kan zowel op een marker, als een item in de lijst klikken om de map te focussen op dat gebouw.

De adressen in de adres-invoer dropdown wordt opgehaald vanuit de Python API met een debounce.

### Gebouwclusters

Op deze pagina kan het cluster-algoritme aangeroepen worden. Dit algoritme bepaalt, op basis van gebouweigenschappen, aan welk cluster ieder gebouw toebehoort. Nadat de cluster bepaald zijn worden alle gebouwen uit de dataset getoond op een interactieve map. Hiervoor wordt niet de MapLibre Marker gebruikt, maar MapLibre's data-driven styling met layers en GeoJSON bronnen. Hiermee kunnen makkelijk een zeer hoog aantal elementen op de kaart getoond worden, zonder prestatievermindering. Deze punten zijn daarentegen wel minder interactief en stijlbaar dan de markers. Alle gebouwen binnen een cluster krijgen dezelfde kleur. Het aantal clusters staat vast op vijf.

## Gebruikte libraries

Alle React componenten (inputs, knoppen, Cards) zijn afkomstig van Shadcn. Dit is een open-source React component library, die de code van deze componenten direct aan het project toevoegt, waardoor deze volledig te bewerken is.

De styling van de elementen is uitsluitend gedaan met Tailwindcss.

Voor de interactieve kaarten is de library MapLibre GL JS gebruikt. De kaartgegevens zijn afkomstig van OpenStreetMap, en worden opgehaald vanuit MapTiler.

Voor de grafieken is de library Chart.js gebruikt.

## Opstarten

Deze applicatie is gemaakt met [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

#### Installeer node modules

```bash
npm i # npm install
# of
pnpm i # pnpm install
# of
yarn # yarn install
# of
bun install
```

#### Start development server

<b>Zorg ervoor dat een `.env.local` bestand aanwezig is in de root van het project voor de benodige environment variables.</b>

De benodige environment variables zijn:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- PYTHON_SERVICE_URL
- MAPTILER_API_KEY

Start de development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

De webapplicatie is nu bereikbaar via [http://localhost:3000](http://localhost:3000).

#### Start production server

Om de production server te starten, moet eerst een production build gemaakt worden:

```bash
npm run build
# of
pnpm run build
# of
yarn run build
# of
bun run build
```

Hierna kan de production build opgestart worden:

<b>Zorg ervoor dat een `.env.production` bestand aanwezig is in de root van het project voor de benodige environment variables. Het `.env.local` bestand voor de development server kan niet worden gebruikt voor een production build.</b>

```bash
npm run start
# of
pnpm run start
# of
yarn run start
# of
bun run start
```