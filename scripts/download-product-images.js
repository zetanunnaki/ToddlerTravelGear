const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const OUTPUT_DIR = path.join(__dirname, "..", "public", "images", "products");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const products = [
  // Strollers
  { file: "dream-on-me-aero.jpg", url: "https://www.dreamonme.com/products/baby-gears/strollers/aero-travel-light-stroller/" },
  { file: "ingenuity-3d-mini.jpg", url: "https://www.target.com/p/ingenuity-3d-mini-convenience-stroller/-/A-89097557" },
  { file: "kolcraft-cloud-plus.jpg", url: "https://www.kolcraft.com/product/kolcraft-cloud-plus-stroller/" },
  { file: "jeep-adventureglyde.jpg", url: "https://www.deltachildren.com/products/jeep-adventureglyde-stroller-by-delta-children" },
  { file: "ingenuity-3dquickclose.jpg", url: "https://www.target.com/p/ingenuity-3dquickclose-cs-compact-fold-stroller/-/A-89097558" },
  { file: "baby-trend-expedition.jpg", url: "https://babytrend.com/products/expedition-jogger-1" },
  { file: "mamazing-ultra-air.jpg", url: "https://www.mamazing.com/products/ultra-air-compact-stroller-for-travel" },
  { file: "graco-gomax.jpg", url: "https://www.gracobaby.com/shop/travel-systems/compact-lightweight-travel-systems/gomax-travel-system/SP_4229351.html" },
  { file: "doona-car-seat-stroller.jpg", url: "https://www.doona.com/en-us/car-seat-stroller/collections/doona-nitro-black" },
  // Car Seats
  { file: "graco-snugride-lite.jpg", url: "https://www.gracobaby.com/shop/car-seats/infant-car-seats/snugride-lite-lx-infant-car-seat/SP_281940.html" },
  { file: "graco-4ever-dlx.jpg", url: "https://www.gracobaby.com/shop/car-seats/toddler-car-seats/all-in-one-car-seats/4ever-dlx-4-in-1-car-seat/SP_229437.html" },
  { file: "graco-slimfit.jpg", url: "https://www.gracobaby.com/shop/car-seats/toddler-car-seats/all-in-one-car-seats/slimfit-3-in-1-car-seat/SP_20904.html" },
  { file: "graco-easyturn-360.jpg", url: "https://www.gracobaby.com/shop/car-seats/rotating-car-seats/easyturn-360-2-in-1-rotating-convertible-car-seat/SP_4124066.html" },
  { file: "graco-tranzitions.jpg", url: "https://www.gracobaby.com/shop/car-seats/harness-booster-car-seats/tranzitions-3-in-1-harness-booster/SP_93789.html" },
  { file: "chicco-kidfit.jpg", url: "https://www.chiccousa.com/shop-our-products/car-seats/booster/kidfit-cleartex-plus-2-in-1-belt-positioning-booster-car-seat/79627.html" },
  { file: "chicco-fit360-cleartex.jpg", url: "https://www.chiccousa.com/shop-our-products/car-seats/fit360-cleartex-rotating-convertible-car-seat/87216.html" },
  { file: "britax-one4life-slim.jpg", url: "https://us.britax.com/shop/car-seats/one4life-slim-all-in-one-car-seat" },
  { file: "evenflo-revolve360.jpg", url: "https://www.evenflo.com/products/revolve360-extend-all-in-one-rotating-car-seat-quick-clean-cover" },
  { file: "cosco-scenera-next.jpg", url: "https://www.coscokids.com/scenera-next-convertible-car-seat-cc140-ck-us-en.html" },
  // Cribs & Sleep
  { file: "baby-trend-lil-snooze.jpg", url: "https://babytrend.com/products/lil-snooze-deluxe-iii-nursery-center" },
  { file: "pamo-babe-pack-play.jpg", url: "https://pamobabe.com/products/pamo-babe-portable-playard-sturdy-play-yard-with-mattress-and-toy-bar-with-soft-toys-grey" },
  { file: "dream-on-me-nest.jpg", url: "https://dreamonme.com/products/baby-gears/playpens-playards/nest-portable-playard/" },
  { file: "guava-travel-crib.jpg", url: "https://www.guavafamily.com/products/lotus-everywhere-travel-crib" },
  { file: "delta-mini-crib.jpg", url: "https://www.deltachildren.com/products/portable-crib-dark-cherry" },
  { file: "babybjorn-travel-crib-light.jpg", url: "https://www.babybjorn.com/products/baby-cradle-and-travel-crib/travel-crib-light/" },
  { file: "regalo-my-cot.jpg", url: "https://regalo-baby.com/products/my-cot-blue-portable-toddler-bed" },
  // Carriers
  { file: "infantino-flip-luxe.jpg", url: "https://infantino.com/products/flip-luxe-4-in-1-convertible-carrier-onyx" },
  { file: "boba-wrap.jpg", url: "https://boba.com/products/boba-wrap-grey" },
  { file: "keababies-wrap.jpg", url: "https://keababies.com/products/baby-wrap-carrier" },
  { file: "ergobaby-omni-classic.jpg", url: "https://ergobaby.com/omni-classic-pure-black" },
  { file: "ergobaby-embrace.jpg", url: "https://ergobaby.com/embrace-pure-black" },
  { file: "deuter-kid-comfort.jpg", url: "https://www.deuter.com/us-en/shop/backpacks/p612111-child-carrier-kid-comfort" },
  { file: "hiking-carrier-backpack.jpg", url: "https://www.luvdbaby.com/products/luvdbaby-toddler-carrier-backpack-comfortable-baby-carrier-backpack-toddler-hiking-backpack-carrier-child-carrier-backpack-system-with-nappy-change-pad-insulated-pocket-rain-and-sun-hood" },
  // High Chairs
  { file: "inglesina-fast.jpg", url: "https://inglesina.us/products/fast-table-chair" },
  { file: "chicco-caddy.jpg", url: "https://www.chiccousa.com/shop-our-products/high-chairs-and-boosters/hook-ons-and-travel-seats/caddy-portable-hook-on-chair/87094.html" },
  { file: "philandteds-lobster.jpg", url: "https://philandteds.com/products/lobster-portable-high-chair" },
  { file: "hiccapop-omniboost.jpg", url: "https://www.hiccapop.com/products/hiccapop-omniboost-travel-booster-seat" },
  { file: "oxo-tot-nest.jpg", url: "https://www.oxo.com/nest-booster-seats-with-removable-cushions.html" },
  { file: "bright-starts-pop-n-sit.jpg", url: "https://www.target.com/p/bright-starts-pop-n-sit-portable-booster-seat-teal/-/A-91007907" },
  // Packing & Organization
  { file: "amazon-essentials-cubes.jpg", url: "https://www.target.com/s?searchTerm=packing+cubes+4+piece+set" },
  { file: "veken-compression-cubes.jpg", url: "https://vekenusa.com/packing-cubes/" },
  { file: "travelon-mesh-pouches.jpg", url: "https://www.travelonbags.com/mesh-pouch-set-of-4" },
  { file: "camtop-toddler-backpack.jpg", url: "https://www.target.com/s?searchTerm=camtop+toddler+backpack" },
  { file: "disney-cars-luggage.jpg", url: "https://www.shopdisney.com/characters/pixar/lightning-mcqueen/" },
  { file: "rosegin-diaper-bag.jpg", url: "https://www.target.com/s?searchTerm=rosegin+diaper+bag+backpack" },
  { file: "mancro-diaper-bag.jpg", url: "https://www.target.com/s?searchTerm=mancro+diaper+bag" },
  { file: "yopcdj-organizer-pouch.jpg", url: "https://www.target.com/s?searchTerm=diaper+bag+organizer+pouch+set+clear" },
  { file: "kopi-baby-changing-pad.jpg", url: "https://kopibaby.com/products/portable-diaper-changing-pad-portable-changing-pad-for-newborn-girl-boy-baby-changing-pad-with-smart-wipes-pocket-waterproof-travel-changing-kit-baby-gift-by-kopi-baby-black-arrow" },
  { file: "peekapoo-changing-pads.jpg", url: "https://peekapookids.com/products/peekapoo-disposable-changing-pad-liners" },
  // Travel Toys
  { file: "flueston-lcd-tablet.jpg", url: "https://www.flueston.com/product/b07thcfjmz/" },
  { file: "kikidex-drawing-board.jpg", url: "https://kikidex.com/products/kikidex-magnetic-drawing-board-toddler-toys" },
  { file: "crayola-bluey-color-wonder.jpg", url: "https://www.crayola.com/products/color-wonder/color-wonder-mess-free-bluey-coloring-set-752805" },
  { file: "melissa-doug-water-wow.jpg", url: "https://www.melissaanddoug.com/products/water-wow-animals-on-the-go-travel-activity" },
  { file: "melissa-doug-water-wow-sea.jpg", url: "https://www.melissaanddoug.com/products/water-wow-under-the-sea-water-reveal-pad-on-the-go-travel-activity" },
  { file: "cupkin-sticker-book.jpg", url: "https://www.cupkin.com/products/animal-habitats-sticker-book" },
  { file: "hahaland-busy-book.jpg", url: "https://hahaland.com/products/montessori-farm-busy-book-for-toddlers-1-3" },
  { file: "busy-board-led.jpg", url: "https://www.target.com/s?searchTerm=busy+board+led+light+switches+montessori" },
  { file: "taco-cat-goat.jpg", url: "https://dolphinhat.com/product/taco-cat-goat-cheese-pizza/" },
  { file: "regal-games-cards.jpg", url: "https://www.target.com/s?searchTerm=regal+games+kids+card+games" },
  { file: "magna-tiles-micromags.jpg", url: "https://magnatiles.com/products/micromags-travel-set" },
  // Bath & Hygiene
  { file: "honest-shampoo-body-wash.jpg", url: "https://www.honest.com/baby-shampoo-and-body-wash/two-in-one-shampoo-and-body-wash.html" },
  { file: "honest-mini-must-haves.jpg", url: "https://www.honest.com/babes-mini-must-haves-gift-set/H0890EGLV200R.html" },
  { file: "cerave-baby-wash.jpg", url: "https://www.cerave.com/skincare/baby/baby-wash-shampoo" },
  { file: "cetaphil-baby-wash.jpg", url: "https://www.cetaphil.com/us/products/product-categories/baby-skincare/baby-wash-and-shampoo/302993936077.html" },
  { file: "lictin-grooming-kit.jpg", url: "https://lictincare.com/products/lictin-baby-healthcare-and-grooming-kit-26-in-1-rechargeable-nail-trimmer-electric-set-safe-file-with-auto-light-newborn-nursery-health-care-portable-safety-set-for-infant-toddlers-boys-girls-grey" },
  { file: "dr-browns-toothbrush.jpg", url: "https://drbrownsbaby.com/products/infant-to-toddler-toothbrushes-4-pack-blue" },
  { file: "dr-browns-glass-bottle.jpg", url: "https://drbrownsbaby.com/products/dr-browns-natural-flow-anti-colic-options-glass-baby-bottle-8oz-250ml" },
  { file: "dr-browns-travel-bowl.jpg", url: "https://www.drbrownsbaby.com/product/dr-browns-travel-fresh-bowl-and-spoon-1-pack/" },
  { file: "kids-toothbrush-4pack.jpg", url: "https://trueocity.com/products/copy-of-trueocity-baby-toddler-toothbrush-4-pack" },
  { file: "huggies-simply-clean.jpg", url: "https://www.huggies.com/en-us/wipes/simply-clean" },
  { file: "impossibly-compact-wipes.jpg", url: "https://mineewipes.com/" },
  { file: "baby-bum-sunscreen.jpg", url: "https://www.sunbum.com/products/baby-bum-spf-50-mineral-sunscreen-lotion-fragrance-free-3-oz" },
  { file: "frida-baby-potty-seat.jpg", url: "https://frida.com/products/potty-topper" },
  // Road Trip Gear
  { file: "hiccapop-uberboost.jpg", url: "https://www.hiccapop.com/products/uberboost-inflatable-booster-car-seat" },
  { file: "wayb-pico.jpg", url: "https://wayb.com/products/pico-car-seat" },
  { file: "helteko-organizer.jpg", url: "https://helteko.com/products/car-seat-organizer-for-backseat-black" },
  { file: "pillani-travel-tray.jpg", url: "https://pill-ani.com/products/pillani-kids-travel-tray-for-car-car-seat-tray-for-kids-travel-car-trays-for-kids-roadtrip-essentials-car-seat-table-tray-for-kids-road-trip-activities-toddler-lap-desk-organizer-for-carseat" },
  { file: "munchkin-carseat-tray.jpg", url: "https://www.munchkin.com/gear-travel/car-accessories" },
  { file: "enovoe-window-shades.jpg", url: "https://www.target.com/s?searchTerm=enovoe+car+window+shades+baby" },
  { file: "munchkin-brica-sun-shade.jpg", url: "https://www.munchkin.com/gear-travel/car-accessories" },
  { file: "noot-kids-headphones.jpg", url: "https://www.target.com/s?searchTerm=noot+k11+kids+headphones" },
  // Airplane Comfort & Entertainment
  { file: "kidrox-headphones.jpg", url: "https://www.target.com/s?searchTerm=kidrox+toddler+headphones" },
  { file: "alpine-muffy-baby.jpg", url: "https://www.alpinehearingprotection.com/earmuffs/muffy-baby/" },
  { file: "procase-earmuffs.jpg", url: "https://www.target.com/s?searchTerm=procase+noise+cancelling+kids+earmuffs" },
  { file: "cozyphones-kids-headphones.jpg", url: "https://cozyphones.com/products/kids-headphones" },
  { file: "lusso-gear-tray-cover.jpg", url: "https://www.lussogear.com/products/airplane-tray-table-cover" },
  { file: "bluey-aqua-art.jpg", url: "https://www.target.com/s?searchTerm=bluey+aqua+art+water+reveal" },
  { file: "tekfun-lcd-tablet.jpg", url: "https://www.target.com/s?searchTerm=tekfun+lcd+writing+tablet+kids" },
  { file: "gojmzo-busy-board.jpg", url: "https://www.target.com/s?searchTerm=gojmzo+busy+board+montessori" },
  { file: "cares-harness.jpg", url: "https://kidsflysafe.com/products/cares-airplane-safety-harness" },
  { file: "saireider-neck-pillow.jpg", url: "https://www.target.com/s?searchTerm=saireider+kids+travel+neck+pillow" },
  // Travel Sleep
  { file: "hatch-go-sound-machine.jpg", url: "https://www.hatchwellness.com/hatch-go" },
  { file: "dreamegg-noise-machine.jpg", url: "https://dreamegg.com/products/dreamegg-d11-pro-portable-sound-machine" },
  { file: "portable-sound-machine-clip.jpg", url: "https://www.target.com/s?searchTerm=portable+baby+sound+machine+clip" },
  { file: "slumberpod-tent.jpg", url: "https://www.slumberpod.com/products/slumberpod" },
  { file: "hiccapop-daydreamer.jpg", url: "https://www.hiccapop.com/products/hiccapop-daydreamer-blackout-tent" },
  { file: "amazon-basics-blackout.jpg", url: "https://www.target.com/s?searchTerm=portable+blackout+curtain+suction+cup" },
  { file: "toddler-travel-bed-sandwich.jpg", url: "https://www.target.com/s?searchTerm=toddler+travel+bed+sandwich+foldable" },
  { file: "hiccapop-bed-rail.jpg", url: "https://www.hiccapop.com/products/hiccapop-inflatable-bed-rail" },
  { file: "yoofoss-sleep-sack.jpg", url: "https://yoofoss.com/products/yoofoss-baby-sleep-sack" },
  { file: "halo-transition-sleepsack.jpg", url: "https://www.halosleep.com/easy-transition-sleepsack-wearable-blanket" },
  // Safety & Baby Proofing
  { file: "clear-outlet-covers.jpg", url: "https://www.target.com/s?searchTerm=clear+outlet+covers+50+pack+baby+safety" },
  { file: "power-gear-outlet-covers.jpg", url: "https://www.target.com/s?searchTerm=power+gear+child+safety+outlet+covers" },
  { file: "vmaisi-magnetic-locks.jpg", url: "https://www.target.com/s?searchTerm=vmaisi+magnetic+cabinet+locks" },
  { file: "inaya-proofing-kit.jpg", url: "https://www.target.com/s?searchTerm=inaya+baby+proofing+kit" },
  { file: "skyla-homes-locks.jpg", url: "https://www.target.com/s?searchTerm=skyla+homes+baby+locks" },
  { file: "corner-protector-clear.jpg", url: "https://www.target.com/s?searchTerm=corner+protector+baby+12+pack+clear" },
  { file: "corner-protectors-patented.jpg", url: "https://www.target.com/s?searchTerm=corner+protectors+patented+12+pack" },
  { file: "door-knob-cover.jpg", url: "https://www.target.com/s?searchTerm=child+safety+door+knob+cover+4+pack" },
  { file: "huglock-door-lock.jpg", url: "https://www.target.com/s?searchTerm=huglock+snap+on+door+lock" },
  { file: "regalo-baby-gate.jpg", url: "https://regalo-baby.com/products/easy-step-walk-thru-baby-gate" },
  // Feeding & Bottles
  { file: "termichy-formula-dispenser.jpg", url: "https://www.target.com/s?searchTerm=termichy+formula+dispenser" },
  { file: "munchkin-formula-dispenser.jpg", url: "https://www.munchkin.com/feeding/formula-and-food-prep" },
  { file: "momcozy-bottle-warmer.jpg", url: "https://momcozy.com/products/momcozy-portable-bottle-warmer" },
  { file: "lansinoh-bottles.jpg", url: "https://lansinoh.com/products/baby-bottles" },
  { file: "lansinoh-storage-bags.jpg", url: "https://lansinoh.com/products/breastmilk-storage-bags" },
  { file: "momcozy-milk-cooler.jpg", url: "https://momcozy.com/products/momcozy-breastmilk-cooler-bag" },
  { file: "munchkin-miracle-360.jpg", url: "https://www.munchkin.com/feeding/cups-and-bottles" },
  { file: "nuk-active-sippy-cars.jpg", url: "https://www.nuk-usa.com/products/disney-active-sippy-cup" },
  // Stroller Accessories
  { file: "momcozy-stroller-organizer.jpg", url: "https://momcozy.com/products/momcozy-universal-stroller-organizer" },
  { file: "accmor-stroller-organizer.jpg", url: "https://www.target.com/s?searchTerm=accmor+stroller+organizer" },
  { file: "topdesign-stroller-organizer.jpg", url: "https://www.target.com/s?searchTerm=topdesign+stroller+organizer" },
  { file: "guiseapue-stroller-organizer.jpg", url: "https://www.target.com/s?searchTerm=guiseapue+stroller+organizer" },
  { file: "jl-childress-cargo-net.jpg", url: "https://www.jlchildress.com/collections/stroller-accessories" },
  { file: "volkgo-stroller-bag.jpg", url: "https://www.target.com/s?searchTerm=volkgo+stroller+bag+airplane" },
  { file: "jl-childress-padded-bag.jpg", url: "https://www.jlchildress.com/collections/travel-bags" },
  { file: "jl-childress-gate-check-bag.jpg", url: "https://www.jlchildress.com/collections/travel-bags" },
  { file: "bramble-gate-check-bag.jpg", url: "https://www.target.com/s?searchTerm=bramble+gate+check+stroller+bag" },
  { file: "munchkin-brica-car-seat-bag.jpg", url: "https://www.munchkin.com/gear-travel/car-accessories" },
];

function fetchPage(pageUrl) {
  return new Promise((resolve, reject) => {
    const url = new URL(pageUrl);
    const mod = url.protocol === "https:" ? https : http;
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
    };
    mod.get(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const loc = res.headers.location.startsWith("http")
          ? res.headers.location
          : `${url.protocol}//${url.hostname}${res.headers.location}`;
        return fetchPage(loc).then(resolve).catch(reject);
      }
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

function extractOgImage(html, baseUrl) {
  // Try og:image first
  let match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
  if (!match) match = html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (match) return match[1];

  // Try twitter:image
  match = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
  if (!match) match = html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
  if (match) return match[1];

  // Try first product image
  match = html.match(/<img[^>]+src=["'](https?:\/\/[^"']+(?:product|hero|main|featured)[^"']*)["']/i);
  if (match) return match[1];

  // Try any large image in srcset or data-src
  match = html.match(/data-src=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/i);
  if (match) return match[1];

  // Try first significant image
  match = html.match(/<img[^>]+src=["'](https?:\/\/cdn[^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/i);
  if (match) return match[1];

  return null;
}

function downloadImage(imageUrl, dest) {
  return new Promise((resolve, reject) => {
    const url = new URL(imageUrl);
    const mod = url.protocol === "https:" ? https : http;
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "image/*,*/*;q=0.8",
      },
    };
    mod.get(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const loc = res.headers.location.startsWith("http")
          ? res.headers.location
          : `${url.protocol}//${url.hostname}${res.headers.location}`;
        return downloadImage(loc, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
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

async function processProduct(product) {
  const dest = path.join(OUTPUT_DIR, product.file);
  if (fs.existsSync(dest)) {
    const stats = fs.statSync(dest);
    if (stats.size > 1000) {
      console.log(`[SKIP] ${product.file} — already exists (${(stats.size / 1024).toFixed(0)} KB)`);
      return true;
    }
  }

  try {
    console.log(`[FETCH] ${product.file} — ${product.url.substring(0, 60)}...`);
    const html = await fetchPage(product.url);
    const imageUrl = extractOgImage(html, product.url);

    if (!imageUrl) {
      console.error(`[NO-IMAGE] ${product.file} — no og:image found on page`);
      return false;
    }

    const fullUrl = imageUrl.startsWith("//") ? "https:" + imageUrl : imageUrl;
    console.log(`[DOWNLOAD] ${product.file} — ${fullUrl.substring(0, 70)}...`);
    await downloadImage(fullUrl, dest);

    const stats = fs.statSync(dest);
    if (stats.size < 1000) {
      fs.unlinkSync(dest);
      console.error(`[TOO-SMALL] ${product.file} — downloaded file too small, removed`);
      return false;
    }

    console.log(`[DONE] ${product.file} — ${(stats.size / 1024).toFixed(0)} KB`);
    return true;
  } catch (err) {
    console.error(`[ERROR] ${product.file} — ${err.message}`);
    return false;
  }
}

async function main() {
  console.log(`Downloading ${products.length} product images from manufacturer websites...\n`);

  let success = 0;
  let failed = 0;
  const failures = [];

  // Process in batches of 5 to avoid overwhelming
  for (let i = 0; i < products.length; i += 5) {
    const batch = products.slice(i, i + 5);
    const results = await Promise.all(batch.map((p) => processProduct(p)));
    results.forEach((ok, idx) => {
      if (ok) success++;
      else { failed++; failures.push(batch[idx].file); }
    });
    if (i + 5 < products.length) await sleep(1000);
  }

  console.log(`\n========================================`);
  console.log(`DONE: ${success} succeeded, ${failed} failed out of ${products.length}`);
  if (failures.length > 0) {
    console.log(`\nFailed images:`);
    failures.forEach((f) => console.log(`  - ${f}`));
  }
  console.log(`========================================\n`);
}

main().catch(console.error);
