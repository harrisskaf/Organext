import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "ORGANEXT — Εξατομικευμένες εφαρμογές και ψηφιακά συστήματα";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const font = await readFile(join(process.cwd(), "assets/Inter-SemiBold.ttf"));
  const logo = await readFile(join(process.cwd(), "public/brand/organext-logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#ffffff",
          color: "#252B30",
          padding: "80px",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 56, letterSpacing: 8, fontWeight: 600 }}>
          <img src={logoSrc} width={92} height={81} alt="" />
          <div style={{ marginLeft: 22 }}>ORGANEXT</div>
        </div>
        <div style={{ marginTop: 36, fontSize: 42, lineHeight: 1.25, maxWidth: 860 }}>
          Εξατομικευμένες εφαρμογές και ψηφιακά συστήματα
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Inter", data: font, weight: 600, style: "normal" }],
    },
  );
}
