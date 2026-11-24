import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

export const alt = "Abdelrahman MANO — AI Applications & Software Development.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  const photo = await readFile(path.join(process.cwd(), "public/images/mano-portrait.jpg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#050B0A", color: "#EDEDED", fontFamily: "sans-serif" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 64px" }}>
          <div style={{ fontSize: 96, fontWeight: 900, letterSpacing: -2 }}>MANO</div>
          <div style={{ width: 220, height: 10, background: "#14B8A6", borderRadius: 10, transform: "rotate(-3deg)", marginTop: -6 }} />
          <div style={{ fontSize: 26, letterSpacing: 8, color: "#14B8A6", marginTop: 28 }}>BUSINESS × TECHNOLOGY</div>
          <div style={{ fontSize: 40, fontWeight: 700, marginTop: 40, lineHeight: 1.2 }}>AI Applications & Software Development</div>
          <div style={{ fontSize: 24, color: "#9FB0B6", marginTop: 24 }}>Abdelrahman MANO · Product & Business Thinking</div>
        </div>
        <img src={src} width={470} height={630} style={{ objectFit: "cover" }} alt="" />
      </div>
    ),
    size,
  );
}
