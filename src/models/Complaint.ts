import { Schema, model, models } from "mongoose";
const schema = new Schema({ publicId: { type: String, required: true, unique: true }, category: { type: String, enum: ["tiffin_theft","washroom_bribe","syllabus_bloat","seat_abuse","sports_abuse","other"], index: true }, description: { type: String, required: true }, incidentDate: { type: Date, required: true, index: true }, location: { type: String, required: true }, evidenceFileId: Schema.Types.ObjectId, status: { type: String, enum: ["pending","verified","rejected"], default: "pending", index: true }, reviewReason: String, reviewedBy: Schema.Types.ObjectId, reviewedAt: Date }, { timestamps: true, strict: "throw" });
schema.index({ createdAt: -1 });
export const Complaint = models.Complaint || model("Complaint", schema);
