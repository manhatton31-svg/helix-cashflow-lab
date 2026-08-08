/**
 * Grok prompts for Cashflow Lab
 */

export function sideHustleGeneratorPrompt(profile: {
  skills: string[];
  location: string;
  hours: number;
  capital: number;
}) {
  return `You are the Cashflow Lab AI inside Helix, the AI Money Operating System.

User profile:
- Skills: ${profile.skills.join(", ") || "general"}
- Location: ${profile.location || "Remote"}
- Available hours/week: ${profile.hours}
- Starting capital: $${profile.capital}

Generate exactly 5 high-ROI, realistic side-hustle ideas ranked by expected monthly profit after expenses, time investment, and risk.

Return ONLY a JSON array (no markdown, no commentary). Each object MUST have:
{
  "id": "string",
  "title": "string",
  "description": "string",
  "estimatedMonthly": number,
  "timeRequiredHours": number,
  "capitalRequired": number,
  "skills": string[],
  "risk": "low" | "medium" | "high",
  "score": number
}

Be practical, local-aware where possible, and avoid get-rich-quick schemes. Focus on leverage of existing skills.`;
}

export function expenseOptimizerPrompt(expenses: { name: string; monthly: number }[]) {
  return `You are the Cashflow Lab expense optimizer inside Helix.

Current monthly expenses:
${expenses.map((e) => `- ${e.name}: $${e.monthly}`).join("\n")}

Identify the top 3–5 categories that can be reduced without destroying quality of life.

Return ONLY a JSON array (no markdown). Each object:
{
  "category": "string",
  "currentMonthly": number,
  "recommendation": "string",
  "estimatedSavings": number
}`;
}

export const SYSTEM_CASHFLOW =
  "You are Helix Cashflow Lab. Respond with valid JSON only when asked for structured data. Be practical and ROI-focused.";
