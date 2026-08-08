export default function CashflowLabHome() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <p className="text-emerald-500 text-sm font-medium mb-2">Helix product</p>
          <h1 className="text-4xl font-bold tracking-tight">Cashflow Lab</h1>
          <p className="text-zinc-400 mt-2">
            Personalized side-hustle generation + continuous expense optimization —
            powered by <code className="text-zinc-300">@helix/ai-core</code>.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-6">
          <a
            href="/onboarding"
            className="block p-6 border border-zinc-800 rounded-2xl hover:border-emerald-500/50 transition"
          >
            <h2 className="text-xl font-semibold mb-2">1. Diagnostic</h2>
            <p className="text-zinc-400 text-sm">
              Skills, time, capital, location — the inputs Grok needs.
            </p>
          </a>
          <a
            href="/generator"
            className="block p-6 border border-zinc-800 rounded-2xl hover:border-emerald-500/50 transition"
          >
            <h2 className="text-xl font-semibold mb-2">2. Side-Hustle Generator</h2>
            <p className="text-zinc-400 text-sm">
              Ranked high-ROI playbooks. Live Grok when key present; smart mock fallback.
            </p>
          </a>
          <a
            href="/optimizer"
            className="block p-6 border border-zinc-800 rounded-2xl hover:border-emerald-500/50 transition md:col-span-2"
          >
            <h2 className="text-xl font-semibold mb-2">3. Expense Optimizer</h2>
            <p className="text-zinc-400 text-sm">
              Enter expenses. Get concrete cuts that free cash without pain.
            </p>
          </a>
        </section>

        <p className="text-zinc-600 text-sm">
          Part of Helix — The AI Money Operating System. Wired Aug 8 2026.
        </p>
      </div>
    </main>
  );
}
