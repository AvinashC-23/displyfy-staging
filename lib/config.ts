export type AppMode = "demo" | "staging" | "production";

const validModes = new Set<AppMode>(["demo", "staging", "production"]);

export function getAppMode(): AppMode {
  const configured = process.env.DISPLYFY_PROVIDER_MODE;
  if (configured && validModes.has(configured as AppMode)) return configured as AppMode;

  // Next evaluates routes while producing local builds. Runtime deployments must
  // always provide an explicit mode so a missing variable can never enable demo data.
  if (process.env.NEXT_PHASE === "phase-production-build" || process.env.NODE_ENV !== "production") {
    return "demo";
  }

  throw new Error("DISPLYFY_PROVIDER_MODE must be demo, staging, or production.");
}

export function isDemoMode() {
  return getAppMode() === "demo";
}

export function isPersistentMode() {
  return getAppMode() !== "demo";
}

export function isProductionMode() {
  return getAppMode() === "production";
}

export function requireSupabasePublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase public configuration is missing.");
  return { url, key };
}

export function assertRuntimeConfiguration() {
  const mode = getAppMode();
  if (mode === "demo") {
    if (process.env.VERCEL === "1") throw new Error("Demo mode is not permitted on Vercel.");
    return;
  }

  requireSupabasePublicConfig();
  if (!process.env.SUPABASE_SECRET_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase server credential is missing.");
  if (!process.env.INVITATION_TOKEN_PEPPER || process.env.INVITATION_TOKEN_PEPPER.length < 32) {
    throw new Error("INVITATION_TOKEN_PEPPER must contain at least 32 characters.");
  }
  if (!process.env.NEXT_PUBLIC_APP_URL) throw new Error("NEXT_PUBLIC_APP_URL is missing.");
}
