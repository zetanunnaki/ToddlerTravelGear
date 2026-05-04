import { ImageResponse } from "next/og";

export const alt = "ToddlerTravelGear — Travel Lighter. Worry Less.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              backgroundColor: "#0d9488",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19l9 2-9-18-9 18 9-2z" />
              <path d="M12 19v-8" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{ fontSize: 36, fontWeight: 700, color: "white" }}
            >
              ToddlerTravel
            </span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#2dd4bf",
                letterSpacing: 4,
                textTransform: "uppercase" as const,
              }}
            >
              GEAR.COM
            </span>
          </div>
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "white",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: 16,
          }}
        >
          Travel Lighter. Worry Less.
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: 700,
          }}
        >
          Thoroughly researched gear reviews, FAA-approved car seat guides, and
          packing lists for parents traveling with babies &amp; toddlers.
        </div>
      </div>
    ),
    { ...size }
  );
}
