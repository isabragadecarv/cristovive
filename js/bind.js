/* ==========================================================================
   bind.js — liga o conteúdo de content.js ao HTML
   --------------------------------------------------------------------------
   Decisão de arquitetura: o TEXTO editorial vive no HTML (semântico,
   indexável, legível sem JavaScript). Só os campos VOLÁTEIS — URLs,
   local, preço, horário — vivem em content.js e são injetados aqui.

   Campos com valor `null` renderizam o marcador "A definir" em vez de
   um dado inventado.
   ========================================================================== */

import { SITE, PLACEHOLDER_LABEL } from './content.js';

/** @param {string} text */
function placeholder(text = PLACEHOLDER_LABEL) {
  const el = document.createElement('span');
  el.className = 'ph';
  el.textContent = text;
  return el;
}

/** Resolve 'venue.city' dentro do objeto SITE. */
function pick(path) {
  return path.split('.').reduce((o, k) => (o == null ? o : o[k]), SITE);
}

export function initBind() {
  /* --- [data-bind="caminho"] → texto ou marcador ---------------------
     O marcador "A definir" já vem escrito no HTML, então a página
     continua correta sem JavaScript. Aqui ele só é SUBSTITUÍDO quando
     existe valor de verdade em content.js.                          */
  document.querySelectorAll('[data-bind]').forEach((el) => {
    const value = pick(el.dataset.bind);
    if (value == null || value === '') {
      el.dataset.state = 'pending';
      if (!el.querySelector('.ph')) el.append(placeholder(el.dataset.phLabel || PLACEHOLDER_LABEL));
      return;
    }
    el.textContent = String(value);
    el.dataset.state = 'ready';
  });

  /* --- [data-href="caminho"] → link real ou botão inativo ------------ */
  document.querySelectorAll('[data-href]').forEach((el) => {
    const url = pick(el.dataset.href);
    if (url) {
      el.setAttribute('href', url);
      el.removeAttribute('aria-disabled');
      if (/^https?:/.test(url)) {
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener noreferrer');
      }
    } else {
      el.removeAttribute('href');
      el.setAttribute('role', 'link');
      el.setAttribute('aria-disabled', 'true');
      el.title = 'Link ainda não definido';
    }
  });

  /* --- <time> da data do evento -------------------------------------- */
  document.querySelectorAll('[data-time]').forEach((el) => {
    el.setAttribute('datetime', SITE.date.iso);
  });

  /* --- SEO: JSON-LD do evento, montado a partir de SITE -------------- */
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${SITE.eventName} ${SITE.eventYear} — ${SITE.brand}`,
    description: SITE.seo.description,
    startDate: SITE.date.iso,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    organizer: { '@type': 'Organization', name: SITE.brand },
  };
  // Só declaramos local/oferta quando existirem de fato.
  if (SITE.venue.name) {
    ld.location = {
      '@type': 'Place',
      name: SITE.venue.name,
      address: SITE.venue.address || SITE.venue.city || undefined,
    };
  }
  if (SITE.tickets.url) {
    ld.offers = { '@type': 'Offer', url: SITE.tickets.url };
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(ld);
  document.head.append(script);

  /* --- Meta description / og, também a partir de SITE ---------------- */
  const setMeta = (attr, key, content) => {
    if (!content) return;
    let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attr, key);
      document.head.append(tag);
    }
    tag.setAttribute('content', content);
  };
  setMeta('name', 'description', SITE.seo.description);
  setMeta('property', 'og:title', SITE.seo.title);
  setMeta('property', 'og:description', SITE.seo.description);
  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:locale', SITE.seo.locale);
  if (SITE.seo.ogImage) setMeta('property', 'og:image', SITE.seo.ogImage);
  if (SITE.seo.url) setMeta('property', 'og:url', SITE.seo.url);
}
