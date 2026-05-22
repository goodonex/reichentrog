export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function onLoaderDone(callback: () => void): void {
  if (prefersReducedMotion()) {
    callback();
    return;
  }
  if (document.getElementById('page-loader')?.classList.contains('is-done')) {
    callback();
    return;
  }
  window.addEventListener('rk:loader-done', callback, { once: true });
}
