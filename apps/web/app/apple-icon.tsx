import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS / PWA home-screen icon — matches favicon style. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #22c55e 0%, #15803d 100%)",
          borderRadius: 36,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            background: "white",
            borderRadius: 16,
            opacity: 0.95,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
