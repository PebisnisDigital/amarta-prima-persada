import { readFile, readdir, stat } from 'node:fs/promises';

const files = ['index.html', 'en/index.html'];
const imageDirectory = new URL('../images/', import.meta.url);
const imageNames = await readdir(imageDirectory);
let checks = 0;

for (const file of files) {
  const content = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
  const isIndonesian = file === 'index.html';
  const fleetNames = ['Toyota 7 Seater', 'Daihatsu 7 Seater', 'Hiace / Elf Long'];
  const serviceNames = isIndonesian
    ? ['Sewa Harian / Bulanan / Tahunan', 'Sewa Mobil + Sopir', 'Sewa Bulanan + Sopir &amp; BBM', 'Antar-Jemput Karyawan', 'Open Trip Pariwisata']
    : ['Daily / Monthly / Yearly Rental', 'Car Rental with Driver', 'Monthly Rental + Driver &amp; Fuel', 'Employee Pick-Up &amp; Drop-Off', 'Open Group Tourism Trips'];
  for (const [label, condition] of [
    ['valid HTML page', /<!doctype html>/i.test(content)],
    ['new WhatsApp number', content.includes('wa.me/628522005585')],
    ['no old WhatsApp number', !content.includes('62811844312')],
    ['no PESONAFLIX references', !content.includes('pesonaflix.vercel.app')],
    ['no nested /zainulhaq2 paths', !content.includes('/zainulhaq2')],
    ['local vendor asset', content.includes('/vendor/swiper-bundle.min.js')],
    ['local image asset', content.includes('/images/logo_amarta.webp')],
    ['proper standalone canonical', content.includes('https://amarta-prima-persada.vercel.app')],
    ['3 fleet categories', fleetNames.every((name) => content.includes(`<h3>${name}</h3>`))],
    ['5 transportation services', serviceNames.every((name) => content.includes(`<h3>${name}</h3>`))],
    ['no outdated Grab/Gojek offer', !/\bGrab\b|\bGojek\b|minimum 1 year|minimum 1 tahun/i.test(content)],
    ['5 service form options', (content.match(/<option(?! value="").*?<\/option>/g) || []).length === 6],
  ]) {
    if (!condition) throw new Error(`${file}: ${label} failed`);
    checks += 1;
  }

  const structuredDataMatch = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!structuredDataMatch) throw new Error(`${file}: no JSON-LD data`);
  const structuredData = JSON.parse(structuredDataMatch[1]);
  const services = structuredData['@graph'].filter((entity) => entity['@type'] === 'Service');
  const faq = structuredData['@graph'].find((entity) => entity['@type'] === 'FAQPage');
  if (services.length !== 5) throw new Error(`${file}: expected 5 services in JSON-LD, got ${services.length}`);
  if (faq?.mainEntity?.length !== 5) throw new Error(`${file}: expected 5 FAQ items in JSON-LD`);
  checks += 2;

  for (const link of content.matchAll(/href="(https:\/\/wa\.me\/[^"?]+)[^"]*"/g)) {
    if (link[1] !== 'https://wa.me/628522005585') throw new Error(`${file}: unexpected WhatsApp link: ${link[1]}`);
  }
  checks += 1;
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
