import type { Metadata } from "next";
import { LoginPage } from "@/components/login-page";
export const metadata: Metadata = { title: "Creator sign in" };
export default function Page() { return <LoginPage role="Creator" dashboard="/creator/dashboard" />; }
