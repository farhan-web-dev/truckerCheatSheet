// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/", // login page
  "/reset-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("authToken")?.value;

  const isLoginPage = pathname === "/";
  const isPublicRoute =
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p)) ||
    pathname.startsWith("/api/auth"); // allow reset/request endpoints, etc.

  // If not authenticated and trying to access protected dashboard area → to login
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If authenticated and on login page, send to dashboard
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Otherwise, let through (including reset-password which is public)
  return NextResponse.next();
}
