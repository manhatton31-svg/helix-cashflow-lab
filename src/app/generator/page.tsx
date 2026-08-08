"use client";

import { useEffect, useState } from "react";
import { SideHustleIdea } from "../../types";
import { SideHustleCard } from "../../components/SideHustleCard";

type Profile = {
  skills: string[];
  location: string;
  hours: number;
  capital: number;
};

export default function GeneratorPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ideas, setIdeas] = useState<SideHustleIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<string>("");
  const [message, setMessage] = useState("");
  const [promptPreview, setPromptPreview] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("cashflow-profile");
      if (raw) {
        try {
          setProfile(JSON.parse(raw));
        } catch {
          /* ignore */
        }
      }
    }
  }, []);

  async function generate() {
    if (!profile) return;
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Generation failed");
        return;
      }
      setIdeas(data.ideas || []);
      setSource(data.source || "");
      setMessage(data.message || "");
      setPromptPreview(data.prompt || "");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-2">
          <a href="/" className="text-sm text-zinc-500 hover:text-zinc-300">
            ← Cashflow Lab
          </a>
          <h1 className="text-3xl font-bold">Side-Hustle Playbook Generator</h1>
          <p className="text-zinc-400">
            Ranked high-ROI ideas tailored to your diagnostic — live via{" "}
            <code className="text-emerald-400">@helix/ai-core</code>.
          </p>
        </header>

        {!profile && (
          <div className="p-6 border border-amber-700/50 rounded-2xl bg-amber-950/20">
            <p className="text-amber-200">No profile found. Complete the diagnostic first.</p>
            <a href="/onboarding" className="inline-block mt-3 text-emerald-400 underline">
              Go to Onboarding →
            </a>
          </div>
        )}

        {profile && (
          <div className="flex flex-wrap gap-3 text-sm text-zinc-400">
            <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
              Skills: {profile.skills.join(", ") || "—"}
            </span>
            <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
              {profile.location || "Anywhere"}
            </span>
            <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
              {profile.hours}h / week
            </span>
            <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
              ${profile.capital} capital
            </span>
          </div>
        )}

        {profile && (
          <button
            onClick={generate}
            disabled={loading}
            className="bg-emerald-500 text-black font-semibold px-6 py-3 rounded-xl hover:bg-emerald-400 disabled:opacity-50 transition"
          >
            {loading ? "Generating with Grok..." : "Generate Ranked Playbooks"}
          </button>
        )}

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

        {ideas.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Your Ranked Ideas</h2>
            <div className="grid gap-4">
              {ideas.map((idea) => (
                <SideHustleCard key={idea.id} idea={idea} />
              ))}
            </div>
          </section>
        )}

        {promptPreview && (
          <details className="text-xs text-zinc-600">
            <summary className="cursor-pointer">View Grok prompt used</summary>
            <pre className="mt-2 p-4 bg-zinc-950 rounded-xl overflow-auto whitespace-pre-wrap">
              {promptPreview}
            </pre>
          </details>
        )}
      </div>
    </main>
  );
}
