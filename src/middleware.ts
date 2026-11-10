/**
 * Next.js Middleware - protects routes by role
 * /admin/* requires ADMIN, /customer/* requires CUSTOMER
 * /auth/* is public
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-dev-secret-change-in-production"
);

const PUBLIC_PATHS = ["/", "/about", "/contact", "/products", "/auth"];
const ADMIN_PATH = "/admin";
const CUSTOMER_PATH = "/customer";

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

async function getTokenPayload(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { sub: string; role: string };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  const user = await getTokenPayload(req);
  if (!user) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith(ADMIN_PATH) && user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/customer", req.url));
  }

  if (pathname.startsWith(CUSTOMER_PATH) && user.role !== "CUSTOMER" && user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|uploads).*)"],
};
