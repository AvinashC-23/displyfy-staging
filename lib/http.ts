import { NextRequest, NextResponse } from "next/server";
import type { ZodType } from "zod";

const attempts = new Map<string, { count: number; resetAt: number }>();

export function enforceSameOrigin(request: NextRequest): NextResponse | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;
  const requestHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? new URL(request.url).host;
  let originHost: string;
  try { originHost = new URL(origin).host; } catch { return NextResponse.json({ error: "Request could not be accepted." }, { status: 403 }); }
  return originHost === requestHost ? null : NextResponse.json({ error: "Request could not be accepted." }, { status: 403 });
}

export function enforceRateLimit(request: NextRequest, limit = 20, windowMs = 60_000): NextResponse | null {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const key = `${request.nextUrl.pathname}:${ip}`;
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }
  if (current.count >= limit) return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
  current.count += 1;
  return null;
}

export async function parseJson<T>(request: NextRequest, schema: ZodType<T>): Promise<{ data: T } | { response: NextResponse }> {
  const maximumBytes = 64 * 1024;
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > maximumBytes) {
    return { response: NextResponse.json({ error: "Request body is too large." }, { status: 413 }) };
  }
  let value: unknown;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > maximumBytes) return { response: NextResponse.json({ error: "Request body is too large." }, { status: 413 }) };
    value = JSON.parse(raw);
  } catch { return { response: NextResponse.json({ error: "Invalid request body." }, { status: 400 }) }; }
  const result = schema.safeParse(value);
  if (!result.success) return { response: NextResponse.json({ error: "Review the submitted fields.", issues: result.error.flatten().fieldErrors }, { status: 422 }) };
  return { data: result.data };
}

export function demoAccepted(message: string, data: Record<string, unknown> = {}) {
  return NextResponse.json({ message, mode: "demo", persisted: false, externallyDelivered: false, ...data }, { status: 202 });
}
