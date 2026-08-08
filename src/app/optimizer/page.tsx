"use client";

import { useState } from "react";

type Expense = { name: string; monthly: number };
type Cut = {
  category: string;
  currentMonthly: number;
  recommendation: string;
  estimatedSavings: number;
};

const DEFAULTS: Expense[] = [
  { name: "Subscriptions", monthly: 89 },
  { name: "Dining out", monthly: 320 },
  { name: "Cloud / SaaS tools", monthly: 145 },
  { name: "Transport", monthly: 180 },
  { name: "Shopping", monthly: 250 },
];

export default function OptimizerPage() {
  const [expenses, setExpenses] = useState<Expense[]>(DEFAULTS);
  const [cuts, setCuts] = useState<Cut[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateExpense(i: number, field: keyof Expense, value: string) {
    setExpenses((prev) =>
      prev.map((e, idx) =>
        idx === i
          ? {
              ...e,
              [field]: field === "monthly" ? Number(value) || 0 : value,
            }
          : e
      )
    );
  }

  function addRow() {
    setExpenses((prev) => [...prev, { name: "New category", monthly: 50 }]);
  }

  async function optimize() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expenses }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Optimize failed");
        return;
      }
      setCuts(data.cuts || []);
      setSource(data.source || "");
      setMessage(data.message || "");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  const totalSavings = cuts.reduce((s, c) => s + (c.estimatedSavings || 0), 0);

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="space-y-2">
          <a href="/" className="text-sm text-zinc-500 hover:text-zinc-300">
            ← Cashflow Lab
          </a>
          <h1 className="text-3xl font-bold">Expense Optimizer</h1>
          <p className="text-zinc-400">
            Concrete cuts that free cash without destroying quality of life.
          </p>
        </header>

        <section className="space-y-3">
          {expenses.map((e, i) => (
            <div key={i} className="grid grid-cols-[1fr_120px] gap-3">
              <input
                className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2"
                value={e.name}
                onChange={(ev) => updateExpense(i, "name", ev.target.value)}
              />
              <input
                type="number"
                className="bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2"
                value={e.monthly}
                onChange={(ev) => updateExpense(i, "monthly", ev.target.value)}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addRow}
            className="text-sm text-zinc-400 hover:text-white"
          >
            + Add category
          </button>
        </section>

        <button
          onClick={optimize}
          disabled={loading}
          className="bg-emerald-500 text-black font-semibold px-6 py-3 rounded-xl hover:bg-emerald-400 disabled:opacity-50 transition"
        >
          {loading ? "Optimizing with Grok..." : "Find Savings"}
        </button>

        {source && (
          <p className="text-xs text-zinc-500">
            Source:{" "}
            <span className={source === "live" ? "text-emerald-400" : "text-amber-400"}>
              {source}
            </span>
            {message ? ` — ${message}` : ""}
          </p>
        )}

        {error && (
          <div className="p-4 border border-red-800 rounded-xl text-red-300 text-sm">{error}</div>
        )}

        {cuts.length > 0 && (
          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <h2 className="text-xl font-semibold">Recommended cuts</h2>
              <span className="text-emerald-400 font-medium">
                ~${totalSavings}/mo potential
              </span>
            </div>
            <div className="grid gap-3">
              {cuts.map((c, i) => (
                <div
                  key={i}
                  className="border border-zinc-800 rounded-xl p-4 bg-zinc-950"
                >
                  <div className="flex justify-between mb-1">
                    <strong>{c.category}</strong>
                    <span className="text-emerald-400 text-sm">
                      save ${c.estimatedSavings}/mo
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm">{c.recommendation}</p>
                  <p className="text-zinc-600 text-xs mt-1">
                    Current: ${c.currentMonthly}/mo
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
