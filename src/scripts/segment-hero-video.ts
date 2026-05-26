function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function waitForCanPlay(video: HTMLVideoElement): Promise<void> {
  if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const onReady = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error('Video konnte nicht geladen werden'));
    };
    const cleanup = () => {
      video.removeEventListener('canplay', onReady);
      video.removeEventListener('error', onError);
    };

    video.addEventListener('canplay', onReady, { once: true });
    video.addEventListener('error', onError, { once: true });
  });
}

export function initSegmentHeroVideos(): void {
  document.querySelectorAll<HTMLElement>('[data-segment-hero-video]').forEach((root) => {
    if (root.dataset.initialized === 'true') return;
    root.dataset.initialized = 'true';

    const video = root.querySelector<HTMLVideoElement>('.segment-hero__video');
    const source = video?.querySelector<HTMLSourceElement>('source[data-src]');
    const playBtn = root.querySelector<HTMLButtonElement>('[data-video-play]');
    const muteBtn = root.querySelector<HTMLButtonElement>('[data-video-mute]');
    const rewindBtn = root.querySelector<HTMLButtonElement>('[data-video-rewind]');
    const progress = root.querySelector<HTMLInputElement>('[data-video-progress]');
    const timeCurrent = root.querySelector<HTMLElement>('[data-video-time-current]');
    const timeTotal = root.querySelector<HTMLElement>('[data-video-time-total]');
    const startOverlay = root.querySelector<HTMLElement>('[data-video-start-overlay]');
    const startBtn = root.querySelector<HTMLButtonElement>('[data-video-start]');
    const replayBtn = root.querySelector<HTMLButtonElement>('[data-video-replay]');
    const endedPanel = root.querySelector<HTMLElement>('[data-video-ended-panel]');

    if (
      !video ||
      !source ||
      !playBtn ||
      !muteBtn ||
      !rewindBtn ||
      !progress ||
      !timeCurrent ||
      !timeTotal
    ) {
      return;
    }

    let hasStarted = false;
    let loadPromise: Promise<void> | null = null;

    const syncPlay = () => {
      const playing = !video.paused && !video.ended;
      playBtn.setAttribute('aria-label', playing ? 'Video pausieren' : 'Video abspielen');
      playBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
      playBtn.dataset.state = playing ? 'playing' : 'paused';
      root.dataset.videoState = video.ended ? 'ended' : playing ? 'playing' : 'paused';
    };

    const syncMute = () => {
      const muted = video.muted;
      muteBtn.setAttribute('aria-label', muted ? 'Ton einschalten' : 'Ton ausschalten');
      muteBtn.setAttribute('aria-pressed', muted ? 'false' : 'true');
      muteBtn.dataset.state = muted ? 'muted' : 'unmuted';
    };

    const syncProgress = () => {
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;
      const pct = (video.currentTime / duration) * 100;
      progress.value = String(pct);
      progress.style.setProperty('--progress', `${pct}%`);
      timeCurrent.textContent = formatTime(video.currentTime);
      timeTotal.textContent = formatTime(duration);
    };

    const hideStartOverlay = () => {
      if (!startOverlay) return;
      startOverlay.hidden = true;
    };

    const showStartOverlay = () => {
      if (!startOverlay) return;
      startOverlay.hidden = false;
    };

    const hideEndedPanel = () => {
      if (endedPanel) endedPanel.hidden = true;
    };

    const showPoster = () => {
      root.dataset.started = 'false';
    };

    const showVideoLayer = () => {
      root.dataset.started = 'true';
    };

    const ensureVideoLoaded = (): Promise<void> => {
      if (loadPromise) return loadPromise;

      loadPromise = (async () => {
        const src = source.dataset.src;
        if (!src) return;

        if (!source.src) {
          source.src = src;
          video.load();
        }

        await waitForCanPlay(video);

        if (Number.isFinite(video.duration) && video.duration > 0) {
          timeTotal.textContent = formatTime(video.duration);
          progress.max = '100';
          syncProgress();
        }
      })().catch(() => {
        loadPromise = null;
      });

      return loadPromise ?? Promise.resolve();
    };

    const resetToPoster = () => {
      hasStarted = false;
      loadPromise = null;
      video.pause();
      video.currentTime = 0;
      source.removeAttribute('src');
      video.load();
      showPoster();
      showStartOverlay();
      hideEndedPanel();
      syncPlay();
      syncMute();
      progress.value = '0';
      progress.style.setProperty('--progress', '0%');
      timeCurrent.textContent = '0:00';
    };

    const startPlayback = async (withSound: boolean) => {
      hasStarted = true;
      hideStartOverlay();
      hideEndedPanel();
      showVideoLayer();

      if (withSound) {
        video.muted = false;
        video.volume = 1;
      }

      if (video.ended) video.currentTime = 0;

      try {
        await ensureVideoLoaded();
        await video.play();
      } catch {
        video.muted = true;
        await video.play();
      }

      syncPlay();
      syncMute();
    };

    playBtn.addEventListener('click', () => {
      if (video.paused || video.ended) {
        if (!hasStarted) hideStartOverlay();
        hasStarted = true;
        showVideoLayer();
        if (video.ended) {
          video.currentTime = 0;
          hideEndedPanel();
        }
        void ensureVideoLoaded().then(() => video.play());
        return;
      }
      video.pause();
    });

    muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      if (!video.muted) video.volume = 1;
      syncMute();
    });

    rewindBtn.addEventListener('click', () => {
      if (!hasStarted) return;
      video.currentTime = Math.max(0, video.currentTime - 10);
      syncProgress();
      if (video.ended) {
        hideEndedPanel();
        syncPlay();
      }
    });

    progress.addEventListener('input', () => {
      if (!hasStarted) return;
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;
      const pct = Number(progress.value);
      video.currentTime = (pct / 100) * duration;
      syncProgress();
      if (video.ended) {
        hideEndedPanel();
        syncPlay();
      }
    });

    startBtn?.addEventListener('click', () => {
      void startPlayback(true);
    });

    replayBtn?.addEventListener('click', () => {
      video.currentTime = 0;
      void startPlayback(true);
    });

    video.addEventListener('loadedmetadata', () => {
      timeTotal.textContent = formatTime(video.duration);
      progress.max = '100';
      syncProgress();
    });

    video.addEventListener('timeupdate', syncProgress);
    video.addEventListener('play', syncPlay);
    video.addEventListener('pause', syncPlay);
    video.addEventListener('volumechange', syncMute);
    video.addEventListener('ended', () => {
      video.pause();
      showPoster();
      if (endedPanel) endedPanel.hidden = false;
      syncPlay();
      syncProgress();
    });

    window.addEventListener('pageshow', (event) => {
      if (event.persisted) resetToPoster();
    });

    video.muted = false;
    video.volume = 1;
    resetToPoster();
  });
}
