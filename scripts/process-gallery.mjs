import sharp from "sharp";
import { readdir, writeFile } from "fs/promises";
import { join, parse } from "path";

const SRC_DIR = "/Users/aaronstevens/Downloads/January 2026 mixed arrangments";
const OUT_DIR = join(import.meta.dirname, "..", "public", "gallery");
const MANIFEST_PATH = join(import.meta.dirname, "..", "src", "data", "gallery.ts");

const WIDTH = 800;
const THUMB_WIDTH = 400;
const QUALITY = 80;

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseCaption(filename) {
  const name = parse(filename).name.replace(/\s*\*\s*$/, "").trim();

  const patterns = [
    /^(.+?)\s+LG\s+(?:and|with)\s+(.+?)\s+SM$/i,
    /^LG\s+(.+?)\s+with\s+SM\s+(.+?)$/i,
    /^LG\s+(.+?)\s+wiht\s+LG\s+(.+?)$/i,
    /^SM\s+(.+?)\s+(?:with|and)\s+(?:LG|SM)\s+(.+?)$/i,
    /^Sm\s+(.+?)\s+(?:with|and)\s+(?:LG|SM|Large)\s+(.+?)$/i,
    /^Small\s+(.+?)\s+with\s+SM\s+(.+?)$/i,
    /^Small\s+(.+?)\s+with\s+LG\s+(.+?)$/i,
    /^Large\s+(.+?)\s+with\s+(?:sm|SM)\s+(.+?)$/i,
    /^Tall\s+(.+?)\s+with\s+(?:sm|SM)\s+(.+?)$/i,
    /^(.+?)\s+with\s+LG\s+(.+?)$/i,
    /^Aprodite\s+LG\s+and\s+(.+?)\s+SM$/i,
  ];

  for (const pat of patterns) {
    const m = name.match(pat);
    if (m) {
      const a = m[1].trim().replace(/jpg$/i, "").trim();
      const b = m[2].trim().replace(/jpg$/i, "").trim();
      return `${a} + ${b}`;
    }
  }

  return name;
}

const files = (await readdir(SRC_DIR)).filter((f) =>
  /\.(jpg|jpeg|png)$/i.test(f),
);
files.sort();

console.log(`Processing ${files.length} images...\n`);

const manifest = [];

for (const file of files) {
  const src = join(SRC_DIR, file);
  const slug = slugify(parse(file).name.replace(/\s*\*\s*$/, ""));
  const outName = `${slug}.jpg`;
  const thumbName = `${slug}-thumb.jpg`;

  await sharp(src)
    .resize({ width: WIDTH, withoutEnlargement: true })
    .jpeg({ quality: QUALITY })
    .toFile(join(OUT_DIR, outName));

  await sharp(src)
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: 75 })
    .toFile(join(OUT_DIR, thumbName));

  const caption = parseCaption(file);
  manifest.push({ id: slug, file: outName, thumb: thumbName, caption });

  console.log(`  ${file}\n    -> ${outName} | caption: "${caption}"`);
}

const entries = manifest.map((m) => ({
  id: m.id,
  src: "/gallery/" + m.file,
  thumb: "/gallery/" + m.thumb,
  caption: m.caption,
}));

const ts = [
  "export interface GalleryImage {",
  "  id: string;",
  "  src: string;",
  "  thumb: string;",
  "  caption: string;",
  "}",
  "",
  "export const galleryImages: GalleryImage[] = " +
    JSON.stringify(entries, null, 2) +
    ";",
  "",
].join("\n");

await writeFile(MANIFEST_PATH, ts);
console.log(`\nWrote manifest to ${MANIFEST_PATH}`);
console.log(`Done: ${manifest.length} images processed.`);
