"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  ["Explore missions", "/creator/missions"],
  ["How it works", "/how-it-works"],
  ["For creators", "/for-creators"],
  ["For brands", "/for-brands"],
  ["Creator sign in", "/creator/login"],
  ["Brand sign in", "/brand/login"]
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <div className="nav-wrap shell">
      <nav className="nav" aria-label="Primary navigation">
        <Link href="/" aria-label="Displyfy home"><Image className="logo" src="/brand/displyfy-logo-v3.svg" alt="Displyfy" width={342} height={87} style={{ width: 142, height: "auto" }} priority /></Link>
        <div className="nav-links">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          <Link className="button small" href="/creator/apply">Apply as a creator</Link>
        </div>
        <button className="menu-button" type="button" aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X aria-hidden size={24} /> : <Menu aria-hidden size={24} />}
        </button>
      </nav>
      {open && <div className="nav-panel" aria-label="Mobile navigation">
        {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
        <Link className="button" href="/creator/apply" onClick={() => setOpen(false)}>Apply as a creator</Link>
      </div>}
    </div>
  );
}
