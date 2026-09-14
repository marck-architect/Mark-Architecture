import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmail =
    process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  // Enforce single-email admin protection
  if (!user) {
    redirect("/admin/login");
  }

  if (adminEmail && user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#FCF8F8] text-[#1C1B1B] selection:bg-amber-100 selection:text-amber-900">
      {/* Background Architectural Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Admin Topbar */}
      <AdminHeader adminEmail={user.email || "admin@markarchitects.com"} />

      {/* Main Content Area */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
        {children}
      </main>
    </div>
  );
}
