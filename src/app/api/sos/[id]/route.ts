import { requireRole } from "@/lib/permissions";
import { connectToDatabase } from "@/lib/mongodb";
import { SosAlert } from "@/models/SosAlert";
import { ok, fail, errorResponse } from "@/lib/api";
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) { try { if (!await requireRole("student", "captain", "admin")) return fail("FORBIDDEN", "Sign in required", 403); await connectToDatabase(); const item = await SosAlert.findOne({ publicId: (await params).id }).select("publicId location status acknowledgedAt resolvedAt createdAt").lean(); return item ? ok(item) : fail("NOT_FOUND", "SOS alert not found", 404); } catch (error) { return errorResponse(error); } }
