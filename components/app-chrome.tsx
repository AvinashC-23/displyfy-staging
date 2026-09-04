"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";
import { SiteNav } from "@/components/site-nav";

const workspaceRoots = ["/creator/dashboard", "/creator/missions", "/brand/dashboard", "/brand/missions", "/admin"];

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const workspace = workspaceRoots.some((root) => pathname === root || pathname.startsWith(`${root}/`));

  return <>
    {!workspace && <SiteNav />}
    <main className="site-main">{children}</main>
    {!workspace && <Footer />}
  </>;
}
