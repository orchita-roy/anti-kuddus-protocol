import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export type Role = "student" | "captain" | "teacher" | "admin";
export async function requireRole(...roles: Role[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !roles.includes(session.user.role)) return null;
  return session.user;
}
