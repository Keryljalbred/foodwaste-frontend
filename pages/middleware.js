// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Le front doit toujours revenir sur "/" après rechargement
  // sauf pour login et register.
  const publicRoutes = ["/index", "/"];

  // Si ce n'est PAS une route publique -> rediriger vers la page d'accueil
  if (!publicRoutes.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Appliquer le middleware à TOUTES les routes
export const config = {
  matcher: "/:path*",
};
