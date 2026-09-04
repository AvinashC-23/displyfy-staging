import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return <footer className="footer"><div className="shell footer-grid">
    <div className="footer-statement"><Image src="/brand/displyfy-logo-v3.svg" alt="Displyfy" width={342} height={87} style={{ width: 160, height: "auto", filter: "invert(1)" }} /><p>Creator partnerships with a clear brief, measurable outcomes, and room for good work.</p><p className="fine-print">Performance-based creator advertising. Participation does not guarantee earnings.</p></div>
    <nav className="footer-nav" aria-label="Footer navigation">
      <div><strong>Discover</strong><Link href="/creator/missions">Explore missions</Link><Link href="/for-creators">For creators</Link><Link href="/for-brands">For brands</Link><Link href="/how-it-works">How it works</Link></div>
      <div><strong>Company</strong><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/advertising-disclosure">Advertising disclosure</Link><a href="mailto:partnerships@displyfy.com">Partnerships</a></div>
    </nav>
  </div></footer>;
}
