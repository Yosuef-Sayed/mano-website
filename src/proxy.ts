import { NextResponse, type NextRequest } from "next/server";
import { adminEnabled, isAdminAuthorized } from "@/lib/adminAuth";

/**
 * 1. Language routing: English stays at the existing URLs (/about) and is served internally from /en/about.
 *    Arabic lives at /ar/... . Direct /en/... URLs redirect to the clean English URL.
 * 2. HTTP Basic auth for the private /admin inbox.
 */
export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (/^\/(ar\/)?admin(\/|$)/.test(pathname) || pathname === "/ar/admin") {
    if (!adminEnabled()) return new NextResponse("Not found", { status: 404 });
    if (!isAdminAuthorized(req.headers.get("authorization"))) {
      return new NextResponse("Authentication required", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="MANO admin", charset="UTF-8"' },
      });
    }
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/ar" || pathname.startsWith("/ar/")) {
    return withAdminHeaders(pathname, NextResponse.next());
  }

  const url = req.nextUrl.clone();
  url.pathname = `/en${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return withAdminHeaders(pathname, NextResponse.rewrite(url));
}

function withAdminHeaders(pathname: string, res: NextResponse) {
  if (pathname.includes("/admin")) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    res.headers.set("Cache-Control", "no-store");
  }
  return res;
}

export const config = {
  // Everything except Next internals, API routes, static files and metadata routes.
  matcher: ["/((?!_next|api|og|files|images|icon.svg|favicon.ico|sitemap.xml|robots.txt|cv).*)"],
};
