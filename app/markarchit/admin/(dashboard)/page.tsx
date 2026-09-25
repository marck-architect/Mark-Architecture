import React from "react";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { AdminDashboardView } from "@/components/admin/AdminDashboardView";
import type { ConsultationRecord, OrderRecord } from "@/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Atelier Dashboard | MARK Architects",
  description:
    "Executive control panel for managing architectural consultation bookings, schedules, and Safepay payments.",
};

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  let consultations: ConsultationRecord[] = [];
  let orders: OrderRecord[] = [];

  try {
    // 1. Fetch all consultation bookings
    const { data: consultationData, error: consultationError } = await supabase
      .from("consultations")
      .select("*")
      .order("booking_date", { ascending: false })
      .order("booking_time", { ascending: false });

    if (!consultationError && consultationData) {
      consultations = consultationData as ConsultationRecord[];
    }

    // 2. Fetch all design orders
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!orderError && orderData) {
      orders = orderData as OrderRecord[];
    }
  } catch (err) {
    console.error("Error fetching admin dashboard data:", err);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const adminEmail =
    user?.email || process.env.ADMIN_EMAIL || "admin@markarchitects.com";

  return (
    <AdminDashboardView
      initialConsultations={consultations}
      initialOrders={orders}
      adminEmail={adminEmail}
    />
  );
}
