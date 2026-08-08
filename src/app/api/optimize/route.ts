import { NextResponse } from "next/server";
import {
  extractJsonArray,
  generateWithSystem,
  liveAiEnabled,
} from "@/lib/ai-core";
import { expenseOptimizerPrompt, SYSTEM_CASHFLOW } from "@/lib/prompts";
import { mockExpenseCuts } from "@/lib/mock";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      expenses?: { name: string; monthly: number }[];
    };
    const expenses = (body.expenses || [])
      .filter((e) => e && e.name)
      .map((e) => ({ name: String(e.name), monthly: Number(e.monthly) || 0 }));

    if (!expenses.length) {
      return NextResponse.json({ error: "expenses required" }, { status: 400 });
    }

    const prompt = expenseOptimizerPrompt(expenses);

    if (!liveAiEnabled()) {
      return NextResponse.json({
        cuts: mockExpenseCuts(expenses),
        source: "mock",
        message: "Free mock path (HELIX_USE_GROK not enabled). Zero xAI cost.",
        prompt,
      });
    }

    const result = await generateWithSystem(SYSTEM_CASHFLOW, prompt, {
      temperature: 0.5,
      maxTokens: 500,
    });

    if (result.error || result.source !== "live") {
      return NextResponse.json({
        cuts: mockExpenseCuts(expenses),
        source: "mock",
        message: result.text || "Grok unavailable — mock fallback",
        prompt,
      });
    }

    const parsed = extractJsonArray(result.text);
    if (!parsed?.length) {
      return NextResponse.json({
        cuts: mockExpenseCuts(expenses),
        source: "mock",
        message: "Could not parse Grok JSON — mock fallback",
        raw: result.text.slice(0, 500),
        prompt,
      });
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
      model: result.model,
      usage: result.usage,
      prompt,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
