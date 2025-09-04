import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public paths and static assets (allow public GeoJSON and other static files)
  const publicPaths = ["/login", "/signup", "/api/auth", "/"];
  const isStatic = pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    /\.(geojson|json|png|svg|jpg|jpeg|gif|css|js|map|ico)$/.test(pathname);

  if (publicPaths.some((p) => pathname === p || pathname.startsWith(p)) || isStatic) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Role-based protection
  // Admin dashboard area
  if (pathname.startsWith("/dashboard/admin")) {
    if (token.role !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard/user";
      return NextResponse.redirect(url);
    }
  }

  // User dashboard area
  if (pathname.startsWith("/dashboard/user")) {
    if (token.role === "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard/admin";
      return NextResponse.redirect(url);
    }
    if (token.role !== "USER") {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // Root dashboard path: redirect based on role
  if (pathname === "/dashboard") {
    const url = req.nextUrl.clone();
    url.pathname = token.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user";
    return NextResponse.redirect(url);
  }

  // Super-admin removed: no dedicated route enforcement

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};


