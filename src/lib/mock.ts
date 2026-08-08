import type { SideHustleIdea } from "../types";

export function mockSideHustles(profile: {
  skills: string[];
  location: string;
  hours: number;
  capital: number;
}): SideHustleIdea[] {
  const skill0 = profile.skills[0] || "service";
  const ideas: SideHustleIdea[] = [
    {
      id: "1",
      title: `Local ${skill0} micro-agency`,
      description: `Package your ${profile.skills.slice(0, 2).join(" + ") || skill0} skills into a done-for-you offer for businesses in ${profile.location || "your area"}.`,
      estimatedMonthly: Math.min(4500, 800 + profile.hours * 120),
      timeRequiredHours: Math.min(profile.hours, 12),
      capitalRequired: Math.min(profile.capital, 300),
      skills: profile.skills.slice(0, 3),
      risk: "low",
      score: 88,
    },
    {
      id: "2",
      title: "Niche content product",
      description:
        "Turn one of your skills into a digital product (template pack, short course, or toolkit) sold via organic social + email.",
      estimatedMonthly: 1800,
      timeRequiredHours: 8,
      capitalRequired: 50,
      skills: profile.skills,
      risk: "medium",
      score: 79,
    },
    {
      id: "3",
      title: "High-ticket consulting calls",
      description:
        "1:1 or small-group advisory using your strongest skill. Low capital, high hourly rate.",
      estimatedMonthly: 3200,
      timeRequiredHours: Math.min(profile.hours, 10),
      capitalRequired: 0,
      skills: profile.skills.slice(0, 2),
      risk: "low",
      score: 84,
    },
    {
      id: "4",
      title: "Done-with-you skill sprints",
      description: `Cohort-based 2-week sprints teaching ${skill0} with templates and live Q&A.`,
      estimatedMonthly: 2400,
      timeRequiredHours: Math.min(profile.hours, 8),
      capitalRequired: 100,
      skills: profile.skills.slice(0, 2),
      risk: "medium",
      score: 81,
    },
    {
      id: "5",
      title: "Local lead-gen partnership",
      description: `Partner with ${profile.location || "local"} service businesses: you generate leads, they close, you take a revenue share.`,
      estimatedMonthly: 2100,
      timeRequiredHours: Math.min(profile.hours, 10),
      capitalRequired: Math.min(profile.capital, 200),
      skills: profile.skills.slice(0, 3),
      risk: "medium",
      score: 76,
    },
  ];
  return ideas.sort((a, b) => b.score - a.score);
}

export function mockExpenseCuts(expenses: { name: string; monthly: number }[]) {
  const sorted = [...expenses].sort((a, b) => b.monthly - a.monthly);
  return sorted.slice(0, 5).map((e, i) => ({
    category: e.name,
    currentMonthly: e.monthly,
    recommendation:
      i === 0
        ? `Audit ${e.name} for unused seats/plans; renegotiate or switch to annual.`
        : `Cap ${e.name} at 70% of current spend; replace with cheaper alternatives where quality holds.`,
    estimatedSavings: Math.round(e.monthly * (0.15 + i * 0.05)),
  }));
}
