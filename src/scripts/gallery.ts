import { s } from './client';

/** Visor de la galería: teclado, gestos táctiles y foco gestionado por <dialog>. */
export function initGallery() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox]');
  const shots = [...document.querySelectorAll<HTMLButtonElement>('[data-shot]')];
  if (!dialog || !shots.length || typeof dialog.showModal !== 'function') return;

  const img = dialog.querySelector<HTMLImageElement>('[data-lb-img]')!;
  const caption = dialog.querySelector<HTMLElement>('[data-lb-caption]')!;
  const count = dialog.querySelector<HTMLElement>('[data-lb-count]')!;
  let index = 0;

  const show = (i: number) => {
    index = (i + shots.length) % shots.length;
    const shot = shots[index]!;
    img.src = shot.dataset.full!;
    img.alt = shot.dataset.alt ?? '';
    caption.textContent = shot.dataset.caption ?? '';
    count.textContent = s('imageOf', { n: index + 1, total: shots.length });
  };

  shots.forEach((shot, i) =>
    shot.addEventListener('click', () => {
      show(i);
      dialog.showModal();
      window.dispatchEvent(new CustomEvent('pcap:lock'));
    }),
  );
  dialog.addEventListener('close', () => {
    window.dispatchEvent(new CustomEvent('pcap:unlock'));
    shots[index]?.focus();
  });
  dialog.querySelector('[data-lb-close]')!.addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-lb-prev]')!.addEventListener('click', () => show(index - 1));
  dialog.querySelector('[data-lb-next]')!.addEventListener('click', () => show(index + 1));
  dialog.addEventListener('click', (e) => e.target === dialog && dialog.close());
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });

  let startX = 0;
  dialog.addEventListener('pointerdown', (e) => (startX = e.clientX));
  dialog.addEventListener('pointerup', (e) => {
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 60) show(index + (dx < 0 ? 1 : -1));
  });
}
