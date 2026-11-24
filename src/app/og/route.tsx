import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";
import { getContent } from "@/content";

export const runtime = "nodejs";

/** Social preview image (1200×630). Text stays in English for both languages: the image renderer ships no Arabic font. */
export async function GET() {
  const c = getContent("en");
  const photo = await readFile(path.join(process.cwd(), "public/images/mano-portrait.jpg"));
  const src = `data:image/jpeg;base64,${photo.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#050B0A", color: "#EDEDED", fontFamily: "sans-serif" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 64px" }}>
          <div style={{ fontSize: 30, letterSpacing: 8, color: "#14B8A6" }}>MANO · BUSINESS × TECHNOLOGY</div>
          <div style={{ fontSize: 84, fontWeight: 900, letterSpacing: -2, marginTop: 24, lineHeight: 1 }}>Abdelrahman MANO</div>
          <div style={{ width: 240, height: 10, background: "#14B8A6", borderRadius: 10, marginTop: 18 }} />
          <div style={{ fontSize: 40, fontWeight: 700, marginTop: 36, lineHeight: 1.2 }}>{c.meta.ogTitle}</div>
          <div style={{ fontSize: 26, color: "#9FB0B6", marginTop: 18 }}>{c.meta.ogSub}</div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse needs a plain img */}
        <img src={src} width={470} height={630} style={{ objectFit: "cover" }} alt="" />
      </div>
    ),
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=86400" } },
  );
}
