"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [skills, setSkills] = useState("writing, automation");
  const [hours, setHours] = useState(8);
  const [capital, setCapital] = useState(100);
  const [location, setLocation] = useState("remote");

  function save() {
    const profile = {
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      hours: Number(hours) || 8,
      capital: Number(capital) || 0,
      location: location || "remote",
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("cashflow_profile", JSON.stringify(profile));
    }
    router.push("/generator");
  }

  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem", fontFamily: "system-ui,sans-serif", color: "#e8eef7", background: "#0b1020", minHeight: "100vh" }}>
      <span style={{ background: "#1a3d2a", color: "#7dffa2", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999 }}>FREE MOCK · HELIX_USE_GROK OFF</span>
      <h1>Cashflow Lab — Onboarding</h1>
      <p style={{ color: "#8b9bb4" }}>Profile for free mock idea generation. Zero API cost.</p>
      <label style={{ display: "block", marginTop: 12, fontSize: 12, color: "#8b9bb4" }}>Skills</label>
      <input style={inp} value={skills} onChange={(e) => setSkills(e.target.value)} />
      <label style={{ display: "block", marginTop: 12, fontSize: 12, color: "#8b9bb4" }}>Hours / week</label>
      <input style={inp} type="number" value={hours} onChange={(e) => setHours(Number(e.target.value))} />
      <label style={{ display: "block", marginTop: 12, fontSize: 12, color: "#8b9bb4" }}>Capital</label>
      <input style={inp} type="number" value={capital} onChange={(e) => setCapital(Number(e.target.value))} />
      <label style={{ display: "block", marginTop: 12, fontSize: 12, color: "#8b9bb4" }}>Location</label>
      <input style={inp} value={location} onChange={(e) => setLocation(e.target.value)} />
      <button style={btn} onClick={save}>Save & go to generator</button>
    </main>
  );
}
const inp: React.CSSProperties = { width: "100%", boxSizing: "border-box", marginTop: 4, padding: 8, borderRadius: 8, border: "1px solid #2a3a50", background: "#111827", color: "#e8eef7" };
const btn: React.CSSProperties = { marginTop: 16, background: "#2f6fed", color: "#fff", border: 0, borderRadius: 8, padding: "10px 14px", fontWeight: 600, cursor: "pointer" };
