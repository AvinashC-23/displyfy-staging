"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, CircleUserRound, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { label: "Missions", href: "/creator/missions", matches: ["/creator/missions"] },
  { label: "How it works", href: "/how-it-works", matches: ["/how-it-works"] },
  { label: "Creators", href: "/for-creators", matches: ["/for-creators", "/creator/apply", "/creator/login"] },
  { label: "Brands", href: "/for-brands", matches: ["/for-brands", "/brand/login", "/brand/access"] }
] as const;

const accessLinks = [
  { label: "Creator sign in", href: "/creator/login" },
  { label: "Brand sign in", href: "/brand/login" }
] as const;

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (matches: readonly string[]) => matches.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  return (
    <div className="nav-wrap shell">
      <nav className="nav" aria-label="Primary navigation">
        <Link href="/" aria-label="Displyfy home"><Image className="logo" src="/brand/displyfy-logo-v3.svg" alt="Displyfy" width={342} height={87} loading="eager" style={{ width: 142, height: "auto" }} /></Link>
        <div className="nav-links">
          <div className="nav-sections">
            {links.map(({ label, href, matches }) => <Link className={isActive(matches) ? "active" : ""} aria-current={isActive(matches) ? "page" : undefined} key={href} href={href} prefetch={false}>{label}</Link>)}
          </div>
          <details className="nav-access">
            <summary><CircleUserRound size={17} aria-hidden /><span>Sign in</span><ChevronDown size={15} aria-hidden /></summary>
            <div className="nav-access-menu">{accessLinks.map(({ label, href }) => <Link key={href} href={href} prefetch={false}>{label}</Link>)}</div>
          </details>
          <Link className="button small" href="/creator/apply" prefetch={false}>Join as creator</Link>
        </div>
        <button className="menu-button" type="button" aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X aria-hidden size={24} /> : <Menu aria-hidden size={24} />}
        </button>
      </nav>
      {open && <div className="nav-panel" aria-label="Mobile navigation">
        <p className="nav-panel-label">Explore Displyfy</p>
        {links.map(({ label, href, matches }) => <Link className={isActive(matches) ? "active" : ""} aria-current={isActive(matches) ? "page" : undefined} key={href} href={href} prefetch={false} onClick={() => setOpen(false)}>{label}</Link>)}
        <div className="nav-panel-access">{accessLinks.map(({ label, href }) => <Link key={href} href={href} prefetch={false} onClick={() => setOpen(false)}>{label}</Link>)}</div>
        <Link className="button" href="/creator/apply" prefetch={false} onClick={() => setOpen(false)}>Join as creator</Link>
      </div>}
    </div>
  );
}
