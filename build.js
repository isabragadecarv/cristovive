/* ==========================================================================
   build.js — empacota o site modular em um único arquivo
   Uso:  node build.js
   Saídas:
     dist/index.html     documento completo, abre offline com duplo clique
     dist/artifact.html  só o conteúdo (para publicação como Artifact)
   O código-fonte modular em css/ e js/ continua sendo a fonte da verdade.
   ========================================================================== */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

/* --- 1. CSS ------------------------------------------------------------- */
const CSS_ORDER = ['tokens', 'base', 'layout', 'components', 'motion', 'sections'];
const css = CSS_ORDER.map((n) => `/* ===== ${n}.css ===== */\n${read(`css/${n}.css`)}`).join('\n');

/* --- 2. JS: concatena os módulos ESM em ordem de dependência ------------ */
const JS_ORDER = ['content', 'reveal', 'video', 'scroll', 'cursor', 'menu', 'bind', 'main'];
const js = JS_ORDER.map((n) => {
  let src = read(`js/${n}.js`);
  src = src.replace(/^\s*import\s[^;]*?;\s*$/gm, '');   // remove imports
  src = src.replace(/^export\s+(const|function)\s/gm, '$1 '); // desexporta
  return `/* ===== ${n}.js ===== */\n${src}`;
}).join('\n');

/* --- 3. Imagens → data URI --------------------------------------------- */
const assets = new Map();
const indexHtml = read('index.html');
for (const f of fs.readdirSync(path.join(ROOT, 'assets'))) {
  if (!indexHtml.includes(`assets/${f}`)) continue;   // só o que a página usa
  const buf = fs.readFileSync(path.join(ROOT, 'assets', f));
  const mime = f.endsWith('.webp') ? 'image/webp'
             : f.endsWith('.png')  ? 'image/png' : 'image/jpeg';
  assets.set(`assets/${f}`, `data:${mime};base64,${buf.toString('base64')}`);
}

/* --- 4. Monta ----------------------------------------------------------- */
let html = read('index.html');

html = html
  .replace(/\n\s*<link rel="stylesheet" href="css\/[^"]+">/g, '')
  .replace('<script type="module" src="js/main.js"></script>',
           `<style>\n${css}\n</style>`)
  .replace('</body>', `<script>\n(function(){\n${js}\n})();\n</script>\n</body>`);

for (const [file, uri] of assets) html = html.split(`"${file}"`).join(`"${uri}"`);

fs.mkdirSync(path.join(ROOT, 'dist'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'dist/index.html'), html);

/* Versão Artifact: sem <!doctype>/<html>/<head>/<body> — o host os fornece. */
const head = html.match(/<head>([\s\S]*?)<\/head>/)[1];
const body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
const keep = head
  .split('\n')
  .filter((l) => /<title>|<style>|<\/style>|font|^\s*\/\*|^\s*$/.test(l) || l.includes('theme-color'))
  .join('\n');
fs.writeFileSync(
  path.join(ROOT, 'dist/artifact.html'),
  `${head.replace(/<meta charset[^>]*>|<meta name="viewport"[^>]*>/g, '')}\n${body}`
);

const kb = (s) => `${(Buffer.byteLength(s) / 1024).toFixed(0)} KB`;
console.log(`dist/index.html    ${kb(html)}`);
console.log(`css ${kb(css)} · js ${kb(js)} · ${assets.size} imagens`);
