/* ==========================================================================
   scroll.js — tudo que depende da posição de rolagem
   Um ÚNICO requestAnimationFrame governa nav, progresso, parallax,
   velocidade do marquee e seção ativa. Vários listeners de scroll
   concorrentes são a causa mais comum de travamento em páginas assim.
   ========================================================================== */

const REDUCED_MOTION = matchMedia('(prefers-reduced-motion: reduce)');

export function initScroll() {
  const nav      = document.querySelector('[data-nav]');
  const progress = document.querySelector('[data-progress]');
  const marquees = [...document.querySelectorAll('[data-marquee]')];
  const parallax = [...document.querySelectorAll('[data-parallax]')].map((el) => ({
    el,
    depth: parseFloat(el.dataset.parallax) || 0.12,
  }));
  const links    = [...document.querySelectorAll('[data-navlink]')];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  let last = window.scrollY;
  let ticking = false;
  let vh = window.innerHeight;
  let docH = document.documentElement.scrollHeight - vh;

  const measure = () => {
    vh = window.innerHeight;
    docH = Math.max(1, document.documentElement.scrollHeight - vh);
  };
  measure();

  const frame = () => {
    ticking = false;
    const y = window.scrollY;
    const delta = y - last;

    /* --- Nav: some ao descer, volta ao subir -------------------------- */
    if (nav) {
      nav.classList.toggle('is-stuck', y > vh * 0.72);
      nav.classList.toggle('is-hidden', delta > 4 && y > vh);
    }
    document.body.classList.toggle('is-scrolled', y > 60);

    /* --- Progresso de leitura ---------------------------------------- */
    if (progress) {
      progress.style.transform = `scaleX(${Math.min(1, y / docH)})`;
    }

    /* --- Parallax: deslocamento curto, só quando visível -------------- */
    if (!REDUCED_MOTION.matches) {
      for (const { el, depth } of parallax) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        // -1..1 conforme o elemento cruza a viewport
        const p = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.setProperty('--py', `${(-p * depth * 100).toFixed(2)}px`);
      }

      /* --- Marquee acelera com a velocidade do scroll ---------------- */
      const boost = Math.min(4.5, 1 + Math.abs(delta) / 14);
      for (const m of marquees) {
        m.style.setProperty('--mq-boost', boost.toFixed(2));
        const base = parseFloat(m.dataset.marquee) || 34;
        m.style.setProperty('--mq-dur', `${(base / boost).toFixed(2)}s`);
        // inverte o sentido conforme a direção do scroll
        m.style.setProperty('--mq-dir', delta < 0 ? 'reverse' : 'normal');
        const track = m.querySelector('.marquee__track');
        if (track) track.style.animationDirection = delta < 0 ? 'reverse' : 'normal';
      }
    }

    /* --- Seção ativa na navegação ------------------------------------- */
    let activeIndex = -1;
    sections.forEach((s, i) => {
      const r = s.getBoundingClientRect();
      if (r.top <= vh * 0.42 && r.bottom >= vh * 0.42) activeIndex = i;
    });
    links.forEach((a, i) => {
      if (i === activeIndex) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });

    last = y;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(frame);
  };

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { measure(); onScroll(); }, { passive: true });
  frame();
}
