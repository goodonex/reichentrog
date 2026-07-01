/** Hero-Video: simple crossfade Poster → Video wenn bereit. */
export function initHeroScrollVideo(): void {
  const video = document.getElementById('hero-video') as HTMLVideoElement | null;
  const poster = document.getElementById('hero-poster') as HTMLImageElement | null;
  if (!video) return;

  const mobileMq = window.matchMedia('(max-width: 767px)');
  const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (mobileMq.matches || motionMq.matches) return;

  const showVideo = () => {
    video.classList.add('is-ready');
    poster?.classList.add('is-hidden');
  };

  if (video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
    showVideo();
  } else {
    video.addEventListener('canplay', showVideo, { once: true });
  }

  video.addEventListener('error', () => {
    video.classList.remove('is-ready');
    poster?.classList.remove('is-hidden');
  }, { once: true });
}
