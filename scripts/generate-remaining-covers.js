const fs = require("fs");
const path = require("path");
const https = require("https");

const API_KEY = process.argv[2];
if (!API_KEY) {
  console.error("Usage: node generate-remaining-covers.js <API_KEY>");
  process.exit(1);
}

const BASE = "https://api.kie.ai";
const OUTPUT_DIR = path.join(__dirname, "..", "public", "images", "covers");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const STYLE_SUFFIX =
  " Ultra high quality, professional editorial lifestyle photography. Color palette: warm cream (#fef9e7) and teal (#0d9488) accents with deep navy (#0f172a) shadows. Soft natural lighting, shallow depth of field, warm and inviting mood. Shot on a full-frame camera, 85mm lens. The image should feel premium, authentic, and trustworthy — like a high-end parenting magazine editorial spread. Photorealistic, no AI artifacts, perfect anatomy and proportions, natural skin tones, realistic textures and materials.";

const covers = [
  {
    file: "travel-bath.jpg",
    prompt:
      "A warm, beautifully styled flat lay of travel bath essentials for a baby arranged on a clean white marble bathroom counter. Items include: travel-size baby shampoo and body wash bottles with teal labels, a soft folded hooded towel in cream, a small yellow rubber duck, a collapsible silicone baby bath basin in teal, and a gentle baby washcloth. Warm bathroom lighting, clean white tiles with cream accents. The arrangement feels curated, organized, and premium — like a product editorial for a parenting magazine." +
      STYLE_SUFFIX,
  },
  {
    file: "hotel-baby-proofing.jpg",
    prompt:
      "A lifestyle photo from the doorway of a modern hotel room, showing a parent kneeling to check an electrical outlet near the floor while placing a safety cover. A toddler (around 20 months) sits safely on the cream-colored bed in the background, playing with a soft toy. The room is clean, well-lit, and welcoming with warm tones. The scene conveys thoroughness and caring." +
      STYLE_SUFFIX,
  },
  {
    file: "toddler-plane-entertainment.jpg",
    prompt:
      "A fun, warm lifestyle photo of a toddler (around 3 years old) on an airplane, excitedly opening a small wrapped surprise from a teal drawstring bag. Stickers, a small drawing pad, and crayons are spread on the airplane tray table. The parent in the adjacent seat watches with a warm smile. Soft cabin lighting with window light. The scene captures a magical 'new toy reveal' moment mid-flight." +
      STYLE_SUFFIX,
  },
  {
    file: "toddler-sleep-vacation.jpg",
    prompt:
      "A serene, moody lifestyle photo of a sleeping toddler (around 2 years old) in a portable toddler travel bed in a darkened vacation rental bedroom. A portable blackout curtain covers the window with just a sliver of golden sunset light at the edges. A compact sound machine with a soft teal glow sits on the nightstand. Navy and cream tones. The scene is deeply peaceful and cozy." +
      STYLE_SUFFIX,
  },
];

function apiRequest(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, BASE);
    const options = {
      method,
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Parse error: ${data}`));
        }
      });
    });
    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function downloadFile(imageUrl, dest) {
  return new Promise((resolve, reject) => {
    const url = new URL(imageUrl);
    const mod = url.protocol === "https:" ? https : require("http");
    mod.get(imageUrl, (res) => {
      if (
        res.statusCode >= 300 &&
        res.statusCode < 400 &&
        res.headers.location
      ) {
        return downloadFile(res.headers.location, dest)
          .then(resolve)
          .catch(reject);
      }
      const ws = fs.createWriteStream(dest);
      res.pipe(ws);
      ws.on("finish", () => {
        ws.close();
        resolve();
      });
      ws.on("error", reject);
    }).on("error", reject);
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function generateImage(cover) {
  const dest = path.join(OUTPUT_DIR, cover.file);
  if (fs.existsSync(dest)) {
    console.log(`[SKIP] ${cover.file} — already exists`);
    return true;
  }

  console.log(`[START] ${cover.file} — submitting to 4o Image API...`);

  const res = await apiRequest("POST", "/api/v1/gpt4o-image/generate", {
    prompt: cover.prompt,
    size: "3:2",
    nVariants: 1,
    isEnhance: true,
    enableFallback: false,
  });

  if (res.code !== 200 || !res.data?.taskId) {
    console.error(`[ERROR] ${cover.file} — submit failed:`, JSON.stringify(res));
    return false;
  }

  const taskId = res.data.taskId;
  console.log(`[TASK] ${cover.file} — taskId: ${taskId}`);

  for (let i = 0; i < 90; i++) {
    await sleep(10000);
    const status = await apiRequest(
      "GET",
      `/api/v1/gpt4o-image/record-info?taskId=${taskId}`
    );

    const flag = status.data?.successFlag;
    if (flag === 1) {
      const urls = status.data?.response?.resultUrls || status.data?.response?.result_urls;
      if (urls && urls.length > 0) {
        console.log(`[DOWNLOAD] ${cover.file} — ${urls[0].substring(0, 80)}...`);
        await downloadFile(urls[0], dest);
        const stats = fs.statSync(dest);
        console.log(`[DONE] ${cover.file} — saved (${(stats.size / 1024).toFixed(0)} KB)`);
        return true;
      } else {
        console.error(
          `[ERROR] ${cover.file} — success but no URL found:`,
          JSON.stringify(status.data?.response || {}).substring(0, 200)
        );
        return false;
      }
    } else if (flag === 2) {
      console.error(
        `[FAILED] ${cover.file} — ${status.data?.errorMessage || "unknown error"}`
      );
      return false;
    } else if (flag === 3) {
      console.error(`[MODERATION] ${cover.file} — blocked by content moderation`);
      return false;
    }

    if (i % 6 === 5) {
      console.log(`[WAIT] ${cover.file} — still processing (${(i + 1) * 10}s)...`);
    }
  }
  console.error(`[TIMEOUT] ${cover.file} — gave up after 15 minutes`);
  return false;
}

async function main() {
  console.log(`Generating ${covers.length} remaining cover images...\n`);
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  const results = await Promise.all(covers.map((c) => generateImage(c)));
  const success = results.filter(Boolean).length;
  const failed = results.length - success;

  console.log("\n========================================");
  console.log(`DONE: ${success} succeeded, ${failed} failed`);
  console.log("========================================\n");

  const files = fs.readdirSync(OUTPUT_DIR);
  console.log(`Total cover images: ${files.length}`);
  files.forEach((f) => {
    const stats = fs.statSync(path.join(OUTPUT_DIR, f));
    console.log(`  ${f} (${(stats.size / 1024).toFixed(0)} KB)`);
  });
}

main().catch(console.error);
