# REBUILD-PLAN — Reichentrog & Kollegen: Kompetenz-Achse (Wargame-Blaupause)

> **WARGAME-ORDER an den Executor (Sonnet/Opus).** Du führst diese Blaupause aus, ohne eigene
> Richtungsentscheidungen zu treffen. Jeder Zug nennt die erwartete Beobachtung, den
> wahrscheinlichsten Fehler mit Signal und Gegenzug, und Trigger für Weggabelungen.
> Alle Texte stehen wörtlich in diesem Dokument — **erfinde keine Copy, keine Zahlen,
> keine Fakten.** Wenn du an eine Abbruchbedingung (§ Abbruch) stößt: stoppen und melden,
> nicht improvisieren. Geplant von Fable 5 am 20.07.2026 nach vollständigem Code-Recon;
> alle file:line-Angaben sind verifiziert.

**Projekt:** `~/Kevin OS/02 Projekte/Kunden/KP - Reichentrog/03_website` (Astro 4 + Tailwind, statisch, Netlify).
**Dev:** `npm run dev` (Port 5175, strictPort). **Build:** `npm run build`. **Preview:** `npm run preview` oder `npx serve dist`.
**Branch:** alles auf `rebuild/kompetenz-achse`, Commit je Phase, **kein Push** ohne Kevins Anweisung.

---

## Mission Brief

Die Seite ist technisch weit und die Kompetenz-Inhalte existieren bereits (WarumSection,
BankenHintergrund, AllesAusEinerHand, Ankauf-Section, FAQ, Reviews). Das Problem ist die
**Botschafts-Hierarchie**: Hero, Tagline und Meta führen mit „Hanseatisch diskret · Off-Market" —
laut Discovery-Call und freigegebenem Leitbild soll **Banken-Kompetenz / kein Alleinauftrag /
Rundum-Sorglos** führen und Diskretion nur Begleitton sein. Außerdem fehlen zwei Module aus dem
Master-Prompt (Vergleich „Üblich am Markt vs. wir", Kanzlei-Herkunft) und der Effekt-Layer
(Ambient-Videos, CustomCursor, PageLoader) soll raus — Bewegungsbudget = 1 (nur Hero-Video).

Referenz-Strategie: `~/Second Brain/03 Bereiche/Kunden/Reichentrog/Reichentrog – Leitbild.md`.

## NICHT ANFASSEN (harte Leitplanken)

- `GoogleReviewsSection.astro` + Marquee/WAAPI-Logik (`reviews-expand.ts` u. a.) — Safari-Fix war teuer.
- `HeroVideo.astro` + `hero-canvas.ts`, `hero-scroll-video.ts`, `segment-hero-video.ts` — Autoplay-Kette ist gehärtet. (`hero-reveal.ts` darf NUR gemäß Zug 3.2-Trigger angepasst werden.)
- `ContactForm.astro`, `kontakt/`, `objekt-anbieten/`, `danke.astro` — Formular-Flows sind fertig.
- `impressum.astro`, `datenschutz.astro`, `netlify.toml`, `package.json`-Dependencies.
- `objekte.astro` bleibt wie sie ist (bereits noindex + entlinkt).
- Copy in `WarumSection`, `segments.ts`, `AllesAusEinerHand`, `CasesSection`, FAQ — ist bereits auf Kompetenz-Achse. Nur die in diesem Plan genannten Strings ändern.

## LEDGER — offene Variablen (blockieren die Ausführung NICHT)

| Variable | Wer liefert | Blockiert |
|---|---|---|
| {{34C_BEHOERDE}} Aufsichtsbehörde §34c | Kunde | nur Go-Live |
| {{GA4_ID}} / {{PIXEL_ID}} | Kunde | nichts (Code gated) |
| {{PLACES_KEY}} Review-Refresh (Cache v. 20.05.) | Kunde/Kevin | nichts |
| {{ECHTE_CASES}} an o.alberich@reichentrog-finance.de angefragt | Kunde | nichts (Dummy ist gekennzeichnet) |
| {{TEAM_BUERO_FOTOS}} echte Büro-/Teambilder | Kunde | nichts |
| {{KANZLEI_ZITAT_FREIGABE}} Wortlaut der Namens-Anekdote (Zug 2.3) | Kunde | nur finale Abnahme |
| {{LEITBILD_FREIGABE}} | Kunde | nur finale Abnahme |

---

## Phase 0 — Baseline

**Zug 0.1** `git checkout -b rebuild/kompetenz-achse` && `npm run build`.
*Erwartung:* Build grün (Stand 09.07. war grün, Working Tree clean). Notiere `du -sh dist`.
*Fehler:* Build rot wegen node_modules-Drift. *Signal:* Modul-Fehler. *Gegenzug:* einmal `npm install`, erneut bauen. Zweimal rot → **Abbruch A1**.

**Zug 0.2** Baseline-Screenshots vom Production-Build (`npx serve dist`): Startseite Desktop 1280 + Mobil 375 (Hero, Warum, Banken, Footer). Ablage `screenshots/baseline/`.
*Erwartung:* Referenzbilder für den Vorher/Nachher-Beweis existieren.

---

## Phase 1 — Botschafts-Hierarchie (Hero, Tagline, Meta)

**Zug 1.1 — `src/content/site.ts:3-4`** Tagline ersetzen.
ALT: `'Immobilien-Kanzlei Hamburg · Hanseatisch diskret · Off-Market'`
NEU: `'Immobilienkanzlei Hamburg · Banken-Kompetenz · Kein Alleinauftrag'`
*Hinweis:* fließt in `BaseLayout` ins Schema.org-`description` — gewollt.

**Zug 1.2 — `src/components/HeroSection.astro`** vier Strings:
- Z. 16 Eyebrow: `Immobilien-Kanzlei Hamburg` → `Immobilienkanzlei Hamburg`
- Z. 23 Headline: `Ihre Immobilie diskret verkauft — zum Preis, der standhält.` → `Ihre Immobilie verkauft — zum Preis, der auch vor der Bank standhält.`
- Z. 29 Motto: `Hanseatisch diskret. Klar erfolgreich.` → `Immobilienvermittlung auf Kanzlei-Niveau.`
- Z. 35 Subline: `Für Eigentümer und Investoren in Hamburg und ganz Deutschland — Off-Market, mit Banken-Hintergrund.` → `Für Eigentümer und Investoren in Hamburg und deutschlandweit — Banken-Erfahrung aus über zehn Jahren, kein Zwang zum Alleinauftrag, ein Ansprechpartner für alles.`
*Erwartung:* Hero liest sich Ergebnis→Kompetenz; „diskret" taucht im Hero nicht mehr auf. Buttons unverändert.
*Fehler:* Längere Headline bricht auf Mobil 375 unschön (3→4 Zeilen). *Signal:* Screenshot 375px. *Gegenzug:* nichts kürzen — `clamp`-Untergrenze in Z. 19 von `2rem` auf `1.875rem` senken, erneut prüfen.

**Zug 1.3 — `src/pages/index.astro:21-23`** Title + Description:
NEU title: `'Reichentrog & Kollegen | Immobilienkanzlei Hamburg — Verkauf mit Banken-Kompetenz'`
NEU description: `'Immobilienkanzlei in Hamburg: Verkauf, Bewertung und Transaktionen mit Banken-Kompetenz — ohne Zwang zum Alleinauftrag, mit wöchentlichem Bericht. Für Eigentümer, Investoren und institutionelle Mandanten in Hamburg und ganz Deutschland.'`

**Zug 1.4 — Schreibweise vereinheitlichen.** `grep -rn "Immobilien-Kanzlei" src/` — jede Fundstelle (u. a. `BaseLayout.astro:78` og:image:alt) auf `Immobilienkanzlei` ändern. Danach: Treffer = 0.
*Hinweis:* Der Fachbegriff „Off-Market" bleibt in Leistungslisten (`segments.ts`, Ankauf-Copy) erlaubt — er wird nur aus Title/Tagline/Hero entfernt.

**Verifikation Phase 1:** `npm run build` grün · `grep -rn "Hanseatisch" src/` → 0 · `grep -rn "Immobilien-Kanzlei" src/` → 0 · Screenshot Hero Desktop+Mobil. Commit `feat(messaging): Kompetenz-Achse in Hero, Tagline, Meta`.

---

## Phase 2 — Neue Substanz (Vergleich + Kanzlei-Herkunft)

**Zug 2.1 — Neue Komponente `src/components/KlassischVsWir.astro`.**
Aufbau mit vorhandenen Bausteinen (`RevealSection`, `SectionHeader` mit `eyebrow="Der Unterschied"`, `title="Nicht besser. Anders."`, `subtitle="Der Satz stammt von uns selbst — und er ist wörtlich gemeint: Vieles machen wir bewusst anders, als es am Markt üblich ist."`). Desktop: 3-Spalten-Vergleich (Merkmal / Üblich am Markt / Reichentrog & Kollegen), rechte Spalte visuell betont (z. B. `bg-white/70` Karte, Bernstein-Akzentlinie). Mobil (<768px): je Merkmal eine gestapelte Karte mit beiden Aussagen untereinander. Stil wie umliegende Off-White-Sections, keine neuen Effekte, kein neues JS.

Inhalte (wörtlich, nichts hinzufügen — UWG: Spalte heißt bewusst „Üblich am Markt", keine Wettbewerber-Namen, keine unbelegten Zahlen):

| Merkmal | Üblich am Markt | Reichentrog & Kollegen |
|---|---|---|
| Mandat | Alleinauftrag ist die Regel — Sie binden sich zuerst. | Kein Zwang zum Alleinauftrag. Das Mandat richtet sich nach Ihnen — von begleitend bis exklusiv. |
| Vermarktung | Inserat auf den großen Portalen, für jeden sichtbar. | Gezielte Ansprache im gewachsenen Netzwerk. Öffentlich wird es nur, wenn Sie es wollen. |
| Finanzierung | Eine Finanzierungsbestätigung wird angefordert — dann wird gewartet. | Wir führen die vollständige Finanzierungsakte und verhandeln in der Sprache der Banken. |
| Bewertung | Preisschätzung als Grundlage fürs Inserat. | DEKRA-zertifizierte Bewertung, die auch vor der Bank standhält. |
| Kommunikation | Rückmeldung, wenn etwas passiert ist. | Bericht jede Woche — auch dann, wenn gerade nichts passiert. |

**Zug 2.2 — Einbau in `src/pages/index.astro`** direkt NACH der „Alles aus einer Hand"-SectionTransition (endet Z. 74), VOR `<!-- 4. Warum -->`:
```astro
<!-- 3b. Der Unterschied -->
<SectionTransition id="unterschied" featherTop={false} cursorSurface="light" class="bg-off-white py-24 md:py-32">
  <div class="mx-auto max-w-content px-6">
    <KlassischVsWir />
  </div>
</SectionTransition>
```
plus Import oben. *Warum genau hier:* Nachbarn sind beidseitig Off-White → kein Übergangs-Umbau nötig; `WarumSection` (`--section-fade-from: #f5f2ea`) bleibt korrekt.
*Erwartung:* Sanfter Übergang, keine sichtbare Kante zur Warum-Section.
*Fehler:* Doppelte Off-White-Flächen wirken als „Loch". *Signal:* Screenshot Übergangsregion. *Gegenzug:* `py-24` der neuen Section auf `py-20` reduzieren — NICHT die Fade-Variablen der Warum-Section anfassen.

**Zug 2.3 — `src/components/OffMarketStatement.astro` umwidmen** (Datei, `id="off-market"`, CSS-Klassen und der `::after`-Verlauf bleiben — `initOffMarketReveal` in `ui-enhancements.ts` hängt an `.off-market-statement__headline`; kein Anker verweist auf `#off-market`, verifiziert).
- Headline (Z. 11): `Die besten Objekte werden nie inseriert.` → `Warum wir Kanzlei heißen — und nicht Makler.`
- Body (Z. 13-16): ersetzen durch: `Der Name geht auf einen Rechtsanwalt aus Norbert Reichentrogs Netzwerk zurück: „Sie arbeiten wie wir mit unseren Mandanten — nennen Sie es Kanzlei." Dabei ist es geblieben. Mandanten statt Kunden, Mandate statt Aufträge — und Diskretion als Haltung, nicht als Werbeversprechen.` — davor HTML-Kommentar `<!-- KUNDE BESTÄTIGEN: Wortlaut der Namens-Anekdote ({{KANZLEI_ZITAT_FREIGABE}}) -->`
- `max-w-[480px]` des Body auf `max-w-[560px]` erhöhen (längerer Text).
- Kommentar Z. 2 anpassen: „Kanzlei-Statement — zwischen Banken-Hintergrund und Ankauf".
*Erwartung:* Editorial-Moment bleibt, Inhalt trägt jetzt die Kanzlei-Story; Reveal-Animation funktioniert unverändert (Klasse unangetastet).
*Fehler:* Reveal feuert nicht mehr. *Signal:* Headline bleibt unsichtbar (`opacity-0`). *Gegenzug:* Diff prüfen — Klassennamen `off-market-statement__headline` und `translate-y-8 … opacity-0` müssen exakt erhalten sein.

**Verifikation Phase 2:** Build grün · Startseite im Preview: neue Section sichtbar, Tabelle mobil als Karten, Kanzlei-Statement animiert ein · Screenshots beider neuer Blöcke Desktop+Mobil. Commit `feat(content): Vergleichsmodul + Kanzlei-Herkunft`.

---

## Phase 3 — Subtraktion (Bewegungsbudget = 1)

**Zug 3.1 — RECON vor dem Schnitt** (nur lesen): `src/components/PageLoader.astro`, `src/scripts/page-loader.ts`, `src/components/CustomCursor.astro`, `src/scripts/custom-cursor.ts`, `src/components/SectionVideoBg.astro`. Notiere: (a) setzt der PageLoader Body-Klassen/Styles, die Inhalte bis „loaded" verstecken? (b) setzt der CustomCursor irgendwo `cursor: none`? (c) hat `SectionVideoBg` einen Poster-only-Pfad (Video-Props optional)?

**Zug 3.2 — PageLoader entfernen.** `BaseLayout.astro`: Import Z. 4 + `<PageLoader />` Z. 91 raus. `main.ts`: Import + Aufruf `initPageLoader` raus. Dateien `PageLoader.astro` + `page-loader.ts` löschen. Zugehörige Styles (grep `page-loader` in `src/styles/global.css`) entfernen.
*Erwartung:* Seite rendert sofort, kein Lade-Overlay.
*Fehler A:* Inhalt bleibt unsichtbar, weil eine Body-Klasse aus 3.1(a) nie entfernt wird. *Signal:* weißer/leerer Viewport im Preview. *Gegenzug:* die versteckende Klasse/CSS-Regel mitentfernen.
*Fehler B (Trigger):* Hero-Reveal startet nicht, weil `hero-reveal.ts` auf ein Loader-Event wartet. *Signal:* Hero-Text bleibt `opacity-0`, Konsole ohne Fehler. *Gegenzug:* In `hero-reveal.ts` den Event-Wait durch Sofort-Init ersetzen — einzige erlaubte Änderung an dieser Datei.

**Zug 3.3 — CustomCursor entfernen.** `BaseLayout.astro`: Import Z. 5 + `<CustomCursor />` Z. 99 raus. `main.ts`: Import + Aufruf `initCustomCursor` raus. Dateien löschen. Styles (grep `custom-cursor` + **`cursor: none`** in `global.css` und Komponenten) entfernen.
*Wichtig:* Die `cursorSurface`-Props auf `SectionTransition` (index/privatkunden/geschaeftskunden) **stehen lassen** — sie werden inert; Entfernen wäre unnötige Diff-Fläche.
*Fehler:* `cursor: none` überlebt irgendwo → nativer Mauszeiger unsichtbar. *Signal:* Grep-Gate unten. *Gegenzug:* Regel löschen.

**Zug 3.4 — Ambient-Videos → Standbilder.** In `WarumSection.astro` (Z. 3 Import, Z. 34-46 inkl. HIGGSFIELD-Kommentar) und `BankenHintergrund.astro` (Z. 3, Z. 15-28):
- Route A (falls 3.1(c) = ja): `SectionVideoBg` ohne Video-Props aufrufen, nur `posterSrc` + `fallbackClass`.
- Route B (sonst): Aufruf ersetzen durch `<div class="absolute inset-0 z-0 {fallbackClass}"><img src="{posterSrc}" alt="" class="h-full w-full object-cover" loading="lazy" decoding="async" /></div>` mit den jeweiligen Postern `/images/sections/warum-poster.jpg` bzw. `/images/sections/banken-poster.jpg`; die Gradient-`fallbackClass` (`warum-section__bg` / `banken-hintergrund__bg`) bleibt als Absicherung unter dem Bild.
*Erwartung:* Beide Sections zeigen ruhige Standbilder; Grain- und Editorial-Overlays (z-1/z-2) liegen weiter über dem Bild, Text bleibt lesbar (Scrim-Regel).
*Fehler:* z-Index-Stapel bricht, Bild liegt über dem Text. *Signal:* Screenshot. *Gegenzug:* Bild-Wrapper muss `z-0` haben (vgl. `.warum-section :global(.section-video-bg) { z-index: 0 }`), Overlays unverändert.

**Zug 3.5 — Totes aufräumen.** Nacheinander, mit Grep-Beweis VOR jedem Löschen (Treffer nur in der Datei selbst bzw. 0):
- `grep -rn "SectionVideoBg" src/` → wenn 0 Verwendungen: Komponente löschen; zugehörige Abspiel-Logik (grep `section-video` in `src/scripts/`) mit.
- `grep -rn "HamburgStatementSequence" src/` → ist bereits 0 (verifiziert): `HamburgStatementSequence.astro` löschen.
- `public/videos/`: `warum-loop.mp4`, `warum-loop.webm`, `banken-loop.mp4`, `banken-loop.webm` löschen (~4,8 MB). **Behalten:** `hero-loop.*`, `privatkunden.mp4`, `geschaeftskunden.mp4`, `reichentrog-statement-poster.jpg`.
*Fehler:* 404 im Netzwerk-Tab nach Build. *Signal:* Preview-Netzwerkliste. *Gegenzug:* Referenz übersehen → Grep wiederholen, Referenz entfernen.

**Verifikation Phase 3:** Build grün · Preview: Konsole ohne Fehler, kein 404 · Gates: `grep -rn "initPageLoader\|initCustomCursor\|cursor: none" src/` → 0; `grep -rn "warum-loop\|banken-loop" src/ public/` → 0 · Screenshots Warum + Banken (Standbild, Text lesbar) · `du -sh dist` notieren. Commit `refactor(motion): Bewegungsbudget 1 — Loader, Cursor, Ambient-Videos entfernt`.

---

## Phase 4 — Feinschliff

**Zug 4.1 — HERRMANN-Credit im Footer** (`src/components/Footer.astro`, Legal-Zeile bei Z. 41-42): rechtsbündig, dezent, EIN Klickziel:
`<a href="https://herrmannundco.de" target="_blank" rel="noopener noreferrer" class="…dezent wie Impressum-Links, ~60 % Opazität…">Website & Branding: HERRMANN & CO.</a>`
Stil an vorhandene Legal-Links angleichen (Datei vorher ganz lesen). Kein Instagram-Link.
*Erwartung:* Wirkt wie eine Künstlersignatur, konkurriert nicht mit den Legal-Links.

**Zug 4.2 — Section-Kommentare in `index.astro`** nur dort aktualisieren, wo sich Inhalt geändert hat (3b Unterschied, Kanzlei-Statement). Keine kosmetische Umnummerierung.

**Verifikation Phase 4:** Build grün · Footer-Screenshot Desktop+Mobil. Commit `feat(footer): Studio-Credit`.

---

## Phase 5 — Abnahme & Beweis

1. `npm run build` → grün; `du -sh dist` (Erwartung: ≈ Baseline − ~5 MB).
2. Alle Grep-Gates aus Phase 1 + 3 erneut, in einem Lauf.
3. Production-Preview: Startseite komplett durchscrollen (Desktop 1280 + Mobil 375) — Screenshots: Hero, Zielgruppe, Unterschied, Warum, Banken, Kanzlei-Statement, Ankauf, Team, Reviews (Marquee läuft endlos!), FAQ, Footer. Dazu je 1 Screenshot `privatkunden/`, `geschaeftskunden/` (unverändert bis auf inerte Props).
4. Konsole + Netzwerk: 0 Fehler, 0 404.
5. `web-design-guidelines`-Skill über die geänderten Dateien laufen lassen; Findings mit file:line fixen, sofern sie im Scope liegen (sonst listen).
6. Ergebnisbericht an Kevin: Vorher/Nachher-Screenshots, dist-Größen, Gate-Outputs, offene LEDGER-Punkte. **Echten Safari-Test macht Kevin** (Hero-Video wurde nicht angefasst — Risiko klein, trotzdem prüfen).

## Abbruchbedingungen

- **A1:** Derselbe Build-/Konsolen-Fehler nach zweitem Fix-Versuch → stoppen, Fehlertext + Diff melden.
- **A2:** Ein Zug verlangt eine Änderung an der NICHT-ANFASSEN-Liste → stoppen, melden.
- **A3:** Eine Copy-Lücke, die dieses Dokument nicht wörtlich füllt (fehlender Text, fehlende Zahl) → stoppen, LEDGER-Eintrag vorschlagen. Nichts erfinden.
- **A4:** Visueller Regress (Hero, Übergänge, Marquee), der sich nicht durch Revert des konkreten Edits beheben lässt → Edit reverten, stoppen, Screenshot melden.

## SUCCESS — die Blaupause gilt als erfüllt, wenn

alle Phase-Commits auf dem Branch liegen · alle Gates 0 Treffer · alle Screenshots erstellt · Konsole/Netzwerk sauber · Bericht mit Vorher/Nachher + LEDGER-Status übergeben · nichts aus der NICHT-ANFASSEN-Liste im Diff auftaucht (`git diff main --stat` als Beweis).

## Red-Team-Protokoll (Planungsphase, Fable)

Durchgespielt und gepatcht: (1) *CustomCursor-Entfernung lässt `cursor: none` zurück* → eigenes Grep-Gate in 3.3. (2) *PageLoader versteckt Body bis „loaded"* → RECON 3.1(a) + Fehler A in 3.2. (3) *Hero-Reveal wartet auf Loader-Event* → expliziter Trigger in 3.2 mit einziger erlaubter `hero-reveal.ts`-Änderung. (4) *„diskret" global weggreppen würde legitime Copy zerstören* → Gates prüfen nur „Hanseatisch"/„Immobilien-Kanzlei", Fachbegriff Off-Market in Listen bleibt. (5) *SectionVideoBg könnte auf Segment-Seiten hängen* → Grep-Beweis vor Löschung (Recon zeigte: nur Warum + Banken). (6) *Vergleichstabelle als Wettbewerber-Bashing (UWG)* → Spalte „Üblich am Markt", weiche Formulierungen, keine Zahlen/Namen. (7) *Off-Market-Statement-Umbau killt Reveal* → Klassennamen fixiert, `initOffMarketReveal` dokumentiert. Angriff ohne gefundenen Patch: keiner offen.
