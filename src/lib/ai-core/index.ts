/**
 * @helix/ai-core — Shared Grok / xAI client for the Helix monorepo
 * Used by Cashflow Lab, Offer Optimizer, LivingGoals, etc.
 * Live generate client with graceful no-key fallback.
 */

export interface GenerateOptions {
  system?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface GenerateResult {
  text: string;
  model: string;
  usage?: { prompt_tokens?: number; completion_tokens?: number };
  error?: string;
  source: "live" | "fallback";
}

const DEFAULT_MODEL = "grok-2-latest";
const XAI_URL = "https://api.x.ai/v1/chat/completions";

export function hasApiKey(): boolean {
  if (typeof process === "undefined") return false;
  return !!(process.env.XAI_API_KEY || process.env.GROK_API_KEY);
}

/** Cost gate: live calls require HELIX_USE_GROK=1 AND a key. Default = mock/fallback. */
export function liveAiEnabled(): boolean {
  if (typeof process === "undefined") return false;
  return process.env.HELIX_USE_GROK === "1" && hasApiKey();
}

function getApiKey(): string | undefined {
  if (typeof process === "undefined") return undefined;
  return process.env.XAI_API_KEY || process.env.GROK_API_KEY;
}

/**
 * Generate text with Grok via the xAI API.
 * Returns a clear message if no key is present so demos stay usable.
 */
export async function generate(
  prompt: string,
  options: GenerateOptions = {}
): Promise<GenerateResult> {
  const apiKey = getApiKey();
  const model = options.model || DEFAULT_MODEL;

  if (!liveAiEnabled()) {
    return {
      text: "[ai-core] Live Grok disabled (set HELIX_USE_GROK=1 and XAI_API_KEY to enable). Using fallback.",
      model,
      error: apiKey ? "grok_disabled" : "missing_api_key",
      source: "fallback",
    };
  }

  const messages: { role: string; content: string }[] = [];
  if (options.system) {
    messages.push({ role: "system", content: options.system });
  }
  messages.push({ role: "user", content: prompt });

  try {
    const res = await fetch(XAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 800,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      return {
        text: `[ai-core] xAI error ${res.status}: ${body.slice(0, 200)}`,
        model,
        error: `http_${res.status}`,
        source: "fallback",
      };
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
      model?: string;
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };
    const text = data.choices?.[0]?.message?.content ?? "";
    return {
      text,
      model: data.model || model,
      usage: data.usage,
      source: "live",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      text: `[ai-core] Network or parse error: ${message}`,
      model,
      error: "network",
      source: "fallback",
    };
  }
}

/** Convenience: system + user in one call */
export async function generateWithSystem(
  system: string,
  user: string,
  options: Omit<GenerateOptions, "system"> = {}
) {
  return generate(user, { ...options, system });
}

/** Returns null on missing key or error — safe for UI fallbacks */
export async function tryGenerate(
  prompt: string,
  options: GenerateOptions = {}
): Promise<string | null> {
  const result = await generate(prompt, options);
  if (result.error) return null;
  return result.text;
}

/**
 * Extract a JSON array from model output (fenced or raw).
 */
export function extractJsonArray<T = unknown>(text: string): T[] | null {
  if (!text) return null;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenced?.[1] ?? text).trim();
  // Try direct parse
  try {
    const parsed = JSON.parse(candidate);
    if (Array.isArray(parsed)) return parsed as T[];
    if (parsed && typeof parsed === "object" && Array.isArray((parsed as { ideas?: unknown }).ideas)) {
      return (parsed as { ideas: T[] }).ideas;
    }
  } catch {
    // fall through
  }
  // Find first [...] block
  const start = candidate.indexOf("[");
  const end = candidate.lastIndexOf("]");
  if (start >= 0 && end > start) {
    try {
      const parsed = JSON.parse(candidate.slice(start, end + 1));
      if (Array.isArray(parsed)) return parsed as T[];
    } catch {
      return null;
    }
  }
  return null;
}

export const AI_CORE_VERSION = "0.2.0";
export const AI_CORE_PLACEHOLDER = false;
