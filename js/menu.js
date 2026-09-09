/* ==========================================================================
   menu.js — menu de navegação em telas pequenas
   Abaixo de 780px a barra de links não cabe. Em vez de escondê-la (o que
   deixaria o site sem navegação no celular), ela vira um painel.
   Acessível: aria-expanded, Esc fecha, foco devolvido ao botão, scroll
   travado enquanto aberto.
   ========================================================================== */

export function initMenu() {
  const btn   = document.querySelector('[data-menu-btn]');
  const panel = document.querySelector('[data-menu]');
  if (!btn || !panel) return;

  let open = false;

  const setOpen = (next) => {
    open = next;
    btn.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('is-open', open);
    panel.hidden = !open;
    document.body.classList.toggle('is-locked', open);
    if (open) {
      panel.querySelector('a')?.focus();
    } else {
      btn.focus();
    }
  };

  btn.addEventListener('click', () => setOpen(!open));

  // Qualquer link navega e fecha.
  panel.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false);
  });

  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) setOpen(false);
  });

  // Se a tela crescer e a barra voltar a caber, o painel não pode ficar preso.
  matchMedia('(min-width: 781px)').addEventListener('change', (e) => {
    if (e.matches && open) setOpen(false);
  });

  panel.hidden = true;
}
