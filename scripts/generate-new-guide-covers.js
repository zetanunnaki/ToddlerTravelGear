const fs = require("fs");
const path = require("path");
const https = require("https");

const API_KEY = process.argv[2];
if (!API_KEY) {
  console.error("Usage: node generate-new-guide-covers.js <API_KEY>");
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
    file: "beach-vacation-toddler.jpg",
    prompt:
      "A stunning lifestyle photo of a young family at a beautiful tropical beach during golden hour. A toddler in a sun hat plays in shallow turquoise water near the shore, with a parent kneeling beside them. A beach tent and colorful beach toys are visible in the soft background. Warm golden sunlight, white sand, palm trees in the distance. The mood is joyful, relaxed, and adventurous — the perfect family beach vacation moment." +
      STYLE_SUFFIX,
  },
  {
    file: "international-travel-toddler.jpg",
    prompt:
      "A professional lifestyle photo of a parent holding a toddler while looking at a large departures board in a bright international airport terminal. The parent has a passport in one hand and the toddler on their hip. A compact stroller and carry-on luggage are beside them. Large windows show airplanes on the tarmac. The mood is confident, prepared, and exciting — a family ready for international adventure." +
      STYLE_SUFFIX,
  },
  {
    file: "theme-park-toddler.jpg",
    prompt:
      "A vibrant lifestyle photo of a happy toddler riding in a stroller through a colorful theme park setting. Whimsical rides and decorations are softly blurred in the background. The toddler is wearing a fun hat and holding a snack cup. A parent pushes the stroller with a backpack hanging on the handles. Bright, cheerful natural lighting with pops of color. The mood is magical, exciting, and fun." +
      STYLE_SUFFIX,
  },
  {
    file: "feeding-toddler-travel.jpg",
    prompt:
      "A warm lifestyle photo of a parent feeding a toddler at a charming outdoor restaurant patio during vacation. The toddler sits in a portable travel high chair attached to the table, eating finger foods from a colorful divided plate. A sippy cup and snack containers are on the table. Warm Mediterranean-style architecture in the soft background. The mood is relaxed, practical, and enjoyable." +
      STYLE_SUFFIX,
  },
  {
    file: "toddler-jet-lag.jpg",
    prompt:
      "A soft, intimate lifestyle photo of a parent comforting a sleepy toddler in a cozy hotel room at dusk. The toddler is in pajamas, being rocked gently. A travel crib is set up nearby with a soft nightlight glowing. Through the hotel window, a city skyline shows it is evening. Warm, dim ambient lighting. The mood is gentle, nurturing, and calm — helping a little one adjust to a new time zone." +
      STYLE_SUFFIX,
  },
  {
    file: "camping-with-toddler.jpg",
    prompt:
      "A stunning outdoor lifestyle photo of a family camping scene with a toddler. A toddler in outdoor clothing sits on a parent's lap by a campfire, roasting marshmallows on a stick. A family tent and pine trees are in the background. Camping gear — lantern, cooler, camp chairs — arranged around the site. Golden evening light filtering through trees. The mood is adventurous, cozy, and connected to nature." +
      STYLE_SUFFIX,
  },
  {
    file: "car-seat-rental-car.jpg",
    prompt:
      "A clean, instructional lifestyle photo of a parent installing a convertible car seat into the back seat of a rental car in an airport parking garage. The parent is focused, threading the seat belt through the car seat. A rental car key fob and paperwork are visible on the front seat. Bright fluorescent garage lighting with clean modern cars around. The mood is competent, focused, and safety-conscious." +
      STYLE_SUFFIX,
  },
  {
    file: "toddler-travel-first-aid.jpg",
    prompt:
      "A beautiful overhead flat lay of a travel first aid kit organized on a cream-colored surface. Neatly arranged items include: children's medicine bottles, adhesive bandages with colorful designs, a digital thermometer, saline spray, sunscreen, hand sanitizer, and a compact zippered pouch. Everything arranged with teal and cream color coordination. Bright, even natural window lighting from above." +
      STYLE_SUFFIX,
  },
  {
    file: "two-under-two-travel.jpg",
    prompt:
      "A warm lifestyle photo of two parents navigating through a bright airport terminal, each carrying one young child. One parent pushes a double stroller loaded with bags while holding a baby in a carrier. The other parent holds a toddler's hand. They look organized and confident despite the complexity. Large terminal windows with natural light. The mood is teamwork, resilience, and family adventure." +
      STYLE_SUFFIX,
  },
  {
    file: "navigating-airports-toddler.jpg",
    prompt:
      "A dynamic lifestyle photo of a parent and toddler at an airport security area. The toddler walks confidently through the terminal holding the parent's hand, with a small child-sized backpack. A folded compact stroller and carry-on bag are on the conveyor belt behind them. The terminal is bright and modern with clear signage. The mood is organized, efficient, and empowering — showing that airport navigation with a toddler is manageable." +
      STYLE_SUFFIX,
  },
  {
    file: "potty-training-travel.jpg",
    prompt:
      "A clean, practical lifestyle photo of a travel potty setup in a hotel bathroom. A portable folding potty seat sits on the hotel toilet, with a toddler step stool below. A small travel bag with potty training supplies (extra clothes, wipes, plastic bags) is open on the bathroom counter. The bathroom is clean and modern with warm lighting. The mood is prepared, practical, and reassuring." +
      STYLE_SUFFIX,
  },
  {
    file: "cruise-with-toddler.jpg",
    prompt:
      "A spectacular lifestyle photo of a parent and toddler on the deck of a cruise ship, looking out at a beautiful turquoise ocean. The toddler sits on the parent's lap in a deck chair, pointing at the water excitedly. The cruise ship railing, teak deck, and a splash of the ship's pool area are visible. Blue sky with white clouds. The mood is luxurious, exciting, and family-friendly — the perfect cruise vacation." +
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
