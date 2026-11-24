import "server-only";
import { sharedLimiter } from "../rateLimit";

/**
 * Free-tool limits and switches. Override with environment variables; see .env.example.
 */
export const toolLimits = {
  /** Runs per visitor (IP) per day, per tool. */
  perVisitorPerDay: Number(process.env.TOOLS_PER_VISITOR_DAILY || 3),
  /** Total AI-assisted runs per day across all visitors and tools (cost ceiling). */
  aiRunsPerDay: Number(process.env.TOOLS_AI_DAILY_LIMIT || 60),
};

export const toolModel = process.env.TOOLS_MODEL || "claude-opus-5-5";

/**
 * AI features need an Anthropic key. In production they also need the shared (Upstash) limiter,
 * because per-instance memory can't enforce a daily cost ceiling on serverless hosting.
 */
export function aiEnabled(): boolean {
  if (process.env.TOOLS_AI_DISABLED === "true") return false;
  if (!process.env.ANTHROPIC_API_KEY) return false;
  return sharedLimiter || process.env.NODE_ENV !== "production";
}
