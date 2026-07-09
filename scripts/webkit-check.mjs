/**
 * WebKit-Verifikations-Harness für die zwei hartnäckigen Safari-Bugs:
 *  1. Google-Reviews-Marquee: darf NIE eine leere Fläche zeigen (Endlos-Loop).
 *  2. Hero-Video: vor Interaktion kein Play-Button (keine Quelle), nach echtem
 *     Klick (Cookie-Banner) spielt das Video und das Poster blendet weg.
 *
 * Aufruf:  node scripts/webkit-check.mjs [webkit|chromium]
 * Testet gegen http://localhost:5175 (npm run preview).
 */
import { webkit, chromium } from 'playwright';

const ENGINE = process.argv[2] === 'chromium' ? chromium : webkit;
const ENGINE_NAME = process.argv[2] === 'chromium' ? 'Chromium' : 'WebKit';
const BASE = 'http://localhost:5175';
const SHOT_DIR = '/tmp/rk-webkit';

const results = [];
const ok = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? '✅' : '❌'} ${name}${detail ? ' — ' + detail : ''}`);
};

const browser = await ENGINE.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
console.log(`\n=== ${ENGINE_NAME} ${browser.version()} gegen ${BASE} ===\n`);

await page.goto(BASE + '/', { waitUntil: 'load' });
await page.waitForTimeout(1500);

/* ---------- HERO: vor Interaktion ---------- */
const heroBefore = await page.evaluate(() => {
  const v = document.getElementById('hero-video');
  if (!v) return { missing: true };
  return {
    sourcesWithSrc: [...v.querySelectorAll('source')].filter((s) => s.getAttribute('src')).length,
    currentSrc: v.currentSrc || '',
    paused: v.paused,
    posterVisible: !document.getElementById('hero-poster')?.classList.contains('is-hidden'),
  };
});
ok(
  'Hero vor Interaktion: keine Videoquelle (→ kein nativer Play-Button möglich)',
  !heroBefore.missing && heroBefore.sourcesWithSrc === 0 && !heroBefore.currentSrc,
  JSON.stringify(heroBefore),
);
await page.screenshot({ path: `${SHOT_DIR}/${ENGINE_NAME}-hero-before.png` });

/* ---------- HERO: echter Klick auf Cookie-Button ---------- */
const cookieBtn = page.locator('#cookie-necessary, #cookie-accept-all').first();
await cookieBtn.click();
await page.waitForTimeout(2500);

const t1 = await page.evaluate(() => document.getElementById('hero-video')?.currentTime ?? -1);
await page.waitForTimeout(2000);
const heroAfter = await page.evaluate(() => {
  const v = document.getElementById('hero-video');
  return {
    currentSrc: (v.currentSrc || '').split('/').pop(),
    currentTime: v.currentTime,
    paused: v.paused,
    posterHidden: document.getElementById('hero-poster')?.classList.contains('is-hidden'),
  };
});
ok(
  'Hero nach Cookie-Klick: Video spielt (currentTime steigt, nicht pausiert)',
  heroAfter.currentTime > t1 && t1 >= 0 && !heroAfter.paused,
  `t1=${t1.toFixed(2)} → t2=${heroAfter.currentTime.toFixed(2)}, paused=${heroAfter.paused}, src=${heroAfter.currentSrc}`,
);
ok('Hero nach Cookie-Klick: Poster ausgeblendet (Video sichtbar)', !!heroAfter.posterHidden);
await page.screenshot({ path: `${SHOT_DIR}/${ENGINE_NAME}-hero-after.png` });

/* ---------- MARQUEE: Endlos-Loop ohne leere Fläche ---------- */
await page.evaluate(() => document.querySelector('#stimmen')?.scrollIntoView({ block: 'center' }));
await page.waitForTimeout(1000);

// Beschleunigen: WAAPI-Animationen (falls vorhanden) ×40; rAF-Marquee via Hook (falls vorhanden).
const accel = await page.evaluate(() => {
  const track = document.querySelector('.reviews-marquee__track');
  if (!track) return 'no-track';
  const anims = track.getAnimations();
  anims.forEach((a) => (a.playbackRate = 40));
  if (window.__rkMarqueeSpeed) window.__rkMarqueeSpeed(40);
  return anims.length ? `waapi×40 (${anims.length})` : window.__rkMarqueeSpeed ? 'raf×40' : 'KEINE ANIMATION GEFUNDEN';
});
console.log(`   Marquee-Antrieb: ${accel}`);

// 100s-Zyklus ÷ 40 = 2,5s → 15s Sampling ≈ 6 volle Zyklen. Sample alle 250 ms.
const samples = [];
for (let i = 0; i < 60; i++) {
  const s = await page.evaluate(() => {
    const track = document.querySelector('.reviews-marquee__track');
    const set = document.querySelector('.reviews-marquee__set');
    const vp = document.querySelector('.reviews-marquee__viewport');
    const m = new DOMMatrixReadOnly(getComputedStyle(track).transform);
    const vpr = vp.getBoundingClientRect();
    const visibleCards = [...document.querySelectorAll('.reviews-card')].filter((c) => {
      const r = c.getBoundingClientRect();
      return r.right > vpr.left + 40 && r.left < vpr.right - 40 && r.width > 0;
    }).length;
    return { tx: m.m41, setWidth: set.scrollWidth, visibleCards };
  });
  samples.push(s);
  await page.waitForTimeout(250);
}

const setWidth = samples[0].setWidth;
const txValues = samples.map((s) => s.tx);
const minVisible = Math.min(...samples.map((s) => s.visibleCards));
const outOfRange = samples.filter((s) => s.tx > 5 || s.tx < -(setWidth + 5)).length;
const distinct = new Set(txValues.map((t) => Math.round(t))).size;
const wrapped = (() => {
  // Mindestens ein Wrap: tx springt von "weit links" zurück Richtung 0
  for (let i = 1; i < txValues.length; i++) {
    if (txValues[i] - txValues[i - 1] > setWidth * 0.5) return true;
  }
  return false;
})();

ok('Marquee bewegt sich (transform ändert sich)', distinct > 5, `${distinct} verschiedene Positionen`);
ok('Marquee: transform bleibt immer in [-setWidth, 0]', outOfRange === 0, `${outOfRange}/60 Samples außerhalb, setWidth=${setWidth}`);
ok('Marquee: mindestens 1 Wrap (Loop startet nahtlos neu)', wrapped);
ok('Marquee: zu JEDEM Zeitpunkt ≥2 Karten sichtbar (nie leer)', minVisible >= 2, `min sichtbar: ${minVisible}`);
await page.screenshot({ path: `${SHOT_DIR}/${ENGINE_NAME}-marquee.png` });

/* ---------- Section-Videos (Warum/Banken) ---------- */
await page.evaluate(() => document.querySelector('#warum')?.scrollIntoView({ block: 'center' }));
await page.waitForTimeout(2500);
const secVids = await page.evaluate(() =>
  [...document.querySelectorAll('.section-video-bg__video')].map((v) => ({
    section: v.closest('[id]')?.id,
    paused: v.paused,
    t: +v.currentTime.toFixed(2),
    display: getComputedStyle(v).display,
  })),
);
const warum = secVids.find((s) => s.section === 'warum');
ok('Warum-Section-Video spielt beim Reinscrollen', !!warum && !warum.paused && warum.t > 0, JSON.stringify(secVids));

await browser.close();

const failed = results.filter((r) => !r.pass).length;
console.log(`\n=== ${ENGINE_NAME}: ${results.length - failed}/${results.length} Checks grün ===`);
process.exit(failed ? 1 : 0);
