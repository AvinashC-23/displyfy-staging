"use client";

import Image from "next/image";
import Link from "next/link";
import { BriefcaseBusiness, CircleUserRound, LayoutGrid, LogOut, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Role = "creator" | "brand" | "admin";

const workspaceItems = {
  creator: [
    { label: "Home", href: "/creator/dashboard", match: "/creator/dashboard", icon: LayoutGrid },
    { label: "Find missions", href: "/creator/missions", match: "/creator/missions", icon: BriefcaseBusiness },
    { label: "Account", href: "/creator/account", match: "/creator/account", icon: CircleUserRound }
  ],
  brand: [
    { label: "Home", href: "/brand/dashboard", match: "/brand/dashboard", icon: LayoutGrid },
    { label: "My missions", href: "/brand/dashboard#missions", match: "brand-missions", icon: BriefcaseBusiness },
    { label: "Create mission", href: "/brand/missions/new", match: "/brand/missions/new", icon: Plus }
  ],
  admin: [{ label: "Review home", href: "/admin", match: "/admin", icon: CircleUserRound }]
} as const;

export function WorkspaceNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  const isActive = (match: string) => {
    if (match === "brand-missions") return (pathname === "/brand/dashboard" && hash === "#missions") || (pathname.startsWith("/brand/missions/") && pathname !== "/brand/missions/new");
    if (match === "/brand/dashboard") return pathname === match && hash !== "#missions";
    if (match === "/admin") return pathname === match;
    return pathname === match || pathname.startsWith(`${match}/`);
  };
  const home = role === "brand" ? "/brand/dashboard" : role === "admin" ? "/admin" : "/creator/dashboard";

  return <nav className="workspace-nav" aria-label={`${role} workspace`}>
    <Link className="workspace-brand" href={home} aria-label="Displyfy workspace home">
      <Image src="/brand/displyfy-logo-v3.svg" alt="Displyfy" width={342} height={87} priority />
      <span>{role}</span>
    </Link>
    <div className="workspace-links">
      {workspaceItems[role].map(item => {
        const Icon = item.icon;
        const active = isActive(item.match);
        return <Link className={active ? "active" : ""} aria-current={active ? "page" : undefined} href={item.href} key={item.href}><Icon size={17} aria-hidden />{item.label}</Link>;
      })}
    </div>
    <form action="/auth/signout" method="post">
      <button className="workspace-signout" type="submit" title="Sign out" aria-label="Sign out"><LogOut size={18} aria-hidden /></button>
    </form>
  </nav>;
}
