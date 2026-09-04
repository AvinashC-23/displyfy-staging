import { NextRequest, NextResponse } from "next/server";
import { enforceSameOrigin } from "@/lib/http";
import { createServerSupabase } from "@/lib/supabase/server";
import { isPersistentMode } from "@/lib/config";

export async function POST(request: NextRequest) {
  const blocked = enforceSameOrigin(request);
  if (blocked) return blocked;
  if (!isPersistentMode()) return NextResponse.redirect(new URL("/", request.url), 303);
  const client = await createServerSupabase();
  await client.auth.signOut({ scope: "local" });
  return NextResponse.redirect(new URL("/", request.url), 303);
}
