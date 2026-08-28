import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ACCESS_COOKIE,
  ACCESS_QUERY,
  configuredAccessToken,
  tokenUnlocks,
} from "@/lib/access";

/**
 * After Whop pay, land on /generator?access=<HELIX_ACCESS_TOKEN>.
 * Valid token becomes an httpOnly cookie so API routes can call Grok.
 */
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = url.searchParams.get(ACCESS_QUERY);
  if (!token) return NextResponse.next();

  const expected = configuredAccessToken();
  if (!tokenUnlocks(token)) {
    return NextResponse.next();
  }

  url.searchParams.delete(ACCESS_QUERY);
  const res = NextResponse.redirect(url);
  res.cookies.set(ACCESS_COOKIE, expected, {
    httpOnly: true,
    secure: url.protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
