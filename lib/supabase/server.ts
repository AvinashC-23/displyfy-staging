import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { isPersistentMode, requireSupabasePublicConfig } from "@/lib/config";

export { isPersistentMode, isProductionMode } from "@/lib/config";

export async function createServerSupabase() {
  const { url, key } = requireSupabasePublicConfig();
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (values) => {
        try { values.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch { /* Server Components cannot write refreshed cookies. */ }
      }
    }
  });
}

export function createAdminSupabase() {
  const { url } = requireSupabasePublicConfig();
  const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Supabase server credential is missing.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export type AppRole = "creator" | "brand" | "admin";

export async function authenticatedProfile(requiredRole?: AppRole, requireMfa = false) {
  if (!isPersistentMode()) return null;
  const client = await createServerSupabase();
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) return null;
  const { data: profile } = await client.from("profiles").select("id,role,suspended_at").eq("id", user.id).maybeSingle();
  if (!profile || profile.suspended_at || (requiredRole && profile.role !== requiredRole)) return null;
  if (requireMfa) {
    const { data: assurance } = await client.auth.mfa.getAuthenticatorAssuranceLevel();
    if (assurance?.currentLevel !== "aal2") return null;
  }
  return { user, profile, client };
}

export async function currentViewer() {
  return authenticatedProfile();
}

export function roleHome(role: AppRole) {
  if (role === "brand") return "/brand/dashboard";
  if (role === "admin") return "/admin";
  return "/creator/dashboard";
}
