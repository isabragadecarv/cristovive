/* ==========================================================================
   CRISTO VIVE MOVEMENT — CONFERENCE 2026
   content.js — FONTE ÚNICA DE CONFIGURAÇÃO
   --------------------------------------------------------------------------
   Tudo que muda com frequência (URLs, datas, local, textos de placeholder)
   vive AQUI. Nenhum destes valores está repetido em outro arquivo.
   ========================================================================== */


/* ██████████████████████████████████████████████████████████████████████████
   ██                                                                      ██
   ██   ►►►  URL DO VÍDEO DO YOUTUBE — BLOCO 3  ◄◄◄                        ██
   ██                                                                      ██
   ██   Cole a URL definitiva do YouTube na linha abaixo. É o ÚNICO        ██
   ██   lugar do projeto onde essa URL precisa existir.                    ██
   ██                                                                      ██
   ██   Aceita qualquer formato:                                           ██
   ██     https://www.youtube.com/watch?v=XXXXXXXXXXX                      ██
   ██     https://youtu.be/XXXXXXXXXXX                                     ██
   ██     https://www.youtube.com/embed/XXXXXXXXXXX                        ██
   ██     https://www.youtube.com/shorts/XXXXXXXXXXX                       ██
   ██     XXXXXXXXXXX          (apenas o ID, também funciona)              ██
   ██                                                                      ██
   ██   Enquanto estiver vazio (''), o Bloco 3 exibe um estado de          ██
   ██   espera claramente identificado — o layout, a animação de           ██
   ██   revelação e o botão de play continuam visíveis e testáveis.        ██
   ██                                                                      ██
   ████████████████████████████████████████████████████████████████████████ */

export const YOUTUBE_VIDEO_URL = '';

//  ↑↑↑  COLE A URL AQUI. Exemplo de como ficará quando preenchido:
//       export const YOUTUBE_VIDEO_URL = 'https://youtu.be/SEU_ID_AQUI';
//
//  Legenda que aparece sob o vídeo (opcional — deixe '' para ocultar):
export const YOUTUBE_VIDEO_CAPTION = '';


/* --------------------------------------------------------------------------
   CONFIGURAÇÃO GERAL DO SITE
   -------------------------------------------------------------------------- */

export const SITE = {

  /* --- Identidade ------------------------------------------------------- */
  brand:      'Cristo Vive Movement',
  eventName:  'Conference',
  eventYear:  '2026',

  /* --- Data do evento (informação confirmada no material original) ------- */
  date: {
    day:      '12',
    monthAbbr: 'SET',
    monthFull: 'Setembro',
    year:      '2026',
    // ISO usado por <time> e pelo JSON-LD de SEO.
    iso:       '2026-09-12',
    // A DEFINIR — horário ainda não informado no material original.
    time:      null,       // ex.: '19:00'
  },

  /* --- Informações práticas ---------------------------------------------
     `null` = ainda não informado no material original. O site renderiza
     automaticamente um marcador "A DEFINIR" no lugar, em vez de inventar.
     Basta preencher a string para o campo virar conteúdo real.          */
  venue: {
    name:     null,        // ex.: 'Ginásio Municipal de Alfenas'
    address:  null,        // ex.: 'Rua X, 123 — Centro'
    city:     null,        // ex.: 'Alfenas — MG'
    mapsUrl:  null,        // ex.: 'https://maps.google.com/?q=...'
  },

  tickets: {
    status:   null,        // ex.: 'Inscrições abertas' | 'Em breve'
    price:    null,        // ex.: 'R$ 00,00'
    url:      null,        // ex.: 'https://link-de-inscricao'
  },

  /* --- Links ------------------------------------------------------------
     O rodapé do material original trazia apenas um ícone do Instagram,
     sem URL legível, e dois placeholders quebrados do Canva.           */
  links: {
    instagram: null,       // ex.: 'https://instagram.com/cristovivemovement'
    youtube:   null,
    whatsapp:  null,
    email:     null,
  },

  /* --- SEO --------------------------------------------------------------- */
  seo: {
    title:       'Conference 2026 — Cristo Vive Movement',
    description: 'Um movimento que nasceu no coração de Deus. Conference 2026, ' +
                 '12 de setembro. Você está pronto?',
    // A DEFINIR — imagem de compartilhamento (1200×630) para redes sociais.
    ogImage:     null,
    url:         null,     // ex.: 'https://cristovive.com.br'
    locale:      'pt_BR',
  },
};


/* --------------------------------------------------------------------------
   RÓTULO USADO EM TODO CAMPO AINDA NÃO DEFINIDO
   -------------------------------------------------------------------------- */
export const PLACEHOLDER_LABEL = 'A definir';
