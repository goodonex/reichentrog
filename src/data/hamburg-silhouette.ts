/**
 * Hamburg-Stadtgrenze (vereinfacht), abgeleitet aus OpenStreetMap via Nominatim.
 * Douglas-Peucker ε≈0.0055 · urbaner Ausschnitt · 25 Punkte.
 * @see scripts/fetch-hamburg-silhouette.mjs zum Regenerieren
 */
export const hamburgSilhouettePath =
  'M 59.61 95.45 L 94.93 75.72 L 90.75 73.62 L 92.45 68.4 L 87.93 69.07 L 87.02 65.4 L 90.24 60.16 L 86.77 58.25 L 90.61 51.48 L 94.96 52.35 L 95.35 24.41 L 84.75 18.41 L 89.82 14.94 L 89.29 9.96 L 95.45 8.23 L 70.52 4.55 L 65.84 7.71 L 68.44 10.17 L 63.47 15.63 L 65.85 18.7 L 47.22 18.0 L 43.53 29.64 L 22.42 28.15 L 17.69 38.51 L 4.55 48.96 Z';

export const hamburgMapLocations = [
  { label: 'Elbvororte', x: 21.11, y: 62.94 },
  { label: 'Alstertal', x: 62.83, y: 24.83 },
  { label: 'Harvestehude', x: 44.57, y: 50.98 },
  { label: 'Eppendorf', x: 43.9, y: 49.41 },
] as const;
