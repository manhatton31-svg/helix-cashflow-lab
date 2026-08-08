export default function Home() {
  return (
    <main style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem", fontFamily: "system-ui,sans-serif", color: "#e8eef7", background: "#0b1020", minHeight: "100vh" }}>
      <span style={{ background: "#1a3d2a", color: "#7dffa2", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999 }}>FULL NEXT · FREE MOCK · HELIX_USE_GROK OFF</span>
      <h1>Helix Cashflow Lab</h1>
      <p style={{ color: "#8b9bb4" }}>Next.js on Vercel. Mock path default — no xAI cost.</p>
      <p>
        <a href="/onboarding" style={{ color: "#9ecbff", marginRight: 16 }}>Onboarding</a>
        <a href="/generator" style={{ color: "#9ecbff" }}>Generator</a>
      </p>
    </main>
  );
}
