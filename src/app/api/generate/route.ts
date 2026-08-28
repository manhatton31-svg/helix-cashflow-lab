import { NextResponse } from "next/server";
import {
  extractJsonArray,
  generateWithSystem,
} from "@/lib/ai-core";
import { sideHustleGeneratorPrompt, SYSTEM_CASHFLOW } from "@/lib/prompts";
import { mockSideHustles } from "@/lib/mock";
import { toIdeaProfileContract } from "@/lib/toIdeaProfile";
import { normalizeIdeas } from "@/lib/normalize";
import { liveGrokGate, requestIsUnlocked, tokenUnlocks } from "@/lib/access";
import type { SideHustleIdea } from "@/types";

export const runtime = "nodejs";

type Profile = {
  skills: string[];
  location: string;
  hours: number;
  capital: number;
};

function withContracts(safe: Profile, ideas: SideHustleIdea[], extra: Record<string, unknown>) {
  const ideaProfiles = ideas.map((idea) =>
    toIdeaProfileContract(safe, idea, extra.source === "live" ? "cashflow-lab-live" : "cashflow-lab-mock")
  );
  return {
    ideas,
    ideaProfiles,
    contractsVersion: "1.0",
    topIdeaProfile: ideaProfiles[0] || null,
    ...extra,
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { profile?: Profile; access?: string };
    const profile = body.profile;
    if (!profile || typeof profile !== "object") {
      return NextResponse.json({ error: "profile required" }, { status: 400 });
    }
    const safe: Profile = {
      skills: Array.isArray(profile.skills) ? profile.skills.map(String) : [],
      location: String(profile.location ?? ""),
      hours: Number(profile.hours) || 10,
      capital: Number(profile.capital) || 0,
    };
    const prompt = sideHustleGeneratorPrompt(safe);
    const unlocked = requestIsUnlocked(req) || tokenUnlocks(body.access);

    if (!unlocked) {
      const ideas = mockSideHustles(safe);
      return NextResponse.json(
        withContracts(safe, ideas, {
          source: "mock",
          unlocked: false,
          message: "Free mock path (unpaid). Zero xAI cost. Pay on Whop to unlock Grok.",
          prompt,
        })
      );
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
      temperature: 0.6,
      maxTokens: 900,
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
          message: "Grok returned text that was not a JSON idea list. Not falling back to mock for a paid session.",
          raw: result.text.slice(0, 500),
        },
        { status: 502 }
      );
    }

    const ideas = normalizeIdeas(parsed);
    return NextResponse.json(
      withContracts(safe, ideas, {
        source: "live",
        unlocked: true,
        model: result.model,
        usage: result.usage,
        prompt,
      })
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
