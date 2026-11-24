import { NextResponse, type NextRequest } from "next/server";
import { adminEnabled, isAdminAuthorized } from "@/lib/adminAuth";

/** Protects the private /admin inbox with HTTP Basic auth. */
export function proxy(req: NextRequest) {
  if (!adminEnabled()) {
    return new NextResponse("Not found", { status: 404 });
  }
  if (!isAdminAuthorized(req.headers.get("authorization"))) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="MANO admin", charset="UTF-8"' },
    });
  }
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
