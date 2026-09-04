import { afterEach, describe, expect, it } from "vitest";
import { assertRuntimeConfiguration, getAppMode } from "@/lib/config";

const original = { ...process.env };

afterEach(() => {
  process.env = { ...original };
});

describe("runtime configuration", () => {
  it("fails closed when a production runtime has no explicit mode", () => {
    delete process.env.DISPLYFY_PROVIDER_MODE;
    delete process.env.NEXT_PHASE;
    Reflect.set(process.env, "NODE_ENV", "production");
    expect(() => getAppMode()).toThrow(/DISPLYFY_PROVIDER_MODE/);
  });

  it("refuses demo mode on Vercel", () => {
    process.env.DISPLYFY_PROVIDER_MODE = "demo";
    process.env.VERCEL = "1";
    expect(() => assertRuntimeConfiguration()).toThrow(/Demo mode/);
  });

  it("requires a strong invitation pepper in staging", () => {
    process.env.DISPLYFY_PROVIDER_MODE = "staging";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test";
    process.env.SUPABASE_SECRET_KEY = "sb_secret_test";
    process.env.NEXT_PUBLIC_APP_URL = "https://staging.example.com";
    process.env.INVITATION_TOKEN_PEPPER = "short";
    expect(() => assertRuntimeConfiguration()).toThrow(/at least 32/);
  });
});
