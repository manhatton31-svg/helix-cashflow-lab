"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("");
  const [hours, setHours] = useState(10);
  const [capital, setCapital] = useState(500);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const profile = {
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      location,
      hours,
      capital,
    };
    // Persist to localStorage for MVP
    if (typeof window !== "undefined") {
      localStorage.setItem("cashflow-profile", JSON.stringify(profile));
    }
    router.push("/generator");
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold">Cashflow Lab Diagnostic</h1>
          <p className="text-zinc-400 mt-2">
            Tell us a few things so Grok can generate high-ROI side-hustle playbooks tailored to you.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Skills (comma-separated)</label>
            <input
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white"
              placeholder="writing, video editing, sales, coding..."
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location (city / country)</label>
            <input
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white"
              placeholder="Austin, TX or Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Available hours / week: {hours}</label>
            <input
              type="range"
              min={1}
              max={40}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Starting capital ($)</label>
            <input
              type="number"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white"
              value={capital}
              onChange={(e) => setCapital(Number(e.target.value))}
              min={0}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 text-black font-semibold py-3 rounded-xl hover:bg-emerald-400 transition"
          >
            Generate My Playbooks →
          </button>
        </form>
      </div>
    </main>
  );
}
