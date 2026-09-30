import React from "react";
import type { Metadata } from "next";
import { AdminResetPasswordView } from "@/components/admin/AdminResetPasswordView";

export const metadata: Metadata = {
  title: "Reset Admin Password | MARK Architects Atelier",
  description:
    "Securely reset your administrator credentials for MARK Architects Atelier Command Center.",
  robots: {
    index: false,
    follow: false,
  },
};

// Never statically prerender the auth screen — it eagerly creates a
// Supabase browser client on render, which needs runtime env vars.
export const dynamic = "force-dynamic";

export default function AdminResetPasswordPage() {
  return <AdminResetPasswordView />;
}
