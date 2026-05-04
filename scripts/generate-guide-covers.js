const fs = require("fs");
const path = require("path");
const https = require("https");

const API_KEY = process.argv[2];
if (!API_KEY) {
  console.error("Usage: node generate-guide-covers.js <API_KEY>");
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
    file: "airline-car-seat-rules.jpg",
    prompt:
      "A professional lifestyle photo of a parent confidently carrying a convertible car seat through a bright modern airport terminal, walking toward a gate. The airport has clean lines, large windows with natural golden light. A boarding pass is tucked under their arm. Other families with luggage visible in the soft background. The mood is confident, informed, and prepared." +
      STYLE_SUFFIX,
  },
  {
    file: "toddler-packing-list.jpg",
    prompt:
      "A stunning overhead flat lay of an open suitcase on a cream-colored bed, perfectly organized for a family trip. Neatly folded toddler clothes sorted by age, teal packing cubes, a small pair of toddler shoes, a printed checklist with a pen, sunscreen, a favorite stuffed animal, and snack containers. Everything arranged with intentional color coordination — teal, cream, navy, and soft pastels. Bright, even natural window lighting." +
      STYLE_SUFFIX,
  },
  {
    file: "renting-vs-bringing-gear.jpg",
    prompt:
      "A split-concept lifestyle photo showing a parent at an airport luggage carousel on one side with a compact folded stroller and car seat, and on the other side a clean vacation rental doorstep with rental baby gear (a crib and high chair) neatly set up and waiting. Warm natural lighting, modern interiors, teal accent colors. The mood conveys comparison, decision-making, and smart planning." +
      STYLE_SUFFIX,
  },
  {
    file: "road-trip-survival-guide.jpg",
    prompt:
      "A warm, cinematic lifestyle photo from inside a family SUV looking out through the windshield at a beautiful open highway with rolling green hills. A toddler car seat is visible in the rearview mirror with a happy child. The dashboard has a phone mounted for navigation and a travel mug in the cupholder. Warm golden hour sunlight streams in. The mood is adventurous, optimistic, and free — the perfect family road trip moment." +
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
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      const ws = fs.createWriteStream(dest);
      res.pipe(ws);
      ws.on("finish", () => { ws.close(); resolve(); });
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

  console.log(`[START] ${cover.file} — submitting...`);

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
    const status = await apiRequest("GET", `/api/v1/gpt4o-image/record-info?taskId=${taskId}`);
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
        console.error(`[ERROR] ${cover.file} — success but no URL found:`, JSON.stringify(status.data?.response || {}).substring(0, 200));
        return false;
      }
    } else if (flag === 2) {
      console.error(`[FAILED] ${cover.file} — ${status.data?.errorMessage || "unknown error"}`);
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
  console.log(`Generating ${covers.length} guide cover images...\n`);
  const results = await Promise.all(covers.map((c) => generateImage(c)));
  const success = results.filter(Boolean).length;
  console.log(`\nDONE: ${success}/${covers.length} succeeded`);
}

main().catch(console.error);
