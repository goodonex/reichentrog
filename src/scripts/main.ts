import { initHeroCanvas } from './hero-canvas';
import { initCustomCursor } from './custom-cursor';
import { initSegmentHeroVideos } from './segment-hero-video';
import { initHeroReveal } from './hero-reveal';
import { initHeroScrollVideo } from './hero-scroll-video';
import { initPageLoader } from './page-loader';
import {
  initFloatingCta,
  initOffMarketReveal,
  initScrollProgress,
} from './ui-enhancements';
import { initReviewsExpand } from './reviews-expand';
import { initReviewsMarquee } from './reviews-marquee';
import { initProcessStepper } from './process-stepper';
import { prefersReducedMotion } from './motion';

const BASE_STAGGER_MS = 110;
const MAX_STAGGERED_CHILDREN = 12;

function initReveals(): void {
  const sections = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (prefersReducedMotion()) {
    sections.forEach((el) => {
      el.classList.remove('opacity-0', 'translate-y-6');
      el.classList.add('opacity-100', 'translate-y-0');
    });
    document.querySelectorAll<HTMLElement>('[data-reveal-child]').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.classList.add('is-revealed');
    });
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const root = entry.target as HTMLElement;
        io.unobserve(root);

        const stagger = root.dataset.revealStagger === 'true';
        const kids = stagger
          ? Array.from(root.querySelectorAll<HTMLElement>('[data-reveal-child]')).slice(
              0,
              MAX_STAGGERED_CHILDREN,
            )
          : [];

        if (stagger && kids.length) {
          kids.forEach((child, i) => {
            window.setTimeout(() => {
              child.classList.add('is-revealed');
            }, i * BASE_STAGGER_MS);
          });
        }
        root.classList.remove('opacity-0', 'translate-y-6');
        root.classList.add('opacity-100', 'translate-y-0', 'transition-all', 'duration-700', 'ease-out');
      });
    },
    { threshold: 0.15, rootMargin: '-80px' },
  );

  sections.forEach((el) => io.observe(el));
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function initCountups(): void {
  const els = document.querySelectorAll<HTMLElement>('[data-countup]');
  if (prefersReducedMotion()) {
    els.forEach((el) => {
      const target = el.dataset.target;
      const suffix = el.dataset.suffix ?? '';
      if (target) el.textContent = `${target}${suffix}`;
    });
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        io.unobserve(el);
        const raw = el.dataset.target;
        if (!raw) return;
        const target = Number(raw);
        const suffix = el.dataset.suffix ?? '';
        const decimals = Number(el.dataset.decimals ?? 0);
        const duration = 1200;
        const start = performance.now();

        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const v = easeOutCubic(p) * target;
          el.textContent =
            decimals > 0 ? `${v.toFixed(decimals)}${suffix}` : `${Math.round(v)}${suffix}`;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.3 },
  );

  els.forEach((el) => io.observe(el));
}

function initNavTheme(): void {
  const nav = document.getElementById('site-nav');
  if (!nav) return;
  const update = () => {
    if (nav.dataset.noHero === 'true') {
      nav.dataset.onHero = 'false';
      return;
    }
    const y = window.scrollY || document.documentElement.scrollTop;
    const threshold = window.innerHeight * 0.88;
    nav.dataset.onHero = y < threshold ? 'true' : 'false';
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
}

function initNav(): void {
  const nav = document.getElementById('site-nav');
  const toggle = document.getElementById('nav-toggle');
  const panel = document.getElementById('nav-panel');
  if (!nav || !toggle || !panel) return;

  const mq = window.matchMedia('(min-width: 768px)');

  const syncPanel = () => {
    if (mq.matches) {
      panel.classList.remove('hidden');
      panel.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'false');
      return;
    }
    const open = toggle.getAttribute('aria-expanded') === 'true';
    panel.classList.toggle('hidden', !open);
    panel.setAttribute('aria-hidden', open ? 'false' : 'true');
  };

  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    syncPanel();
  };

  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    nav.dataset.scrolled = y > 24 ? 'true' : 'false';
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  toggle.addEventListener('click', () => {
    if (mq.matches) return;
    const open = toggle.getAttribute('aria-expanded') === 'true';
    setOpen(!open);
  });

  mq.addEventListener('change', syncPanel);
  syncPanel();

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      setOpen(false);
      toggle.focus();
    }
  });

  panel.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      if (!mq.matches) setOpen(false);
    });
  });
}

function initCookieBanner(): void {
  const KEY = 'rk_cookie_consent';
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  const existing = localStorage.getItem(KEY);
  if (existing === 'all' || existing === 'necessary') {
    banner.classList.add('hidden');
    if (existing === 'all') window.dispatchEvent(new CustomEvent('rk-consent-all'));
    return;
  }

  const acceptAll = document.getElementById('cookie-accept-all');
  const necessary = document.getElementById('cookie-necessary');

  acceptAll?.addEventListener('click', () => {
    localStorage.setItem(KEY, 'all');
    banner.classList.add('hidden');
    window.dispatchEvent(new CustomEvent('rk-consent-all'));
  });

  necessary?.addEventListener('click', () => {
    localStorage.setItem(KEY, 'necessary');
    banner.classList.add('hidden');
  });
}

function initHero(): void {
  const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement | null;
  if (!canvas || canvas.classList.contains('hidden')) return;
  if (prefersReducedMotion()) {
    canvas.classList.add('hidden');
    return;
  }
  initHeroCanvas(canvas);
}

function boot(): void {
  initPageLoader();
  initHero();
  initHeroScrollVideo();
  initNavTheme();
  initNav();
  initReveals();
  initCountups();
  initCookieBanner();
  initCustomCursor();
  initSegmentHeroVideos();
  initHeroReveal();
  initScrollProgress();
  initFloatingCta();
  initOffMarketReveal();
  initReviewsExpand();
  initReviewsMarquee();
  initProcessStepper();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
