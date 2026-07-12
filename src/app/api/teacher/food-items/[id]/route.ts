import { z } from "zod";
import { requireRole } from "@/lib/permissions";
import { connectToDatabase } from "@/lib/mongodb";
import { FoodItem } from "@/models/FoodItem";
import { ok, fail, errorResponse } from "@/lib/api";
const schema = z.object({ name: z.string().min(2).max(80).optional(), unit: z.string().min(1).max(30).optional(), estimatedCaloriesPerUnit: z.number().positive().max(5000).optional(), active: z.boolean().optional() });
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) { try { if (!await requireRole("teacher", "admin")) return fail("FORBIDDEN", "Teacher access required", 403); const parsed = schema.safeParse(await request.json()); if (!parsed.success) return fail("VALIDATION_ERROR", parsed.error.issues[0].message, 422); await connectToDatabase(); const item = await FoodItem.findByIdAndUpdate((await params).id, parsed.data, { new: true, runValidators: true }); return item ? ok(item, "Food item updated") : fail("NOT_FOUND", "Food item not found", 404); } catch (error) { return errorResponse(error); } }
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) { try { if (!await requireRole("teacher", "admin")) return fail("FORBIDDEN", "Teacher access required", 403); await connectToDatabase(); const item = await FoodItem.findByIdAndDelete((await params).id); return item ? ok({ deleted: true }) : fail("NOT_FOUND", "Food item not found", 404); } catch (error) { return errorResponse(error); } }
