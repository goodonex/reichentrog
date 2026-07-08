/** Hero-Video: simple crossfade Poster → Video wenn bereit. */
export function initHeroScrollVideo(): void {
  const video = document.getElementById('hero-video') as HTMLVideoElement | null;
  const poster = document.getElementById('hero-poster') as HTMLImageElement | null;
  if (!video) return;

  const mobileMq = window.matchMedia('(max-width: 767px)');
  const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (mobileMq.matches || motionMq.matches) return;

  const tryPlay = () => {
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  };

  const showVideo = () => {
    video.classList.add('is-ready');
    poster?.classList.add('is-hidden');
    // Safari startet muted-Videos nicht immer allein über das autoplay-Attribut —
    // explizit anstoßen, sobald genug Daten da sind.
    tryPlay();
  };

  if (video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
    showVideo();
  } else {
    video.addEventListener('canplay', showVideo, { once: true });
    video.addEventListener('loadeddata', tryPlay, { once: true });
  }

  tryPlay();

  video.addEventListener('error', () => {
    video.classList.remove('is-ready');
    poster?.classList.remove('is-hidden');
  }, { once: true });
}
