import { Schema, model, models } from "mongoose";

const schema = new Schema({
  key: { type: String, required: true },
  windowStart: { type: Date, required: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
}, { timestamps: false });

schema.index({ key: 1, windowStart: 1 }, { unique: true });
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const RateLimit = models.RateLimit || model("RateLimit", schema);
