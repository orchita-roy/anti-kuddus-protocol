import { sosSchema } from "@/lib/validations";
import { requireRole } from "@/lib/permissions";
import { connectToDatabase } from "@/lib/mongodb";
import { checkRateLimit } from "@/lib/rate-limit";
import { publishSosEvent } from "@/lib/pusher-server";
import { SosAlert } from "@/models/SosAlert";
import { publicId } from "@/lib/crypto";
import { ok, fail, errorResponse } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const user = await requireRole("student");
    if (!user) return fail("FORBIDDEN", "Student access required", 403);
    const rate = await checkRateLimit("sos", user.id, 3, 5 * 60 * 1000);
    if (!rate.allowed) return fail("RATE_LIMITED", "Too many SOS requests. Try again shortly.", 429);
    const parsed = sosSchema.safeParse(await request.json());
    if (!parsed.success) return fail("VALIDATION_ERROR", parsed.error.issues[0].message, 422);
    await connectToDatabase();
    const existing = await SosAlert.findOne({ idempotencyKey: parsed.data.idempotencyKey });
    if (existing) return ok(existing, "Existing alert returned");
    const alert = await SosAlert.create({ ...parsed.data, publicId: publicId("SOS") });
    await publishSosEvent("sos-created", { publicId: alert.publicId, location: alert.location, status: alert.status, createdAt: alert.createdAt }).catch(() => false);
    return ok(alert, "SOS dispatched", 201);
  } catch (error) { return errorResponse(error); }
}
