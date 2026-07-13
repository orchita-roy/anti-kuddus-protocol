import "server-only";
import { createHash } from "node:crypto";
import { connectToDatabase } from "@/lib/mongodb";
import { RateLimit } from "@/models/RateLimit";

export function effectiveRateLimit(limit: number) {
  const configured = Number(process.env.RATE_LIMIT_MULTIPLIER ?? 1);
  const multiplier = Number.isFinite(configured) ? Math.min(100, Math.max(1, configured)) : 1;
  return Math.max(1, Math.floor(limit * multiplier));
}

export async function checkRateLimit(scope: string, identifier: string, limit: number, windowMs: number) {
  await connectToDatabase();
  const effectiveLimit = effectiveRateLimit(limit);
  const now = Date.now();
  const windowStart = new Date(Math.floor(now / windowMs) * windowMs);
  const key = createHash("sha256").update(`${scope}:${identifier}`).digest("hex");
  const expiresAt = new Date(windowStart.getTime() + windowMs * 2);
  const record = await RateLimit.findOneAndUpdate(
    { key, windowStart },
    { $inc: { count: 1 }, $setOnInsert: { expiresAt } },
    { upsert: true, new: true },
  ).lean() as unknown as { count: number };
  return { allowed: record.count <= effectiveLimit, remaining: Math.max(0, effectiveLimit - record.count), retryAfterSeconds: Math.ceil((windowStart.getTime() + windowMs - now) / 1000) };
}
