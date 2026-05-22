/** Zentrale Site-Daten */
export const siteName = 'Reichentrog & Kollegen';
export const siteTagline =
  'Immobilien-Kanzlei Hamburg · Hanseatisch diskret · Off-Market';

export const phoneDisplay = '040/41 00 90-0';
export const phoneHref = 'tel:+494041009000';
export const emailDisplay = 'info@reichentrog-finance.de';
export const emailHref = 'mailto:info@reichentrog-finance.de';

/** Google — Bewertungen / Profil (Share-Link, Fallback) */
export const googleReviewsUrl = 'https://share.google/A7jubUpeaHq6J5d7N';

export const googlePlaceId = 'ChIJRYeLAOKTsUcR6iFlqkSXUTo';

/** Link zur Google-Maps-Bewertungsübersicht (aktualisieren sobald Place ID gesetzt) */
export const googleMapsReviewsUrl = googlePlaceId
  ? `https://www.google.com/maps/place/?q=place_id:${googlePlaceId}`
  : googleReviewsUrl;

export const addressLines = [
  'Reichentrog & Kollegen GmbH',
  'Karnapp 25',
  '21079 Hamburg',
];
