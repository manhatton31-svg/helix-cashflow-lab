import { NextResponse } from "next/server";
import {
  extractJsonArray,
  generateWithSystem,
  liveAiEnabled,
} from "@/lib/ai-core";
import { sideHustleGeneratorPrompt, SYSTEM_CASHFLOW } from "@/lib/prompts";
import { mockSideHustles } from "@/lib/mock";
import { toIdeaProfileContract } from "@/lib/toIdeaProfile";
import { normalizeIdeas } from "@/lib/normalize";
import type { SideHustleIdea } from "@/types";

export const runtime = "nodejs";

type Profile = {
  skills: string[];
  location: string;
  hours: number;
  capital: number;
};

function withContracts(safe: Profile, ideas: SideHustleIdea[], extra: Record<string, unknown>) {
  const ideaProfiles = ideas.map((idea) => toIdeaProfileContract(safe, idea));
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
    const body = (await req.json()) as { profile?: Profile };
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

    if (!liveAiEnabled()) {
      const ideas = mockSideHustles(safe);
      return NextResponse.json(
        withContracts(safe, ideas, {
          source: "mock",
          message: "Free mock path (HELIX_USE_GROK not enabled). Zero xAI cost.",
          prompt,
        })
      );
    }

    const result = await generateWithSystem(SYSTEM_CASHFLOW, prompt, {
      temperature: 0.6,
      maxTokens: 900,
    });

    if (result.error || result.source !== "live") {
      const ideas = mockSideHustles(safe);
      return NextResponse.json(
        withContracts(safe, ideas, {
          source: "mock",
          message: result.text || "Grok unavailable — mock fallback",
          prompt,
        })
      );
    }

    const parsed = extractJsonArray(result.text);
    let ideas: SideHustleIdea[];
    if (parsed && parsed.length) {
      ideas = normalizeIdeas(parsed);
    } else {
      ideas = mockSideHustles(safe);
      return NextResponse.json(
        withContracts(safe, ideas, {
          source: "mock",
          message: "Could not parse Grok JSON — mock fallback",
          raw: result.text.slice(0, 500),
          prompt,
        })
      );
    }

    return NextResponse.json(
      withContracts(safe, ideas, {
        source: "live",
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
