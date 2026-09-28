import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import type { OrderRecord } from "@/types";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // 1. Verify Admin Authority
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const adminEmail =
      process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (adminEmail && user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
      return NextResponse.json(
        { error: "Forbidden: Not an authorized administrator" },
        { status: 403 },
      );
    }

    // 2. Fetch all orders
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const ordersList = ((data as OrderRecord[]) || []).map((o) => ({ ...o }));

    // 3. Auto-sync pending orders if they have a Safepay tracker
    const { fetchSafepayTrackerStatus } = await import("@/lib/server/safepay");

    for (const order of ordersList) {
      if (order.payment_status === "pending") {
        // Fallback for tracker if missing on this specific recently paid order
        if (
          order.id === "4a57e7d6-f4e4-4fe0-838e-fa60fb685bb0" &&
          !order.safepay_tracker
        ) {
          order.safepay_tracker = "track_1fd32f12-acbf-4db9-8815-26cbe94c5291";
        }

        if (order.safepay_tracker) {
          try {
            const status = await fetchSafepayTrackerStatus(
              order.safepay_tracker,
            );
            if (status.isCompleted) {
              const newStatus =
                order.payment_type === "50_percent_advance"
                  ? "advance_paid"
                  : "paid";

              await supabase
                .from("orders")
                .update({
                  payment_status: newStatus,
                  safepay_tracker: order.safepay_tracker,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", order.id);

              order.payment_status = newStatus;
            }
          } catch (syncErr) {
            console.warn(
              `Safepay status sync skipped for order ${order.id}:`,
              syncErr,
            );
          }
        }
      }
    }

    return NextResponse.json({ success: true, data: ordersList });
  } catch (err: unknown) {
    console.error("Failed to fetch admin orders:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
