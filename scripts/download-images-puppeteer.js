const puppeteer = require("puppeteer-core");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const OUTPUT_DIR = path.join(__dirname, "..", "public", "images", "products");
const PRODUCTS_FILE = path.join(__dirname, "..", "src", "data", "products.json");
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const allProducts = JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"));

// For each product: use ASIN to search Google, find manufacturer page, get image
// Strategy: search "[brand] [product short name]", visit manufacturer result, get og:image

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function downloadFile(imageUrl, dest) {
  return new Promise((resolve, reject) => {
    const url = new URL(imageUrl);
    const mod = url.protocol === "https:" ? https : http;
    const req = mod.get({
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: { "User-Agent": "Mozilla/5.0", Accept: "image/*,*/*", Referer: url.origin + "/" },
      timeout: 20000,
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location.startsWith("http") ? res.headers.location : url.origin + res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const ws = fs.createWriteStream(dest);
      res.pipe(ws);
      ws.on("finish", () => { ws.close(); resolve(); });
      ws.on("error", reject);
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

function isAmazonImage(url) {
  const l = url.toLowerCase();
  return l.includes("media-amazon.com") || l.includes("ssl-images-amazon") || l.includes("amazon.com/images");
}

async function getImageFromPage(page, url) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
    await sleep(2000); // let images load

    // Extract image URL from the page
    const imageUrl = await page.evaluate(() => {
      // 1. og:image
      const og = document.querySelector('meta[property="og:image"]');
      if (og && og.content) return og.content;

      // 2. twitter:image
      const tw = document.querySelector('meta[name="twitter:image"]');
      if (tw && tw.content) return tw.content;

      // 3. First large product image
      const imgs = Array.from(document.querySelectorAll("img"));
      for (const img of imgs) {
        const src = img.src || img.dataset.src || "";
        if (!src) continue;
        const w = img.naturalWidth || parseInt(img.getAttribute("width") || "0");
        const h = img.naturalHeight || parseInt(img.getAttribute("height") || "0");
        if ((w > 200 || h > 200) && !src.includes("logo") && !src.includes("icon") && !src.includes("svg")) {
          return src;
        }
      }

      // 4. Any img with product-related classes
      const productImg = document.querySelector(".product-image img, .product-gallery img, [data-product-image], .pdp-image img, .product__image img, .ProductImage img");
      if (productImg) return productImg.src || productImg.dataset.src;

      // 5. First reasonably-sized image
      for (const img of imgs) {
        const src = img.src || "";
        if (src && (src.includes("cdn") || src.includes("product") || src.includes("images")) && !src.includes("logo") && !src.includes("icon")) {
          return src;
        }
      }

      return null;
    });

    return imageUrl;
  } catch (err) {
    return null;
  }
}

async function searchAndGetManufacturerImage(page, brand, productName, asin) {
  // Strategy 1: Search Google for "[brand] [product name]" and find manufacturer page
  const query = encodeURIComponent(`${brand} ${productName} product`);
  const searchUrl = `https://www.google.com/search?q=${query}&tbm=isch`;

  try {
    await page.goto(searchUrl, { waitUntil: "domcontentloaded", timeout: 15000 });
    await sleep(1500);

    // Get image URLs from Google Image results - look for non-Amazon sources
    const imageData = await page.evaluate(() => {
      const results = [];
      // Google Images stores image data in scripts
      const scripts = document.querySelectorAll("script");
      for (const script of scripts) {
        const text = script.textContent || "";
        // Find image URLs in the page data
        const matches = text.matchAll(/"(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp))"/gi);
        for (const m of matches) {
          results.push(m[1]);
        }
      }
      // Also check img tags
      document.querySelectorAll("img").forEach(img => {
        if (img.src && (img.src.includes("http") && !img.src.includes("google"))) {
          results.push(img.src);
        }
      });
      return results;
    });

    // Filter: no Amazon images, prefer manufacturer CDN
    const nonAmazon = imageData.filter(u => {
      const l = u.toLowerCase();
      return !l.includes("media-amazon") && !l.includes("ssl-images-amazon") && !l.includes("amazon.com") &&
             !l.includes("gstatic.com") && !l.includes("google.com") && !l.includes("googleusercontent") &&
             !l.includes("favicon") && !l.includes("logo") && !l.includes("icon") &&
             (l.endsWith(".jpg") || l.endsWith(".jpeg") || l.endsWith(".png") || l.endsWith(".webp") || l.includes(".jpg?") || l.includes(".png?") || l.includes(".jpeg?") || l.includes(".webp?"));
    });

    if (nonAmazon.length > 0) return nonAmazon[0];
  } catch {}

  return null;
}

async function searchManufacturerSite(page, brand, productName) {
  // Try to find and visit the manufacturer's product page directly
  const query = encodeURIComponent(`${brand} ${productName} site:${brand.toLowerCase().replace(/\s+/g, "")}.com`);
  try {
    await page.goto(`https://www.google.com/search?q=${query}`, { waitUntil: "domcontentloaded", timeout: 15000 });
    await sleep(1500);

    const firstResult = await page.evaluate(() => {
      const link = document.querySelector("#search a[href^='http']");
      return link ? link.href : null;
    });

    if (firstResult && !firstResult.includes("amazon.com") && !firstResult.includes("google.com")) {
      const imgUrl = await getImageFromPage(page, firstResult);
      if (imgUrl && !isAmazonImage(imgUrl)) return imgUrl;
    }
  } catch {}

  return null;
}

async function main() {
  const existing = new Set(fs.readdirSync(OUTPUT_DIR).filter(f => {
    try { return fs.statSync(path.join(OUTPUT_DIR, f)).size > 5000; } catch { return false; }
  }));

  const missing = Object.entries(allProducts).filter(([id, p]) =>
    !existing.has(path.basename(p.image))
  );

  console.log(`\n=== Puppeteer Image Downloader (Manufacturer Only) ===`);
  console.log(`Missing: ${missing.length} products\n`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-blink-features=AutomationControlled"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36");

  let ok = 0, fail = 0;
  const failures = [];
  const successes = [];

  for (let i = 0; i < missing.length; i++) {
    const [id, product] = missing[i];
    const filename = path.basename(product.image);
    const dest = path.join(OUTPUT_DIR, filename);
    const brand = product.brand;
    const name = product.name.replace(/[,\-–]+.*$/, "").trim(); // Short name for search

    console.log(`[${i+1}/${missing.length}] ${filename} — ${brand} ${name.substring(0, 40)}`);

    let imageUrl = null;

    // Strategy 1: Google Images search for manufacturer image
    imageUrl = await searchAndGetManufacturerImage(page, brand, name, null);

    // Strategy 2: Search manufacturer site directly
    if (!imageUrl) {
      imageUrl = await searchManufacturerSite(page, brand, name);
    }

    if (imageUrl && !isAmazonImage(imageUrl)) {
      try {
        const fullUrl = imageUrl.startsWith("//") ? "https:" + imageUrl : imageUrl;
        await downloadFile(fullUrl, dest);
        const size = fs.statSync(dest).size;
        if (size > 3000) {
          ok++;
          const source = new URL(fullUrl).hostname;
          successes.push({ file: filename, source, size });
          console.log(`  [OK] ${(size/1024).toFixed(0)}KB from ${source}`);
        } else {
          fs.unlinkSync(dest);
          fail++;
          failures.push(filename);
          console.log(`  [FAIL] Too small`);
        }
      } catch (err) {
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        fail++;
        failures.push(filename);
        console.log(`  [FAIL] Download error: ${err.message}`);
      }
    } else {
      fail++;
      failures.push(filename);
      console.log(`  [FAIL] No non-Amazon image found`);
    }

    // Small delay to avoid Google rate limiting
    if (i < missing.length - 1) await sleep(2000);
  }

  await browser.close();

  console.log(`\n${"=".repeat(50)}`);
  console.log(`OK: ${ok} | FAIL: ${fail}`);
  if (successes.length > 0) {
    console.log(`\nDownloaded:`);
    successes.forEach(s => console.log(`  + ${s.file} (${(s.size/1024).toFixed(0)}KB from ${s.source})`));
  }
  if (failures.length > 0) {
    console.log(`\nFailed (${failures.length}):`);
    failures.forEach(f => console.log(`  - ${f}`));
  }
  console.log("=".repeat(50));
}

main().catch(err => { console.error("Fatal:", err); process.exit(1); });
