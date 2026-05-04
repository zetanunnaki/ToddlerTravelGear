const fs = require("fs");
const path = require("path");
const https = require("https");

const API_KEY = process.argv[2];
if (!API_KEY) {
  console.error("Usage: node generate-covers.js <API_KEY>");
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
    file: "travel-stroller.jpg",
    prompt:
      "A warm, inviting lifestyle photo of a young parent pushing a lightweight compact travel stroller through a bright modern airport terminal. The toddler (around 2 years old) is sitting happily in the stroller looking around with curiosity. Natural light streams through large terminal windows, casting soft warm tones across the scene. The parent looks confident and relaxed. The scene feels authentic and candid, not posed." +
      STYLE_SUFFIX,
  },
  {
    file: "car-seat-airplane.jpg",
    prompt:
      "A realistic lifestyle photo of a convertible car seat properly installed on an airplane window seat. A happy toddler (around 18 months) is securely buckled in, looking out the window. The airplane cabin is softly lit with natural window light. The parent is visible in the adjacent seat smiling reassuringly. Warm, comforting atmosphere." +
      STYLE_SUFFIX,
  },
  {
    file: "travel-crib.jpg",
    prompt:
      "A cozy lifestyle photo of a portable travel crib (pack and play) set up in a clean, bright hotel room. A sleeping baby (around 10 months) is peacefully napping inside. Soft natural light from a window with sheer curtains, warm cream walls and teal accent pillows on the nearby bed. The scene feels safe, serene, and well-designed." +
      STYLE_SUFFIX,
  },
  {
    file: "travel-high-chair.jpg",
    prompt:
      "A bright, cheerful lifestyle photo of a toddler (around 18 months) sitting in a portable clip-on travel high chair attached to a cafe table, happily eating colorful finger foods. A parent sits nearby smiling. The cafe has warm ambient lighting, exposed brick, and a casual family-friendly atmosphere. Natural sunlight from a nearby window." +
      STYLE_SUFFIX,
  },
  {
    file: "baby-carrier.jpg",
    prompt:
      "A stunning outdoor lifestyle photo of a parent hiking on a scenic forest trail while wearing a structured baby carrier backpack with a happy toddler (around 2 years old) peeking over their shoulder, pointing at something in the trees. Lush green canopy overhead, golden sunlight filtering through leaves, a well-maintained dirt trail ahead. Warm, adventurous mood." +
      STYLE_SUFFIX,
  },
  {
    file: "packing-organizers.jpg",
    prompt:
      "A beautiful top-down flat lay photo of an organized open suitcase on a clean cream-colored bed. Inside: teal and cream packing cubes, neatly rolled baby clothes, a stylish diaper bag, travel-size toiletries, and toddler snacks in small containers. Everything is arranged aesthetically with intentional color coordination in teal, cream, and soft pastels. Bright, even natural lighting." +
      STYLE_SUFFIX,
  },
  {
    file: "stroller-bag.jpg",
    prompt:
      "A lifestyle photo at an airport gate showing a parent preparing a folded stroller with a stroller organizer caddy attached, near the jet bridge entrance. A toddler stands nearby holding a small backpack. Other families visible in the bright modern terminal background. Natural terminal window lighting. Authentic travel moment capturing the gate-check preparation." +
      STYLE_SUFFIX,
  },
  {
    file: "airplane-comfort-entertainment.jpg",
    prompt:
      "A warm lifestyle photo inside an airplane cabin of a toddler (around 2 years old) wearing teal kid-sized headphones, happily coloring on a mess-free water reveal activity pad on the airplane tray table. A parent sits next to them looking relaxed and content. Soft airplane cabin lighting combined with warm window light. The scene radiates calm — a successful flight moment." +
      STYLE_SUFFIX,
  },
  {
    file: "road-trip-gear.jpg",
    prompt:
      "A cheerful lifestyle photo of a family SUV interior ready for a road trip. In the back seat, a toddler (around 2 years old) sits happily in a car seat with a travel tray on their lap. A backseat organizer hangs from the front seat, sun shades cover the windows. The car door is open, revealing a beautiful sunny countryside road outside. Warm, adventurous mood." +
      STYLE_SUFFIX,
  },
  {
    file: "travel-sleep-accessories.jpg",
    prompt:
      "A serene, cozy photo of a dimly lit hotel room prepared for a toddler's bedtime. A portable blackout canopy covers a pack-and-play, a small round white noise machine glows with a soft teal light on the nightstand, and a cream-colored sleep sack is draped over the crib edge. Warm navy and cream tones dominate the scene. The room radiates calm and safety." +
      STYLE_SUFFIX,
  },
  {
    file: "travel-toys-activities.jpg",
    prompt:
      "A bright, inviting flat lay of toddler travel toys and activities arranged on a warm cream surface: a colorful LCD drawing tablet, a water wow activity pad, a sticker book with animal stickers, a magnetic drawing board, washable crayons, and small card games. Everything is colorful and neatly arranged with soft natural shadows. Clean, editorial product photography." +
      STYLE_SUFFIX,
  },
  {
    file: "travel-feeding-bottles.jpg",
    prompt:
      "A warm, intimate lifestyle photo of a parent bottle-feeding a baby (around 8 months) while sitting in an airport terminal waiting area. A portable bottle warmer and neatly organized diaper bag with formula dispenser are visible on the seat beside them. Natural terminal light, other travelers softly blurred in the background. The moment feels peaceful and tender." +
      STYLE_SUFFIX,
  },
  {
    file: "travel-safety-baby-proofing.jpg",
    prompt:
      "A lifestyle photo of a parent's hands carefully applying clear outlet covers in a bright, modern hotel room. A curious toddler (around 18 months) plays safely on a cream-colored rug nearby with a soft toy. Corner protectors are visible on the glass coffee table. The room is clean and well-lit with warm tones. The scene conveys proactive parental care and safety." +
      STYLE_SUFFIX,
  },
  {
    file: "travel-bath.jpg",
    prompt:
      "A warm, gentle lifestyle photo of a happy toddler (around 2 years old) during bath time in a clean hotel bathroom. Travel-size baby wash bottles with teal labels and a small rubber duck sit on the white tub edge. The child splashes gently with joy. Soft warm bathroom lighting, clean white tiles with cream accents. The scene feels safe, fun, and loving." +
      STYLE_SUFFIX,
  },
  {
    file: "flying-toddler-guide.jpg",
    prompt:
      "A wide cinematic lifestyle photo of a young family walking confidently through a bright, modern airport terminal. One parent pushes a compact travel stroller while the toddler (around 2 years old) walks alongside holding a small teal backpack. Natural golden light streams through the terminal's floor-to-ceiling windows. The family looks calm, prepared, and happy. Optimistic, aspirational mood." +
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
        const dest = path.join(OUTPUT_DIR, cover.file);
        console.log(
          `[DOWNLOAD] ${cover.file} — ${urls[0].substring(0, 80)}...`
        );
        await downloadFile(urls[0], dest);
        const stats = fs.statSync(dest);
        console.log(
          `[DONE] ${cover.file} — saved (${(stats.size / 1024).toFixed(0)} KB)`
        );
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
    }

    if (i % 6 === 5) {
      console.log(`[WAIT] ${cover.file} — still processing (${(i + 1) * 10}s)...`);
    }
  }
  console.error(`[TIMEOUT] ${cover.file} — gave up after 15 minutes`);
  return false;
}

async function main() {
  console.log(`Generating ${covers.length} cover images using 4o Image API...\n`);
  console.log(`Output directory: ${OUTPUT_DIR}\n`);

  let totalSuccess = 0;
  let totalFailed = 0;

  for (let i = 0; i < covers.length; i += 3) {
    const batch = covers.slice(i, i + 3);
    const batchNum = Math.floor(i / 3) + 1;
    const totalBatches = Math.ceil(covers.length / 3);
    console.log(
      `\n--- Batch ${batchNum} of ${totalBatches} (${batch.map((c) => c.file).join(", ")}) ---`
    );
    const results = await Promise.all(batch.map((c) => generateImage(c)));
    const success = results.filter(Boolean).length;
    totalSuccess += success;
    totalFailed += results.length - success;
    console.log(`Batch ${batchNum} done: ${success}/${batch.length} succeeded\n`);
  }

  console.log("\n========================================");
  console.log(`ALL DONE: ${totalSuccess} succeeded, ${totalFailed} failed`);
  console.log("========================================\n");

  const files = fs.readdirSync(OUTPUT_DIR);
  console.log(`Cover images in ${OUTPUT_DIR}: ${files.length}`);
  files.forEach((f) => {
    const stats = fs.statSync(path.join(OUTPUT_DIR, f));
    console.log(`  ${f} (${(stats.size / 1024).toFixed(0)} KB)`);
  });
}

main().catch(console.error);
