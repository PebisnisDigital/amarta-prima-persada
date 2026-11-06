import { readFile, readdir, stat } from 'node:fs/promises';

const files = ['index.html', 'en/index.html'];
const imageDirectory = new URL('../images/', import.meta.url);
const imageNames = await readdir(imageDirectory);
let checks = 0;
const partnershipCss = await readFile(new URL('../partnership.css', import.meta.url), 'utf8');
const partnershipJs = await readFile(new URL('./partnership.js', import.meta.url), 'utf8');
if (!partnershipCss.includes('.kjans-sim-shell') || !partnershipJs.includes('628151840631') || !partnershipJs.includes('encodeURIComponent(text)')) {
  throw new Error('Partnership CSS or interactive WhatsApp script is incomplete');
}
checks += 3;

for (const file of files) {
  const content = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
  const isIndonesian = file === 'index.html';
  const fleetNames = ['Toyota 7 Seater', 'Daihatsu 7 Seater', 'Hiace / Elf Long'];
  const partnershipNames = isIndonesian
    ? ['Titip Mobil', 'Sewa Murni', 'Sewa Kepemilikan']
    : ['Car Management (Titip Mobil)', 'New Unit Leasing (Sewa Murni)', 'Lease-to-Own (Sewa Kepemilikan)'];
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
    ['Karansa symbol in navigation and body', (content.match(/src="\/images\/karansa-symbol\.webp"/g) || []).length >= 3],
    ['symbol-only ICO and cache-busted favicon', content.includes('rel="icon" type="image/x-icon" href="/favicon.ico?v=2"') && content.includes('rel="icon" type="image/png" sizes="64x64" href="/images/karansa-favicon.png?v=2"')],
    ['updated Apple touch icon', content.includes('rel="apple-touch-icon" sizes="180x180" href="/images/karansa-touch-icon.png?v=2"')],
    ['branded thumbnail in Open Graph and Twitter', content.includes('property="og:image" content="https://asanirwanaselaras.com/images/og-asa-nirwana-selaras.jpg"') && content.includes('name="twitter:image" content="https://asanirwanaselaras.com/images/og-asa-nirwana-selaras.jpg"')],
    ['thumbnail JPEG metadata and correct size', content.includes('property="og:image:type" content="image/jpeg"') && content.includes('property="og:image:width" content="1200"') && content.includes('property="og:image:height" content="630"')],
    ['no old WebP thumbnail references', !content.includes('/images/og-cover.webp')],
    ['no old logo references', !content.includes('/images/logo-karansa-solution.png') && !content.includes('/images/icon-kjans-official.svg') && !content.includes('/images/logo-kjans-official.svg')],
    ['official cooperative acronym', content.includes('KJANS') && !/\bANS\b/.test(content)],
    ['proper standalone canonical', content.includes(`rel="canonical" href="https://asanirwanaselaras.com/${isIndonesian ? '' : 'en/'}"`) && !content.includes('amarta-prima-persada.vercel.app')],
    ['public-facing site name', content.includes('Asa Nirwana Selaras')],
    ['new cooperative legal name', content.includes('Koperasi Jasa Asa Nirwana Selaras')],
    ['no old company branding', !content.includes('PT Amarta Prima Persada') && !content.includes('logo_amarta.webp')],
    ['no inherited old company contact details', !content.includes('amartaprimapersada.com') && !content.includes('Skyline Building')],
    ['new WhatsApp greeting', !content.includes('Halo%20APP') && !content.includes('Hi%20APP') && !content.includes('%20ANS')],
    ['3 fleet categories', fleetNames.every((name) => content.includes(`<h3>${name}</h3>`))],
    ['5 transportation services', serviceNames.every((name) => content.includes(`<h3>${name}</h3>`))],
    ['3 partnership programs', partnershipNames.every((name) => isIndonesian ? content.includes(`<h3>${name}`) : content.includes(`<h3>${name}</h3>`))],
    ['partnership contact', content.includes('asanirwanaselaras@gmail.com') && content.includes('+62 815-184-0631')],
    ['joining process', (isIndonesian ? content.includes('id="alur"') : content.includes('class="partnership-process"')) && (content.match(/class="process-step"/g) || []).length === 4],
    ['rental WhatsApp unchanged', content.includes('https://wa.me/628522005585') && !content.includes('wa.me/628151840631')],
    ['no outdated Grab/Gojek offer', !/\bGrab\b|\bGojek\b|minimum 1 year|minimum 1 tahun/i.test(content)],
    ['5 service form options', (content.match(/<option(?! value="").*?<\/option>/g) || []).length >= 6],
    ['draft partnership features', !isIndonesian || (
      content.includes('id="simulasi"') &&
      content.includes('id="ketentuan"') &&
      content.includes('id="hak-kewajiban"') &&
      content.includes('id="kjansPartnerForm"') &&
      content.includes('/scripts/partnership.js?v=1')
    )],
  ]) {
    if (!condition) throw new Error(`${file}: ${label} failed`);
    checks += 1;
  }

  const structuredDataMatch = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!structuredDataMatch) throw new Error(`${file}: no JSON-LD data`);
  const structuredData = JSON.parse(structuredDataMatch[1]);
  const organization = structuredData['@graph'].find((entity) => Array.isArray(entity['@type']) && entity['@type'].includes('AutomotiveBusiness'));
  const website = structuredData['@graph'].find((entity) => entity['@type'] === 'WebSite');
  if (organization?.name !== 'Koperasi Jasa Asa Nirwana Selaras' || organization?.alternateName !== 'KJANS' || website?.name !== 'Asa Nirwana Selaras') {
    throw new Error(`${file}: organization and website name mismatch`);
  }
  checks += 1;
  const services = structuredData['@graph'].filter((entity) => entity['@type'] === 'Service');
  const faq = structuredData['@graph'].find((entity) => entity['@type'] === 'FAQPage');
  if (services.length !== 5) throw new Error(`${file}: expected 5 services in JSON-LD, got ${services.length}`);
  if (faq?.mainEntity?.length !== 5) throw new Error(`${file}: expected 5 FAQ items in JSON-LD`);
  checks += 2;

  for (const link of content.matchAll(/href="(https:\/\/wa\.me\/[^"?]+)[^"]*"/g)) {
    if (link[1] !== 'https://wa.me/628522005585') throw new Error(`${file}: unexpected WhatsApp link: ${link[1]}`);
  }
  checks += 1;

  const ids = [...content.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  if (new Set(ids).size !== ids.length) throw new Error(`${file}: duplicate HTML ids`);
  const sections = new Set(ids);
  for (const anchor of content.matchAll(/href="#([^"#]+)"/g)) {
    if (!sections.has(anchor[1])) throw new Error(`${file}: invalid section link #${anchor[1]}`);
  }
  checks += 2;
}

for (const name of imageNames.filter((name) => name.endsWith('.webp'))) {
  const data = await readFile(new URL(`../images/${name}`, import.meta.url));
  if (data.toString('ascii', 8, 12) !== 'WEBP') throw new Error(`Invalid WebP: ${name}`);
  checks += 1;
}

const karansaSymbol = await readFile(new URL('../images/karansa-symbol.webp', import.meta.url));
if (karansaSymbol.toString('ascii', 8, 12) !== 'WEBP') throw new Error('Invalid Karansa Solution WebP');
if (karansaSymbol.length >= 50 * 1024) throw new Error('Karansa symbol exceeds 50 KB');
const socialThumbnail = await readFile(new URL('../images/og-asa-nirwana-selaras.jpg', import.meta.url));
if (socialThumbnail.toString('hex', 0, 2) !== 'ffd8') throw new Error('Invalid JPEG social thumbnail');
if (socialThumbnail.length > 300 * 1024) throw new Error('Social thumbnail exceeds 300 KB');
checks += 2;
const karansaTouchIcon = await readFile(new URL('../images/karansa-touch-icon.png', import.meta.url));
if (karansaTouchIcon.toString('hex', 0, 8) !== '89504e470d0a1a0a') throw new Error('Invalid Karansa touch icon');
const karansaFavicon = await readFile(new URL('../images/karansa-favicon.png', import.meta.url));
if (karansaFavicon.toString('hex', 0, 8) !== '89504e470d0a1a0a') throw new Error('Invalid Karansa PNG favicon');
const ico = await readFile(new URL('../favicon.ico', import.meta.url));
if (ico.toString('hex', 0, 4) !== '00000100') throw new Error('Invalid Karansa ICO favicon');
checks += 5;

for (const name of ['gsap.min.js', 'ScrollTrigger.min.js', 'swiper-bundle.min.js', 'aos.js']) {
  const file = new URL(`../vendor/${name}`, import.meta.url);
  if ((await stat(file)).size < 100) throw new Error(`Missing vendor: ${name}`);
  checks += 1;
}

console.log(`Standalone site validation passed: ${checks} checks.`);
