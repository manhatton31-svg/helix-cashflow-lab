import { NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  accessConfig,
  configuredAccessToken,
  requestIsUnlocked,
  tokenUnlocks,
} from "@/lib/access";

export const runtime = "nodejs";

function publicStatus(req: Request, unlocked: boolean) {
  const cfg = accessConfig();
  return {
    unlocked,
    checkoutUrl: cfg.checkoutUrl,
    planId: cfg.planId || null,
    accessTokenConfigured: cfg.accessTokenConfigured,
    grokFlag: cfg.grokFlag,
    hasXaiKey: cfg.hasXaiKey,
    grokReady: cfg.grokReady,
    message: unlocked
      ? cfg.grokReady
        ? "Paid unlock active. Generator can call Grok."
        : !cfg.grokFlag
          ? "Paid unlock active, but HELIX_USE_GROK=0."
          : "Paid unlock active, but XAI_API_KEY is missing."
      : "Unpaid visitor — free mock path. Pay on Whop to unlock Grok.",
  };
}

export async function GET(req: Request) {
  return NextResponse.json(publicStatus(req, requestIsUnlocked(req)));
}

/** Set the access cookie from a token (same value as ?access=). */
export async function POST(req: Request) {
  let token = "";
  try {
    const body = (await req.json()) as { access?: string; token?: string };
    token = String(body.access || body.token || "").trim();
  } catch {
    token = "";
  }

  if (!tokenUnlocks(token)) {
    return NextResponse.json(
      { ...publicStatus(req, false), error: "invalid_or_missing_access_token" },
      { status: 401 }
    );
  }

  const res = NextResponse.json(publicStatus(req, true));
  res.cookies.set(ACCESS_COOKIE, configuredAccessToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
