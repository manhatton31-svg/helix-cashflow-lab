import { NextResponse } from "next/server";
import { generateWithSystem, extractJsonArray } from "@/lib/ai-core";
import { expenseOptimizerPrompt, SYSTEM_CASHFLOW } from "@/lib/prompts";
import { mockExpenseCuts } from "@/lib/mock";
import { liveGrokGate, requestIsUnlocked, tokenUnlocks } from "@/lib/access";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      expenses?: { name: string; monthly: number }[];
      access?: string;
    };
    const expenses = (body.expenses || [])
      .filter((e) => e && e.name)
      .map((e) => ({ name: String(e.name), monthly: Number(e.monthly) || 0 }));

    if (!expenses.length) {
      return NextResponse.json({ error: "expenses required" }, { status: 400 });
    }

    const prompt = expenseOptimizerPrompt(expenses);
    const unlocked = requestIsUnlocked(req) || tokenUnlocks(body.access);

    if (!unlocked) {
      return NextResponse.json({
        cuts: mockExpenseCuts(expenses),
        source: "mock",
        unlocked: false,
        message: "Free mock path (unpaid). Zero xAI cost. Pay on Whop to unlock Grok.",
        prompt,
      });
    }

    const gate = liveGrokGate();
    if (!gate.ok) {
      return NextResponse.json(
        {
          error: gate.code,
          source: "error",
          unlocked: true,
          message: gate.message,
        },
        { status: 503 }
      );
    }

    const result = await generateWithSystem(SYSTEM_CASHFLOW, prompt, {
      temperature: 0.5,
      maxTokens: 500,
    });

    if (result.error || result.source !== "live") {
      return NextResponse.json(
        {
          error: result.error || "grok_unavailable",
          source: "error",
          unlocked: true,
          message: result.text || "Grok did not return a live result. Not falling back to mock for a paid session.",
        },
        { status: 502 }
      );
    }

    const parsed = extractJsonArray(result.text);
    if (!parsed?.length) {
      return NextResponse.json(
        {
          error: "grok_parse",
          source: "error",
          unlocked: true,
          message: "Grok returned text that was not a JSON cut list. Not falling back to mock for a paid session.",
          raw: result.text.slice(0, 500),
        },
        { status: 502 }
      );
    }

    const cuts = parsed.map((item) => {
      const o = (item ?? {}) as Record<string, unknown>;
      return {
        category: String(o.category ?? o.name ?? "Category"),
        currentMonthly: Number(o.currentMonthly ?? o.monthly ?? 0) || 0,
        recommendation: String(o.recommendation ?? o.advice ?? ""),
        estimatedSavings: Number(o.estimatedSavings ?? o.savings ?? 0) || 0,
      };
    });

    return NextResponse.json({
      cuts,
      source: "live",
      unlocked: true,
      model: result.model,
      usage: result.usage,
      prompt,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
