import { onLoaderDone, prefersReducedMotion } from './motion';

export function initHeroReveal(): void {
  const root = document.querySelector('[data-hero-reveal]');
  if (!root) return;

  const run = () => {
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-hero-item]'));

    if (prefersReducedMotion()) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const byKey = (key: string) => items.find((el) => el.dataset.heroItem === key);

    // Stufe 1: eyebrow sofort
    byKey('eyebrow')?.classList.add('is-visible');

    // Stufe 2: Headline + Motto + Subline
    window.setTimeout(() => {
      byKey('headline')?.classList.add('is-visible');
      byKey('motto')?.classList.add('is-visible');
      byKey('subline')?.classList.add('is-visible');
    }, 200);

    // Stufe 3: Buttons + Trust
    window.setTimeout(() => {
      byKey('buttons')?.classList.add('is-visible');
      byKey('trust')?.classList.add('is-visible');
    }, 450);
  };

  onLoaderDone(run);
}
