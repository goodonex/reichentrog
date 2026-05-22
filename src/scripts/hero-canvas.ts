/**
 * Hero-Canvas: aktuell Verlauf als Platzhalter.
 * Später: WebP-Frame-Sequenz (requestAnimationFrame, nicht im Scroll-Handler).
 */
export function initHeroCanvas(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => undefined;

  let raf = 0;

  const draw = () => {
    const w = canvas.width;
    const h = canvas.height;
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#1a2e4e');
    g.addColorStop(0.45, '#2e4e70');
    g.addColorStop(1, '#6d90bc');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    raf = requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });

  return () => {
    window.removeEventListener('resize', resize);
    cancelAnimationFrame(raf);
  };
}
