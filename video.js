/* ==========================================================================
   video.js — BLOCO 3 · player real do YouTube (facade / lite-embed)
   --------------------------------------------------------------------------
   Por que uma fachada e não um <iframe> direto:
   um embed do YouTube carrega ~1,2 MB de script de terceiro e vários
   cookies ANTES de qualquer clique. Aqui o iframe só nasce no clique —
   a página carrega rápido e nada de terceiro roda sem ação do usuário.

   A URL vem exclusivamente de YOUTUBE_VIDEO_URL, em js/content.js.
   ========================================================================== */

import { YOUTUBE_VIDEO_URL, YOUTUBE_VIDEO_CAPTION } from './content.js';

/**
 * Extrai o ID de 11 caracteres de qualquer formato de URL do YouTube.
 * Aceita watch?v=, youtu.be/, /embed/, /shorts/, /live/ ou o ID puro.
 * @param {string} input
 * @returns {string|null}
 */
export function parseYouTubeId(input) {
  if (!input || typeof input !== 'string') return null;
  const raw = input.trim();
  if (!raw) return null;

  // ID solto
  if (/^[\w-]{11}$/.test(raw)) return raw;

  let url;
  try {
    url = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, '');
  if (host === 'youtu.be') {
    const id = url.pathname.slice(1).split('/')[0];
    return /^[\w-]{11}$/.test(id) ? id : null;
  }
  if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
    const v = url.searchParams.get('v');
    if (v && /^[\w-]{11}$/.test(v)) return v;
    const m = url.pathname.match(/\/(?:embed|shorts|live|v)\/([\w-]{11})/);
    if (m) return m[1];
  }
  return null;
}

export function initVideo() {
  const player = document.querySelector('[data-player]');
  if (!player) return;

  const facade  = player.querySelector('[data-facade]');
  const hint    = player.querySelector('[data-hint]');
  const capNode = document.querySelector('[data-video-caption]');
  const id      = parseYouTubeId(YOUTUBE_VIDEO_URL);

  if (YOUTUBE_VIDEO_CAPTION && capNode) capNode.textContent = YOUTUBE_VIDEO_CAPTION;

  /* --- Estado de espera: nenhuma URL definida ainda ---------------------
     Não inventamos vídeo. A composição inteira do Bloco 3 continua
     visível e testável; só o play fica inativo, e isso é dito.       */
  if (!id) {
    player.classList.add('is-empty');
    facade.setAttribute('role', 'img');
    facade.setAttribute(
      'aria-label',
      'Área reservada ao vídeo. Aguardando a URL definitiva do YouTube.'
    );
    facade.removeAttribute('tabindex');
    if (hint) hint.textContent = 'Aguardando URL do vídeo';
    return;
  }

  /* --- Miniatura oficial do vídeo, servida pelo próprio YouTube -------- */
  const thumb = new Image();
  thumb.className = 'player__thumb';
  thumb.alt = '';
  thumb.loading = 'lazy';
  thumb.decoding = 'async';
  thumb.src = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  let fallbackTried = false;
  thumb.onerror = () => {
    if (!fallbackTried) {
      fallbackTried = true;
      thumb.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
      return;
    }
    // Sem rede ou vídeo privado: o painel desenhado basta.
    thumb.remove();
  };
  facade.prepend(thumb);

  if (hint) hint.textContent = 'Assistir';
  facade.setAttribute('aria-label', 'Reproduzir o vídeo');

  /* --- Pré-conexão só ao aproximar o mouse: economiza handshake -------- */
  let warmed = false;
  const warm = () => {
    if (warmed) return;
    warmed = true;
    for (const href of ['https://www.youtube-nocookie.com', 'https://i.ytimg.com']) {
      const l = document.createElement('link');
      l.rel = 'preconnect';
      l.href = href;
      document.head.append(l);
    }
  };
  facade.addEventListener('pointerenter', warm, { once: true });
  facade.addEventListener('focus', warm, { once: true });

  /* --- Troca a fachada pelo iframe real -------------------------------- */
  const play = () => {
    if (player.classList.contains('is-playing')) return;
    const iframe = document.createElement('iframe');
    // -nocookie: modo de privacidade reforçada do YouTube.
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}` +
                 '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
    iframe.title = 'Vídeo — Cristo Vive Movement';
    iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    player.append(iframe);
    player.classList.add('is-playing');
    iframe.focus();
  };

  facade.addEventListener('click', play);
  facade.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); }
  });
}
