"use client";
import { useEffect, useState } from "react";

type Idea = { id: string; title: string; description: string; estimatedMonthly: number; risk: string; score: number };

export default function GeneratorPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [source, setSource] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ skills: ["writing"], hours: 8, capital: 100, location: "remote" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cashflow_profile");
      if (raw) setProfile(JSON.parse(raw));
    } catch {}
  }, []);

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      const data = await res.json();
      setIdeas(data.ideas || []);
      setSource(data.source || "");
      setMessage(data.message || "");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem", fontFamily: "system-ui,sans-serif", color: "#e8eef7", background: "#0b1020", minHeight: "100vh" }}>
      <a href="/onboarding" style={{ color: "#9ecbff", fontSize: 14 }}>← Onboarding</a>
      <h1>Side Hustle Generator</h1>
      <p style={{ color: "#8b9bb4", fontSize: 13 }}>{source ? `source=${source} · ${message}` : "Ready — mock path only"}</p>
      <button style={{ marginTop: 12, background: "#2f6fed", color: "#fff", border: 0, borderRadius: 8, padding: "10px 14px", fontWeight: 600, cursor: "pointer" }} onClick={generate} disabled={loading}>
        {loading ? "Generating…" : "Generate ideas (mock)"}
      </button>
      <div style={{ marginTop: 16 }}>
        {ideas.map((i) => (
          <div key={i.id} style={{ background: "#111827", border: "1px solid #1e2a3a", borderRadius: 12, padding: 12, marginTop: 10 }}>
            <strong>{i.title}</strong> · score {i.score}
            <div style={{ color: "#8b9bb4", fontSize: 13 }}>{i.description}</div>
            <div style={{ color: "#8b9bb4", fontSize: 12 }}>~${i.estimatedMonthly}/mo · risk {i.risk}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
