# Reichentrog & Kollegen — Website-Finish-Plan (Agentur-Level)

## Kontext

Die Reichentrog-Website (`~/Kevin OS/02 Projekte/Kunden/KP - Reichentrog/03_website`, Astro 4 + Tailwind, Netlify, GitHub `goodonex/reichentrog`) ist strukturell weit: 10 Seiten, sauberes Komponentensystem, durchdachte Hero-Scrims, reduced-motion-Fallbacks, Netlify-Forms, Sitemap. Letzter Commit 02.07. Ziel dieses Plans: die Seite so fertigmachen, wie eine Agentur sie nach einem halben Jahr abliefern würde — rechtlich sauber, performant, ohne Platzhalter-Substanz, mit verifiziertem Feinschliff. Der Plan ist so geschrieben, dass Opus 4.8 ihn Phase für Phase abarbeiten kann.

**Basisdaten:** Dev-Server läuft auf Port **5175** (`astro.config.mjs` erzwingt strictPort — immer aus dem Projektordner starten). Build: `npm run build`. Live-Domain laut Config: `https://www.reichentrog-kollegen.de`.

## Entscheidungen für Kevin (im Plan mit Empfehlung vorentschieden)

1. **Objekte-Seite:** Alle Objekte in `src/content/objekte.ts` sind **fiktiv** (TODO im Code: „Echte Objekt-Daten pflegen"). Empfehlung (so umgesetzt in Phase 1): Seite behalten, aber als „Referenzen — anonymisiert" umformulieren, aktive Fake-Angebote entfernen, `noindex`, Nav-Link vorerst raus. Sobald Oliver echte Objekte liefert, zurückdrehen.
2. **Tracking:** GA-ID und Meta-Pixel sind Platzhalter (`BaseLayout.astro:73`). Empfehlung: Tracking-Code-Gerüst behalten, aber Cookie-Banner auf „nur notwendige, keine Tracking-Cookies aktiv" abrüsten, bis echte IDs vorliegen. Kevin muss die IDs vom Kunden holen.
3. **Impressum §34c:** Die Erlaubnis-Angabe nach §34c GewO + zuständige Aufsichtsbehörde ist Pflicht für Makler und **fehlt komplett**. Text-Baustein wird vorbereitet, die konkrete Behörde (vmtl. Bezirksamt Hamburg-Harburg) muss der Kunde bestätigen → als sichtbarer `<!-- KUNDE BESTÄTIGEN -->`-Kommentar einbauen.

---

## Phase 1 — Launch-Blocker: Recht & Substanz

**1.1 Impressum reparieren** (`src/pages/impressum.astro`)
- Zeile 46: „Konzeption und Programmierung: Kausche und Partner" — das ist die **alte Agentur**, von der Alt-Seite kopiert. Ersetzen durch „HERRMANN & CO." (oder Zeile streichen).
- Durchgehend `ae/oe/ue` → echte Umlaute („Geschaeftsfuehrer" → „Geschäftsführer").
- Ergänzen: Erlaubnis nach §34c GewO + Aufsichtsbehörde (Baustein, Behörde vom Kunden bestätigen lassen), Hinweis nach §36 VSBG (Verbraucherstreitbeilegung), Link zur EU-OS-Plattform.
- Bildrechte-Zeile prüfen: „shutterstock / SN-Photography / Pixabay / Daniel Sumesgutner" stammt von der Alt-Seite — gegen die tatsächlich verwendeten Assets abgleichen (Hero-/Segment-Videos sind Eigen-/KI-Produktionen).

**1.2 Datenschutz überarbeiten** (`src/pages/datenschutz.astro`)
- Gleiche Umlaut-Korrektur (durchgehend „fuer", „koennen" …).
- Inhaltlich abgleichen mit realem Stack: Netlify-Hosting (US-Anbieter, SCC erwähnen), Netlify Forms als Auftragsverarbeiter, Fonts self-hosted via Fontsource (kein Google-Fonts-CDN — falls die Alt-Formulierung Google Fonts nennt, korrigieren), Google-Places-Reviews werden serverseitig gecacht (kein Client-Abruf). GA/Pixel-Abschnitte als „derzeit nicht aktiv" fassen oder konditional formulieren, konsistent mit Entscheidung 2.

**1.3 Objekte-Seite entschärfen** (`src/pages/objekte.astro`, `src/content/objekte.ts`, `src/components/Nav.astro`, `src/components/Footer.astro`)
- Fiktive `aktiveObjekte` nicht als kaufbare Angebote zeigen. Umbau gemäß Entscheidung 1: Referenz-/Track-Record-Framing (die `ReferenzObjekt`-Struktur existiert schon), aktive Angebote mit Preisen raus, `noindex` via BaseLayout-Prop, Nav-/Footer-Link „Objekte" vorerst entfernen. TODO-Kommentare für Olivers echte Daten stehen lassen.
- Gleiches Framing-Problem bei `src/content/cases.ts` („TODO: Echte Cases von Oliver Alberich"): Cases prüfen — solange sie fiktiv sind, als „typische Mandate, anonymisiert" kennzeichnen, nicht als echte Referenzen.

**1.4 Cookie-Banner & Consent konsistent machen** (`src/components/CookieBanner.astro`, `src/layouts/BaseLayout.astro:71-77`)
- Solange kein Tracking lädt: Banner-Text auf technisch notwendige Cookies reduzieren oder Banner ganz deaktivieren (empfohlen: deaktivieren, Consent-Code auskommentiert lassen — weniger Reibung, DSGVO-sauber, in 5 Min. reaktivierbar wenn GA-ID kommt).

**1.5 Google-Reviews-Pipeline aktivieren**
- Cache ist vom 20.05. (7 Wochen alt). GitHub-Action existiert (`.github/workflows/fetch-google-reviews.yml`), braucht Secret `GOOGLE_PLACES_API_KEY`. Prüfen ob Secret gesetzt ist (`gh secret list -R goodonex/reichentrog`); falls nein: Kevin braucht den Key, dann `npm run fetch:reviews` einmal lokal laufen lassen und committen. Trust-Bar zeigt Rating/Anzahl aus diesem Cache (`HeroTrustBar.astro`).

## Phase 2 — Performance & Assets

**2.1 Deploy-Ballast entfernen (größter Einzelhebel)**
- `public/videos/_originals/` = **248 MB** wandert in jedes Build/Deploy (dist = 276 MB). Verschieben nach `../01_discovery/videos_originals/` (außerhalb des Repos/public). Danach `npm run build` und prüfen: dist sollte ~25 MB sein.

**2.2 Bilder nachkomprimieren**
- `public/images/sections/geschaeftskunden-hamburg.jpg` (1,0 MB) + `.webp` (555 KB): mit `npm run optimize:images` bzw. sharp neu encodieren, Ziel < 250 KB fürs WebP/AVIF, JPG nur als Fallback.
- Alle Team-PNGs (`norbert-reichentrog.png`, `oliver-alberich.png`) prüfen — PNGs für Fotos sind meist 3-5× zu groß; nach WebP/AVIF mit JPG-Fallback konvertieren, sofern keine Transparenz gebraucht wird.

**2.3 Segment-Videos optimieren**
- `privatkunden.mp4` 9,5 MB / `geschaeftskunden.mp4` 8,3 MB. Click-to-play mit `preload="none"` ist schon richtig — trotzdem auf ~5 MB re-encodieren (H.264, CRF ~24, 1080p, Audio 96k) und eine WebM-Variante ergänzen. ffmpeg lokal vorhanden.
- Eigene Poster-Frames aus den Segment-Videos ziehen (`ffmpeg -ss … -frames:v 1`): aktuell nutzen beide Segment-Heroes **dasselbe Poster wie die Homepage** (`privatkunden.astro:35`, analog geschaeftskunden) — wirkt beim Seitenwechsel wie ein Fehler und verschenkt Differenzierung.

**2.4 Caching-Header** (`netlify.toml`)
- `Cache-Control: public, max-age=31536000, immutable` für `/videos/*`, `/images/*`, `/_astro/*` (Assets sind über `?v=`/Hash versioniert). Zusätzlich `Strict-Transport-Security`.

## Phase 3 — Bugs

**3.1 AVIF als WebP deklariert** — `SegmentHero.astro:44` rendert `fallbackPosterWebp` mit `type="image/webp"`, bekommt aber von beiden Segment-Seiten eine **.avif**-Datei (`privatkunden.astro:36`). Falscher MIME-Type → Browser wählen die Source anhand des deklarierten Typs und scheitern beim Decodieren. Fix: Prop umbenennen zu `fallbackPosterAvif` + `type="image/avif"`, oder echte WebP-Dateien erzeugen (in 2.3 gleich mit erledigen).

**3.2 Hartkodierte Videodauer** — `SegmentHero.astro:155` zeigt statisch „1:36"; geschaeftskunden.mp4 ist 1:33. In `src/scripts/segment-hero-video.ts` bei `loadedmetadata` die echte `duration` setzen.

**3.3 Formular: stummes Scheitern** — `ContactForm.astro:408`: wenn beim Submit `type/detail/name/kontakt` fehlt, wird `preventDefault()` ohne jedes Feedback ausgeführt — Nutzer klickt und nichts passiert. Fix: Inline-Fehlermeldung anzeigen und zum betroffenen Schritt zurückspringen. Zusätzlich: Kontaktfeld „Telefon oder E-Mail" ist `type="text"` mit `autocomplete="email"` — auf `inputmode="email"` + sinnvolle Validierung (E-Mail ODER Telefonnummer) heben.

**3.4 Toter Server-Code** — `kontakt/index.astro:13`: `Astro.url.searchParams` ist bei statischem Build immer leer; der Client-JS-Fallback in ContactForm übernimmt das bereits. Zeile entfernen (Verwirrungs-/Regressionquelle).

**3.5 Strukturierte Daten ausbauen** — `BaseLayout.astro:45`: JSON-LD hat nur Ort. Ergänzen: `streetAddress` (Karnapp 25, 21079), `telephone`, `email`, `url`, `logo`, `openingHours` falls bekannt (Daten aus `src/content/site.ts` wiederverwenden). Auf der Startseite zusätzlich `FAQPage`-Schema aus den 6 FAQ-Items (`index.astro:174-199`).

**3.6 Netlify-Forms-Probe** — Nach Deploy einmal echte Test-Submission durch alle 3 Formulare (`privatkunden`, `geschaeftskunden`/`kontakt-seite`, `objekt-anbieten`) und prüfen, dass sie im Netlify-Dashboard ankommen und die Benachrichtigungs-E-Mail an den Kunden konfiguriert ist. (Multi-Step-Form schreibt in hidden fields — genau die Sorte Setup, die still brechen kann.)

## Phase 4 — Feinschliff auf Agentur-Niveau (am lebenden Objekt)

Dev-Server starten (`npm run dev`, Port 5175) und **jede der 10 Seiten** durchgehen — Desktop (1280+), Mobile (375), und einmal echt in Safari (Kevins wiederkehrender Beanstandungsgrund):

- `/` — Hero-Video-Einblendung (Poster→Video-Crossfade), Scrim-Lesbarkeit, Section-Übergänge ruhig?
- `/privatkunden/` + `/geschaeftskunden/` — Click-to-Play-Video inkl. Controls, Mobile-Verhalten, Trust-Bar
- `/objekte/` (nach Umbau), `/objekt-anbieten/`, `/kontakt/` — Formular-Flow alle 3 Pfade bis „danke"
- `/impressum/`, `/datenschutz/`, `/danke/`, `/404`
- Gezielt prüfen: Nav-Schriftgrößen 9-10px (`Nav.astro:103`) — an der Grenze der Lesbarkeit, auf mind. 11px heben, Touch-Targets ≥ 44px; Custom-Cursor stört er auf Touch/Safari?; PageLoader-Verhalten bei langsamer Verbindung; die zwei offenen `VideoPlaceholder`-TODOs in `WarumSection.astro:38` / `BankenHintergrund.astro:23` — entweder finale Standbilder einsetzen oder Sections so gestalten, dass nichts „fehlt".

Abschluss der Phase: **`web-design-guidelines`-Skill über die Seiten laufen lassen** (Kevins Standard vor Übergabe) und Findings mit file:line abarbeiten.

## Phase 5 — Verifikation & Übergabe

1. `npm run build` — fehlerfrei, dist-Größe ~25 MB (Beweis: `du -sh dist`).
2. Lighthouse (oder `npx unlighthouse`/PageSpeed) auf `/`, `/privatkunden/`: Performance ≥ 90 mobil anpeilen, LCP < 2,5 s.
3. Screenshots aller Seiten (Desktop + Mobile) als Ergebnis-Beweis für Kevin — er soll nicht manuell testen müssen.
4. Formular-Test-Submissions dokumentiert (3.6).
5. Commit(s) auf Feature-Branch, Push, Netlify-Deploy-Preview prüfen, dann Zusammenfassung: was geändert, was offen beim Kunden (34c-Behörde, GA-ID, echte Objekte/Cases von Oliver, Places-API-Key).

## Offene Kunden-Abhängigkeiten (nicht blockierend für die Umsetzung, aber fürs Go-Live)

- §34c-GewO-Behörde bestätigen (Impressum)
- GA-Measurement-ID / Meta-Pixel-ID (falls Tracking gewünscht)
- Echte Objekte + Bilder und echte Cases von Oliver Alberich
- Google-Places-API-Key für den Review-Refresh
