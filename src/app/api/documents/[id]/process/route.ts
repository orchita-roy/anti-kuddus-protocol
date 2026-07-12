import mongoose from "mongoose";
import { requireRole } from "@/lib/permissions";
import { connectToDatabase } from "@/lib/mongodb";
import { SourceDocument } from "@/models/SourceDocument";
import { DocumentChunk } from "@/models/DocumentChunk";
import { chunkText } from "@/algorithms/core";
import { embedText } from "@/services/embedding.service";
import { ok, fail, errorResponse } from "@/lib/api";

export const runtime = "nodejs";
export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await requireRole("teacher", "admin")) return fail("FORBIDDEN", "Teacher access required", 403);
    await connectToDatabase();
    const document = await SourceDocument.findById((await params).id);
    if (!document) return fail("NOT_FOUND", "Document not found", 404);
    document.status = "processing"; document.errorMessage = undefined; await document.save();
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db!, { bucketName: "documents" });
    const buffers: Buffer[] = [];
    await new Promise<void>((resolve, reject) => bucket.openDownloadStream(document.originalFileId).on("data", (chunk) => buffers.push(chunk)).on("end", resolve).on("error", reject));
    const buffer = Buffer.concat(buffers);
    let text: string;
    const file = await mongoose.connection.db!.collection("documents.files").findOne({ _id: document.originalFileId });
    if (file?.metadata?.contentType === "application/pdf") text = (await (await import("pdf-parse")).default(buffer)).text;
    else text = buffer.toString("utf8");
    const chunks = chunkText(text);
    if (!chunks.length) throw new Error("No readable text found");
    await DocumentChunk.deleteMany({ documentId: document._id });
    const records = [];
    for (let index = 0; index < chunks.length; index++) {
      const embedding = await embedText(chunks[index]);
      records.push({ documentId: document._id, documentType: document.type, subject: document.subject, sourceTitle: document.title, chunkIndex: index, text: chunks[index], embedding: embedding.values });
    }
    await DocumentChunk.insertMany(records);
    document.status = "ready"; await document.save();
    return ok({ document, chunkCount: records.length }, "Document processed");
  } catch (error) { return errorResponse(error); }
}
