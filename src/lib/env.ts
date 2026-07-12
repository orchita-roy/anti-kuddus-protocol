import "server-only";
import { z } from "zod";

const schema = z.object({
  MONGODB_URI: z.string().min(1),
  MONGODB_DB_NAME: z.string().default("anti_kuddus_protocol"),
  AUTH_SECRET: z.string().min(16),
  ROLL_LOOKUP_SECRET: z.string().min(16),
  COMPLAINT_HMAC_SECRET: z.string().min(16),
  VOTE_HMAC_SECRET: z.string().min(16).optional(),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_TEXT_MODEL: z.string().default("gemini-2.5-flash"),
  GEMINI_EMBEDDING_MODEL: z.string().default("text-embedding-004"),
  PUSHER_APP_ID: z.string().optional(), PUSHER_KEY: z.string().optional(), PUSHER_SECRET: z.string().optional(), PUSHER_CLUSTER: z.string().default("ap2"),
  MAX_UPLOAD_MB: z.coerce.number().positive().default(5),
  ENABLE_DEMO_AI_FALLBACK: z.enum(["true", "false"]).default("false").transform(v => v === "true"),
  TRUTHLENS_MAX_UPLOAD_MB: z.coerce.number().positive().max(20).default(5),
  ENABLE_TRUTHLENS_WEB_SEARCH: z.enum(["true", "false"]).default("false").transform(v => v === "true"),
  ASSISTANT_MAX_CONTEXT_CHARS: z.coerce.number().int().min(1000).max(50000).default(16000),
  ASSISTANT_MAX_MESSAGES_PER_HOUR: z.coerce.number().int().min(1).max(200).default(30),
  BEHAVIOUR_ANALYSIS_LOOKBACK_DAYS: z.coerce.number().int().min(7).max(365).default(30)
});

export function getEnv() {
  const result = schema.safeParse(process.env);
  if (!result.success) throw new Error(`Server configuration error: ${result.error.issues.map(i => i.path.join(".")).join(", ")} missing or invalid`);
  return result.data;
}
