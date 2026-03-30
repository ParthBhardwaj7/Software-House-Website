import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Default favicon — neutral mark; replace with `app/icon.png` anytime. */
export default function Icon() {
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
          borderRadius: 7,
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            background: "white",
            borderRadius: 3,
            opacity: 0.95,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
