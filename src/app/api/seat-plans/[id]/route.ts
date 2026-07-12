import { requireRole } from "@/lib/permissions";
import { connectToDatabase } from "@/lib/mongodb";
import { SeatPlan } from "@/models/SeatPlan";
import { ok, fail, errorResponse } from "@/lib/api";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await requireRole("student", "teacher", "admin")) return fail("FORBIDDEN", "Sign in required", 403);
    await connectToDatabase();
    const item = await SeatPlan.findById((await params).id).lean();
    return item ? ok(item) : fail("NOT_FOUND", "Seat plan not found", 404);
  } catch (error) { return errorResponse(error); }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!await requireRole("teacher", "admin")) return fail("FORBIDDEN", "Teacher access required", 403);
    await connectToDatabase();
    const item = await SeatPlan.findByIdAndDelete((await params).id);
    return item ? ok({ deleted: true }) : fail("NOT_FOUND", "Seat plan not found", 404);
  } catch (error) { return errorResponse(error); }
}
