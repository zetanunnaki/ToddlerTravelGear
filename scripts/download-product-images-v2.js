const https = require("https");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const OUTPUT_DIR = path.join(__dirname, "..", "public", "images", "products");
const PRODUCTS_FILE = path.join(__dirname, "..", "src", "data", "products.json");

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const allProducts = JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"));

function extractAsin(amazonUrl) {
  const match = amazonUrl.match(/\/dp\/([A-Z0-9]{10})/i);
  return match ? match[1] : null;
}

function fetchPage(pageUrl, maxRedirects = 5) {
  if (maxRedirects <= 0) return Promise.reject(new Error("Too many redirects"));
  return new Promise((resolve, reject) => {
    const url = new URL(pageUrl);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "identity",
        "Cache-Control": "no-cache",
      },
      timeout: 20000,
    };
    const req = https.get(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const loc = res.headers.location.startsWith("http")
          ? res.headers.location
          : `https://${url.hostname}${res.headers.location}`;
        return fetchPage(loc, maxRedirects - 1).then(resolve).catch(reject);
      }
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => resolve({ html: data, status: res.statusCode }));
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

function extractMainImage(html) {
  let match;

  // 1. Amazon landing-image data attribute (most reliable for Amazon pages)
  match = html.match(/id=["']landingImage["'][^>]+(?:data-old-hires|src)=["'](https:\/\/m\.media-amazon\.com\/images\/I\/[^"']+)["']/i);
  if (match) return cleanAmazonUrl(match[1]);

  // 2. Amazon image block JSON
  match = html.match(/'colorImages'.*?'initial'.*?\[.*?"hiRes":"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/s);
  if (match) return match[1];

  // 3. Amazon image from imageBlockData
  match = html.match(/"hiRes"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/);
  if (match) return match[1];

  // 4. og:image (works on both Amazon and other sites)
  match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
  if (!match) match = html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (match) return cleanAmazonUrl(match[1]);

  // 5. twitter:image
  match = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
  if (!match) match = html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
  if (match) return cleanAmazonUrl(match[1]);

  // 6. Any Amazon media image
  match = html.match(/(https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9+_.-]+\.(?:jpg|png))/);
  if (match) return cleanAmazonUrl(match[1]);

  return null;
}

function cleanAmazonUrl(url) {
  // Get the highest resolution version by modifying the URL
  // Replace size suffixes like ._AC_SX679_ with ._AC_SL1500_ for max quality
  return url.replace(/\._[A-Z]+_[A-Z]+\d+_/, "._AC_SL1500_")
            .replace(/\._SS\d+_/, "._AC_SL1500_");
}

function downloadImage(imageUrl, dest, maxRedirects = 5) {
  if (maxRedirects <= 0) return Promise.reject(new Error("Too many redirects"));
  return new Promise((resolve, reject) => {
    const url = new URL(imageUrl);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "image/*,*/*;q=0.8",
        Referer: "https://www.amazon.com/",
      },
      timeout: 20000,
    };
    const req = https.get(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const loc = res.headers.location.startsWith("http")
          ? res.headers.location
          : `https://${url.hostname}${res.headers.location}`;
        return downloadImage(loc, dest, maxRedirects - 1).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const ws = fs.createWriteStream(dest);
      res.pipe(ws);
      ws.on("finish", () => { ws.close(); resolve(); });
      ws.on("error", reject);
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function processProduct(id, product) {
  const filename = path.basename(product.image);
  const dest = path.join(OUTPUT_DIR, filename);

  if (fs.existsSync(dest)) {
    const stats = fs.statSync(dest);
    if (stats.size > 5000) {
      return { status: "skip", id, file: filename };
    }
    fs.unlinkSync(dest);
  }

  const asin = extractAsin(product.amazonUrl);
  if (!asin) {
    return { status: "fail", id, file: filename, reason: "No ASIN found" };
  }

  const amazonPageUrl = `https://www.amazon.com/dp/${asin}`;

  try {
    const { html, status } = await fetchPage(amazonPageUrl);

    if (status === 503 || html.includes("api-services-support@amazon.com")) {
      return { status: "fail", id, file: filename, reason: "Amazon bot detection" };
    }

    const imageUrl = extractMainImage(html);
    if (!imageUrl) {
      return { status: "fail", id, file: filename, reason: "No image found in HTML" };
    }

    await downloadImage(imageUrl, dest);

    const stats = fs.statSync(dest);
    if (stats.size < 3000) {
      fs.unlinkSync(dest);
      return { status: "fail", id, file: filename, reason: `Too small: ${stats.size} bytes` };
    }

    return { status: "ok", id, file: filename, size: stats.size };
  } catch (err) {
    if (fs.existsSync(dest)) fs.unlinkSync(dest);
    return { status: "fail", id, file: filename, reason: err.message };
  }
}

async function main() {
  const existing = new Set(fs.readdirSync(OUTPUT_DIR).filter(f => {
    const stat = fs.statSync(path.join(OUTPUT_DIR, f));
    return stat.size > 5000;
  }));

  const missing = Object.entries(allProducts).filter(([id, p]) =>
    !existing.has(path.basename(p.image))
  );

  console.log(`\n=== Product Image Downloader v2 (ASIN-based) ===`);
  console.log(`Total products: ${Object.keys(allProducts).length}`);
  console.log(`Already have: ${existing.size}`);
  console.log(`Need to download: ${missing.length}\n`);

  if (missing.length === 0) {
    console.log("All images present!");
    return;
  }

  let ok = 0, fail = 0;
  const failures = [];
  const successes = [];

  // Process in small batches with delays to avoid rate limiting
  for (let i = 0; i < missing.length; i += 2) {
    const batch = missing.slice(i, i + 2);
    const batchNum = Math.floor(i / 2) + 1;
    const totalBatches = Math.ceil(missing.length / 2);
    console.log(`--- Batch ${batchNum}/${totalBatches} ---`);

    const results = await Promise.all(
      batch.map(([id, product]) => processProduct(id, product))
    );

    for (const result of results) {
      if (result.status === "ok") {
        ok++;
        successes.push(result);
        console.log(`  [OK]   ${result.file} (${(result.size / 1024).toFixed(0)} KB)`);
      } else if (result.status === "skip") {
        console.log(`  [SKIP] ${result.file}`);
      } else {
        fail++;
        failures.push(result);
        console.log(`  [FAIL] ${result.file} — ${result.reason}`);
      }
    }

    // Delay between batches to be respectful
    if (i + 2 < missing.length) await sleep(1500);
  }

  console.log(`\n========================================`);
  console.log(`RESULTS: ${ok} downloaded, ${fail} failed`);
  if (successes.length > 0) {
    console.log(`\nDownloaded (${successes.length}):`);
    successes.forEach(s => console.log(`  + ${s.file}`));
  }
  if (failures.length > 0) {
    console.log(`\nFailed (${failures.length}):`);
    failures.forEach(f => console.log(`  - ${f.file}: ${f.reason}`));
  }
  console.log(`========================================\n`);
}

main().catch(console.error);
