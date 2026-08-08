import type { SideHustleIdea } from "../types";

export function toIdeaProfileContract(
  profile: { skills: string[]; location: string; hours: number; capital: number },
  idea: SideHustleIdea,
  source = "cashflow-lab-mock"
) {
  return {
    version: "1.0" as const,
    source,
    cost: "free" as const,
    profile: {
      skills: profile.skills,
      hours: profile.hours,
      capital: profile.capital,
      location: profile.location,
    },
    idea: {
      id: idea.id,
      title: idea.title,
      description: idea.description,
      score: idea.score > 1 ? idea.score / 100 : idea.score,
      estimatedMonthly: idea.estimatedMonthly,
      timeRequiredHours: idea.timeRequiredHours,
      capitalRequired: idea.capitalRequired,
      skills: idea.skills,
      risk: idea.risk,
    },
    createdAt: new Date().toISOString(),
  };
}
