"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function PageMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".route-reveal", { y: 34, opacity: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" });
    gsap.utils.toArray<HTMLElement>(".route-image").forEach(image => {
      gsap.fromTo(image, { scale: 0.84, opacity: 0.35 }, { scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: image, start: "top 88%", end: "center 56%", scrub: 1 } });
    });
    gsap.utils.toArray<HTMLElement>(".route-copy").forEach(copy => {
      gsap.from(copy, { y: 38, opacity: 0, duration: 0.8, ease: "power2.out", scrollTrigger: { trigger: copy, start: "top 86%" } });
    });
  }, { scope: root });
  return <div className="page-motion" ref={root}>{children}</div>;
}
