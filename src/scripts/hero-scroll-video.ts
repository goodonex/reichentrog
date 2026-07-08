/** Hero-Video: simple crossfade Poster → Video wenn bereit. */
export function initHeroScrollVideo(): void {
  const video = document.getElementById('hero-video') as HTMLVideoElement | null;
  const poster = document.getElementById('hero-poster') as HTMLImageElement | null;
  if (!video) return;

  const mobileMq = window.matchMedia('(max-width: 767px)');
  const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (mobileMq.matches || motionMq.matches) return;

  const tryPlay = () => {
    video.muted = true;
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  };

  // Das Video erst SICHTBAR machen, wenn es WIRKLICH spielt — nicht schon bei
  // „canplay". Bis dahin liegt das Poster (ein Bild, kein Play-Button) darüber.
  // Damit sieht man nie Safaris nativen Play-Button eines pausierten Videos:
  // Startet Autoplay → Poster blendet sofort weg. Blockt Safari Autoplay →
  // Poster bleibt (sauber, ohne Button), bis die erste Interaktion play() auslöst.
  const reveal = () => {
    video.classList.add('is-ready');
    poster?.classList.add('is-hidden');
  };

  video.addEventListener('playing', reveal);
  // Falls das Video bereits läuft, bevor der Listener dranhing (Autoplay greift
  // sofort): laufendes Playback nachträglich aufdecken.
  video.addEventListener('timeupdate', () => {
    if (!video.paused && video.currentTime > 0) reveal();
  });
  if (!video.paused && video.currentTime > 0) reveal();

  if (video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
    tryPlay();
  } else {
    video.addEventListener('canplay', tryPlay, { once: true });
    video.addEventListener('loadeddata', tryPlay, { once: true });
  }

  tryPlay();

  video.addEventListener(
    'error',
    () => {
      video.classList.remove('is-ready');
      poster?.classList.remove('is-hidden');
    },
    { once: true },
  );
}
