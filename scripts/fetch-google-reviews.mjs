#!/usr/bin/env node
/**
 * Wöchentlicher Fetch: Google Places API → src/data/google-reviews.json
 *
 * Field Mask (minimal, Pro-Tier): reviews,rating,userRatingCount
 * Bei Fehler: bestehende JSON bleibt unverändert (kein harter Fall).
 *
 * TODO: Google Places API Key in .env eintragen (GOOGLE_PLACES_API_KEY)
 * TODO: Place ID in src/content/site.ts setzen (googlePlaceId)
 * TODO: Cron-Job einrichten (wöchentlich, Montag früh) — .github/workflows/fetch-google-reviews.yml
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CACHE_PATH = join(ROOT, 'src/data/google-reviews.json');
const SITE_TS = join(ROOT, 'src/content/site.ts');

const FIELD_MASK = 'reviews,rating,userRatingCount';

function readPlaceId() {
  const src = readFileSync(SITE_TS, 'utf8');
  const m = src.match(/export const googlePlaceId\s*=\s*['"]([^'"]*)['"]/);
  return m?.[1]?.trim() ?? '';
}

function loadEnv() {
  const envPath = join(ROOT, '.env');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    const val = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

function pickReviewText(r) {
  const localized =
    typeof r.text === 'string' ? r.text.trim() : r.text?.text?.trim() ?? '';
  const original = r.originalText?.text?.trim() ?? '';
  // originalText = Sprache der Bewertung; mit languageCode=de ist text ebenfalls DE
  return original || localized;
}

function mapReview(r) {
  return {
    authorName: r.authorAttribution?.displayName ?? 'Google-Nutzer',
    rating: Number(r.rating) || 5,
    text: pickReviewText(r),
    profilePhotoUrl: r.authorAttribution?.photoUri ?? null,
    relativeTimeDescription: r.relativePublishTimeDescription ?? null,
  };
}

async function fetchReviews(apiKey, placeId) {
  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=de`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': FIELD_MASK,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Places API ${res.status}: ${body.slice(0, 400)}`);
  }

  const data = await res.json();
  const reviews = (data.reviews ?? [])
    .map(mapReview)
    .filter((r) => r.text.length > 0)
    .slice(0, 5);

  return {
    fetchedAt: new Date().toISOString(),
    placeId,
    rating: data.rating ?? null,
    userRatingCount: data.userRatingCount ?? null,
    reviews,
    source: 'google-places-api',
  };
}

async function main() {
  loadEnv();
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  const placeId = readPlaceId();

  if (!apiKey) {
    console.warn('[fetch-google-reviews] GOOGLE_PLACES_API_KEY fehlt — Cache unverändert.');
    process.exit(0);
  }
  if (!placeId) {
    console.warn('[fetch-google-reviews] googlePlaceId in site.ts fehlt — Cache unverändert.');
    process.exit(0);
  }

  try {
    const cache = await fetchReviews(apiKey, placeId);
    if (cache.reviews.length === 0) {
      console.warn('[fetch-google-reviews] Keine Reviews in der Antwort — Cache unverändert.');
      process.exit(0);
    }
    writeFileSync(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`, 'utf8');
    console.log(
      `[fetch-google-reviews] OK — ${cache.reviews.length} Reviews, Rating ${cache.rating}, Count ${cache.userRatingCount}`,
    );
  } catch (err) {
    console.error('[fetch-google-reviews] Fehler:', err.message);
    console.error('[fetch-google-reviews] Letzter Cache bleibt aktiv.');
    process.exit(0);
  }
}

main();
