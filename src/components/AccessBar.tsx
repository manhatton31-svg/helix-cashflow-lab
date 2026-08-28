"use client";

import { useEffect, useState } from "react";

export type AccessStatus = {
  unlocked: boolean;
  checkoutUrl: string;
  planId: string | null;
  grokFlag: boolean;
  hasXaiKey: boolean;
  grokReady: boolean;
  message: string;
};

export function useAccessStatus() {
  const [status, setStatus] = useState<AccessStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/access")
      .then((r) => r.json())
      .then((data: AccessStatus) => {
        if (!cancelled) setStatus(data);
      })
      .catch(() => {
        if (!cancelled) {
          setStatus({
            unlocked: false,
            checkoutUrl: "",
            planId: null,
            grokFlag: false,
            hasXaiKey: false,
            grokReady: false,
            message: "Could not load access status.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return status;
}

function badgeText(status: AccessStatus | null): string {
  if (!status) return "LOADING ACCESS…";
  if (!status.unlocked) {
    return status.hasXaiKey
      ? "FREE MOCK · NO XAI COST · PAY TO UNLOCK GROK"
      : "FREE MOCK · NO XAI · HELIX_USE_GROK OFF";
  }
  if (status.grokReady) return "PAID UNLOCK · GROK LIVE";
  if (!status.hasXaiKey) return "PAID UNLOCK · GROK BLOCKED · NO XAI_API_KEY";
  return "PAID UNLOCK · GROK BLOCKED · HELIX_USE_GROK OFF";
}

export function AccessBar() {
  const status = useAccessStatus();
  const checkoutUrl = status?.checkoutUrl || "";

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 10,
        margin: "0 0 1rem",
      }}
    >
      <span
        style={{
          background: status?.unlocked ? "#3d2a1a" : "#1a3d2a",
          color: status?.unlocked ? "#ffd27d" : "#7dffa2",
          fontSize: 11,
          fontWeight: 700,
          padding: "2px 8px",
          borderRadius: 999,
        }}
      >
        {badgeText(status)}
      </span>
      {checkoutUrl ? (
        <a
          href={checkoutUrl}
          style={{
            background: "#2f6fed",
            color: "#fff",
            textDecoration: "none",
            borderRadius: 8,
            padding: "6px 12px",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Get access
        </a>
      ) : (
        <button
          type="button"
          disabled
          title="Set WHOP_CHECKOUT_URL on Vercel when the live Whop checkout exists."
          style={{
            background: "#1e2a3a",
            color: "#8b9bb4",
            border: "1px solid #2a3a50",
            borderRadius: 8,
            padding: "6px 12px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "not-allowed",
          }}
        >
          Get access
        </button>
      )}
      {!checkoutUrl && (
        <span style={{ color: "#8b9bb4", fontSize: 12 }}>
          Checkout not configured — set WHOP_CHECKOUT_URL (optional WHOP_PLAN_ID). No fake link.
        </span>
      )}
    </div>
  );
}
