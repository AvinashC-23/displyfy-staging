import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { assertRuntimeConfiguration, getAppMode } from "@/lib/config";

type AppRole = "creator" | "brand" | "admin";

const roleForPath = (path: string): AppRole | null => path.startsWith("/admin") ? "admin" : path.startsWith("/brand/") ? "brand" : path.startsWith("/creator/dashboard") || path.startsWith("/creator/missions") ? "creator" : null;
const homeForRole = (role: AppRole) => role === "brand" ? "/brand/dashboard" : role === "admin" ? "/admin" : "/creator/dashboard";
const loginForRole = (role: AppRole) => role === "brand" ? "/brand/login" : role === "admin" ? "/admin/login" : "/creator/login";
const loginPaths = new Set(["/creator/login", "/brand/login", "/admin/login"]);

export async function proxy(request: NextRequest) {
  try {
    assertRuntimeConfiguration();
  } catch {
    return NextResponse.json({ error: "Staging authentication is not configured." }, { status: 503 });
  }
  if (getAppMode() === "demo") return NextResponse.next();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  let response = NextResponse.next({ request });
  const redirect = (target: URL) => {
    const redirected = NextResponse.redirect(target);
    response.cookies.getAll().forEach((cookie) => redirected.cookies.set(cookie));
    return redirected;
  };
  const client = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (values) => {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      }
    }
  });
  const { data: { user } } = await client.auth.getUser();
  const path = request.nextUrl.pathname;
  const expectedRole = roleForPath(path);

  if (!user) {
    if (loginPaths.has(path)) return response;
    if (!expectedRole) return response;
    const login = new URL(loginForRole(expectedRole), request.url);
    login.searchParams.set("next", `${path}${request.nextUrl.search}`);
    return redirect(login);
  }

  const { data: profile } = await client.from("profiles").select("role,suspended_at").eq("id", user.id).maybeSingle();
  if (!profile || profile.suspended_at) {
    await client.auth.signOut({ scope: "local" });
    return redirect(new URL("/creator/login?error=account-unavailable", request.url));
  }

  const role = profile.role as AppRole;
  if (path === "/" || loginPaths.has(path)) {
    return redirect(new URL(homeForRole(role), request.url));
  }
  if (expectedRole && role !== expectedRole) return redirect(new URL(homeForRole(role), request.url));
  if (role === "admin" && expectedRole === "admin") {
    const { data: assurance } = await client.auth.mfa.getAuthenticatorAssuranceLevel();
    if (assurance?.currentLevel !== "aal2" && path !== "/admin/mfa") return redirect(new URL("/admin/mfa", request.url));
    if (assurance?.currentLevel === "aal2" && path === "/admin/mfa") return redirect(new URL("/admin", request.url));
  }
  return response;
}

export const config = { matcher: ["/", "/creator/login", "/brand/login", "/creator/dashboard/:path*", "/creator/missions/:path*", "/brand/dashboard/:path*", "/brand/missions/:path*", "/admin/:path*"] };
