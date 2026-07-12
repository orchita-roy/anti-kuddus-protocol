import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { rollLookupHash } from "@/lib/crypto";
import { User } from "@/models/User";
import { checkRateLimit } from "@/lib/rate-limit";

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/login" },
  providers: [CredentialsProvider({
    name: "Class credentials",
    credentials: { rollNumber: { label: "Roll number", type: "text" }, classCode: { label: "Secret class code", type: "password" } },
    async authorize(raw) {
      const parsed = z.object({ rollNumber: z.string().min(1).max(20), classCode: z.string().min(6).max(100) }).safeParse(raw);
      if (!parsed.success) return null;
      await connectToDatabase();
      const lookupHash = rollLookupHash(parsed.data.rollNumber);
      const rate = await checkRateLimit("login", lookupHash, 8, 15 * 60 * 1000);
      if (!rate.allowed) return null;
      const user = await User.findOne({ rollLookupHash: lookupHash, active: true }).lean() as any;
      if (!user || !(await bcrypt.compare(parsed.data.classCode, user.secretHash))) return null;
      return { id: String(user._id), name: user.name, role: user.role, captainRank: user.captainRank };
    }
  })],
  callbacks: {
    jwt({ token, user }) { if (user) { token.id = user.id; token.role = user.role; token.captainRank = user.captainRank; } return token; },
    session({ session, token }) { session.user = { id: String(token.id), name: session.user?.name ?? String(token.name ?? "User"), role: token.role as "student" | "captain" | "teacher" | "admin", ...(token.captainRank ? { captainRank: token.captainRank } : {}) }; return session; }
  }
};
