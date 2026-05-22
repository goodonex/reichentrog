import { onLoaderDone, prefersReducedMotion } from './motion';

export function initHeroReveal(): void {
  const root = document.querySelector('[data-hero-reveal]');
  if (!root) return;

  const run = () => {
    const words = Array.from(root.querySelectorAll<HTMLElement>('[data-hero-word]'));
    const headline = root.querySelector<HTMLElement>('[data-hero-headline]');
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-hero-item]'));

    if (prefersReducedMotion()) {
      headline?.classList.add('is-visible');
      words.forEach((w) => {
        w.classList.add('is-visible');
      });
      items.forEach((el) => el.classList.add('is-visible'));
      if (headline) headline.textContent = 'Hanseatisch diskret. Klar erfolgreich.';
      return;
    }

    headline?.classList.add('is-visible');

    words.forEach((word, i) => {
      window.setTimeout(() => word.classList.add('is-visible'), i * 80);
    });

    const wordsEnd = words.length * 80;
    window.setTimeout(() => {
      items.find((el) => el.dataset.heroItem === 'subline')?.classList.add('is-visible');
    }, wordsEnd + 200);

    window.setTimeout(() => {
      items.find((el) => el.dataset.heroItem === 'buttons')?.classList.add('is-visible');
    }, wordsEnd + 350);

    window.setTimeout(() => {
      items.find((el) => el.dataset.heroItem === 'trust')?.classList.add('is-visible');
      items.find((el) => el.dataset.heroItem === 'eyebrow')?.classList.add('is-visible');
      if (headline) {
        headline.textContent = 'Hanseatisch diskret. Klar erfolgreich.';
      }
    }, wordsEnd + 500);
  };

  onLoaderDone(run);
}
