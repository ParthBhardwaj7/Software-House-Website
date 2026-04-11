import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "APNCODIX — Modern software agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  let host = "";
  try {
    if (site) host = new URL(site).host;
  } catch {
    host = "";
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(165deg, #f8fafc 0%, #e0f2fe 45%, #d1fae5 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            padding: 48,
          }}
        >
          <div style={{ display: "flex", flexDirection: "row", alignItems: "baseline", gap: 14 }}>
            <span
              style={{
                fontSize: 88,
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: "#0f172a",
              }}
            >
              APN
            </span>
            <span
              style={{
                fontSize: 72,
                fontWeight: 600,
                letterSpacing: "-0.03em",
                color: "#475569",
              }}
            >
              Codix
            </span>
          </div>
          <span style={{ fontSize: 28, color: "#64748b", textAlign: "center", maxWidth: 720 }}>
            Modern software agency — AI, web, and product engineering
          </span>
          {host ? (
            <span
              style={{
                marginTop: 8,
                fontSize: 22,
                fontWeight: 600,
                color: "#16a34a",
              }}
            >
              {host}
            </span>
          ) : null}
        </div>
      </div>
    ),
    { ...size }
  );
}
