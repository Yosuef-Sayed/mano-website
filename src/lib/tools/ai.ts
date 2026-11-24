import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { z } from "zod";
import { toolModel } from "./config";

export class AiRefusedError extends Error {}
export class AiFailedError extends Error {}

let client: Anthropic | null = null;
function getClient() {
  if (!client) client = new Anthropic({ timeout: 55_000, maxRetries: 1 });
  return client;
}

/**
 * One structured call. Untrusted input (page text, user descriptions) must already be wrapped
 * in clearly delimited data tags inside `user`; the system prompt tells the model it is data only.
 * No tools are given to the model, so injected instructions have nothing to act on.
 */
export async function runStructured<S extends z.ZodType>(opts: { system: string; user: string; schema: S; maxTokens?: number }): Promise<z.infer<S>> {
  try {
    const res = await getClient().beta.messages.parse({
      model: toolModel,
      max_tokens: opts.maxTokens ?? 8000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "medium", format: betaZodOutputFormat(opts.schema) },
      system: opts.system,
      messages: [{ role: "user", content: opts.user }],
    });
    if (res.stop_reason === "refusal") throw new AiRefusedError("refused");
    if (res.stop_reason === "max_tokens" || !res.parsed_output) throw new AiFailedError(`incomplete: ${res.stop_reason}`);
    return res.parsed_output as z.infer<S>;
  } catch (e) {
    if (e instanceof AiRefusedError || e instanceof AiFailedError) throw e;
    if (e instanceof Anthropic.APIError) {
      console.error("[ai] API error", e.status, e.message);
      throw new AiFailedError(`api ${e.status}`);
    }
    console.error("[ai] error", e);
    throw new AiFailedError("unknown");
  }
}
