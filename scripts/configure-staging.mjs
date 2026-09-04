import { execFileSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRef = process.argv[2];
if (!/^[a-z]{20}$/.test(projectRef ?? "")) {
  throw new Error("Usage: npm run configure:staging -- <supabase-project-ref>");
}

const target = resolve(".env.local");
if (existsSync(target) && process.env.FORCE !== "1") {
  throw new Error(".env.local already exists. Refusing to overwrite it without FORCE=1.");
}

const raw = execFileSync("npx", ["--yes", "supabase@latest", "projects", "api-keys", "--project-ref", projectRef, "--reveal", "--output", "json"], {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "inherit"]
});
const keys = JSON.parse(raw);
const publishable = keys.find((key) => key.type === "publishable")?.api_key;
const secret = keys.find((key) => key.type === "secret")?.api_key;
if (!publishable || !secret || secret.includes("·")) throw new Error("Current Supabase API keys could not be retrieved.");

const values = [
  "DISPLYFY_PROVIDER_MODE=staging",
  "NEXT_PUBLIC_APP_URL=http://127.0.0.1:3000",
  `NEXT_PUBLIC_SUPABASE_URL=https://${projectRef}.supabase.co`,
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${publishable}`,
  `SUPABASE_SECRET_KEY=${secret}`,
  `INVITATION_TOKEN_PEPPER=${randomBytes(48).toString("base64url")}`,
  ""
].join("\n");

writeFileSync(target, values, { encoding: "utf8", mode: 0o600, flag: "wx" });
console.log("Created .env.local with staging configuration. Credential values were not printed.");
