import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/settings",
  "/category-management",
  "/product-management",
];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === "/" || pathname === "/login" || pathname === "/register";

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 1. Not authenticated, trying to access a protected route ➜ redirect to login
  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 2. Authenticated, trying to access login page ➜ redirect to dashboard
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 3. All good ➜ continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/", // login
    "/login", // optional if separate login route
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/category-management/:path*",
    "/product-management/:path*",
    "/stock-management/:path*",
    "/stock-history/:path*",
    "/stock/:path*",
    "/product/:path*",
  ],
};
