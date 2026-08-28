import { AccessBar } from "@/components/AccessBar";

export default function Home() {
  return (
    <main
      style={{
        maxWidth: 720,
        margin: "2rem auto",
        padding: "0 1rem",
        fontFamily: "system-ui,sans-serif",
        color: "#e8eef7",
        background: "#0b1020",
        minHeight: "100vh",
      }}
    >
      <AccessBar />
      <h1>Helix Cashflow Lab</h1>
      <p style={{ color: "#8b9bb4" }}>
        Side-hustle idea lab. Unpaid visitors stay on the free mock (zero xAI cost). Paying on
        Whop unlocks the real Grok generator.
      </p>
      <p>
        <a href="/onboarding" style={{ color: "#9ecbff", marginRight: 16 }}>
          Onboarding
        </a>
        <a href="/generator" style={{ color: "#9ecbff" }}>
          Generator
        </a>
      </p>
    </main>
  );
}
