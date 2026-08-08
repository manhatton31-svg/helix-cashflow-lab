# Helix Cashflow Lab

Full Next.js app. **Mock by default** — no xAI cost.

## Live
- Production: https://helix-cashflow-lab.vercel.app (static mock shell or Next after git link)
- Repo: this one

## Cost
- Default: free mock (`liveAiEnabled()` false unless `HELIX_USE_GROK=1` + `XAI_API_KEY`)
- Do **not** set HELIX_USE_GROK unless you want paid Grok

## Local
```bash
npm install && npm run dev
```

## Smoke
1. Open /onboarding → set profile → Save
2. /generator → Generate ideas (mock)
3. Confirm source=mock

## Full Next (production)

This repo **is** the full Next.js Cashflow Lab (not static-only).

Vercel: import `manhatton31-svg/helix-cashflow-lab`, Framework=Next.js.

**Env (cost floor):**
- Do **not** set `HELIX_USE_GROK` (mock default)
- Optional later: `HELIX_USE_GROK=1` + `XAI_API_KEY`

**Contracts:** `/api/generate` returns `ideaProfiles` + `topIdeaProfile` (v1) for Helix Spark.
