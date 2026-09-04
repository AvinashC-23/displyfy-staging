import Image from "next/image";
import Link from "next/link";
import { BriefcaseBusiness, CircleUserRound, LayoutGrid, LogOut, Plus } from "lucide-react";

export function WorkspaceNav({ role, current }: { role: "creator" | "brand" | "admin"; current: "home" | "missions" | "create" }) {
  const items = role === "creator"
    ? [{ label: "Home", href: "/creator/dashboard", icon: LayoutGrid, id: "home" }, { label: "Find missions", href: "/creator/missions", icon: BriefcaseBusiness, id: "missions" }]
    : role === "brand"
      ? [{ label: "Home", href: "/brand/dashboard", icon: LayoutGrid, id: "home" }, { label: "My missions", href: "/brand/dashboard#missions", icon: BriefcaseBusiness, id: "missions" }, { label: "Create mission", href: "/brand/missions/new", icon: Plus, id: "create" }]
      : [{ label: "Review home", href: "/admin", icon: CircleUserRound, id: "home" }];

  return <nav className="workspace-nav" aria-label={`${role} workspace`}>
    <Link className="workspace-brand" href={role === "brand" ? "/brand/dashboard" : role === "admin" ? "/admin" : "/creator/dashboard"} aria-label="Displyfy workspace home">
      <Image src="/brand/displyfy-logo-v3.svg" alt="Displyfy" width={342} height={87} priority />
      <span>{role}</span>
    </Link>
    <div className="workspace-links">
      {items.map(item => {
        const Icon = item.icon;
        return <Link className={current === item.id ? "active" : ""} href={item.href} key={item.href}><Icon size={17} aria-hidden />{item.label}</Link>;
      })}
    </div>
    <form action="/auth/signout" method="post">
      <button className="workspace-signout" type="submit" title="Sign out" aria-label="Sign out"><LogOut size={18} aria-hidden /></button>
    </form>
  </nav>;
}
