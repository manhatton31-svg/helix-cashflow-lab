import {
  WHOP_CHECKOUT_URL_LIVE,
  WHOP_PLAN_ID_LIVE,
} from "@/lib/whop-checkout";

export const ACCESS_COOKIE = "helix_access";
export const ACCESS_HEADER = "x-helix-access";
export const ACCESS_QUERY = "access";

export type AccessConfig = {
  checkoutUrl: string;
  planId: string;
  accessTokenConfigured: boolean;
  grokFlag: boolean;
  hasXaiKey: boolean;
  grokReady: boolean;
};

function trimEnv(value: string | undefined): string {
  return (value || "").trim();
}

/** Exact live checkout. Env can override; never invent a different product URL. */
export function whopCheckoutUrl(): string {
  if (typeof process === "undefined") return WHOP_CHECKOUT_URL_LIVE;
  return (
    trimEnv(process.env.WHOP_CHECKOUT_URL) ||
    trimEnv(process.env.NEXT_PUBLIC_WHOP_CHECKOUT_URL) ||
    WHOP_CHECKOUT_URL_LIVE
  );
}

export function whopPlanId(): string {
  if (typeof process === "undefined") return WHOP_PLAN_ID_LIVE;
  return trimEnv(process.env.WHOP_PLAN_ID) || WHOP_PLAN_ID_LIVE;
}

export function configuredAccessToken(): string {
  if (typeof process === "undefined") return "";
  return trimEnv(process.env.HELIX_ACCESS_TOKEN);
}

export function grokFlagOn(): boolean {
  if (typeof process === "undefined") return true;
  return process.env.HELIX_USE_GROK !== "0";
}

export function hasXaiKey(): boolean {
  if (typeof process === "undefined") return false;
  return !!(trimEnv(process.env.XAI_API_KEY) || trimEnv(process.env.GROK_API_KEY));
}

export function accessConfig(): AccessConfig {
  const grokFlag = grokFlagOn();
  const hasKey = hasXaiKey();
  return {
    checkoutUrl: whopCheckoutUrl(),
    planId: whopPlanId(),
    accessTokenConfigured: !!configuredAccessToken(),
    grokFlag,
    hasXaiKey: hasKey,
    grokReady: grokFlag && hasKey,
  };
}

export function tokensEqual(provided: string, expected: string): boolean {
  if (!provided || !expected || provided.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < provided.length; i++) {
    mismatch |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

export function tokenUnlocks(token: string | null | undefined): boolean {
  const expected = configuredAccessToken();
  if (!expected || !token) return false;
  return tokensEqual(token, expected);
}

export function readTokenFromRequest(req: Request): string | null {
  const header = req.headers.get(ACCESS_HEADER);
  if (header?.trim()) return header.trim();

  const cookie = req.headers.get("cookie") || "";
  const parts = cookie.split(";").map((p) => p.trim());
  for (const part of parts) {
    if (part.startsWith(`${ACCESS_COOKIE}=`)) {
      const value = part.slice(ACCESS_COOKIE.length + 1);
      try {
        return decodeURIComponent(value);
      } catch {
        return value;
      }
    }
  }

  try {
    const url = new URL(req.url);
    const q = url.searchParams.get(ACCESS_QUERY);
    if (q?.trim()) return q.trim();
  } catch {
    // ignore
  }

  return null;
}

export function requestIsUnlocked(req: Request): boolean {
  return tokenUnlocks(readTokenFromRequest(req));
}

export type LiveGate =
  | { ok: true }
  | { ok: false; code: "grok_flag_off" | "missing_api_key"; message: string };

/** Paid path only: never silently mock. Paid + XAI_API_KEY is enough. */
export function liveGrokGate(): LiveGate {
  if (typeof process !== "undefined" && process.env.HELIX_USE_GROK === "0") {
    return {
      ok: false,
      code: "grok_flag_off",
      message:
        "Paid unlock is active, but HELIX_USE_GROK=0. Live Grok is off — refusing to fake a paid result.",
    };
  }
  if (!hasXaiKey()) {
    return {
      ok: false,
      code: "missing_api_key",
      message:
        "Paid unlock is active, but XAI_API_KEY is missing. Live Grok cannot run — refusing to silently mock.",
    };
  }
  return { ok: true };
}
