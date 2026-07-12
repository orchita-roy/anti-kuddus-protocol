import { Schema, model, models } from "mongoose";
const schema = new Schema({ documentId: { type: Schema.Types.ObjectId, index: true }, documentType: { type: String, index: true }, subject: { type: String, index: true }, sourceTitle: String, pageNumber: Number, chunkIndex: Number, text: String, embedding: [Number] }, { timestamps: { createdAt: true, updatedAt: false } });
schema.index({ documentType: 1, subject: 1 });
export const DocumentChunk = models.DocumentChunk || model("DocumentChunk", schema);
