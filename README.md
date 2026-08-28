# Helix Cashflow Lab

The existing side-hustle / cashflow idea lab. **Unpaid visitors stay on the free mock** (zero xAI cost). **Whop buyers unlock the real Grok generator.**

## Live
- Production: https://helix-cashflow-lab.vercel.app
- Repo: this one

## How access works

| Visitor | What they get |
|---|---|
| Stranger / unpaid | Free mock ideas + a **Get access** CTA |
| Paid / unlocked | Live Grok (`HELIX_USE_GROK=1` + `XAI_API_KEY`) |

Unlock is a documented access token (not a fake “already paid” UI):

1. After Whop checkout, send buyers to  
   `https://helix-cashflow-lab.vercel.app/generator?access=<HELIX_ACCESS_TOKEN>`
2. Middleware sets an httpOnly `helix_access` cookie when the token matches.
3. `/api/generate` and `/api/optimize` call Grok only when that cookie (or `x-helix-access` / JSON `access`) matches.

If a paid session is unlocked but `XAI_API_KEY` is missing (or `HELIX_USE_GROK` is not `1`), the API **fails clearly** — it does not silently return mock ideas.

## Exact env vars (Vercel)

| Var | Required for | What it does |
|---|---|---|
| `WHOP_CHECKOUT_URL` | Taking money | Live Whop checkout link for the **Get access** button. **If empty, the button is shown disabled — no invented URL.** |
| `WHOP_PLAN_ID` | Optional | Stored/returned for YieldForge; not used as a fake checkout. |
| `HELIX_ACCESS_TOKEN` | After-pay unlock | Shared secret. Whop success URL query `?access=` must equal this value. |
| `HELIX_USE_GROK` | Live Grok | Set to `1` to allow paid sessions to call xAI. Unpaid traffic still uses mock. |
| `XAI_API_KEY` | Live Grok | xAI / Grok key. **Grok only.** If a paid user hits generate and this is missing, the API returns 503 — no silent mock. |
| `XAI_MODEL` | Optional | Defaults to `grok-4-latest`. Override if YieldForge wants a pinned Grok model. |

`GROK_API_KEY` is accepted as an alias for `XAI_API_KEY`.  
`NEXT_PUBLIC_WHOP_CHECKOUT_URL` is an optional alias for `WHOP_CHECKOUT_URL` (the app reads checkout on the server via `/api/access`, so the non-public var is preferred).

Do **not** set OpenAI / Anthropic / Gemini keys. This lab is Grok / xAI only.

## Checkout hook (YieldForge)

When the Helix Cashflow Lab Whop checkout exists, paste it:

```
WHOP_CHECKOUT_URL=https://whop.com/checkout/...   # real URL only
WHOP_PLAN_ID=plan_...                            # optional
HELIX_ACCESS_TOKEN=<long random string>
HELIX_USE_GROK=1
XAI_API_KEY=xai-...
```

Whop dashboard → success / redirect URL:

```
https://helix-cashflow-lab.vercel.app/generator?access=<same HELIX_ACCESS_TOKEN>
```

There is no Helix Cashflow checkout hardcoded in this repo. Do not point **Get access** at Offer Optimizer or any other product.

## Local
```bash
npm install && npm run dev
```

## Smoke
1. Open `/` — unpaid badge + **Get access** (disabled until `WHOP_CHECKOUT_URL` is set).
2. `/onboarding` → Save → `/generator` → Generate ideas → `source=mock`.
3. Unlock: visit `/generator?access=<HELIX_ACCESS_TOKEN>` (token must match env).
4. With `HELIX_USE_GROK=1` + `XAI_API_KEY`, generate returns `source=live`.
5. With unlock but no `XAI_API_KEY`, generate returns **503** (not mock ideas).

## Full Next (production)

This repo **is** the full Next.js Cashflow Lab.

Vercel: import `manhatton31-svg/helix-cashflow-lab`, Framework=Next.js.

**Contracts:** `/api/generate` still returns `ideaProfiles` + `topIdeaProfile` (v1) for Helix Spark on the mock path. Live Grok responses use the same contract with `source=live`.
