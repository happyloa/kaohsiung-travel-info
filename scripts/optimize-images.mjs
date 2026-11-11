import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import sharp from "sharp";

const dataset =
  "https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json";
const imageOrigin =
  "https://raw.githubusercontent.com/hexschool/KCGTravel/master/image/";
const sources = "src/lib/assets/images";
// 卡片照片框高 160 px、寬約 290–490 px；預先裁成 20:9，不再傳送會被 object-cover 裁掉的像素。
const spotSizes = [
  [480, 216],
  [800, 360],
];
const spotFormats = {
  avif: { quality: 45, effort: 6, chromaSubsampling: "4:2:0" },
  webp: { quality: 55, effort: 6 },
};
// 首圖疊有深色漸層，可用較低品質。
const heroWidths = [640, 800, 1280];
const heroFormats = {
  avif: { quality: 40, effort: 6, chromaSubsampling: "4:2:0" },
  webp: { quality: 45, effort: 6 },
};

const hash = (...parts) => {
  const digest = createHash("sha256");
  for (const part of parts) digest.update(part);
  return digest.digest("hex").slice(0, 16);
};

const response = await fetch(dataset, { signal: AbortSignal.timeout(10000) });
if (!response.ok) throw new Error(`Dataset: HTTP ${response.status}`);
const {
  result: { records },
} = await response.json();
const urls = [...new Set(records.map((spot) => spot.Picture1))].sort();
await mkdir("static/images/spots", { recursive: true });

// 同一張照片的所有尺寸與格式共用一個 id（來源與設定的雜湊），頁面資料只需傳送 id。
const spotSettings = JSON.stringify({ spotSizes, spotFormats });
const spots = {};
const bytes = { original: 0, avif: 0, webp: 0 };
let next = 0;
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (next < urls.length) {
      const url = urls[next++];
      // Only download the dataset's known image host, never arbitrary destinations.
      if (!url.startsWith(imageOrigin))
        throw new Error(`Unexpected image origin: ${url}`);
      const image = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (!image.ok) throw new Error(`Image: HTTP ${image.status} ${url}`);
      const input = Buffer.from(await image.arrayBuffer());
      bytes.original += input.length;
      const id = hash(input, spotSettings);
      for (const [width, height] of spotSizes) {
        const resized = sharp(input)
          .rotate()
          .resize({ width, height, fit: "cover" });
        for (const [format, options] of Object.entries(spotFormats)) {
          const output = await resized.clone()[format](options).toBuffer();
          await writeFile(
            `static/images/spots/${id}-${width}.${format}`,
            output,
          );
          bytes[format] += output.length;
        }
      }
      spots[url] = id;
    }
  }),
);

const heroSource = await readFile(`${sources}/hero.webp`);
const hero = [];
for (const width of heroWidths) {
  const entry = { width, height: 0 };
  for (const [format, options] of Object.entries(heroFormats)) {
    const { data, info } = await sharp(heroSource)
      .resize({ width, withoutEnlargement: true })
      [format](options)
      .toBuffer({ resolveWithObject: true });
    const path = `/images/hero-${hash(data)}-${info.width}.${format}`;
    await writeFile(`static${path}`, data);
    Object.assign(entry, {
      width: info.width,
      height: info.height,
      [format]: path,
    });
  }
  hero.push(entry);
}

async function icon(name, size) {
  const output = await sharp(`${sources}/${name}.webp`)
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ lossless: true, effort: 6 })
    .toBuffer();
  const path = `/images/${name}-${hash(output)}.webp`;
  await writeFile(`static${path}`, output);
  return path;
}
const favicon = await icon("favicon", 96);
const github = await icon("github", 48);

await writeFile(
  "src/lib/media.json",
  JSON.stringify(
    {
      favicon,
      github,
      hero,
      spotWidths: spotSizes.map(([width]) => width),
      spots: Object.fromEntries(
        Object.entries(spots).sort(([a], [b]) => a.localeCompare(b)),
      ),
    },
    null,
    2,
  ) + "\n",
);

const retained = new Set([
  favicon,
  github,
  ...hero.flatMap((image) => [image.avif, image.webp]),
  ...Object.values(spots).flatMap((id) =>
    spotSizes.flatMap(([width]) =>
      Object.keys(spotFormats).map(
        (format) => `/images/spots/${id}-${width}.${format}`,
      ),
    ),
  ),
]);
const generated =
  /^(?:(?:hero-)?[a-f0-9]{16}-\d+\.(?:avif|webp)|(?:favicon|github)-[a-f0-9]{16}\.webp)$/;
for (const directory of ["static/images", "static/images/spots"]) {
  for (const file of await readdir(directory, { withFileTypes: true })) {
    const path = `${directory}/${file.name}`;
    if (
      file.isFile() &&
      generated.test(file.name) &&
      !retained.has(path.slice("static".length))
    )
      await unlink(path);
  }
}
console.log(
  JSON.stringify({ images: urls.length, bytes, hero, favicon, github }),
);
