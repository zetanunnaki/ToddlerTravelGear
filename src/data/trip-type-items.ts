export type TripType = "all" | "beach" | "winter" | "camping" | "city" | "road-trip";

export interface TripTypeConfig {
  label: string;
  icon: string;
  add: Partial<Record<string, string[]>>;
  dim: string[];
}

export const TRIP_TYPES: Record<Exclude<TripType, "all">, TripTypeConfig> = {
  beach: {
    label: "Beach",
    icon: "\u{1F3D6}\u{FE0F}",
    add: {
      "0–12 Months": [
        "Rash guard or swim shirt UPF 50+",
        "Swim diapers — pack 6+ per beach day",
        "Pop-up beach tent or shade canopy for naps",
        "Reef-safe mineral sunscreen — reapply every 80 min in water",
      ],
      "1–2 Years": [
        "Rash guard UPF 50+ — easier than reapplying sunscreen every hour",
        "Reusable swim diapers — most pools require them",
        "Sand toys — bucket, shovel, and a few molds",
        "Pop-up beach tent or shade canopy",
        "Water shoes that actually stay on in waves",
      ],
      "2–4 Years": [
        "Rash guard UPF 50+",
        "Water shoes with grip for rocks and hot sand",
        "Sand toys and sand molds",
        "Beach tent or shade canopy",
        "Swim goggles for pool or calm water",
        "Mesh bag for sandy toys — sand stays at the beach",
      ],
    },
    dim: [
      "snow suit", "insulated", "hand warmers", "toe warmers",
      "fleece", "winter", "ski pants",
    ],
  },
  winter: {
    label: "Winter / Snow",
    icon: "\u{1F3D4}\u{FE0F}",
    add: {
      "0–12 Months": [
        "Insulated car seat cover or bunting — never put a puffy coat under car seat straps",
        "Warm hat that fully covers ears",
        "Baby mittens — 2 pairs, they get wet fast",
        "Warm fleece blanket for stroller",
      ],
      "1–2 Years": [
        "Snow suit or insulated one-piece — one-piece is easier than separates",
        "Waterproof mittens — 2 pairs minimum, one is always wet",
        "Warm hat that covers ears and stays on",
        "Insulated waterproof boots — test fit with thick socks before trip",
        "Hand warmers for the stroller handlebar",
      ],
      "2–4 Years": [
        "Snow suit or ski pants + jacket combo",
        "Waterproof mittens — 2 pairs minimum",
        "Warm hat and neck gaiter or balaclava",
        "Insulated waterproof boots",
        "Hand and toe warmers",
        "Thermos for warm drinks or soup on the slopes",
      ],
    },
    dim: [
      "swim diaper", "rash guard", "water shoes", "sand toys",
      "beach tent", "swimsuit", "reef-safe", "goggles",
    ],
  },
  camping: {
    label: "Camping",
    icon: "⛺",
    add: {
      "0–12 Months": [
        "Mosquito net for crib or carrier",
        "Baby-safe insect repellent (DEET-free, for 2+ months)",
        "Extra-large waterproof changing pad for ground changes",
        "Extra blankets — camping nights drop 20°F from daytime",
        "Clip-on stroller fan for warm days",
      ],
      "1–2 Years": [
        "Toddler headlamp — kids love having their own light",
        "Bug spray safe for toddlers + after-bite cream",
        "Extra warm layers — campsite temps drop fast after sunset",
        "Closed-toe shoes for campsite — sticks, rocks, hot embers",
        "Portable high chair or clip-on seat for campsite eating",
      ],
      "2–4 Years": [
        "Kids headlamp or flashlight — doubles as a toy",
        "Bug spray + after-bite cream",
        "Sturdy closed-toe shoes for hiking and campsite",
        "Extra warm layers for cool nights",
        "Kid-sized camp chair",
        "Nature scavenger hunt list — keeps them exploring for hours",
      ],
    },
    dim: [
      "outlet covers", "cabinet locks", "door knob",
    ],
  },
  city: {
    label: "City Break",
    icon: "\u{1F3D9}\u{FE0F}",
    add: {
      "0–12 Months": [
        "Baby carrier as stroller backup — cobblestones and subway stairs defeat wheels",
        "Rain cover for stroller",
        "Extra muslin blankets for over-air-conditioned museums",
      ],
      "1–2 Years": [
        "Most comfortable walking shoes they own — city trips mean miles of walking",
        "Rain jacket or packable poncho",
        "Small portable snack container for on-the-go munching",
        "Carrier as stroller backup for cobblestones, stairs, and crowded transit",
      ],
      "2–4 Years": [
        "Most comfortable walking shoes they own — break them in before the trip",
        "Packable rain jacket",
        "Small backpack they carry with their own snacks and water",
        "Kid-friendly city guidebook or scavenger hunt printout",
      ],
    },
    dim: [
      "potty seat",
    ],
  },
  "road-trip": {
    label: "Road Trip",
    icon: "\u{1F697}",
    add: {
      "0–12 Months": [
        "Extra change of clothes within arm's reach — not buried in the trunk",
        "[Car window shades](/reviews/enovoe-car-window-shades) for rear windows",
        "Mirror to see rear-facing baby from driver seat",
        "[Backseat organizer](/reviews/helteko-backseat-organizer) for diapers, wipes, and toys",
      ],
      "1–2 Years": [
        "[Car window shades](/reviews/enovoe-car-window-shades) — sun on a sleeping toddler = meltdown",
        "[Backseat organizer](/reviews/helteko-backseat-organizer) for snacks and toys",
        "[Car seat travel tray](/reviews/pillani-travel-tray) for activities and snacks",
        "Extra drinks and snacks within driver's reach",
        "Plastic bags for car sickness — just in case",
      ],
      "2–4 Years": [
        "[Car seat travel tray](/reviews/pillani-travel-tray) for drawing, snacks, and figurines",
        "[Car window shades](/reviews/enovoe-car-window-shades)",
        "[Backseat organizer](/reviews/helteko-backseat-organizer)",
        "Audiobooks and car-friendly road trip games",
        "Barf bags within reach — winding roads + screen time = trouble",
      ],
    },
    dim: [
      "gate-check", "stroller bag for airplane",
    ],
  },
};
