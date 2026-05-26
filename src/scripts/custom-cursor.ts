import { prefersReducedMotion } from './motion';

function isNavLightSurface(nav: HTMLElement | null): boolean {
  if (!nav) return false;
  if (nav.dataset.noHero === 'true') return true;
  if (nav.dataset.onHero === 'false') return true;
  return nav.dataset.onHero === 'true' && nav.dataset.scrolled === 'true';
}

function isLightSurfaceAt(x: number, y: number, nav: HTMLElement | null): boolean {
  const hit = document.elementFromPoint(x, y);
  if (!hit) return false;

  if (hit.closest('[data-cursor-surface="dark"]')) return false;
  if (hit.closest('#floating-cta')) return false;
  if (hit.closest('.nav-highlight')) return false;
  if (hit.closest('[data-cursor-surface="light"]')) return true;
  if (hit.closest('#cookie-banner')) return true;
  if (hit.closest('#site-nav') && isNavLightSurface(nav)) return true;

  return false;
}

export function initCustomCursor(): void {
  const cursor = document.getElementById('custom-cursor');
  const inner = cursor?.querySelector<HTMLElement>('.custom-cursor__inner');
  const nav = document.getElementById('site-nav');
  const finePointer = window.matchMedia('(pointer: fine)');

  if (!cursor || !inner || prefersReducedMotion() || !finePointer.matches) {
    document.body.classList.remove('has-custom-cursor');
    return;
  }

  document.body.classList.add('has-custom-cursor');

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let rafId = 0;
  let clickLocked = false;
  let onLightSurface = false;

  const LERP = 0.17;
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const updateSurfaceColor = (x: number, y: number) => {
    const onLight = isLightSurfaceAt(x, y, nav);
    if (onLight === onLightSurface) return;
    onLightSurface = onLight;
    cursor.classList.toggle('is-on-light', onLight);
  };

  const tick = () => {
    currentX = lerp(currentX, targetX, LERP);
    currentY = lerp(currentY, targetY, LERP);
    cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
    updateSurfaceColor(currentX, currentY);
    rafId = window.requestAnimationFrame(tick);
  };

  const onMove = (e: MouseEvent) => {
    targetX = e.clientX;
    targetY = e.clientY;
    updateSurfaceColor(targetX, targetY);
  };

  const hoverSelector =
    'a, button, summary, [role="button"], label, input, textarea, select, .segment-hero__control-btn, .segment-hero__play-btn';

  document.addEventListener('mousemove', onMove, { passive: true });

  document.addEventListener(
    'mouseover',
    (e) => {
      const t = e.target as Element | null;
      if (t?.closest(hoverSelector)) cursor.classList.add('is-hover');
    },
    { passive: true },
  );

  document.addEventListener(
    'mouseout',
    (e) => {
      const t = e.target as Element | null;
      if (t?.closest(hoverSelector)) cursor.classList.remove('is-hover');
    },
    { passive: true },
  );

  document.addEventListener('mousedown', () => {
    if (clickLocked) return;
    clickLocked = true;
    cursor.classList.add('is-click');

    window.setTimeout(() => {
      cursor.classList.remove('is-click');
      inner.style.transition = 'none';
      inner.style.transform = cursor.classList.contains('is-hover') ? 'scale(1.3)' : '';
      void inner.offsetWidth;
      inner.style.transition = '';
      clickLocked = false;
    }, 500);
  });

  const onNavStateChange = () => {
    updateSurfaceColor(currentX, currentY);
  };

  window.addEventListener('scroll', onNavStateChange, { passive: true });

  finePointer.addEventListener('change', (e) => {
    if (!e.matches) {
      document.body.classList.remove('has-custom-cursor');
      window.cancelAnimationFrame(rafId);
    }
  });

  rafId = window.requestAnimationFrame(tick);

  window.addEventListener('pagehide', () => {
    window.cancelAnimationFrame(rafId);
  });
}
