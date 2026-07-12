import { getToken } from "next-auth/jwt";import { ok } from "@/lib/api";
export async function GET(request:Request){const token=await getToken({req:request as any,secret:process.env.AUTH_SECRET});return ok(token?{id:String(token.id),name:String(token.name??"User"),role:String(token.role),captainRank:token.captainRank??null}:null)}
