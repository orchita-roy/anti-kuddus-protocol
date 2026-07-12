import { z } from "zod";
import { requireRole } from "@/lib/permissions";
import { connectToDatabase } from "@/lib/mongodb";
import { SeatPlan } from "@/models/SeatPlan";
import { visibilityScore } from "@/algorithms/core";
import { ok, fail, errorResponse } from "@/lib/api";

export async function POST(request: Request) {
  try {
    if (!await requireRole("student", "teacher", "admin")) return fail("FORBIDDEN", "Sign in required", 403);
    const parsed = z.object({ planId: z.string().min(1) }).safeParse(await request.json());
    if (!parsed.success) return fail("VALIDATION_ERROR", "A valid plan ID is required", 422);
    await connectToDatabase();
    const plan = await SeatPlan.findById(parsed.data.planId);
    if (!plan) return fail("NOT_FOUND", "Seat plan not found", 404);
    const assignments = plan.assignments.map((item: any) => item.toObject ? item.toObject() : item);
    const kuddus = assignments.find((item: any) => item.isKuddus);
    const swaps: string[] = [];
    if (kuddus) {
      for (let iteration = 0; iteration < 20; iteration++) {
        const blocker = assignments.find((item: any) => item.row < kuddus.row && item.column === kuddus.column && item.heightCm > kuddus.heightCm + 5);
        if (!blocker) break;
        const replacement = assignments.filter((item: any) => item.row >= kuddus.row && !item.isKuddus && item.heightCm < blocker.heightCm).sort((a: any, b: any) => a.heightCm - b.heightCm)[0];
        if (!replacement) break;
        const from = { row: blocker.row, column: blocker.column };
        blocker.row = replacement.row; blocker.column = replacement.column;
        replacement.row = from.row; replacement.column = from.column;
        swaps.push(`Swapped ${blocker.name} with ${replacement.name} to improve the teacher sightline.`);
      }
    }
    const score = visibilityScore(assignments);
    plan.assignments = assignments;
    plan.visibilityStatus = score.visibilityStatus;
    plan.score = score.score;
    plan.explanation = [...score.explanation, ...swaps];
    await plan.save();
    return ok(plan, "Seat plan optimized");
  } catch (error) { return errorResponse(error); }
}
