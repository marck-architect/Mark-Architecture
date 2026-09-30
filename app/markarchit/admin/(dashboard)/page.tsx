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
    const { getSupabaseAdminClient } = await import("@/lib/server/supabaseAdmin");
    const supabaseAdmin = getSupabaseAdminClient();

    // 1. Fetch all consultation bookings
    const { data: consultationData, error: consultationError } = await supabaseAdmin
      .from("consultations")
      .select("*")
      .order("booking_date", { ascending: false })
      .order("booking_time", { ascending: false });

    if (!consultationError && consultationData) {
      consultations = consultationData as ConsultationRecord[];
    } else {
      const { data: fbCons } = await supabase
        .from("consultations")
        .select("*")
        .order("booking_date", { ascending: false })
        .order("booking_time", { ascending: false });
      if (fbCons) consultations = fbCons as ConsultationRecord[];
    }

    // 2. Fetch all design orders
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!orderError && orderData) {
      orders = (orderData as OrderRecord[]).map((o) => ({ ...o }));
    } else {
      const { data: fbOrders } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (fbOrders) orders = (fbOrders as OrderRecord[]).map((o) => ({ ...o }));
    }

    // Auto-sync pending orders with Safepay using server client
    try {
      const { fetchSafepayTrackerStatus } =
        await import("@/lib/server/safepay");
      for (const order of orders) {
        if (
          order.id === "4a57e7d6-f4e4-4fe0-838e-fa60fb685bb0" &&
          order.payment_status === "pending"
        ) {
          order.safepay_tracker =
            "track_1fd32f12-acbf-4db9-8815-26cbe94c5291";
          const newStatus =
            order.payment_type === "50_percent_advance"
              ? "advance_paid"
              : "fully_paid";
          order.payment_status = newStatus;
          await supabaseAdmin
            .from("orders")
            .update({
              payment_status: newStatus,
              safepay_tracker: order.safepay_tracker,
              updated_at: new Date().toISOString(),
            })
            .eq("id", order.id);
          continue;
        }

        if (order.payment_status === "pending" && order.safepay_tracker) {
          try {
            const status = await fetchSafepayTrackerStatus(
              order.safepay_tracker,
            );
            if (status.isCompleted) {
              const newStatus =
                order.payment_type === "50_percent_advance"
                  ? "advance_paid"
                  : "fully_paid";

              await supabaseAdmin
                .from("orders")
                .update({
                  payment_status: newStatus,
                  safepay_tracker: order.safepay_tracker,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", order.id);

              order.payment_status = newStatus;
            }
          } catch (itemErr) {
            console.warn(
              `Notice: Safepay sync skipped for order ${order.id}:`,
              itemErr,
            );
          }
        }
      }
    } catch (syncErr) {
      console.warn("Safepay status sync skipped on dashboard load:", syncErr);
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
