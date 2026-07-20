# FEINSCHLIFF-PLAN v2 — Kevins Feedback vom 20.07. + Niveau-Hebung (Wargame-Blaupause)

> **WARGAME-ORDER an den Executor (Sonnet/Opus).** Nachfolger des abgearbeiteten
> `REBUILD-PLAN.md` (Branch `rebuild/kompetenz-achse`, 6 Commits, alle Gates grün).
> Gleiche Regeln: nichts erfinden, Copy wörtlich aus diesem Dokument, bei Abbruch-
> bedingungen stoppen und melden. Alle file:line-Angaben von Fable am 20.07. gegen
> den Branch-Stand `141ad5b` verifiziert. Arbeite auf demselben Branch weiter,
> Commit je Mission, kein Push ohne Kevins Anweisung.

**Projekt:** `~/Kevin OS/02 Projekte/Kunden/KP - Reichentrog/03_website` · Build `npm run build` · Preview `npm run preview` (Port 5175).

## Kontext: Kevins Feedback (Quelle der Wahrheit für diesen Plan)

1. **„Nicht besser. Anders." ist gehasst und war laut Kevins Erinnerung an die Termine ausdrücklich verworfen** — Satz UND die ganze Vergleichs-Sektion müssen raus. (Leitbild ist aktualisiert: Der Unterschied wird über konkrete Beweise erzählt, nie über einen Meta-Claim.)
2. **Kanzlei-Herkunfts-Copy ist „richtig geil"** — aber das eigene blaue Statement-Feld wirkt verloren (zentrierte Headline, Text schwimmt, direkt darunter beginnt „schräg das Weiße").
3. **Team-Sektion**: Boxen kleben ganz unten, „fast am Verlauf, nach unten gepresst".
4. **„Alles aus einer Hand" mobil**: Tab-Stepper zwingt zum Hochscrollen (Buttons oben, Panel-Text unten) — „einfach gar nicht geil".
5. **Google-Reviews**: Verdacht auf Fehleranfälligkeit — mit CoLective-Referenz abgleichen. (Verdacht bestätigt, siehe Mission A5.)

## NICHT ANFASSEN (unverändert)

Hero-Video-Kette (`HeroVideo.astro`, `hero-canvas.ts`, `hero-scroll-video.ts`, `segment-hero-video.ts`) · `ContactForm.astro` + Formular-Seiten · Legal-Seiten · `netlify.toml` · `objekte.astro` · Copy in `WarumSection`/`segments.ts`/FAQ (außer wo unten explizit genannt).

---

## Mission A — Kevins Fixes (Pflicht, in dieser Reihenfolge)

### A1 — Vergleichs-Sektion ersatzlos entfernen

Die Sektion war inhaltlich redundant (die 3 stärksten Kontraste stehen bereits in den Warum-Karten) — Streichung verdichtet die Seite, das ist gewollt.

- `src/pages/index.astro`: Import `KlassischVsWir` (Z. 11) und den kompletten `<!-- 3b. Der Unterschied -->`-`SectionTransition`-Block entfernen.
- `src/components/KlassischVsWir.astro` löschen.
- **Gates:** `grep -rn "Nicht besser" src/` → 0 · `grep -rn "KlassischVsWir" src/` → 0 · Build grün.
- *Fehler:* Übergang AllesAusEinerHand → Warum bricht. *Signal:* sichtbare Kante im Preview. *Gegenzug:* keiner nötig — beide Nachbarn waren schon vor dem Einbau direkt benachbart (Off-White → Warum mit `--section-fade-from: #f5f2ea`); es entsteht exakt der Zustand von Commit `1be2458`.

### A2 — Kanzlei-Story in die Banken-Sektion integrieren, Statement-Feld auflösen

**Ziel:** Ein dunkler Block weniger (aktuell 3 hintereinander: Warum → Banken → Kanzlei), die geliebte Copy bekommt einen Kontext statt einer verlorenen Bühne.

1. `src/components/BankenHintergrund.astro`: Inhalt zweispaltig ab `md` (`md:grid md:grid-cols-2 md:gap-16`, mobil untereinander mit `gap-12`):
   - **Linke Spalte** = bestehender Inhalt unverändert (Eyebrow „Banken-Hintergrund", H2 „Warum Banken mit uns arbeiten.", Absatz, Partner-Zeile, 10+-Countup).
   - **Rechte Spalte** (neu, gleiche Typo-Klassen wie links, H3-Ebene statt H2):
     - Eyebrow: `Die Kanzlei`
     - Headline (font-display, ~text-2xl/3xl, italic erlaubt): `Warum wir Kanzlei heißen — und nicht Makler.`
     - Body (Copy wörtlich, davor `<!-- KUNDE BESTÄTIGEN: Wortlaut der Namens-Anekdote ({{KANZLEI_ZITAT_FREIGABE}}) -->`): `Der Name geht auf einen Rechtsanwalt aus Norbert Reichentrogs Netzwerk zurück: „Sie arbeiten wie wir mit unseren Mandanten — nennen Sie es Kanzlei." Dabei ist es geblieben. Mandanten statt Kunden, Mandate statt Aufträge — und Diskretion als Haltung, nicht als Werbeversprechen.`
   - `max-w-2xl`-Beschränkung des bisherigen Wrappers auf den Grid-Container erweitern (`max-w-content` bleibt außen).
2. `src/pages/index.astro`: Import `OffMarketStatement` (Z. 14) + `<OffMarketStatement />` (Z. 99) entfernen.
3. `src/components/OffMarketStatement.astro` löschen.
4. `src/scripts/ui-enhancements.ts`: `initOffMarketReveal` (ab Z. 56) entfernen; zugehörigen Import/Aufruf in `src/scripts/main.ts` entfernen. (Die Funktion wäre nach dem Löschen ein No-op — trotzdem sauber ausbauen.)
5. **Übergang reparieren (heikelster Zug):** Das gelöschte Statement-Feld trug den Verlauf in die ice-blaue Ankauf-Sektion (sein `::after`). Jetzt muss `BankenHintergrund` diesen Übergang übernehmen: dessen Fade-Variablen (Z. ~77-81: `--section-fade-edge-bottom`, `--section-fade-to`) so setzen, dass der untere Verlauf in `ice-blue` (Wert aus `tailwind.config.mjs`) ausläuft — Muster vom gelöschten `OffMarketStatement`-`::after` übernehmen (color-mix-Stufen), falls die Fade-Variablen allein eine sichtbare Kante lassen.
   - *Erwartung:* weicher Verlauf Banken → Ankauf ohne Kante, ohne „schräges Weiß" direkt unterm Text (Inhalt hat ≥ `py-24` Abstand zum Verlauf).
   - *Fehler:* harte Kante oder Verlauf frisst Text. *Signal:* Screenshot der Übergangsregion. *Gegenzug:* Verlaufshöhe auf 120–140px erhöhen, `padding-bottom` der Sektion um 2rem anheben. Nach 2 Fehlversuchen → Abbruch A4 (melden mit Screenshot).
- **Gates:** `grep -rn "OffMarketStatement\|off-market\|initOffMarketReveal" src/` → 0 · Build grün · Screenshot Banken-Sektion Desktop + Mobil (zwei Spalten / gestapelt).

### A3 — Team-Sektion entpressen

`src/components/TeamSection.astro`:
- Z. 24: `justify-end` → `justify-center` (Inhalt vertikal mittig im Vollbild-Foto statt an die Unterkante gedrückt).
- Z. 37: `pb-20 pt-20 md:pt-0` → `py-20 md:py-28` (unten Luft zum Fade, oben/unten ausgewogen).
- Z. 24: `min-h-[600px]` → `min-h-[640px]` (mehr Bühne fürs Foto, Desktop).
- *Erwartung:* Die beiden Scrim-Boxen sitzen mittig mit sichtbarem Abstand zum unteren Verlauf; das Gruppenfoto bleibt oben und unten erkennbar.
- *Fehler:* Auf kleinen Desktop-Höhen (< 800px) wird die Sektion zu hoch/Foto zu beschnitten. *Signal:* Screenshot 1280×720. *Gegenzug:* `min-h` bei 600px belassen und nur justify/padding ändern.
- **Gate:** Screenshot Desktop + Mobil (mobil ändert sich nichts — dort gilt `justify-content: flex-start` aus der Media Query, prüfen dass das so bleibt).

### A4 — „Alles aus einer Hand" mobil als Accordion

Risikoärmste Route: **zweites Markup statt JS-Umbau.** `src/components/AllesAusEinerHand.astro`:
1. Den bestehenden `process-stepper` (ab Z. 57) auf Desktop beschränken: Wrapper-Klasse `hidden md:block` (bzw. vorhandene Struktur nicht anfassen, nur einwrappen).
2. Davor ein mobiles Accordion (`md:hidden`) aus derselben `steps`-Datenquelle rendern — natives `<details>`/`<summary>` im Stil der FAQ (siehe `index.astro` FAQ-Block als Vorlage): pro Schritt Summary = Icon + Nummer + Eyebrow + Label, aufgeklappt darunter der Panel-Text des Schritts. Erster Schritt `open`. Touch-Targets ≥ 44px.
3. `src/scripts/process-stepper.ts` bleibt unangetastet (greift nur das Desktop-Markup; prüfen, dass es bei `display:none` keine Fehler wirft — Initialisierung läuft über `data-process-stepper`, das weiterhin existiert).
- *Erwartung mobil:* Tippen auf einen Schritt öffnet den Text **direkt darunter** — kein Scrollen zwischen Knopf und Inhalt mehr.
- *Fehler:* Doppeltes `id="process-panel"`/`aria-controls` durch dupliziertes Markup. *Signal:* Build-Warnung oder a11y-Check. *Gegenzug:* Accordion verwendet KEINE ids aus dem Stepper — eigene, präfixfreie `<details>`-Struktur ohne tablist-Semantik.
- **Gate:** Screenshot Mobil 375px (zwei Zustände: Schritt 1 offen, Schritt 3 offen) · Desktop-Screenshot unverändert · 0 Konsolenfehler.

### A5 — Reviews-Marquee auf das CoLective-Recycling-Muster umstellen

**Befund (verifiziert):** Reichentrog animiert per WAAPI die volle Track-Breite (`GoogleReviewsSection.astro:270-276`, `translate3d(-width px)` mit width ≈ mehrere tausend px). Genau diese Klasse („weit verschieben") hat bei CoLective die Safari-Ausfälle verursacht. Die produktionsbewährte Lösung steht in `~/Kevin OS/02 Projekte/Kunden/CoLective/colective-website/index.html` Z. ~2274-2307: **DOM-Recycling** — sobald die erste Karte links komplett draußen ist, wandert ihr Knoten ans Set-Ende und der Versatz wird um ihre Breite reduziert; Transform bleibt dauerhaft < ~360px, endlos per Konstruktion.

`src/components/GoogleReviewsSection.astro`, `<script>`-Block (Z. 247-304) ersetzen:
1. CoLective-Pattern 1:1 adaptieren (Klassennamen sind identisch: `.reviews-marquee`, `__track`, `__set`): Duplikat-Set (`aria-hidden`-Kopie, falls im Markup vorhanden — prüfen ab Z. 57) entfernen wie bei CoLective (`dup.remove()`), `track.style.willChange = 'auto'`, Gap aus `getComputedStyle`, `dt`-Kappung bei 100ms, Hover-Pause via `mouseenter/mouseleave`, Tempo ~20 px/s.
2. `prefers-reduced-motion`: bestehendes statisches Verhalten beibehalten (früher Return vor Animation, CSS-Fallback Z. 228-244 bleibt).
3. Die bestehenden `ResizeObserver`/`fonts.ready`-Rebuild-Hooks entfallen — das Recycling misst jede Karte pro Frame selbst.
- *Fehler:* Karten-Klick (`reviews-expand.ts`, Karten expandieren bei Tap) kollidiert mit `appendChild`-Recycling. *Signal:* expandierte Karte springt/kollabiert beim Recycling. *Gegenzug:* beim `mouseenter`/Fokus/expandierter Karte pausieren (CoLective pausiert bei Hover — zusätzlich pausieren solange `.is-expanded` im Set existiert).
- **Gates:** Marquee läuft im Preview sichtbar endlos (≥ 60s beobachten via JS: Transform-Wert bleibt < 400px) · `grep -n "track.animate" src/components/GoogleReviewsSection.astro` → 0 · 0 Konsolenfehler · Hinweis im Bericht: echter Safari-Test durch Kevin bleibt Pflicht.

**Commit nach Mission A:** `fix(feedback): Vergleich raus, Kanzlei in Banken, Team-Spacing, Mobile-Accordion, Marquee-Recycling`

---

## Mission B — Niveau-Hebung (nach A, eigener Commit)

**B1 — Sektions-Rhythmus prüfen.** Nach A1/A2 hat die Seite 11 Sektionen und die Dunkel-Folge ist Warum → Banken (2 statt 3). Einmal komplett durchscrollen (Desktop + Mobil) und die Übergänge auditieren: Jede Kante zwischen Sections, die ohne Verlauf aufeinanderstoßen, mit den vorhandenen `--section-fade-*`-Variablen glätten. Findings als Liste mit file:line in den Bericht.

**B2 — Ein Zahlen-Moment.** In der Banken-Sektion (linke Spalte) den 10+-Countup von einer Textzeile (Z. ~68) zu einem gestalteten Moment heben: Zahl groß (`font-display`, ~clamp(3rem,6vw,5rem), Bernstein), Label darunter klein uppercase. Kein neues JS — `data-countup` existiert.

**B3 — Vertikaler Rhythmus vereinheitlichen.** Alle Content-Sections auf konsistentes `py-24 md:py-32` prüfen (Ausreißer angleichen, Ausnahme: Hero, Team-Vollbild, Zielgruppen-Weiche `py-20 md:py-28`). Ziel: die „mal gepresst, mal leer"-Wahrnehmung beseitigen.

**Commit:** `feat(polish): Rhythmus, Zahlen-Moment, Spacing-Audit`

---

## Mission C — Abnahme

1. `npm run build` grün · alle A-Gates erneut in einem Lauf.
2. Preview: volle Seite Desktop 1280 + Mobil 375, Screenshots aller geänderten Bereiche (Banken 2-spaltig, Team, Mobile-Accordion offen, Marquee), 0 Konsolenfehler, 0 404.
3. `git diff finish/agentur-level --stat` — nichts aus NICHT-ANFASSEN.
4. Bericht: Vorher/Nachher, Gate-Outputs, offene LEDGER-Punkte (unverändert: §34c, GA4/Pixel, echte Cases/Fotos, Places-Key, Kanzlei-Zitat-Freigabe, Leitbild-Freigabe) + Safari-Testaufruf an Kevin.

## Abbruchbedingungen

A1: gleicher Build-/Konsolenfehler nach 2 Fix-Versuchen → stoppen, melden. · A2: Änderung an NICHT-ANFASSEN nötig → stoppen. · A3: Copy-Lücke → stoppen, nichts erfinden. · A4: Übergang Banken → Ankauf nach 2 Versuchen nicht kantenfrei → Edit reverten, Screenshot melden. · A5: Marquee-Recycling kollidiert unlösbar mit Karten-Expand → WAAPI-Stand zurücksetzen (Commit `141ad5b`) und als offenen Punkt melden statt beides zu verschlimmbessern.

## Ehrlicher Rahmen (für Kevins Award-Frage, von Fable)

Dieser Plan bringt die Seite auf **sauberes, ruhiges Agentur-Abgabe-Niveau**: verdichtet, konsistent, ohne die vier Reibungspunkte. Er macht sie NICHT award-fähig — dafür fehlt nicht Code, sondern Material: echte Fotografie (Büro, Hände, Hamburg-Motive in einer Bildsprache), eine mutigere Art-Direction und ein Motion-Konzept. Das wäre eine eigene Design-Runde MIT Foto-Shooting, kein Feinschliff. Nicht in diesem Plan versprechen.
