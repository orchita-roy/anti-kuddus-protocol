import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ token, req }) {
      if (!token) return false;
      const path = req.nextUrl.pathname;
      const role = token.role;
      if (path.startsWith("/admin")) return role === "admin";
      if (path.startsWith("/teacher")) return role === "teacher" || role === "admin";
      if (path.startsWith("/captain")) return role === "captain" || role === "admin";
      if (path.startsWith("/assistant") || path.startsWith("/truthlens") || path.startsWith("/democracy")) return role === "student" || role === "captain" || role === "teacher" || role === "admin";
      if (path.startsWith("/seat-planner")) return role === "student" || role === "teacher" || role === "admin";
      return role === "student";
    },
  },
});

export const config={matcher:["/dashboard/:path*","/complaints/:path*","/seat-planner/:path*","/syllabus/:path*","/ledger/:path*","/sos/:path*","/fact-check/:path*","/assistant/:path*","/truthlens/:path*","/democracy/:path*","/captain/:path*","/teacher/:path*","/admin/:path*"]};
