import bcrypt from "bcryptjs";
import { z } from "zod";
import { requireRole } from "@/lib/permissions";
import { connectToDatabase } from "@/lib/mongodb";
import { rollLookupHash } from "@/lib/crypto";
import { User } from "@/models/User";
import { ok, fail, errorResponse } from "@/lib/api";

const createSchema = z.object({ name: z.string().min(2).max(80), rollNumber: z.string().min(1).max(20), classCode: z.string().min(8).max(100), role: z.enum(["student", "captain", "teacher", "admin"]), captainRank: z.union([z.literal(2), z.literal(3)]).optional() });
export async function GET() { try { if (!await requireRole("admin")) return fail("FORBIDDEN", "Admin access required", 403); await connectToDatabase(); const users = await User.find().sort({ role: 1, name: 1 }).select("name role captainRank active createdAt").lean(); return ok(users); } catch (error) { return errorResponse(error); } }
export async function POST(request: Request) { try { if (!await requireRole("admin")) return fail("FORBIDDEN", "Admin access required", 403); const parsed = createSchema.safeParse(await request.json()); if (!parsed.success) return fail("VALIDATION_ERROR", parsed.error.issues[0].message, 422); await connectToDatabase(); const user = await User.create({ name: parsed.data.name, rollLookupHash: rollLookupHash(parsed.data.rollNumber), secretHash: await bcrypt.hash(parsed.data.classCode, 12), role: parsed.data.role, captainRank: parsed.data.captainRank, active: true }); return ok({ id: user._id, name: user.name, role: user.role, active: user.active }, "User created", 201); } catch (error) { return errorResponse(error); } }
