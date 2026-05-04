const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const OUTPUT_DIR = path.join(__dirname, "..", "public", "images", "products");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Manufacturer + retailer URLs (NO Amazon). Priority: manufacturer first, Walmart/Target fallback.
const products = [
  // STROLLERS
  { file: "dream-on-me-aero.jpg", urls: ["https://www.dreamonme.com/products/baby-gears/strollers/aero-travel-light-stroller/", "https://www.walmart.com/ip/Dream-On-Me-Aero-Travel-Light-Stroller-Gray/9246350512"] },
  { file: "ingenuity-3d-mini.jpg", urls: ["https://www.walmart.com/ip/Ingenuity-3D-Mini-Convenience-Stroller-Cashew-Tan-Toddler/12848414939"] },
  { file: "kolcraft-cloud-plus.jpg", urls: ["https://www.kolcraft.com/product/kolcraft-cloud-plus-stroller/", "https://www.walmart.com/ip/Kolcraft-Cloud-Plus-Lightweight-Stroller-Slate/47507783"] },
  { file: "ingenuity-3dquickclose.jpg", urls: ["https://www.walmart.com/ip/Ingenuity-3Dquickclose-CS-Compact-Fold-Infant-Baby-Stroller-Black/813440570"] },
  { file: "graco-gomax.jpg", urls: ["https://www.walmart.com/ip/Graco-GoMax-Travel-System-Ace-1-Count/15777104040"] },
  { file: "doona-car-seat-stroller.jpg", urls: ["https://www.doona.com/en-us/car-seat-stroller/collections/doona-nitro-black", "https://www.target.com/p/doona-car-seat-stroller/-/A-87530473"] },
  // CAR SEATS
  { file: "graco-snugride-lite.jpg", urls: ["https://www.walmart.com/ip/Graco-SnugRide-Lite-LX-Infant-Car-Seat-Studio-1-Count/10757913624"] },
  { file: "graco-4ever-dlx.jpg", urls: ["https://www.walmart.com/ip/Graco-4Ever-DLX-4-in-1-Convertible-Car-Seat-Fairmont/424357148"] },
  { file: "graco-slimfit.jpg", urls: ["https://www.walmart.com/ip/Graco-SlimFit-3-in-1-Convertible-Car-Seat-Saves-Space-in-Your-Back-Seat-Darcie/55047790"] },
  { file: "graco-easyturn-360.jpg", urls: ["https://www.walmart.com/ip/Graco-EasyTurn-360-2-in-1-Convertible-Car-Seat-Solae/12513671791"] },
  { file: "graco-tranzitions.jpg", urls: ["https://www.walmart.com/ip/Graco-Tranzitions-3-in-1-Forward-Facing-Harness-Booster-Car-Seat-Proof-15-1-lbs/5069256284"] },
  // CRIBS
  { file: "dream-on-me-nest.jpg", urls: ["https://dreamonme.com/products/baby-gears/playpens-playards/nest-portable-playard/", "https://www.walmart.com/ip/Dream-On-Me-Nest-Portable-Play-Yard-with-Carry-Bag-and-Shoulder-Strap-Black/878074455"] },
  // PACKING
  { file: "amazon-essentials-cubes.jpg", urls: ["https://www.walmart.com/ip/Packing-Cubes-4-Set-Travel-Luggage-Organizer-Storage-Bags-Large-Medium-Small-Slim/762574568"] },
  { file: "veken-compression-cubes.jpg", urls: ["https://vekenusa.com/packing-cubes/", "https://www.walmart.com/ip/Veken-8-Set-Packing-Cubes-Travel-Essentials-Suitcase-Organizer-Bags-Set-Luggage-Road-Trip-Travel-Accessories-4-Sizes-Extra-Large-Large-Medium-Small-B/15651706483"] },
  { file: "travelon-mesh-pouches.jpg", urls: ["https://www.travelonbags.com/mesh-pouch-set-of-4", "https://www.walmart.com/ip/Travelon-Set-of-4-Soft-Packing-Organizers-Black/728351738"] },
  { file: "camtop-toddler-backpack.jpg", urls: ["https://www.walmart.com/ip/CAMTOP-Toddler-Backpack-for-Boys-Girls-12-Kids-Backpack-Preschool-Kindergarten-2-4-Dinosaur-Black/2474073816"] },
  { file: "disney-cars-luggage.jpg", urls: ["https://www.walmart.com/ip/Disney-Pixar-Cars-Kids-Rolling-Lightning-McQueen-Carry-on-Luggage/326087085"] },
  { file: "rosegin-diaper-bag.jpg", urls: ["https://www.walmart.com/ip/ROSEGIN-Diaper-Bag-Backpack-Large-Capacity-Baby-Bag-Travel-Essentials-Baby-Stuff-Waterproof-Black/2578340671"] },
  { file: "mancro-diaper-bag.jpg", urls: ["https://www.walmart.com/ip/Mancro-Diaper-Bag-Backpack-Waterproof-Travel-Backpack-with-Stroller-Straps-and-2-Side-Insulated-Pockets-Black/16684620500"] },
  { file: "yopcdj-organizer-pouch.jpg", urls: ["https://www.walmart.com/ip/5PCS-Diaper-Bag-Organizer-Pouch-Set-TSA-Approved-Clear-Waterproof-TPU-Travel-Pouches/3750994612"] },
  { file: "peekapoo-changing-pads.jpg", urls: ["https://peekapookids.com/products/peekapoo-disposable-changing-pad-liners", "https://www.walmart.com/ip/Peekapoo-Disposable-Changing-Pad-Liners-50-Pack-Super-Soft-Ultra-Absorbent-Waterproof-Covers-Any-Surface-for-Mess-Free-Baby-Diaper-Changes/242076814"] },
  // CARRIERS
  { file: "boba-wrap.jpg", urls: ["https://boba.com/products/boba-wrap-grey", "https://www.walmart.com/ip/Boba-Wrap-Baby-Carrier-Black-Newborn-Babies-to-Children-7lbs-35lbs/193296630"] },
  { file: "ergobaby-omni-classic.jpg", urls: ["https://ergobaby.com/omni-classic-pure-black", "https://www.walmart.com/ip/Ergobaby-OMNI-360-All-in-One-Ergonomic-Baby-Carrier-Black/944588284"] },
  { file: "ergobaby-embrace.jpg", urls: ["https://ergobaby.com/embrace-pure-black", "https://www.walmart.com/ip/Ergobaby-Embrace-Baby-Carrier-Pure-Black/728925264"] },
  { file: "deuter-kid-comfort.jpg", urls: ["https://www.deuter.com/us-en/shop/backpacks/p612111-child-carrier-kid-comfort", "https://www.walmart.com/ip/Deuter-Kid-Comfort-Child-Carrier-Backpack/627270396"] },
  // HIGH CHAIRS
  { file: "oxo-tot-nest.jpg", urls: ["https://www.oxo.com/nest-booster-seats-with-removable-cushions.html", "https://www.walmart.com/ip/OXO-Tot-Toddler-Nest-Booster-Seat-With-Removable-Cushion-Taupe/485946204"] },
  { file: "bright-starts-pop-n-sit.jpg", urls: ["https://www.walmart.com/ip/Bright-Starts-Pop-N-Sit-Portable-Booster-Teal-Infant-to-Toddler/12829973587"] },
  // TOYS
  { file: "flueston-lcd-tablet.jpg", urls: ["https://www.walmart.com/ip/FLUESTON-LCD-Writing-Tablet-Doodle-Board-Toys-Gifts-3-8-Year-Old-Girls-Boys-10-Inch-Colorful-Electronic-Board-Drawing-Pad-Kids-Gifts-Toddler-Educatio/16490316400"] },
  { file: "crayola-bluey-color-wonder.jpg", urls: ["https://www.crayola.com/products/color-wonder/color-wonder-mess-free-bluey-coloring-set-752805", "https://www.walmart.com/ip/Crayola-Color-Wonder-Mess-Free-Bluey-Coloring-Set-18-Pgs-Mess-Free-Coloring-Beginner-Unisex-Child/883658048"] },
  { file: "busy-board-led.jpg", urls: ["https://www.walmart.com/ip/Busy-Board-LED-Light-Montessori-Learning-Toys-Toggle-Switch-Sensory-Toys-Toddlers-Boys-Ages-1-2-3-Years-Old-Travel-Toys-Toddler-Activities-1-2-3-4-Ye/3646794774"] },
  { file: "regal-games-cards.jpg", urls: ["https://www.walmart.com/ip/Regal-Games-Kids-Classic-Card-Games-6-Game-Set-Old-Maid-Go-Fish-SlapJack-War-Crazy-8-s-Memory-for-Fun-Learning-Activities/405233126"] },
  { file: "bluey-aqua-art.jpg", urls: ["https://www.walmart.com/ip/Bluey-Aqua-Art-Reusable-water-reveal-activity-pages-water-pen-no-mess-drawing-coloring-Water-pen-reusable-Bluey-Aqua-Art-activity-sheets-drawing-colo/13313619899"] },
  // BATH & HYGIENE
  { file: "cerave-baby-wash.jpg", urls: ["https://www.cerave.com/skincare/baby/baby-wash-shampoo", "https://www.walmart.com/ip/CeraVe-Baby-Wash-Shampoo-8-fl-oz/35497271"] },
  { file: "cetaphil-baby-wash.jpg", urls: ["https://www.cetaphil.com/us/products/product-categories/baby-skincare/baby-wash-and-shampoo/302993936077.html", "https://www.walmart.com/ip/Cetaphil-Baby-Wash-Shampoo-with-Organic-Calendula-Tear-Free-Paraben-13-5-oz/194650911"] },
  { file: "honest-mini-must-haves.jpg", urls: ["https://www.honest.com/babes-mini-must-haves-gift-set/H0890EGLV200R.html", "https://www.walmart.com/ip/The-Honest-Company-Babe-s-Mini-Must-Haves/15764923057"] },
  { file: "huggies-simply-clean.jpg", urls: ["https://www.huggies.com/en-us/wipes/simply-clean", "https://www.walmart.com/ip/Huggies-Simply-Clean-Unscented-Baby-Wipes-6-Flip-Top-Packs-384-Wipes-Total/145675427"] },
  { file: "impossibly-compact-wipes.jpg", urls: ["https://www.walmart.com/ip/Impossibly-Compact-Travel-Flushable-Wipes-Natural-Extracts-Skin-Friendly-Wet-Wipes-Hypoallergenic-Unscented-Travel-Size-Butt-Wipes-Adults-Kids-Baby-C/16327867949"] },
  // ROAD TRIP
  { file: "munchkin-carseat-tray.jpg", urls: ["https://www.walmart.com/ip/Munchkin-Car-Seat-Toddler-Travel-Snack-Tray-Mess-Free-Gray-Unisex/6436604166"] },
  { file: "enovoe-window-shades.jpg", urls: ["https://www.walmart.com/ip/Enovoe-19-x12-Windows-4-Shade-Rays-Shades-Side-Cling-Pack-Protection-Child-Window-UV-Sun-For-Baby-Sun-Sunshade-Glare-Car-And-By-Your/698092357"] },
  { file: "munchkin-brica-sun-shade.jpg", urls: ["https://www.walmart.com/ip/Munchkin-Brica-White-Hot-Sun-Safety-Car-Window-Baby-Roller-Shade-Black-Unisex-2-Pack/182128352"] },
  { file: "noot-kids-headphones.jpg", urls: ["https://www.walmart.com/ip/Kids-Headphones-noot-products-K11-Foldable-Stereo-Tangle-Free-3-5mm-Jack-Wired-Cord-On-Ear-Headset-for-Children-Navy-Teal/657476997"] },
  // SOUND & SLEEP
  { file: "hatch-go-sound-machine.jpg", urls: ["https://www.hatchwellness.com/hatch-go", "https://www.walmart.com/ip/Hatch-Rest-Go-Portable-Sound-Machine-for-Babies-and-Kids-Baby-Sleep-Soother-with-10-Soothing-Sounds/3104780923"] },
  { file: "dreamegg-noise-machine.jpg", urls: ["https://dreamegg.com/products/dreamegg-d11-pro-portable-sound-machine", "https://www.walmart.com/ip/Dreamegg-Sleep-Lite-D11-Portable-White-Noise-Machine-Baby-Sleeping-Night-Light-Lullaby-Nature-Sounds-Child-Lock-USB-Rechargeable-Travel-Nursery/7696308459"] },
  { file: "portable-sound-machine-clip.jpg", urls: ["https://www.walmart.com/ip/Portable-Baby-White-Noise-Machine-Clip-On-Sound-Machine-Stroller-12-Soothing-Sounds/2349715046"] },
  { file: "hiccapop-daydreamer.jpg", urls: ["https://www.hiccapop.com/products/hiccapop-daydreamer-blackout-tent", "https://www.walmart.com/ip/hiccapop-DayDreamer-Portable-Blackout-Canopy-Cover-Tent-for-Pack-and-Play-HPR-DDT-BK/14697355675"] },
  { file: "amazon-basics-blackout.jpg", urls: ["https://www.walmart.com/ip/Portable-Blackout-Curtain-Shade-Suction-Cups-Baby-Travel-Window-Cover/2985479611"] },
  { file: "toddler-travel-bed-sandwich.jpg", urls: ["https://www.walmart.com/ip/Toddler-Travel-Bed-Foldable-Portable-Floor-Mattress-Kids-Camping-Nap-Mat-with-Washable-Cover/3825994012"] },
  { file: "hiccapop-bed-rail.jpg", urls: ["https://www.hiccapop.com/products/hiccapop-inflatable-bed-rail", "https://www.walmart.com/ip/hiccapop-Inflatable-Bed-Rail-for-Toddlers-with-Non-Slip-Machine-Washable-Cover-2-Pack-HPR-IBB2/14662609906"] },
  { file: "yoofoss-sleep-sack.jpg", urls: ["https://yoofoss.com/products/yoofoss-baby-sleep-sack", "https://www.walmart.com/ip/Yoofoss-Baby-Sleep-Sack-0-6-Months-Boy-Girls-100-Cotton-Baby-Blanket-with-2-way-Zipper-3-Packs/1267471447"] },
  { file: "halo-transition-sleepsack.jpg", urls: ["https://www.halosleep.com/easy-transition-sleepsack-wearable-blanket", "https://www.walmart.com/ip/HALO-Easy-Transition-SleepSack-Wearable-Blanket-100-Cotton-Gray-Heather-Small/200076003"] },
  // SAFETY
  { file: "clear-outlet-covers.jpg", urls: ["https://www.walmart.com/ip/Outlet-Covers-Baby-Proofing-50-Pack-Safe-Secure-Electric-Plug-Protectors-Sturdy-Childproof-Socket-For-Home-Office-Easy-Installation-Protect-Toddlers/2007838361"] },
  { file: "power-gear-outlet-covers.jpg", urls: ["https://www.walmart.com/ip/GE-Safety-Outlet-Covers-30pk-51175/16561524"] },
  { file: "vmaisi-magnetic-locks.jpg", urls: ["https://www.walmart.com/ip/cabinet-locks-child-safety-latches-20-pack-vmaisi-baby-proofing-cabinets-drawers-lock-upgraded-stronger-adhesive-easy-installation-no-drilling/683308606"] },
  { file: "inaya-proofing-kit.jpg", urls: ["https://www.walmart.com/ip/Inaya-Baby-Proofing-Kit-Cabinet-Locks-Corner-Guards-Outlet-Covers/2831469826"] },
  { file: "skyla-homes-locks.jpg", urls: ["https://www.walmart.com/ip/Skyla-Homes-Adhesive-Baby-Safety-Locks-Multi-Purpose-Adjustable-Straps-for-Childproofing-White-8-Pack/15189523915"] },
  { file: "corner-protector-clear.jpg", urls: ["https://www.walmart.com/ip/CalMyotis-Corner-Protector-Baby-Proofing-Guards-Soft-Transparent-100-Covered-Adhesive-Improved-Tasteless-Covers-Furniture-Sharp-Corner-12-Count/2220651027"] },
  { file: "corner-protectors-patented.jpg", urls: ["https://www.walmart.com/ip/Corner-Protectors-for-Baby-12-Pack-Transparent-Edge-Protectors-Furniture-Corner-Guards/1523009828"] },
  { file: "door-knob-cover.jpg", urls: ["https://www.walmart.com/ip/Safety-1st-Parent-Grip-Door-Knob-Covers-White-One-Size-4-Count-Pack-of-1-HS3260600/2387008510"] },
  { file: "huglock-door-lock.jpg", urls: ["https://www.walmart.com/ip/HugLock-Child-Proof-Door-Lock/17818515199"] },
  // FEEDING
  { file: "termichy-formula-dispenser.jpg", urls: ["https://www.walmart.com/ip/Termichy-Stackable-Formula-Dispenser-Portable-Milk-Powder-Container-2-Pack/3264837485"] },
  { file: "munchkin-formula-dispenser.jpg", urls: ["https://www.walmart.com/ip/Munchkin-Formula-Dispenser-Combo-Pack-Colors-May-Vary/21901281"] },
  { file: "momcozy-bottle-warmer.jpg", urls: ["https://momcozy.com/products/momcozy-portable-bottle-warmer", "https://www.walmart.com/ip/Momcozy-Portable-Bottle-Warmer-17oz-USB-Rechargeable-Baby-Bottle-Warmer/2780395271"] },
  { file: "munchkin-miracle-360.jpg", urls: ["https://www.walmart.com/ip/Munchkin-Miracle-360-Trainer-Cup-7-Oz-2-Pack-Green-Blue/46551306"] },
  { file: "nuk-active-sippy-cars.jpg", urls: ["https://www.nuk-usa.com/products/disney-active-sippy-cup", "https://www.walmart.com/ip/NUK-Active-Sippy-Cup-Cars-10-oz-2-Pack/609498882"] },
  // HEADPHONES
  { file: "kidrox-headphones.jpg", urls: ["https://www.walmart.com/ip/Kidrox-Wired-Kids-Headphones-for-1-7-Year-Old-Children-85dB-Volume-Limited/1482973651"] },
  { file: "alpine-muffy-baby.jpg", urls: ["https://www.alpinehearingprotection.com/earmuffs/muffy-baby/", "https://www.walmart.com/ip/Alpine-Muffy-Baby-Ear-Protection-for-Babies-and-Toddlers-Adjustable-Elastic-Headband/328873695"] },
  { file: "procase-earmuffs.jpg", urls: ["https://www.walmart.com/ip/ProCase-Baby-Ear-Protection-Noise-Cancelling-Headphones-for-Babies-Infant-Toddlers/1424019346"] },
  { file: "cozyphones-kids-headphones.jpg", urls: ["https://www.walmart.com/ip/CozyPhones-Kids-Headphones-Volume-Limited-with-Ultra-Thin-Speakers-Soft-Fleece-Headband/46652592"] },
  // AIRPLANE
  { file: "lusso-gear-tray-cover.jpg", urls: ["https://www.lussogear.com/products/airplane-tray-table-cover", "https://www.walmart.com/ip/Lusso-Gear-Airplane-Tray-Table-Cover/1693823562"] },
  { file: "tekfun-lcd-tablet.jpg", urls: ["https://www.walmart.com/ip/TEKFUN-LCD-Writing-Tablet-10-Inch-Doodle-Board-Colorful-Drawing-Tablet-Drawing-Pad-Kids-Travel-Games-Toys/1696724635"] },
  { file: "gojmzo-busy-board.jpg", urls: ["https://www.walmart.com/ip/Gojmzo-Busy-Board-Montessori-Toys-Toddlers-Sensory-Activity-Book-Travel/2651308841"] },
  { file: "cares-harness.jpg", urls: ["https://kidsflysafe.com/products/cares-airplane-safety-harness", "https://www.walmart.com/ip/CARES-Kids-Fly-Safe-Airplane-Safety-Harness-FAA-Approved/44781908"] },
  { file: "saireider-neck-pillow.jpg", urls: ["https://www.walmart.com/ip/SAIREIDER-Travel-Neck-Pillow-100-Pure-Memory-Foam-Adjustable-Plane-Car-Home/1846002957"] },
  // STROLLER ACCESSORIES
  { file: "accmor-stroller-organizer.jpg", urls: ["https://www.walmart.com/ip/Accmor-Universal-Stroller-Organizer-Insulated-Cup-Holder-Detachable-Phone-Bag-Shoulder-Strap/1623027482"] },
  { file: "topdesign-stroller-organizer.jpg", urls: ["https://www.walmart.com/ip/TOPDesign-Universal-Baby-Stroller-Organizer-Detachable-Mesh-Bag-Insulated-Cup-Holders/2948631067"] },
  { file: "guiseapue-stroller-organizer.jpg", urls: ["https://www.walmart.com/ip/Guiseapue-Universal-Stroller-Organizer-Cup-Holder-Detachable-Phone-Bag/2536104923"] },
  { file: "volkgo-stroller-bag.jpg", urls: ["https://www.walmart.com/ip/VOLKGO-Stroller-Bag-for-Airplane-Gate-Check-Bag-for-Single-Double-Strollers/537676982"] },
  { file: "jl-childress-padded-bag.jpg", urls: ["https://www.jlchildress.com/collections/travel-bags", "https://www.walmart.com/ip/J-L-Childress-Padded-Umbrella-Stroller-Travel-Bag-Black/15724338"] },
  { file: "jl-childress-gate-check-bag.jpg", urls: ["https://www.walmart.com/ip/J-L-Childress-Gate-Check-Bag-for-Single-Umbrella-Strollers-Red/5765122"] },
  { file: "bramble-gate-check-bag.jpg", urls: ["https://www.walmart.com/ip/Bramble-Extra-Large-Gate-Check-Stroller-Bag-Airplane-Waterproof-Padded-Strap/2618994723"] },
  { file: "munchkin-brica-car-seat-bag.jpg", urls: ["https://www.walmart.com/ip/Munchkin-Brica-Cover-Guard-Car-Seat-Travel-Bag/467498498"] },
];

function fetchPage(pageUrl, maxRedirects = 5) {
  if (maxRedirects <= 0) return Promise.reject(new Error("Too many redirects"));
  return new Promise((resolve, reject) => {
    const url = new URL(pageUrl);
    const mod = url.protocol === "https:" ? https : http;
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "identity",
      },
      timeout: 15000,
    };
    const req = mod.get(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const loc = res.headers.location.startsWith("http")
          ? res.headers.location
          : `${url.protocol}//${url.hostname}${res.headers.location}`;
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

function extractImageUrl(html) {
  let match;

  // og:image
  match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
  if (!match) match = html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (match && isGoodImage(match[1])) return match[1];

  // twitter:image
  match = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
  if (!match) match = html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
  if (match && isGoodImage(match[1])) return match[1];

  // JSON-LD image
  const jsonBlocks = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  if (jsonBlocks) {
    for (const block of jsonBlocks) {
      try {
        const json = JSON.parse(block.replace(/<script[^>]*>/i, "").replace(/<\/script>/i, ""));
        const img = json.image || (json["@graph"] && json["@graph"].find(n => n.image))?.image;
        if (img) {
          const url = Array.isArray(img) ? img[0] : (typeof img === "string" ? img : img.url);
          if (url && isGoodImage(url)) return url;
        }
      } catch {}
    }
  }

  // Shopify CDN image
  match = html.match(/(https:\/\/cdn\.shopify\.com\/s\/files\/[^"'\s]+\.(?:jpg|jpeg|png|webp))/i);
  if (match && isGoodImage(match[1])) return match[1];

  // Walmart CDN image
  match = html.match(/(https:\/\/i5\.walmartimages\.com\/[^"'\s]+\.(?:jpg|jpeg|png|webp))/i);
  if (match && isGoodImage(match[1])) return match[1];

  // Target CDN
  match = html.match(/(https:\/\/target\.scene7\.com\/[^"'\s]+)/i);
  if (match && isGoodImage(match[1])) return match[1];

  // Generic product/hero image
  match = html.match(/<img[^>]+src=["'](https?:\/\/[^"']+(?:product|hero|main)[^"']*\.(?:jpg|jpeg|png|webp)[^"']*)["']/i);
  if (match && isGoodImage(match[1])) return match[1];

  // data-src
  match = html.match(/data-src=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/i);
  if (match && isGoodImage(match[1])) return match[1];

  // srcset first entry
  match = html.match(/srcset=["'](https?:\/\/[^"'\s,]+\.(?:jpg|jpeg|png|webp)[^"'\s,]*)[\s,]/i);
  if (match && isGoodImage(match[1])) return match[1];

  // Any CDN image as last resort
  match = html.match(/<img[^>]+src=["'](https?:\/\/cdn[^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/i);
  if (match && isGoodImage(match[1])) return match[1];

  return null;
}

function isGoodImage(url) {
  const lower = url.toLowerCase();
  // REJECT Amazon images
  if (lower.includes("media-amazon.com")) return false;
  if (lower.includes("amazon.com")) return false;
  if (lower.includes("ssl-images-amazon")) return false;
  // Reject logos/icons
  if (lower.includes("logo") && !lower.includes("catalog")) return false;
  if (lower.includes("favicon")) return false;
  if (lower.includes("/icon/")) return false;
  if (lower.includes("placeholder")) return false;
  return true;
}

function downloadImage(imageUrl, dest, maxRedirects = 5) {
  if (maxRedirects <= 0) return Promise.reject(new Error("Too many redirects"));
  return new Promise((resolve, reject) => {
    const url = new URL(imageUrl);
    const mod = url.protocol === "https:" ? https : http;
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "image/*,*/*;q=0.8",
        Referer: `${url.protocol}//${url.hostname}/`,
      },
      timeout: 20000,
    };
    const req = mod.get(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const loc = res.headers.location.startsWith("http")
          ? res.headers.location
          : `${url.protocol}//${url.hostname}${res.headers.location}`;
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

async function processProduct(product) {
  const dest = path.join(OUTPUT_DIR, product.file);
  if (fs.existsSync(dest)) {
    const s = fs.statSync(dest);
    if (s.size > 5000) return { status: "skip", file: product.file };
    fs.unlinkSync(dest);
  }

  for (const url of product.urls) {
    try {
      const { html, status } = await fetchPage(url);
      if (status === 503 || html.includes("Robot or human") || html.includes("captcha")) {
        console.log(`    CAPTCHA on ${new URL(url).hostname}`);
        continue;
      }
      const imageUrl = extractImageUrl(html);
      if (!imageUrl) continue;

      const fullUrl = imageUrl.startsWith("//") ? "https:" + imageUrl : imageUrl;
      await downloadImage(fullUrl, dest);
      const s = fs.statSync(dest);
      if (s.size < 3000) { fs.unlinkSync(dest); continue; }

      return { status: "ok", file: product.file, size: s.size, source: new URL(url).hostname };
    } catch (err) {
      continue;
    }
  }

  if (fs.existsSync(dest)) fs.unlinkSync(dest);
  return { status: "fail", file: product.file };
}

async function main() {
  console.log(`\n=== Product Image Downloader v3 (Manufacturer/Retailer Only — No Amazon) ===`);
  console.log(`Products to process: ${products.length}\n`);

  let ok = 0, skip = 0, fail = 0;
  const failures = [];

  for (let i = 0; i < products.length; i += 3) {
    const batch = products.slice(i, i + 3);
    const n = Math.floor(i / 3) + 1;
    const total = Math.ceil(products.length / 3);
    console.log(`Batch ${n}/${total}`);
    const results = await Promise.all(batch.map(p => processProduct(p)));
    for (const r of results) {
      if (r.status === "ok") { ok++; console.log(`  [OK]   ${r.file} (${(r.size/1024).toFixed(0)}KB from ${r.source})`); }
      else if (r.status === "skip") { skip++; console.log(`  [SKIP] ${r.file}`); }
      else { fail++; failures.push(r.file); console.log(`  [FAIL] ${r.file}`); }
    }
    if (i + 3 < products.length) await sleep(1000);
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`OK: ${ok} | SKIP: ${skip} | FAIL: ${fail}`);
  if (failures.length) { console.log(`\nFailed:`); failures.forEach(f => console.log(`  - ${f}`)); }
  console.log("=".repeat(50) + "\n");
}

main().catch(console.error);
