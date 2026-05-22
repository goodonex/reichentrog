import { prefersReducedMotion } from './motion';

const MOBILE_MQ = '(max-width: 767px)';

export function initHeroScrollVideo(): void {
  const stack = document.getElementById('hero-video-stack');
  const video = document.getElementById('hero-video') as HTMLVideoElement | null;
  const poster = document.getElementById('hero-poster') as HTMLImageElement | null;
  const hero = document.getElementById('hero');

  if (!stack || !video || !hero) return;

  const mobileMq = window.matchMedia(MOBILE_MQ);
  const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');

  let ready = false;
  let duration = 0;
  let rafId = 0;
  let ticking = false;
  let pendingSeek: number | null = null;
  let isSeeking = false;
  let cachedHeroTop = 0;
  let cachedScrollRange = 1;

  const isMobileOrReduced = () => mobileMq.matches || motionMq.matches || prefersReducedMotion();

  const showVideo = () => {
    video.classList.add('is-ready');
    poster?.classList.add('is-hidden');
  };

  const keepPoster = () => {
    video.classList.remove('is-ready');
    poster?.classList.remove('is-hidden');
  };

  const cacheHeroMetrics = () => {
    cachedHeroTop = hero.getBoundingClientRect().top + window.scrollY;
    cachedScrollRange = Math.max(hero.offsetHeight - window.innerHeight, 1);
  };

  const getScrollProgress = (): number => {
    const scrolled = window.scrollY - cachedHeroTop;
    return Math.min(Math.max(scrolled / cachedScrollRange, 0), 1);
  };

  const flushSeek = () => {
    if (!ready || pendingSeek === null || isSeeking) return;

    const targetTime = pendingSeek;
    pendingSeek = null;
    isSeeking = true;

    try {
      if (typeof video.fastSeek === 'function') {
        video.fastSeek(targetTime);
      } else {
        video.currentTime = targetTime;
      }
    } catch {
      isSeeking = false;
    }
  };

  const scheduleSeek = (time: number) => {
    pendingSeek = time;
    flushSeek();
  };

  const syncStackFade = (progress: number) => {
    const fade = progress > 0.82 ? Math.min((progress - 0.82) / 0.18, 1) : 0;
    stack.style.setProperty('--hero-exit-fade', String(fade));
  };

  const tick = () => {
    ticking = false;

    if (!ready || duration <= 0 || isMobileOrReduced()) return;

    const progress = getScrollProgress();
    const targetTime = progress * duration;

    if (Math.abs(video.currentTime - targetTime) > 0.008) {
      scheduleSeek(targetTime);
    }

    syncStackFade(progress);
  };

  const requestTick = () => {
    if (ticking) return;
    ticking = true;
    rafId = window.requestAnimationFrame(tick);
  };

  const onScrollOrResize = () => {
    if (!ready || isMobileOrReduced()) return;
    requestTick();
  };

  const initScrollControl = () => {
    if (isMobileOrReduced()) return;
    if (!Number.isFinite(video.duration) || video.duration <= 0) return;

    duration = video.duration;
    ready = true;
    video.pause();
    video.currentTime = 0;
    showVideo();
    cacheHeroMetrics();

    const progress = getScrollProgress();
    scheduleSeek(progress * duration);
    syncStackFade(progress);
    requestTick();
  };

  const teardownScrollControl = () => {
    ready = false;
    duration = 0;
    pendingSeek = null;
    isSeeking = false;
    ticking = false;
    video.pause();
    video.currentTime = 0;
    keepPoster();
    stack.style.removeProperty('--hero-exit-fade');
    window.cancelAnimationFrame(rafId);
  };

  const setupScrollControl = () => {
    if (isMobileOrReduced()) {
      teardownScrollControl();
      return;
    }

    const start = () => {
      if (video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
        initScrollControl();
      } else {
        video.addEventListener('canplaythrough', initScrollControl, { once: true });
        video.load();
      }
    };

    start();
  };

  video.addEventListener('seeked', () => {
    isSeeking = false;
    flushSeek();
  });

  video.addEventListener(
    'error',
    () => {
      keepPoster();
    },
    { once: true },
  );

  const onModeChange = () => {
    if (isMobileOrReduced()) {
      teardownScrollControl();
      return;
    }
    cacheHeroMetrics();
    setupScrollControl();
  };

  mobileMq.addEventListener('change', onModeChange);
  motionMq.addEventListener('change', onModeChange);
  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', () => {
    cacheHeroMetrics();
    onScrollOrResize();
  });

  cacheHeroMetrics();

  if (isMobileOrReduced()) {
    window.addEventListener('pagehide', () => window.cancelAnimationFrame(rafId));
    return;
  }

  setupScrollControl();

  window.addEventListener('pagehide', () => {
    window.cancelAnimationFrame(rafId);
  });
}
