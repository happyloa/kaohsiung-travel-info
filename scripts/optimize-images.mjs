import { createHash } from 'node:crypto';
import { mkdir, readdir, unlink, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const source = 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json';
const response = await fetch(source, { signal: AbortSignal.timeout(10000) });
if (!response.ok) throw new Error(`Dataset: HTTP ${response.status}`);
const { result: { records } } = await response.json();
const urls = [...new Set(records.map(spot => spot.Picture1))].sort();
await mkdir('static/images/spots', { recursive: true });
const spots = {};
let originalBytes = 0;
let optimizedBytes = 0;
let next = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (next < urls.length) {
    const url = urls[next++];
    // Only download the dataset's known image host, never arbitrary destinations.
    if (!url.startsWith('https://raw.githubusercontent.com/hexschool/KCGTravel/master/image/')) {
      throw new Error(`Unexpected image origin: ${url}`);
    }
    const image = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!image.ok) throw new Error(`Image: HTTP ${image.status} ${url}`);
    const input = Buffer.from(await image.arrayBuffer());
    originalBytes += input.length;
    const variants = [];
    for (const width of [480, 800]) {
      const output = await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 55, effort: 6 }).toBuffer();
      const hash = createHash('sha256').update(output).digest('hex').slice(0, 16);
      const path = `/images/spots/${hash}-${width}.webp`;
      await writeFile(`static${path}`, output);
      optimizedBytes += output.length;
      variants.push(path);
    }
    spots[url] = variants;
  }
}));

const hero = [];
for (const width of [640, 800, 1280]) {
  const { data: output, info } = await sharp('static/bg.webp').resize({ width, withoutEnlargement: true }).webp({ quality: 45, effort: 6 }).toBuffer({ resolveWithObject: true });
  const hash = createHash('sha256').update(output).digest('hex').slice(0, 16);
  const path = `/images/hero-${hash}-${info.width}.webp`;
  await writeFile(`static${path}`, output);
  hero.push({ src: path, width: info.width, height: info.height });
}
const icon = await sharp('static/github.webp').resize(48, 48).webp({ lossless: true }).toBuffer();
const iconPath = `/images/github-${createHash('sha256').update(icon).digest('hex').slice(0, 16)}.webp`;
await writeFile(`static${iconPath}`, icon);
await writeFile('src/lib/media.json', JSON.stringify({
  hero, icon: iconPath, spots: Object.fromEntries(Object.entries(spots).sort(([a], [b]) => a.localeCompare(b))),
}, null, 2) + '\n');
const retained = new Set([...hero.map(image => image.src), iconPath, ...Object.values(spots).flat()]);
for (const directory of ['static/images', 'static/images/spots']) {
  for (const file of await readdir(directory, { withFileTypes: true })) {
    const path = `${directory}/${file.name}`;
    if (file.isFile() && /^(?:hero-[a-f0-9]{16}-\d+|github-[a-f0-9]{16}|[a-f0-9]{16}-\d+)\.webp$/.test(file.name)
      && !retained.has(path.slice('static'.length))) await unlink(path);
  }
}
console.log(JSON.stringify({ images: urls.length, originalBytes, optimizedBytes, hero, icon: iconPath }));
