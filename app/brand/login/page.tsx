import type { Metadata } from "next";
import { LoginPage } from "@/components/login-page";
export const metadata: Metadata = { title: "Brand sign in" };
export default function Page() { return <LoginPage role="Brand" dashboard="/brand/dashboard" />; }
