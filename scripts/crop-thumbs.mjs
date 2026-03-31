import sharp from "sharp";
import { readdir } from "fs/promises";
import { join } from "path";

const GALLERY_DIR = join(import.meta.dirname, "..", "public", "gallery");
const THUMB_SIZE = 400;

const files = (await readdir(GALLERY_DIR)).filter(
  (f) => f.endsWith("-thumb.jpg"),
);

console.log(`Re-cropping ${files.length} thumbnails...\n`);

for (const file of files) {
  const fullFile = file.replace("-thumb.jpg", ".jpg");
  const src = join(GALLERY_DIR, fullFile);

  const meta = await sharp(src).metadata();
  const w = meta.width || 800;
  const h = meta.height || 800;

  const cropSize = Math.min(w, h) * 0.75;
  const left = Math.round((w - cropSize) / 2);
  const top = Math.round((h - cropSize) / 2.5);

  await sharp(src)
    .extract({
      left: Math.max(0, left),
      top: Math.max(0, top),
      width: Math.round(Math.min(cropSize, w - left)),
      height: Math.round(Math.min(cropSize, h - top)),
    })
    .resize({ width: THUMB_SIZE, height: THUMB_SIZE, fit: "cover" })
    .jpeg({ quality: 80 })
    .toFile(join(GALLERY_DIR, file));

  console.log(`  ${file} cropped`);
}

console.log(`\nDone.`);
