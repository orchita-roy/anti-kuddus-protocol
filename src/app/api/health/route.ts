import { connectToDatabase } from "@/lib/mongodb"; import { ok, fail } from "@/lib/api";
export const runtime = "nodejs";
export async function GET() { try { await connectToDatabase(); return ok({ status: "healthy", database: "connected", timestamp: new Date().toISOString() }); } catch { return fail("DATABASE_UNAVAILABLE", "Database is unavailable", 503); } }
