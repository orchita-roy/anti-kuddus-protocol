import "server-only";
import { z } from "zod";

const schema = z.object({
  MONGODB_URI: z.string().min(1),
  MONGODB_DB_NAME: z.string().default("anti_kuddus_protocol"),
  AUTH_SECRET: z.string().min(16),
  ROLL_LOOKUP_SECRET: z.string().min(16),
  COMPLAINT_HMAC_SECRET: z.string().min(16),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_TEXT_MODEL: z.string().default("gemini-2.5-flash"),
  GEMINI_EMBEDDING_MODEL: z.string().default("text-embedding-004"),
  PUSHER_APP_ID: z.string().optional(), PUSHER_KEY: z.string().optional(), PUSHER_SECRET: z.string().optional(), PUSHER_CLUSTER: z.string().default("ap2"),
  MAX_UPLOAD_MB: z.coerce.number().positive().default(5),
  ENABLE_DEMO_AI_FALLBACK: z.enum(["true", "false"]).default("false").transform(v => v === "true")
});

export function getEnv() {
  const result = schema.safeParse(process.env);
  if (!result.success) throw new Error(`Server configuration error: ${result.error.issues.map(i => i.path.join(".")).join(", ")} missing or invalid`);
  return result.data;
}
