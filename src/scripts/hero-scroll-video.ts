/**
 * Hero-Video ohne jemals sichtbaren Play-Button:
 *  - Quellen werden erst bei der ersten Interaktion angehängt (Lazy-Source).
 *  - Das Video bleibt per CSS transparent (opacity 0), bis der ERSTE echte Frame
 *    gerendert wurde — damit ist auch Safaris UA-Play-Button unsichtbar und es
 *    gibt keinen Weißblitz (Safari feuert 'playing' vor dem ersten Paint).
 *  - Bei echten Gesten (pointerdown/click/touch/key) wird play() direkt in der
 *    Geste aufgerufen; autoplay-Attribut + canplay-play() dienen als Fallback.
 */
export function initHeroScrollVideo(): void {
  const video = document.getElementById('hero-video') as HTMLVideoElement | null;
  const poster = document.getElementById('hero-poster') as HTMLImageElement | null;
  if (!video) return;

  const mobileMq = window.matchMedia('(max-width: 767px)');
  const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mobileMq.matches || motionMq.matches) return;

  /* Reveal erst, wenn ein Frame wirklich präsentiert wurde. */
  let revealed = false;
  const reveal = () => {
    if (revealed) return;
    revealed = true;
    video.classList.add('is-ready');
    poster?.classList.add('is-hidden');
  };

  const armFrameReveal = () => {
    // WICHTIG: rVFC feuert auch für den ersten Frame eines PAUSIERTEN Videos
    // (z. B. wenn Autoplay blockiert wurde). Nur aufdecken, wenn wirklich
    // Wiedergabe läuft — sonst neu scharf stellen und weiter warten.
    if ('requestVideoFrameCallback' in video) {
      const v = video as HTMLVideoElement & {
        requestVideoFrameCallback: (cb: () => void) => number;
      };
      const onFrame = () => {
        if (!video.paused && video.currentTime > 0) reveal();
        else if (!revealed) v.requestVideoFrameCallback(onFrame);
      };
      v.requestVideoFrameCallback(onFrame);
    }
    // Fallback (und Doppelboden): erst ab spürbarem Fortschritt aufdecken.
    video.addEventListener('timeupdate', function onTime() {
      if (!video.paused && video.currentTime > 0.05) {
        video.removeEventListener('timeupdate', onTime);
        reveal();
      }
    });
  };

  const tryPlay = () => {
    video.muted = true;
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  };

  let attached = false;
  const attachSources = () => {
    if (attached) return;
    attached = true;
    video.querySelectorAll<HTMLSourceElement>('source[data-src]').forEach((s) => {
      if (s.dataset.src && !s.getAttribute('src')) s.src = s.dataset.src;
    });
    armFrameReveal();
    video.addEventListener('canplay', tryPlay, { once: true });
    video.load();
  };

  /* Quellen SOFORT anhängen: Download startet mit dem Seitenaufbau, das
     autoplay-Attribut startet die Wiedergabe, sobald genug Daten da sind →
     Video läuft direkt beim Betreten der Seite. Der Play-Button-Schutz liegt
     komplett bei der Opacity-Gate (Video transparent, bis ein Frame einer
     LAUFENDEN Wiedergabe gerendert ist) — Lazy-Anhängen ist dafür nicht mehr
     nötig und hat den Start nur verzögert. */
  attachSources();

  /* Fallback für Browser, die muted-Autoplay blockieren: bei der ersten echten
     Geste (z. B. Cookie-Klick) play() direkt in der Geste. */
  const gestureEvents = ['pointerdown', 'touchstart', 'keydown', 'click'];
  const onGesture = () => tryPlay();

  gestureEvents.forEach((e) => window.addEventListener(e, onGesture, { passive: true }));

  video.addEventListener(
    'playing',
    () => {
      gestureEvents.forEach((e) => window.removeEventListener(e, onGesture));
    },
    { once: true },
  );

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && attached) tryPlay();
  });

  video.addEventListener(
    'error',
    () => {
      video.classList.remove('is-ready');
      poster?.classList.remove('is-hidden');
    },
    { once: true },
  );
}
