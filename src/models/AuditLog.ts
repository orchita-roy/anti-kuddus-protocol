import { Schema, model, models } from "mongoose";
const schema = new Schema({ actorId: Schema.Types.ObjectId, action: String, entityType: String, entityId: Schema.Types.ObjectId, safeMetadata: Schema.Types.Mixed }, { timestamps: { createdAt: true, updatedAt: false } });
export const AuditLog = models.AuditLog || model("AuditLog", schema);
