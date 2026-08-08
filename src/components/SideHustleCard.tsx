import type { SideHustleIdea } from "../types";

export function SideHustleCard({ idea }: { idea: SideHustleIdea }) {
  return (
    <div className="border border-zinc-800 rounded-xl p-5 bg-zinc-950 hover:border-zinc-600 transition">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-white">{idea.title}</h3>
        <span className="text-sm text-emerald-400 font-medium">${idea.estimatedMonthly}/mo</span>
      </div>
      <p className="text-zinc-400 text-sm mb-3">{idea.description}</p>
      <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
        <span>{idea.timeRequiredHours}h/week</span>
        <span>•</span>
        <span>${idea.capitalRequired} capital</span>
        <span>•</span>
        <span className="capitalize">{idea.risk} risk</span>
        <span>•</span>
        <span>Score {idea.score}</span>
      </div>
    </div>
  );
}
