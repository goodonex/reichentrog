/** Mobile-Screenshots (WebKit, 390px) über die ganze Startseite, Section für Section. */
import { webkit } from 'playwright';

const BASE = 'http://localhost:5175';
const OUT = '/tmp/rk-mobile';
const browser = await webkit.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await page.goto(BASE + '/', { waitUntil: 'load' });
await page.waitForTimeout(1200);
// Cookie akzeptieren, damit Videos/Reveals laufen
await page.locator('#cookie-necessary, #cookie-accept-all').first().click().catch(() => {});
await page.waitForTimeout(800);

// Alle Reveal-Elemente sichtbar erzwingen (IntersectionObserver in Screenshots)
await page.addStyleTag({
  content:
    '.opacity-0{opacity:1 !important;} [data-reveal],[data-hero-item],.usp-card,.off-market-statement__headline{opacity:1 !important; transform:none !important;}',
});

const sections = ['hero', 'zielgruppe', 'alles-aus-einer-hand', 'warum', 'banken-hintergrund', 'off-market', 'ankauf', 'cases', 'reichweite', 'team', 'stimmen', 'faq', 'kontakt'];
for (const id of sections) {
  const el = await page.$(`#${id}`);
  if (!el) { console.log(`(kein #${id})`); continue; }
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await el.screenshot({ path: `${OUT}/${id}.png` }).catch((e) => console.log(`fail ${id}: ${e.message.split('\n')[0]}`));
  console.log(`shot ${id}`);
}
// Ganze Seite als Übersicht
await page.screenshot({ path: `${OUT}/_fullpage.png`, fullPage: true });
await browser.close();
console.log('done');
