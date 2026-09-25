import React from "react";
import type { Metadata } from "next";
import { AdminLoginView } from "@/components/admin/AdminLoginView";

export const metadata: Metadata = {
  title: "Admin Portal Sign In | MARK Architects Atelier",
  description:
    "Secure administrative login portal for managing architectural consultation bookings, schedules, and Safepay payments.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return <AdminLoginView />;
}
