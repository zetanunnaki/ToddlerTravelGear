import fs from "fs";
import path from "path";
import https from "https";

const API_KEY = process.env.KIE_API_KEY || "a34ec7e113fd3f211e45fc9c44ecaabb";
const API_BASE = "https://api.kie.ai";

const coverImages = [
  {
    filename: "travel-stroller.jpg",
    prompt:
      "Professional product photography style: a lightweight compact travel stroller folded small next to a carry-on suitcase in a bright modern airport terminal. Clean, minimal, aspirational travel lifestyle. Soft natural lighting, shallow depth of field. No text or logos.",
  },
  {
    filename: "car-seat-airplane.jpg",
    prompt:
      "Professional product photography: a toddler car seat properly installed on an airplane window seat, bright cabin interior, clean and safe look. Calm travel atmosphere, soft lighting. No people, no text or logos.",
  },
  {
    filename: "travel-crib.jpg",
    prompt:
      "Professional lifestyle photography: a portable travel crib set up in a clean, bright hotel room next to a window with soft natural light. Cozy and safe sleeping environment for a baby. Minimal decor, calm atmosphere. No people, no text.",
  },
  {
    filename: "stroller-bag.jpg",
    prompt:
      "Professional product photography: a stroller gate-check travel bag leaning against an airport gate wall, with boarding pass and travel items nearby. Clean airport background, bright lighting. No people, no text or logos.",
  },
  {
    filename: "travel-high-chair.jpg",
    prompt:
      "Professional lifestyle photography: a portable folding high chair set up at an outdoor restaurant patio table with a beautiful vacation backdrop. Clean, inviting dining scene. Soft golden hour lighting. No people, no text.",
  },
  {
    filename: "baby-carrier.jpg",
    prompt:
      "Professional lifestyle photography: a soft structured baby carrier laid out next to hiking boots and a trail map on a wooden table, with a mountain landscape visible through a window. Adventure travel mood, warm natural lighting. No people, no text.",
  },
  {
    filename: "packing-organizers.jpg",
    prompt:
      "Professional flat-lay photography: colorful packing cubes and compression bags neatly organized inside an open suitcase, with tiny toddler clothes folded inside. Bright, clean, organized travel aesthetic. Top-down view, soft studio lighting. No text.",
  },
];

const productImages = [
  {
    filename: "gb-pockit.jpg",
    prompt:
      "Professional product photo on white background: GB Pockit Plus ultra-compact travel stroller, folded position showing tiny compact fold size. Clean studio lighting, product photography style. No text or logos.",
  },
  {
    filename: "babyzen-yoyo2.jpg",
    prompt:
      "Professional product photo on white background: BABYZEN YOYO2 compact stroller in unfolded position, showing sleek design and small wheels. Clean studio lighting. No text or logos.",
  },
  {
    filename: "summer-3dlite.jpg",
    prompt:
      "Professional product photo on white background: lightweight umbrella stroller with canopy, similar to Summer Infant 3Dlite convenience stroller. Clean studio lighting. No text.",
  },
  {
    filename: "cosco-scenera.jpg",
    prompt:
      "Professional product photo on white background: lightweight convertible car seat for travel, compact design, gray fabric. Clean studio lighting. No text or logos.",
  },
  {
    filename: "graco-slimfit3.jpg",
    prompt:
      "Professional product photo on white background: slim 3-in-1 convertible car seat, showing forward-facing position with harness. Clean studio lighting. No text.",
  },
  {
    filename: "lotus-crib.jpg",
    prompt:
      "Professional product photo on white background: portable travel crib with side zippered door open, showing mesh sides and compact design. Clean studio lighting. No text.",
  },
  {
    filename: "babybjorn-crib.jpg",
    prompt:
      "Professional product photo on white background: lightweight travel crib with all-mesh sides, simple modern design. Clean studio lighting. No text.",
  },
  {
    filename: "jl-childress-gate-bag.jpg",
    prompt:
      "Professional product photo on white background: large red stroller gate check travel bag, drawstring closure. Clean studio lighting. No text.",
  },
  {
    filename: "ciao-baby-chair.jpg",
    prompt:
      "Professional product photo on white background: portable freestanding baby high chair with tray, camp-chair style fold. Clean studio lighting. No text.",
  },
  {
    filename: "ergobaby-omni.jpg",
    prompt:
      "Professional product photo on white background: ergonomic structured baby carrier with lumbar support, front carry position. Clean studio lighting. No text.",
  },
  {
    filename: "osprey-poco.jpg",
    prompt:
      "Professional product photo on white background: hiking child carrier backpack with sunshade and kickstand, outdoor adventure gear. Clean studio lighting. No text.",
  },
  {
    filename: "eagle-creek-cubes.jpg",
    prompt:
      "Professional product photo on white background: set of three colorful packing cubes with mesh tops, different sizes. Clean studio lighting. No text.",
  },
  {
    filename: "ziploc-space-bags.jpg",
    prompt:
      "Professional product photo on white background: travel compression bags with clothes partially compressed inside, showing space saving. Clean studio lighting. No text.",
  },
];

function apiPost(endpoint, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, API_BASE);
    const data = JSON.stringify(body);
    const req = https.request(
      url,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch {
            reject(new Error(`Parse error: ${body}`));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function apiGet(endpoint, params) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, API_BASE);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const req = https.request(
      url,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${API_KEY}` },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch {
            reject(new Error(`Parse error: ${body}`));
          }
        });
      }
    );
    req.on("error", reject);
    req.end();
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(destPath);
        downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve();
      });
    }).on("error", (err) => {
      fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function generateImage(prompt, aspectRatio = "16:9") {
  console.log(`  Creating task...`);
  const createRes = await apiPost("/api/v1/flux/kontext/generate", {
    prompt,
    aspectRatio,
    model: "flux-kontext-pro",
    outputFormat: "jpeg",
  });

  if (createRes.code !== 200) {
    throw new Error(`Create failed: ${JSON.stringify(createRes)}`);
  }

  const taskId = createRes.data.taskId;
  console.log(`  Task created: ${taskId}`);

  for (let attempt = 0; attempt < 60; attempt++) {
    await sleep(5000);
    const status = await apiGet("/api/v1/flux/kontext/record-info", { taskId });

    if (status.code === 200 && status.data) {
      if (status.data.successFlag === 1) {
        return status.data.response.resultImageUrl;
      }
      if (status.data.successFlag >= 2) {
        throw new Error(`Task failed: ${status.data.errorMessage}`);
      }
    }
    process.stdout.write(".");
  }
  throw new Error("Timeout waiting for image generation");
}

async function main() {
  const allImages = [
    ...coverImages.map((img) => ({
      ...img,
      dir: "public/images/covers",
      aspect: "16:9",
    })),
    ...productImages.map((img) => ({
      ...img,
      dir: "public/images/products",
      aspect: "1:1",
    })),
  ];

  console.log(`Generating ${allImages.length} images via Kie AI...\n`);

  for (const img of allImages) {
    const destPath = path.join(img.dir, img.filename);

    if (fs.existsSync(destPath)) {
      console.log(`SKIP ${destPath} (already exists)`);
      continue;
    }

    console.log(`Generating: ${destPath}`);
    try {
      const imageUrl = await generateImage(img.prompt, img.aspect);
      console.log(`  Downloading...`);
      await downloadFile(imageUrl, destPath);
      console.log(`  Saved: ${destPath}`);
    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
    }

    await sleep(2000);
  }

  console.log("\nDone!");
}

main().catch(console.error);
