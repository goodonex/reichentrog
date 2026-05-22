import { prefersReducedMotion } from './motion';

export function initScrollProgress(): void {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  const update = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
}

export function initFloatingCta(): void {
  const cta = document.getElementById('floating-cta') as HTMLAnchorElement | null;
  const contact = document.getElementById('kontakt');
  if (!cta) return;

  const isHome = window.location.pathname === '/' || window.location.pathname === '/index.html';
  cta.href = isHome ? '#kontakt-form' : '/kontakt/';

  let contactVisible = false;

  const contactObserver = new IntersectionObserver(
    (entries) => {
      contactVisible = entries.some((e) => e.isIntersecting);
      sync();
    },
    { threshold: 0.15 },
  );

  if (contact) contactObserver.observe(contact);

  const sync = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
    const show = (isHome ? pct >= 0.3 : true) && !contactVisible;
    cta.classList.toggle('is-visible', show);
    cta.setAttribute('aria-hidden', show ? 'false' : 'true');
  };

  window.addEventListener(
    'scroll',
    () => {
      sync();
    },
    { passive: true },
  );
  sync();
}

export function initOffMarketReveal(): void {
  const headline = document.querySelector<HTMLElement>('.off-market-statement__headline');
  if (!headline) return;

  if (prefersReducedMotion()) {
    headline.classList.add('is-visible');
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        headline.classList.add('is-visible');
        io.disconnect();
      });
    },
    { threshold: 0.35 },
  );

  io.observe(headline);
}
