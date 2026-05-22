#!/usr/bin/env node
/** Regeneriert src/data/hamburg-silhouette.ts aus OSM-Stadtgrenzen (Nominatim). */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../src/data/hamburg-silhouette.ts');

function ringArea(ring) {
  let a = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[i + 1];
    a += x1 * y2 - x2 * y1;
  }
  return Math.abs(a) / 2;
}

function perpDist(p, a, b) {
  const [x0, y0] = p;
  const [x1, y1] = a;
  const [x2, y2] = b;
  const dx = x2 - x1;
  const dy = y2 - y1;
  if (dx === 0 && dy === 0) return Math.hypot(x0 - x1, y0 - y1);
  const t = Math.max(0, Math.min(1, ((x0 - x1) * dx + (y0 - y1) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(x0 - (x1 + t * dx), y0 - (y1 + t * dy));
}

function rdp(points, eps) {
  if (points.length < 3) return points;
  const a = points[0];
  const b = points[points.length - 1];
  let idx = 0;
  let maxd = -1;
  for (let i = 1; i < points.length - 1; i++) {
    const d = perpDist(points[i], a, b);
    if (d > maxd) {
      idx = i;
      maxd = d;
    }
  }
  if (maxd > eps) return [...rdp(points.slice(0, idx + 1), eps).slice(0, -1), ...rdp(points.slice(idx), eps)];
  return [a, b];
}

function project(lon, lat, bounds) {
  const { minLon, maxLon, minLat, maxLat } = bounds;
  const x = ((lon - minLon) / (maxLon - minLon)) * 100;
  const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100;
  return [Math.round(x * 100) / 100, Math.round(y * 100) / 100];
}

const res = await fetch(
  'https://nominatim.openstreetmap.org/search?q=Hamburg&format=json&polygon_geojson=1&limit=1',
  { headers: { 'User-Agent': 'ReichentrogWebsite/1.0' } },
);
const geo = (await res.json())[0].geojson;
const main =
  geo.type === 'Polygon'
    ? geo.coordinates[0]
    : geo.coordinates.reduce((a, p) => (ringArea(p[0]) > ringArea(a) ? p[0] : a), geo.coordinates[0][0]);

const clipped = main.filter((p) => p[0] >= 9.84 && p[0] <= 10.18 && p[1] >= 53.46 && p[1] <= 53.72);
const simplified = rdp(clipped.length >= 30 ? clipped : main, 0.0055);
const lons = simplified.map((p) => p[0]);
const lats = simplified.map((p) => p[1]);
const bounds = {
  minLon: Math.min(...lons),
  maxLon: Math.max(...lons),
  minLat: Math.min(...lats),
  maxLat: Math.max(...lats),
};
const px = (bounds.maxLon - bounds.minLon) * 0.05;
const py = (bounds.maxLat - bounds.minLat) * 0.05;
bounds.minLon -= px;
bounds.maxLon += px;
bounds.minLat -= py;
bounds.maxLat += py;

const pts = simplified.map(([lon, lat]) => {
  const [x, y] = project(lon, lat, bounds);
  return [Math.max(0, Math.min(100, x)), Math.max(0, Math.min(100, y))];
});
const path = `M ${pts.map(([x, y]) => `${x} ${y}`).join(' L ')} Z`;

const locations = [
  ['Elbvororte', 9.902, 53.553],
  ['Alstertal', 10.058, 53.662],
  ['Harvestehude', 9.9897, 53.5872],
  ['Eppendorf', 9.9872, 53.5917],
].map(([label, lon, lat]) => {
  const [x, y] = project(lon, lat, bounds);
  return { label, x, y };
});

const file = `/**
 * Hamburg-Stadtgrenze (vereinfacht), abgeleitet aus OpenStreetMap via Nominatim.
 * Douglas-Peucker ε≈0.0055 · urbaner Ausschnitt · ${pts.length} Punkte.
 * @see scripts/fetch-hamburg-silhouette.mjs zum Regenerieren
 */
export const hamburgSilhouettePath =
  '${path}';

export const hamburgMapLocations = [
${locations.map((l) => `  { label: '${l.label}', x: ${l.x}, y: ${l.y} },`).join('\n')}
] as const;
`;

writeFileSync(OUT, file, 'utf8');
console.log(`Wrote ${OUT} (${pts.length} points)`);
