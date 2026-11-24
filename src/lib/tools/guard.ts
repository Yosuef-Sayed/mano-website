import "server-only";
import { rateLimit, todayKey } from "../rateLimit";
import { toolLimits } from "./config";

/** Per-visitor daily limit for one tool. */
export async function visitorLimit(tool: string, ip: string) {
  return rateLimit(`tool:${tool}:${todayKey()}:${ip}`, toolLimits.perVisitorPerDay, 26 * 3600);
}

/** Global daily AI ceiling across all tools — protects the API budget. */
export async function aiBudget() {
  return rateLimit(`tool:ai-budget:${todayKey()}`, toolLimits.aiRunsPerDay, 26 * 3600);
}
