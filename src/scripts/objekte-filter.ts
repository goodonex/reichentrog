function formatPreis(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

function updateRangeFill(slider: HTMLInputElement): void {
  const min = Number(slider.min);
  const max = Number(slider.max);
  const val = Number(slider.value);
  const pct = ((val - min) / (max - min)) * 100;
  slider.style.background = `linear-gradient(to right, #1c2b4a ${pct}%, rgba(28, 43, 74, 0.15) ${pct}%)`;
}

export function initObjekteFilter(): void {
  const root = document.querySelector('[data-objekte-filter]');
  if (!root) return;

  const slider = root.querySelector<HTMLInputElement>('[data-preis-slider]');
  const output = root.querySelector('[data-preis-output]');
  const emptyMsg = document.querySelector<HTMLElement>('[data-objekte-empty]');
  const cards = document.querySelectorAll<HTMLElement>('[data-objekt-card]');
  const toggles = root.querySelectorAll<HTMLButtonElement>('[data-typ-filter] button');

  if (!slider || !output || !cards.length) return;

  let activeTyp = 'alle';

  const applyFilters = (): void => {
    const maxPreis = Number(slider.value);
    let visible = 0;

    cards.forEach((card) => {
      const price = Number(card.dataset.objektPrice);
      const type = card.dataset.objektType ?? '';
      const matchesPrice = price <= maxPreis;
      const matchesType = activeTyp === 'alle' || type === activeTyp;
      const show = matchesPrice && matchesType;

      card.style.display = show ? '' : 'none';
      card.setAttribute('aria-hidden', show ? 'false' : 'true');
      if (show) visible += 1;
    });

    if (emptyMsg) {
      emptyMsg.hidden = visible > 0;
    }
  };

  slider.addEventListener('input', () => {
    const value = Number(slider.value);
    output.textContent = formatPreis(value);
    slider.setAttribute('aria-valuenow', String(value));
    updateRangeFill(slider);
    applyFilters();
  });

  toggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      activeTyp = btn.dataset.typ ?? 'alle';
      toggles.forEach((t) => {
        const active = t === btn;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      applyFilters();
    });
  });

  updateRangeFill(slider);
  applyFilters();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initObjekteFilter);
} else {
  initObjekteFilter();
}
