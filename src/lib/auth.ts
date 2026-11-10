/**
 * JWT Authentication utilities
 * Uses jose for signing/verifying (Edge-compatible)
 */

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-dev-secret-change-in-production"
);

export type TokenPayload = {
  sub: string;  // userId
  email: string;
  role: "ADMIN" | "CUSTOMER";
  iat?: number;
  exp?: number;
};

/** Generate JWT token for a user (valid 7 days) */
export async function createToken(payload: Omit<TokenPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

/** Verify and decode JWT token */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

/** Get current user from cookie (use in Server Components / API) */
export async function getCurrentUser(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

/** Set auth cookie (call after login) */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

/** Remove auth cookie (logout) */
export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
}
