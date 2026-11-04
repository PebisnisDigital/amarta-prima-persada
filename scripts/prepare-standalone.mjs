import { readFile, writeFile } from 'node:fs/promises';

const productionOrigin = 'https://amarta-prima-persada.vercel.app';
const sourceOrigin = 'https://pesonaflix.vercel.app/zainulhaq2';

for (const path of ['index.html', 'en/index.html']) {
  const original = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
  const standalone = original
    .replaceAll(sourceOrigin, productionOrigin)
    .replaceAll('/zainulhaq2/', '/')
    .replaceAll('href="/zainulhaq2"', 'href="/"');
  await writeFile(new URL(`../${path}`, import.meta.url), standalone);
}

console.log('Prepared isolated root-domain HTML for PT Amarta Prima Persada.');
