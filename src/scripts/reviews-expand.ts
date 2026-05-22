export function initReviewsExpand(): void {
  const cards = document.querySelectorAll<HTMLElement>('.reviews-card');
  if (!cards.length) return;

  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const collapsedHeight = '200px';

  cards.forEach((card) => {
    card.style.height = collapsedHeight;
    card.style.maxHeight = collapsedHeight;
    card.style.overflow = 'hidden';
    card.style.cursor = 'pointer';
    card.style.transition = 'max-height 400ms ease, height 400ms ease, box-shadow 400ms ease';

    const expand = () => {
      card.classList.add('is-expanded');
      card.style.height = 'auto';
      card.style.maxHeight = '400px';
    };

    const collapse = () => {
      card.classList.remove('is-expanded');
      card.style.height = collapsedHeight;
      card.style.maxHeight = collapsedHeight;
    };

    if (isCoarse) {
      card.addEventListener('click', () => {
        if (card.classList.contains('is-expanded')) collapse();
        else expand();
      });
    } else {
      card.addEventListener('mouseenter', expand);
      card.addEventListener('mouseleave', collapse);
    }
  });
}
