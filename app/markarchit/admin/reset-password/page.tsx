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

export default function AdminResetPasswordPage() {
  return <AdminResetPasswordView />;
}
