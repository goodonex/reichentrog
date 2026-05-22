/** Endlos-Marquee per requestAnimationFrame — zuverlässiger als CSS-Keyframes. */
const LOOP_DURATION_S = 100;

export function initReviewsMarquee(): void {
  const marquee = document.querySelector<HTMLElement>('.reviews-marquee');
  const track = document.querySelector<HTMLElement>('.reviews-marquee__track');
  const set = track?.querySelector<HTMLElement>('.reviews-marquee__set');
  if (!marquee || !track || !set) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  track.style.animation = 'none';

  let setWidth = 0;
  let offset = 0;
  let paused = false;
  let lastTime = performance.now();
  let rafId = 0;

  const measure = () => {
    const width = set.getBoundingClientRect().width;
    if (width > 0) {
      setWidth = width;
      if (offset >= setWidth) offset = offset % setWidth;
    }
  };

  const tick = (now: number) => {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    if (setWidth <= 0) {
      measure();
    } else if (!paused) {
      offset += (setWidth / LOOP_DURATION_S) * dt;
      if (offset >= setWidth) offset -= setWidth;
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    }

    rafId = requestAnimationFrame(tick);
  };

  measure();
  requestAnimationFrame(() => {
    measure();
    rafId = requestAnimationFrame(tick);
  });

  set.querySelectorAll('img').forEach((img) => {
    if (!img.complete) img.addEventListener('load', measure, { once: true });
  });

  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(measure);
    observer.observe(set);
  } else {
    window.addEventListener('resize', measure);
  }

  marquee.addEventListener('mouseenter', () => {
    paused = true;
  });
  marquee.addEventListener('mouseleave', () => {
    paused = false;
    lastTime = performance.now();
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) lastTime = performance.now();
  });

  window.addEventListener('pagehide', () => cancelAnimationFrame(rafId), { once: true });
}
