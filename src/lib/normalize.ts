import type { SideHustleIdea } from "../types";

export function normalizeIdeas(raw: unknown[]): SideHustleIdea[] {
  return raw
    .map((item, index) => {
      const o = (item ?? {}) as Record<string, unknown>;
      const riskRaw = String(o.risk ?? "medium").toLowerCase();
      const risk =
        riskRaw === "low" || riskRaw === "high" || riskRaw === "medium"
          ? riskRaw
          : "medium";
      const skills = Array.isArray(o.skills)
        ? o.skills.map(String)
        : typeof o.skills === "string"
          ? o.skills.split(",").map((s) => s.trim())
          : [];
      return {
        id: String(o.id ?? index + 1),
        title: String(o.title ?? "Untitled idea"),
        description: String(o.description ?? ""),
        estimatedMonthly: Number(o.estimatedMonthly ?? o.monthly ?? 0) || 0,
        timeRequiredHours: Number(o.timeRequiredHours ?? o.hours ?? 5) || 5,
        capitalRequired: Number(o.capitalRequired ?? o.capital ?? 0) || 0,
        skills,
        risk: risk as SideHustleIdea["risk"],
        score: Number(o.score ?? 70) || 70,
      } satisfies SideHustleIdea;
    })
    .sort((a, b) => b.score - a.score);
}
