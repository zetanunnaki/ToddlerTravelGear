import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ToddlerTravelGear — Travel Lighter, Worry Less",
    short_name: "ToddlerGear",
    description:
      "Honest gear reviews, packing checklists, and travel guides for parents of babies and toddlers.",
    start_url: "/guides/toddler-packing-list",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0d9488",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
