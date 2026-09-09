/* ==========================================================================
   reveal.js — animações de entrada por scroll
   Um único IntersectionObserver para a página inteira. Cada elemento é
   observado uma vez e liberado depois de revelado (unobserve), para que
   o custo de scroll tenda a zero conforme o usuário desce.
   ========================================================================== */

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)');

/**
 * Quebra um título em linhas visuais e envolve cada uma numa máscara,
 * para que o texto suba progressivamente em vez de aparecer de uma vez.
 * Preserva o texto acessível original em um <span class="u-sr">.
 * @param {HTMLElement} el
 */
export function splitLines(el) {
  const source = el.textContent.trim();
  const words = source.split(/\s+/);

  el.setAttribute('aria-label', source);
  el.textContent = '';

  // Mede onde cada linha realmente quebra, em vez de adivinhar.
  const probe = document.createElement('span');
  words.forEach((w, i) => {
    const s = document.createElement('span');
    s.textContent = w;
    s.dataset.w = String(i);
    probe.append(s, document.createTextNode(' '));
  });
  el.append(probe);

  const rows = new Map();
  probe.querySelectorAll('span').forEach((s) => {
    const top = Math.round(s.getBoundingClientRect().top);
    if (!rows.has(top)) rows.set(top, []);
    rows.get(top).push(s.textContent);
  });

  el.textContent = '';
  el.classList.add('lines');

  let i = 0;
  for (const words of rows.values()) {
    const line = document.createElement('span');
    line.className = 'line';
    line.setAttribute('aria-hidden', 'true');
    const inner = document.createElement('span');
    inner.style.setProperty('--d', `${i * 105}ms`);
    inner.textContent = words.join(' ');
    line.append(inner);
    el.append(line);
    i++;
  }
}

/**
 * Ativa o sistema de reveal. Elementos-alvo: [data-reveal].
 * Modos: 'up' (padrão) | 'mask' | 'rule' | 'lines' | 'count'
 */
export function initReveal() {
  const CLASS = {
    up: 'js-reveal', mask: 'js-mask', rule: 'js-rule', count: 'js-count',
  };

  const targets = [...document.querySelectorAll('[data-reveal]')];

  targets.forEach((el) => {
    const mode = el.dataset.reveal || 'up';
    if (mode === 'lines') {
      splitLines(el);
    } else {
      el.classList.add(CLASS[mode] || CLASS.up);
    }
  });

  if (REDUCED.matches) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);          // revelou uma vez, sai da conta
    }
  }, {
    // Dispara um pouco antes de entrar na tela: o movimento acompanha o
    // scroll em vez de "pular" quando o elemento já está visível.
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.12,
  });

  targets.forEach((el) => io.observe(el));

  // Os .plate revelam a imagem (escala) junto com sua máscara.
  const plates = [...document.querySelectorAll('.plate')];
  const ioPlate = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('is-in');
      ioPlate.unobserve(e.target);
    }
  }, { threshold: 0.15 });
  plates.forEach((el) => ioPlate.observe(el));
}
