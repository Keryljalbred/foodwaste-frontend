import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1️⃣ Ignorer tous les fichiers statiques
  if (
    pathname.startsWith("/_next") || 
    pathname.startsWith("/api") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/manifest.json") ||
    pathname.startsWith("/service-worker.js") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2️⃣ Routes publiques
  const publicRoutes = ["/", "/index", "/login", "/register"];

  // 3️⃣ Redirection pour routes non publiques
  if (!publicRoutes.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
