import Link from "next/link";

export default function NotFound() {
  return <section className="route-error"><p className="kicker">404</p><h1>That page is not here.</h1><p>The link may be outdated, or the mission may no longer be available to your account.</p><Link className="button acid" href="/">Return home</Link></section>;
}
