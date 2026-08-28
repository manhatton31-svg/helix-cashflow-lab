"use client";

import { useEffect, useState } from "react";
import { WHOP_CHECKOUT_URL_LIVE } from "@/lib/whop-checkout";

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
            checkoutUrl: WHOP_CHECKOUT_URL_LIVE,
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
  if (!status) return "FREE MOCK · NO XAI COST";
  if (!status.unlocked) return "FREE MOCK · NO XAI COST · PAY TO UNLOCK GROK";
  if (status.grokReady) return "PAID UNLOCK · GROK LIVE";
  if (!status.hasXaiKey) return "PAID UNLOCK · GROK BLOCKED · NO XAI_API_KEY";
  return "PAID UNLOCK · GROK BLOCKED";
}

export function AccessBar() {
  const status = useAccessStatus();
  const checkoutUrl = status?.checkoutUrl || WHOP_CHECKOUT_URL_LIVE;

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
        Get access · $49
      </a>
    </div>
  );
}
