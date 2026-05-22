/** Cache-Struktur für Google Places Reviews (Build-Zeit, kein Live-Call). */

export interface GoogleReview {
  authorName: string;
  rating: number;
  text: string;
  profilePhotoUrl: string | null;
  relativeTimeDescription: string | null;
}

export interface GoogleReviewsCache {
  fetchedAt: string;
  placeId: string;
  rating: number | null;
  userRatingCount: number | null;
  reviews: GoogleReview[];
  source: 'google-places-api' | 'seed' | 'cache';
}
