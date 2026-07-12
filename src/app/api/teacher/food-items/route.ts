import { z } from "zod";
import { requireRole } from "@/lib/permissions";
import { connectToDatabase } from "@/lib/mongodb";
import { FoodItem } from "@/models/FoodItem";
import { ok, fail, errorResponse } from "@/lib/api";
const schema = z.object({ name: z.string().min(2).max(80), unit: z.string().min(1).max(30), estimatedCaloriesPerUnit: z.number().positive().max(5000), active: z.boolean().default(true) });
export async function POST(request: Request) { try { if (!await requireRole("teacher", "admin")) return fail("FORBIDDEN", "Teacher access required", 403); const parsed = schema.safeParse(await request.json()); if (!parsed.success) return fail("VALIDATION_ERROR", parsed.error.issues[0].message, 422); await connectToDatabase(); return ok(await FoodItem.create(parsed.data), "Food item created", 201); } catch (error) { return errorResponse(error); } }
