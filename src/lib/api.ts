import { NextResponse } from "next/server";
export const ok = <T>(data: T, message?: string, status = 200) => NextResponse.json({ success: true, data, ...(message ? { message } : {}) }, { status });
export const fail = (code: string, message: string, status = 400, fieldErrors?: unknown) => NextResponse.json({ success: false, error: { code, message, ...(fieldErrors ? { fieldErrors } : {}) } }, { status });
export function errorResponse(error: unknown) { console.error(error instanceof Error ? error.message : "Unknown server error"); return fail("INTERNAL_ERROR", "The request could not be completed", 500); }
