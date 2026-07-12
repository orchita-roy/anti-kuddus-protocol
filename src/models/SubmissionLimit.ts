import { Schema, model, models } from "mongoose";
const schema = new Schema({ dailyToken: String, dateKey: String, count: { type: Number, default: 0 }, expiresAt: Date }, { timestamps: true });
schema.index({ dailyToken: 1, dateKey: 1 }, { unique: true }); schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const SubmissionLimit = models.SubmissionLimit || model("SubmissionLimit", schema);
