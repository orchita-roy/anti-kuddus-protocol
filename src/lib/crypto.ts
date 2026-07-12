import { createHmac, randomUUID } from "crypto";
import { getEnv } from "@/lib/env";
export const normalizeRoll = (value: string) => value.trim().toUpperCase().replace(/\s+/g, "");
export const hmac = (secret: string, value: string) => createHmac("sha256", secret).update(value).digest("hex");
export const rollLookupHash = (roll: string) => hmac(getEnv().ROLL_LOOKUP_SECRET, normalizeRoll(roll));
export const dailyComplaintToken = (userId: string, dateKey: string) => hmac(getEnv().COMPLAINT_HMAC_SECRET, `${userId}:${dateKey}`);
export const publicId = (prefix: string) => `${prefix}-${randomUUID().split("-")[0].toUpperCase()}`;
