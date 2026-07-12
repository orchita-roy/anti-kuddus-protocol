import "next-auth";
declare module "next-auth" {
  interface User { role: "student" | "captain" | "teacher" | "admin"; captainRank?: 2 | 3 }
  interface Session { user: { id: string; name: string; role: "student" | "captain" | "teacher" | "admin"; captainRank?: 2 | 3 } }
}
declare module "next-auth/jwt" { interface JWT { id: string; role: string; captainRank?: 2 | 3 } }
