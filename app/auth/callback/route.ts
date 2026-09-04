import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase, roleHome } from "@/lib/supabase/server";

function safeNext(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : null;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL("/creator/login?error=invalid-callback", url));

  const client = await createServerSupabase();
  const { error } = await client.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL("/creator/login?error=invalid-callback", url));

  const { data: { user } } = await client.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/creator/login?error=invalid-callback", url));
  const { data: profile } = await client.from("profiles").select("role,suspended_at").eq("id", user.id).maybeSingle();
  if (!profile || profile.suspended_at) {
    await client.auth.signOut({ scope: "local" });
    return NextResponse.redirect(new URL("/creator/login?error=account-unavailable", url));
  }

  const destination = safeNext(url.searchParams.get("next")) ?? roleHome(profile.role);
  return NextResponse.redirect(new URL(destination, url));
}
