// Builds a single self-contained HTML file (JS and CSS inlined) that can be
// opened directly from disk (file://) with no server.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
let html = readFileSync(join(dist, 'index.html'), 'utf8');
const assets = readdirSync(join(dist, 'assets'));
for (const file of assets) {
  const code = readFileSync(join(dist, 'assets', file), 'utf8');
  if (file.endsWith('.css')) {
    html = html.replace(new RegExp(`<link[^>]*href="\\./assets/${file}"[^>]*>`), () => `<style>${code}</style>`);
  } else if (file.endsWith('.js')) {
    const safe = code.replace(/<\/script/gi, '<\\/script');
    html = html.replace(new RegExp(`<script[^>]*src="\\./assets/${file}"[^>]*></script>`), () => `<script type="module">${safe}</script>`);
  }
}
const icon = readFileSync(join(dist, 'favicon.svg'), 'utf8');
html = html.replace(/<link rel="icon"[^>]*>/, `<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(icon)}" />`);
mkdirSync('jogar', { recursive: true });
mkdirSync('docs', { recursive: true });
writeFileSync(join('docs', 'index.html'), html);
writeFileSync(join('docs', '.nojekyll'), '');
writeFileSync(join('jogar', 'index.html'), html);
console.log(`jogar/index.html written (${Math.round(html.length / 1024)} kB)`);
