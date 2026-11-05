import { readFile, writeFile } from 'node:fs/promises';

// Extract the unchanged official KJANS artwork from Poppler's SVG rendering of
// page 1 of the cooperative's supplied proposal. The crop keeps its vector
// outlines and embedded source artwork; only the full-page background is removed.
const [sourcePath, destinationDirectory] = process.argv.slice(2);
if (!sourcePath || !destinationDirectory) {
  throw new Error('Usage: node scripts/extract-kjans-logo.mjs proposal-page-1.svg images/');
}

const page = await readFile(sourcePath, 'utf8');
if (!page.includes('viewBox="0 0 960 540"') || !page.includes('source-5')) {
  throw new Error('Unexpected proposal page SVG; check the supplied PDF.');
}

const transparent = page
  .replace(/<image id="source-5"[^>]*\/>/, '')
  .replace(/<use xlink:href="#source-5"[^>]*\/>/, '');

const variants = [
  { file: 'logo-kjans-official.svg', viewBox: '351 130 231 69', width: 462, height: 138, title: 'Koperasi Jasa Asa Nirwana Selaras' },
  { file: 'icon-kjans-official.svg', viewBox: '351 130 76 69', width: 152, height: 138, title: 'Simbol resmi KJANS' },
];

for (const { file, viewBox, width, height, title } of variants) {
  const output = transparent
    .replace('width="960" height="540" viewBox="0 0 960 540"', `width="${width}" height="${height}" viewBox="${viewBox}"`)
    .replace('<defs>', `<title>${title}</title>\n<defs>`);
  await writeFile(`${destinationDirectory}/${file}`, output);
  console.log(`Extracted official KJANS artwork: ${file}`);
}
