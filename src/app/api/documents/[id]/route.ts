import mongoose from "mongoose";
import { requireRole } from "@/lib/permissions";
import { connectToDatabase } from "@/lib/mongodb";
import { SourceDocument } from "@/models/SourceDocument";
import { DocumentChunk } from "@/models/DocumentChunk";
import { ok, fail, errorResponse } from "@/lib/api";

export const runtime = "nodejs";
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await requireRole("teacher", "admin")) return fail("FORBIDDEN", "Teacher access required", 403);
    await connectToDatabase();
    const document = await SourceDocument.findByIdAndDelete((await params).id);
    if (!document) return fail("NOT_FOUND", "Document not found", 404);
    await DocumentChunk.deleteMany({ documentId: document._id });
    if (document.originalFileId) {
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db!, { bucketName: "documents" });
      await bucket.delete(document.originalFileId).catch(() => undefined);
    }
    return ok({ deleted: true });
  } catch (error) { return errorResponse(error); }
}
