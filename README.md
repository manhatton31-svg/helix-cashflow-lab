# Helix Cashflow Lab

The existing side-hustle / cashflow idea lab.

- **Unpaid visitors** stay on the **FREE MOCK** path (zero xAI cost).
- **Paid visitors** (Whop membership or access unlock after checkout) get the **Grok** idea generator.
- Grok / xAI only. This is not Offer Optimizer or Arcly.

## Live
- Site: https://helix-cashflow-lab.vercel.app
- Checkout (exact, do not invent another): https://whop.com/checkout/plan_IY7lPskIfxJYh
- Company: Helix Cashflow Lab (`biz_iDXFENeXmsmr82`)
- Product: Cashflow Lab — Idea Generator (`prod_KYqLixJdA2POR`)
- Plan: `plan_IY7lPskIfxJYh` · one-time $49.00
- Checkout custom field: `field_t1WhGhgXCTJC` “Skills / hours / capital” (required)

**Get access** on the site hits that exact Whop URL.

## Env vars (Vercel)

Christopher sets these on Vercel after this PR:

```
WHOP_CHECKOUT_URL=https://whop.com/checkout/plan_IY7lPskIfxJYh
XAI_API_KEY=
```

| Var | What it does |
|---|---|
| `WHOP_CHECKOUT_URL` | Checkout button target. The app already defaults to the live URL above if this is empty. |
| `XAI_API_KEY` | Paid sessions call Grok. Missing key → clear error, not a silent mock. |

After pay, send buyers to `/generator?access=<HELIX_ACCESS_TOKEN>` if you set `HELIX_ACCESS_TOKEN` on Vercel (optional unlock cookie). `/api/generate` also accepts header `x-helix-access`.

Unpaid traffic never calls xAI.

## Local
```bash
npm install && npm run dev
```

## Smoke
1. Unpaid `/` — **FREE MOCK** banner. **Get access** → `https://whop.com/checkout/plan_IY7lPskIfxJYh`
2. `/generator` → Generate → `source=mock`
3. Paid unlock + `XAI_API_KEY` → Grok (`source=live`)
