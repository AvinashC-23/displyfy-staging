import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return <footer className="footer"><div className="shell footer-grid">
    <div className="footer-statement"><Image src="/brand/displyfy-logo-v3.svg" alt="Displyfy" width={342} height={87} style={{ width: 160, height: "auto", filter: "invert(1)" }} /><p>Creator partnerships with a clear brief, measurable outcomes, and room for good work.</p><p className="fine-print">Performance-based creator advertising. Participation does not guarantee earnings.</p></div>
    <nav className="footer-nav" aria-label="Footer navigation">
      <div><strong>Discover</strong><Link href="/creator/missions" prefetch={false}>Explore missions</Link><Link href="/for-creators" prefetch={false}>For creators</Link><Link href="/for-brands" prefetch={false}>For brands</Link><Link href="/how-it-works" prefetch={false}>How it works</Link></div>
      <div><strong>Company</strong><Link href="/privacy" prefetch={false}>Privacy</Link><Link href="/terms" prefetch={false}>Terms</Link><Link href="/advertising-disclosure" prefetch={false}>Advertising disclosure</Link><a href="mailto:partnerships@displyfy.com">Partnerships</a></div>
    </nav>
  </div></footer>;
}
