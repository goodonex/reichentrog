type QuizAnliegen = 'verkaufen' | 'kauf' | 'investor' | 'bewertung' | '';
type QuizSegment = 'privatkunde' | 'geschaeftskunde';

interface QuizState {
  anliegen: QuizAnliegen;
  preissegment: string;
  suchtyp: string;
  umfang: string;
}

interface QuizResult {
  segment: QuizSegment;
  headline: string;
  copy: string;
  pageHref: string;
  ctaHref: string;
  ctaLabel: string;
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

const GESCHAEFT_SUCHTYPEN = new Set(['Portfolios', 'Projektentwicklung']);
const GESCHAEFT_UMFANG = new Set(['4+ Objekte', 'Portfolio / Bestand', '3–5 Transaktionen', '6+ Transaktionen']);
const GESCHAEFT_PREIS = new Set(['Über 3 Mio']);

function resolveSegment(state: QuizState): QuizSegment {
  if (state.anliegen === 'investor') return 'geschaeftskunde';
  if (GESCHAEFT_SUCHTYPEN.has(state.suchtyp)) return 'geschaeftskunde';
  if (GESCHAEFT_UMFANG.has(state.umfang)) return 'geschaeftskunde';
  if (GESCHAEFT_PREIS.has(state.preissegment)) return 'geschaeftskunde';
  return 'privatkunde';
}

function buildQuizResult(state: QuizState): QuizResult {
  const segment = resolveSegment(state);
  const isGeschaeft = segment === 'geschaeftskunde';

  if (isGeschaeft) {
    const portfolioScale =
      state.umfang === '6+ Transaktionen' ||
      state.umfang === 'Portfolio / Bestand' ||
      state.suchtyp === 'Portfolios';

    return {
      segment,
      headline: portfolioScale
        ? 'Ihr Volumen passt zu unserem institutionellen Mandat.'
        : 'Ihr Anliegen passt zu unserem Geschäftskunden-Mandat.',
      copy: 'Strukturierte Transaktionen, Portfolios und Projektentwicklung — Oliver Alberich und Norbert Reichentrog begleiten Sie diskret, mit Banken-Know-how und Off-Market-Netzwerk. Im nächsten Schritt: kurzes Erstgespräch, klare Einordnung.',
      pageHref: '/geschaeftskunden/',
      ctaHref: '/geschaeftskunden/#kontakt-form',
      ctaLabel: 'Mandat anfragen',
    };
  }

  const multiObject = state.umfang === '2–3 Objekte' || state.umfang === '4+ Objekte';

  return {
    segment,
    headline:
      state.anliegen === 'bewertung'
        ? 'Wir ordnen Ihren Verkehrswert fundiert ein.'
        : 'Wir begleiten Sie persönlich — diskret und klar.',
    copy:
      state.anliegen === 'verkaufen'
        ? multiObject
          ? 'Mehrere Objekte brauchen Struktur: Wir planen Vermarktung, Timing und Abwicklung — persönlich geführt von Norbert Reichentrog.'
          : 'Verkauf ohne Marktgeräusch: Norbert Reichentrog begleitet Sie von der Bewertung bis zum Notar — DEKRA-zertifiziert und mit Banken-Hintergrund.'
        : state.anliegen === 'kauf'
          ? 'Kaufberatung mit Substanz: Wir prüfen Objekt, Lage und Finanzierung — damit Sie sicher entscheiden, nicht unter Zeitdruck.'
          : 'DEKRA-zertifizierte Einordnung als saubere Basis — für Erbschaft, Finanzierung oder den nächsten Schritt beim Verkauf.',
    pageHref: '/privatkunden/',
    ctaHref: '/privatkunden/#kontakt-form',
    ctaLabel: 'Erstgespräch anfragen',
  };
}

function trackQuizCompletion(state: QuizState, result: QuizResult): void {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'quiz_completed',
    quiz_segment: result.segment,
    quiz_anliegen: state.anliegen,
    quiz_preissegment: state.preissegment || undefined,
    quiz_suchtyp: state.suchtyp || undefined,
    quiz_umfang: state.umfang,
    quiz_cta_href: result.ctaHref,
  });
  // TODO: GTM / Meta Pixel anschließen
}

export function initQualificationQuiz(): void {
  const modal = document.getElementById('qualification-quiz');
  if (!modal || modal.dataset.initialized === 'true') return;
  modal.dataset.initialized = 'true';

  const state: QuizState = {
    anliegen: '',
    preissegment: '',
    suchtyp: '',
    umfang: '',
  };

  let step = 1;
  let lastFocus: HTMLElement | null = null;

  const steps = Array.from(modal.querySelectorAll<HTMLElement>('[data-quiz-step]'));
  const dots = Array.from(modal.querySelectorAll<HTMLElement>('[data-quiz-dot]'));
  const preisPanel = modal.querySelector<HTMLElement>('[data-quiz-panel="preis"]');
  const investorPanel = modal.querySelector<HTMLElement>('[data-quiz-panel="investor"]');
  const privatUmfangPanel = modal.querySelector<HTMLElement>('[data-quiz-panel="privat-umfang"]');
  const geschaeftUmfangPanel = modal.querySelector<HTMLElement>('[data-quiz-panel="geschaeft-umfang"]');
  const resultHeadlineEl = modal.querySelector<HTMLElement>('[data-quiz-result-headline]');
  const resultCopyEl = modal.querySelector<HTMLElement>('[data-quiz-result-copy]');
  const resultCtaEl = modal.querySelector<HTMLAnchorElement>('[data-quiz-result-cta]');
  const resultPageEl = modal.querySelector<HTMLAnchorElement>('[data-quiz-result-page]');

  function updateDots(activeStep: number): void {
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i + 1 === activeStep);
      dot.hidden = activeStep > 3;
    });
  }

  function showStep(next: number): void {
    steps.forEach((el) => {
      const n = Number(el.dataset.quizStep);
      const active = n === next;
      el.hidden = !active;
      el.classList.toggle('is-active', active);
    });
    step = next;
    if (next <= 3) updateDots(next);
    else dots.forEach((d) => d.classList.remove('is-active'));
  }

  function showStep3Panel(): void {
    if (state.anliegen === 'investor') {
      privatUmfangPanel?.setAttribute('hidden', '');
      geschaeftUmfangPanel?.removeAttribute('hidden');
    } else {
      geschaeftUmfangPanel?.setAttribute('hidden', '');
      privatUmfangPanel?.removeAttribute('hidden');
    }
    showStep(3);
  }

  function openModal(): void {
    lastFocus = document.activeElement as HTMLElement | null;
    modal.hidden = false;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    resetQuiz();
    showStep(1);
    modal.querySelector<HTMLElement>('.quiz-modal__close')?.focus();
  }

  function closeModal(restoreFocus = true): void {
    modal.hidden = true;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (restoreFocus) lastFocus?.focus();
  }

  function followQuizLink(event: MouseEvent, link: HTMLAnchorElement | null): void {
    if (!link) return;
    event.preventDefault();
    const href = link.getAttribute('href');
    if (!href) return;

    closeModal(false);
    window.location.assign(href);
  }

  function resetQuiz(): void {
    state.anliegen = '';
    state.preissegment = '';
    state.suchtyp = '';
    state.umfang = '';
    modal.querySelectorAll('.quiz-modal__choice.is-selected').forEach((el) => {
      el.classList.remove('is-selected');
    });
  }

  function showResult(): void {
    const result = buildQuizResult(state);
    trackQuizCompletion(state, result);

    if (resultHeadlineEl) resultHeadlineEl.textContent = result.headline;
    if (resultCopyEl) resultCopyEl.textContent = result.copy;
    if (resultCtaEl) {
      resultCtaEl.href = result.ctaHref;
      resultCtaEl.innerHTML = `${result.ctaLabel} <span aria-hidden="true">→</span>`;
    }
    if (resultPageEl) resultPageEl.href = result.pageHref;

    try {
      sessionStorage.setItem('quiz_segment', result.segment);
      sessionStorage.setItem('quiz_anliegen', state.anliegen);
    } catch {
      /* private browsing */
    }

    showStep(4);
  }

  document.querySelectorAll('[data-quiz-open]').forEach((btn) => {
    btn.addEventListener('click', openModal);
  });

  modal.querySelectorAll('[data-quiz-close]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  resultCtaEl?.addEventListener('click', (event) => {
    followQuizLink(event, resultCtaEl);
  });

  resultPageEl?.addEventListener('click', (event) => {
    followQuizLink(event, resultPageEl);
  });

  modal.querySelectorAll<HTMLButtonElement>('[data-quiz-anliegen]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.anliegen = (btn.dataset.quizAnliegen as QuizAnliegen) || '';
      btn.parentElement?.querySelectorAll('.quiz-modal__choice').forEach((b) => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');

      if (state.anliegen === 'bewertung') {
        showStep3Panel();
        return;
      }

      if (state.anliegen === 'investor') {
        preisPanel?.setAttribute('hidden', '');
        investorPanel?.removeAttribute('hidden');
      } else {
        investorPanel?.setAttribute('hidden', '');
        preisPanel?.removeAttribute('hidden');
      }
      showStep(2);
    });
  });

  modal.querySelectorAll<HTMLButtonElement>('[data-quiz-preis]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.preissegment = btn.dataset.quizPreis || '';
      showStep3Panel();
    });
  });

  modal.querySelectorAll<HTMLButtonElement>('[data-quiz-suchtyp]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.suchtyp = btn.dataset.quizSuchtyp || '';
      showStep3Panel();
    });
  });

  modal.querySelectorAll<HTMLButtonElement>('[data-quiz-umfang]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.umfang = btn.dataset.quizUmfang || '';
      showResult();
    });
  });

  modal.querySelectorAll<HTMLButtonElement>('[data-quiz-back]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (step === 3) {
        if (state.anliegen === 'bewertung') showStep(1);
        else showStep(2);
      } else if (step === 2) {
        showStep(1);
      }
    });
  });
}
