import { Schema, model, models } from "mongoose";
const schema = new Schema({ title: String, type: { type: String, enum: ["curriculum","past_question","rulebook"] }, subject: String, originalFileId: Schema.Types.ObjectId, status: { type: String, enum: ["processing","ready","failed"] }, pageCount: Number, errorMessage: String, uploadedBy: Schema.Types.ObjectId }, { timestamps: true });
export const SourceDocument = models.SourceDocument || model("SourceDocument", schema);
