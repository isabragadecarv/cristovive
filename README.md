# Conference 2026 — Cristo Vive Movement

Protótipo de site, reconstruído a partir da peça original do Canva.
HTML semântico + CSS com design tokens + JavaScript em módulos ES.
Sem framework, sem build obrigatório, sem dependência externa além das fontes.

---

## ►► A URL do vídeo (Bloco 3)

Um único lugar, no topo de **`js/content.js`**:

```js
export const YOUTUBE_VIDEO_URL = '';   // ← cole a URL aqui
```

Aceita qualquer formato: `watch?v=`, `youtu.be/`, `/embed/`, `/shorts/`,
`/live/` ou só o ID de 11 caracteres. Não existe nenhuma outra URL de vídeo
no projeto.

Enquanto o campo estiver vazio, o Bloco 3 exibe um estado de espera
identificado (“Aguardando URL do vídeo”) — a composição, a animação de
revelação e a moldura continuam visíveis e testáveis.

Assim que a URL é preenchida, o bloco vira um player real: miniatura oficial
do YouTube, e o `<iframe>` só é criado **no clique** (fachada / *lite embed*).
Antes disso nenhum script ou cookie do YouTube carrega — a página abre rápido
e nada de terceiro roda sem ação do visitante. O embed usa
`youtube-nocookie.com`.

---

## Estrutura

```
index.html            marcação semântica; cada seção é um bloco isolado e comentado
css/
  tokens.css          cor, tipografia, escala, ritmo, movimento — trocar a marca é trocar este arquivo
  base.css            reset, tipografia base, foco visível, prefers-reduced-motion, impressão
  layout.css          grid de 12 colunas, seções, trilhos verticais
  components.css      nav, menu, botões, marcadores, figuras, marquee, cursor
  motion.css          sistema de revelação por scroll (reveal, cortina, linhas, parallax)
  sections.css        estilos de cada bloco narrativo
js/
  content.js          ►► FONTE ÚNICA: URL do vídeo, data, local, links, SEO
  bind.js             injeta content.js no HTML; monta JSON-LD e metatags
  reveal.js           IntersectionObserver único; quebra de títulos em linhas
  scroll.js           um só requestAnimationFrame: nav, progresso, parallax, marquee, seção ativa
  video.js            Bloco 3 — parser de URL + player com fachada
  menu.js             navegação em telas pequenas
  cursor.js           cursor personalizado (só em ponteiro fino)
  main.js             ponto de entrada
assets/               fotos otimizadas em WebP
build.js              empacota tudo em dist/index.html (arquivo único)
```

## Rodar

Abrir `index.html` por um servidor local (os módulos ES exigem `http://`):

```bash
python3 -m http.server 8000     # depois: http://localhost:8000
```

Gerar a versão de arquivo único (abre com duplo clique, sem servidor):

```bash
node build.js                   # → dist/index.html
```

---

## Trocar conteúdo

| O quê | Onde |
|---|---|
| URL do vídeo | `js/content.js` → `YOUTUBE_VIDEO_URL` |
| Data, horário, local, endereço, cidade | `js/content.js` → `SITE.date`, `SITE.venue` |
| Inscrição (status, preço, link) | `js/content.js` → `SITE.tickets` |
| Instagram, e-mail, WhatsApp | `js/content.js` → `SITE.links` |
| Título, descrição, imagem de compartilhamento | `js/content.js` → `SITE.seo` |
| Textos editoriais (manifesto, bio, “o que é”) | `index.html`, na seção correspondente |
| Cores, fontes, escala, espaçamento | `css/tokens.css` |

Campo com valor `null` renderiza automaticamente o marcador **“A definir”**.
Nada é inventado: o que falta aparece como falta. Basta preencher a string
para o campo virar conteúdo real — sem tocar em HTML ou CSS.

O mesmo vale para os links: um botão sem URL fica inativo e com
`aria-disabled`, em vez de apontar para lugar nenhum.

---

## Decisões técnicas

- **Sem JavaScript o site continua legível.** Os textos estão no HTML, e os
  marcadores “A definir” também. O JS só adiciona movimento e liga
  `content.js`.
- **Um único `requestAnimationFrame`** governa tudo que depende de scroll.
  Vários listeners concorrentes são a causa mais comum de travamento em
  páginas com este tipo de efeito.
- **Só `transform`, `opacity` e `clip-path`** são animados — propriedades
  compostas pela GPU, sem reflow.
- **A cortina de revelação é um pseudo-elemento, não um `clip-path` no
  próprio elemento.** Um `clip-path` zera a área visível e o
  IntersectionObserver passa a calcular interseção 0 — o efeito nunca
  dispararia.
- **`prefers-reduced-motion`** desliga toda animação, o cursor e o parallax.
- **Imagens** em WebP, com `width`/`height` declarados (sem *layout shift*) e
  `loading="lazy"` fora da primeira dobra.
- **SEO**: `<time datetime>`, hierarquia de títulos correta, `aria-label` nos
  títulos animados, e JSON-LD do tipo `Event` montado a partir de
  `content.js` — declarando local e inscrição só quando existirem de fato.

---

## Migração para um site completo

A separação já está pronta para virar componentes:

- cada bloco de `index.html` → um componente (`Hero`, `Manifesto`, `VideoBlock`,
  `About`, `Field`, `Info`, `Cta`, `Footer`);
- `js/content.js` → arquivo de conteúdo do CMS, ou rotas de dados;
- `css/tokens.css` → tema (CSS custom properties funcionam igual em qualquer
  framework, inclusive Tailwind v4 via `@theme`);
- `css/components.css` → biblioteca de componentes;
- `js/*.js` → hooks (`useReveal`, `useScroll`) ou continuam como estão.

Páginas novas (programação, palestrantes, inscrição, edições anteriores)
reaproveitam `tokens.css` + `components.css` + `layout.css` sem alteração.
