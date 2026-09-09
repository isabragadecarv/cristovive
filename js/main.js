/* ==========================================================================
   main.js — ponto de entrada único
   Ordem importa: bind (conteúdo) → reveal (mede o texto já final) →
   scroll → video → cursor.
   ========================================================================== */

import { initBind }   from './bind.js';
import { initReveal } from './reveal.js';
import { initScroll } from './scroll.js';
import { initVideo }  from './video.js';
import { initCursor } from './cursor.js';
import { initMenu }   from './menu.js';

function boot() {
  document.documentElement.classList.add('js');

  initBind();
  initMenu();

  // As fontes display mudam a quebra de linha; medir depois delas evita
  // que o split de linhas do título fique errado.
  const start = () => {
    initReveal();
    initScroll();
    initVideo();
    initCursor();

    // Sequência de abertura do hero, disparada uma vez.
    requestAnimationFrame(() => {
      document.querySelectorAll('[data-hero-seq]').forEach((el) => el.classList.add('is-in'));
    });
  };

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start).catch(start);
  } else {
    start();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
