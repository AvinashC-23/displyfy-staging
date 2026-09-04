import type { Metadata } from "next";
import { LoginPage } from "@/components/login-page";

export const metadata: Metadata = { title: "Administrator sign in" };

export default function Page() {
  return <LoginPage role="Admin" dashboard="/admin" />;
}
