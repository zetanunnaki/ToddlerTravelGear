import sharp from "sharp";
import { writeFileSync } from "fs";

function makeSvg(size) {
  const rx = Math.round(size * 0.25);
  const fontSize = Math.round(size * 0.69);
  const textY = Math.round(size * 0.75);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${rx}" fill="#0d9488"/>
    <text x="${size / 2}" y="${textY}" text-anchor="middle" font-family="Georgia,serif" font-weight="bold" font-size="${fontSize}" fill="#fff">T</text>
  </svg>`;
}

async function generateIcons() {
  // favicon.ico (32x32)
  const png32 = await sharp(Buffer.from(makeSvg(32))).resize(32, 32).png().toBuffer();
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const dir = Buffer.alloc(16);
  dir.writeUInt8(32, 0);
  dir.writeUInt8(32, 1);
  dir.writeUInt8(0, 2);
  dir.writeUInt8(0, 3);
  dir.writeUInt16LE(1, 4);
  dir.writeUInt16LE(32, 6);
  dir.writeUInt32LE(png32.length, 8);
  dir.writeUInt32LE(22, 12);
  writeFileSync("public/favicon.ico", Buffer.concat([header, dir, png32]));
  console.log("  favicon.ico (32x32)");

  // PWA icons (192x192, 512x512)
  for (const size of [192, 512]) {
    const png = await sharp(Buffer.from(makeSvg(size))).resize(size, size).png().toBuffer();
    writeFileSync(`public/icon-${size}.png`, png);
    console.log(`  icon-${size}.png`);
  }

  console.log("Icons generated.");
}

generateIcons();
