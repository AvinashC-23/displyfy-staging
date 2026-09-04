import type { Metadata } from "next";
import { AdminMfa } from "@/components/admin-mfa";

export const metadata: Metadata = { title: "Administrator verification" };

export default function Page() {
  return <AdminMfa />;
}
