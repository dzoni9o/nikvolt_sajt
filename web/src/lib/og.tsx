import { ImageResponse } from "next/og";
import { site } from "@/lib/site-config";

/**
 * Shared renderer for Open Graph images.
 *
 * The site previously pointed og:image at an SVG. No social platform renders
 * SVG, so every link shared to WhatsApp, Viber, Facebook or Instagram showed
 * no image at all — and for this business those are the main sharing channels.
 * Generating a PNG per page at request time fixes that without a single binary
 * asset in the repo.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export function ogImage({
  title,
  kicker,
}: {
  title: string;
  kicker?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0A0A",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* accent rule */}
        <div style={{ display: "flex", width: 96, height: 8, background: "#FFD400" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {kicker && (
            <div
              style={{
                display: "flex",
                fontSize: 26,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "#8A8A8A",
              }}
            >
              {kicker}
            </div>
          )}
          <div
            style={{
              display: "flex",
              fontSize: title.length > 60 ? 60 : 74,
              lineHeight: 1.1,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: -1.5,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 30,
            color: "#FFFFFF",
          }}
        >
          <div style={{ display: "flex", fontWeight: 700 }}>{site.name}</div>
          <div style={{ display: "flex", color: "#FFD400", fontWeight: 600 }}>
            {site.phoneDisplay}
          </div>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
