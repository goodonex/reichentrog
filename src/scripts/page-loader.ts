import { onLoaderDone, prefersReducedMotion } from './motion';

export function initPageLoader(): void {
  const loader = document.getElementById('page-loader');
  if (!loader) {
    window.dispatchEvent(new CustomEvent('rk:loader-done'));
    return;
  }

  const finish = () => {
    loader.classList.add('is-hidden');
    window.setTimeout(() => {
      loader.classList.add('is-done');
      document.body.classList.remove('overflow-hidden');
      window.dispatchEvent(new CustomEvent('rk:loader-done'));
    }, prefersReducedMotion() ? 0 : 400);
  };

  document.body.classList.add('overflow-hidden');
  window.setTimeout(finish, prefersReducedMotion() ? 0 : 800);
}
