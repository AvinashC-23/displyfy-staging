"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <section className="route-error"><p className="kicker">Something went wrong</p><h1>This page could not finish loading.</h1><p>Your data was not changed. Try the request again, or return to the home page.</p><div className="button-row"><button className="button acid" type="button" onClick={reset}>Try again</button><Link className="button glass" href="/">Return home</Link></div></section>;
}
