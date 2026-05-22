import { prefersReducedMotion } from './motion';

const AUTO_MS = 5000;

export function initProcessStepper(): void {
  const root = document.querySelector<HTMLElement>('[data-process-stepper]');
  if (!root) return;

  const steps = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-process-step]'));
  const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-process-slide]'));
  const markers = Array.from(root.querySelectorAll<HTMLElement>('[data-process-marker]'));
  const spineFill = root.querySelector<HTMLElement>('[data-process-spine-fill]');
  const panel = root.querySelector<HTMLElement>('[data-process-panel]');
  if (!steps.length || !slides.length || !panel) return;

  let active = 0;
  let userHovered = false;
  let autoTimer = 0;
  let visible = false;
  const reduced = prefersReducedMotion();
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;

  if (reduced) {
    root.classList.add('is-reduced-motion');
  }

  const setProgress = (index: number) => {
    const max = steps.length - 1;
    const pct = max > 0 ? (index / max) * 100 : 0;

    if (spineFill) {
      spineFill.style.setProperty('--progress', reduced ? '100%' : `${pct}%`);
    }

    markers.forEach((marker, i) => {
      marker.classList.toggle('is-active', i <= index);
    });
  };

  const setActive = (index: number) => {
    const next = ((index % steps.length) + steps.length) % steps.length;
    if (next === active) return;

    active = next;

    steps.forEach((step, i) => {
      const isActive = i === next;
      step.classList.toggle('is-active', isActive);
      step.setAttribute('aria-selected', isActive ? 'true' : 'false');
      step.tabIndex = isActive ? 0 : -1;
    });

    slides.forEach((slide, i) => {
      const isActive = i === next;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });

    panel.setAttribute('aria-labelledby', `process-tab-${next}`);
    setProgress(next);
  };

  const goTo = (index: number) => {
    setActive(index);
  };

  const stopAuto = () => {
    userHovered = true;
    window.clearInterval(autoTimer);
    autoTimer = 0;
  };

  const startAuto = () => {
    if (reduced || userHovered || !visible) return;
    window.clearInterval(autoTimer);
    autoTimer = window.setInterval(() => {
      goTo(active + 1);
    }, AUTO_MS);
  };

  steps.forEach((step, i) => {
    if (isCoarse) {
      step.addEventListener('click', () => {
        stopAuto();
        goTo(i);
      });
    } else {
      step.addEventListener('mouseenter', () => {
        stopAuto();
        goTo(i);
      });
    }

    step.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        stopAuto();
        goTo(i);
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        stopAuto();
        goTo(active + 1);
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        stopAuto();
        goTo(active - 1);
      }
    });
  });

  const io = new IntersectionObserver(
    (entries) => {
      visible = entries.some((e) => e.isIntersecting);
      if (visible) startAuto();
      else window.clearInterval(autoTimer);
    },
    { threshold: 0.2 },
  );
  io.observe(root);

  setActive(0);
  if (!reduced) startAuto();

  window.addEventListener('pagehide', () => {
    window.clearInterval(autoTimer);
    io.disconnect();
  });
}
