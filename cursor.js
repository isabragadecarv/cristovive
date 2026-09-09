/* ==========================================================================
   cursor.js — cursor personalizado
   Só é ativado em ponteiro fino (mouse/trackpad). Em toque, nem existe.
   Função: sinalizar o que é interativo antes do clique — não decorar.
   ========================================================================== */

export function initCursor() {
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (!fine.matches || reduced.matches) return;

  const ring = document.createElement('div');
  ring.className = 'cursor';
  ring.setAttribute('aria-hidden', 'true');
  document.body.append(ring);

  let tx = innerWidth / 2, ty = innerHeight / 2;   // alvo
  let cx = tx, cy = ty;                            // atual (suavizado)
  let raf = 0;

  const loop = () => {
    // interpolação: o anel "persegue" o ponteiro — dá peso ao movimento
    cx += (tx - cx) * 0.18;
    cy += (ty - cy) * 0.18;
    ring.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
    raf = requestAnimationFrame(loop);
  };

  addEventListener('pointermove', (e) => {
    tx = e.clientX; ty = e.clientY;
    if (!ring.classList.contains('is-live')) ring.classList.add('is-live');
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });

  addEventListener('pointerleave', () => ring.classList.remove('is-live'));

  // Delegação: nada de listener por elemento.
  const HOT = 'a, button, [data-facade], [role="button"], summary';
  addEventListener('pointerover', (e) => {
    if (e.target.closest(HOT)) ring.classList.add('is-hot');
  }, { passive: true });
  addEventListener('pointerout', (e) => {
    if (e.target.closest(HOT)) ring.classList.remove('is-hot');
  }, { passive: true });
}
