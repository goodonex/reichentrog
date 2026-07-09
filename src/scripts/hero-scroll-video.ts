/**
 * Hero-Video: Quellen erst bei der ersten Nutzer-Interaktion (Klick/Scroll/Maus)
 * anhängen und abspielen. So zeigt Safari NIE seinen nativen Play-Button für ein
 * pausiertes Video — vor der Interaktion existiert schlicht keine abspielbare
 * Quelle, nur das Poster-Bild liegt darüber. Läuft das Video, blendet das Poster weg.
 */
export function initHeroScrollVideo(): void {
  const video = document.getElementById('hero-video') as HTMLVideoElement | null;
  const poster = document.getElementById('hero-poster') as HTMLImageElement | null;
  if (!video) return;

  const mobileMq = window.matchMedia('(max-width: 767px)');
  const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mobileMq.matches || motionMq.matches) return;

  const reveal = () => poster?.classList.add('is-hidden');
  video.addEventListener('playing', reveal);
  video.addEventListener('timeupdate', () => {
    if (!video.paused && video.currentTime > 0) reveal();
  });

  const events = ['pointerdown', 'touchstart', 'keydown', 'scroll', 'mousemove', 'click'];
  let attached = false;

  const tryPlay = () => {
    video.muted = true;
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  };

  const start = () => {
    if (!attached) {
      attached = true;
      video.querySelectorAll<HTMLSourceElement>('source[data-src]').forEach((s) => {
        if (s.dataset.src && !s.getAttribute('src')) s.src = s.dataset.src;
      });
      // Nach dem Anhängen NICHT sofort play() (würde vom load() abgebrochen und
      // verbrennt die User-Geste) — das autoplay-Attribut startet die Wiedergabe
      // selbst, sobald genug Daten da sind; canplay-play() als Absicherung.
      video.addEventListener('canplay', tryPlay, { once: true });
      video.load();
      return;
    }
    tryPlay();
  };

  const onInteract = () => start();
  events.forEach((evt) => window.addEventListener(evt, onInteract, { passive: true }));

  // Sobald das Video läuft, die Interaktions-Listener abräumen.
  video.addEventListener(
    'playing',
    () => events.forEach((evt) => window.removeEventListener(evt, onInteract)),
    { once: true },
  );

  // Tab wieder aktiv → weiterspielen, sofern schon gestartet.
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && attached) start();
  });

  video.addEventListener(
    'error',
    () => poster?.classList.remove('is-hidden'),
    { once: true },
  );
}
