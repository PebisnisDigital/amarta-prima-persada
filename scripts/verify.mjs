import { readFile, readdir, stat } from 'node:fs/promises';

const files = ['index.html', 'en/index.html'];
const imageDirectory = new URL('../images/', import.meta.url);
const imageNames = await readdir(imageDirectory);
let checks = 0;

for (const file of files) {
  const content = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
  for (const [label, condition] of [
    ['valid HTML page', /<!doctype html>/i.test(content)],
    ['new WhatsApp number', content.includes('wa.me/628522005585')],
    ['no old WhatsApp number', !content.includes('62811844312')],
    ['no PESONAFLIX references', !content.includes('pesonaflix.vercel.app')],
    ['no nested /zainulhaq2 paths', !content.includes('/zainulhaq2')],
    ['local vendor asset', content.includes('/vendor/swiper-bundle.min.js')],
    ['local image asset', content.includes('/images/logo_amarta.webp')],
    ['proper standalone canonical', content.includes('https://amarta-prima-persada.vercel.app')],
  ]) {
    if (!condition) throw new Error(`${file}: ${label} failed`);
    checks += 1;
  }
}

for (const name of imageNames) {
  const data = await readFile(new URL(`../images/${name}`, import.meta.url));
  if (data.toString('ascii', 8, 12) !== 'WEBP') throw new Error(`Invalid WebP: ${name}`);
  checks += 1;
}

for (const name of ['gsap.min.js', 'ScrollTrigger.min.js', 'swiper-bundle.min.js', 'aos.js']) {
  const file = new URL(`../vendor/${name}`, import.meta.url);
  if ((await stat(file)).size < 100) throw new Error(`Missing vendor: ${name}`);
  checks += 1;
}

console.log(`Standalone site validation passed: ${checks} checks.`);
