import { NextRequest, NextResponse } from "next/server";
import { fetchSafepayTrackerStatus } from "@/lib/server/safepay";
import { getSupabaseAdminClient } from "@/lib/server/supabaseAdmin";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let tracker = searchParams.get("tracker") || searchParams.get("beacon");
    const orderId =
      searchParams.get("orderId") || searchParams.get("reference");
    const type = searchParams.get("type") || "consultation"; // 'consultation' or 'order'

    const supabaseAdmin = getSupabaseAdminClient();

    // If tracker wasn't in URL parameters but orderId was, retrieve tracker from DB
    if (!tracker && orderId) {
      if (type === "consultation") {
        const { data: consultation } = await supabaseAdmin
          .from("consultations")
          .select(
            "id, safepay_tracker, payment_status, client_name, client_email, client_phone, tier_name, price_pkr, booking_date, booking_time, meeting_url, created_at",
          )
          .eq("id", orderId)
          .maybeSingle();

        if (consultation?.safepay_tracker) {
          tracker = consultation.safepay_tracker;
        }

        // If already marked paid (e.g. by webhook), return success immediately
        if (consultation?.payment_status === "paid") {
          return NextResponse.json({
            success: true,
            isPaid: true,
            tracker: tracker || "",
            state: "TRACKER_ENDED",
            details: {
              id: consultation.id,
              type: "consultation",
              referenceNumber: consultation.id,
              tracker: tracker || undefined,
              title: consultation.tier_name || "Architectural Consultation",
              amountPkr: Number(consultation.price_pkr) || 0,
              status: "paid",
              customerName: consultation.client_name,
              customerEmail: consultation.client_email,
              customerPhone: consultation.client_phone,
              scheduledDate: consultation.booking_date,
              scheduledTime: consultation.booking_time,
              meetingUrl: consultation.meeting_url,
              date: consultation.created_at || new Date().toISOString(),
            },
          });
        }
      } else {
        const { data: order } = await supabaseAdmin
          .from("orders")
          .select(
            "id, order_number, safepay_tracker, payment_status, client_name, client_email, client_phone, total_amount_pkr, advance_amount_pkr, payment_type, created_at",
          )
          .eq("id", orderId)
          .maybeSingle();

        if (order?.safepay_tracker) {
          tracker = order.safepay_tracker;
        }

        if (
          order?.payment_status === "paid" ||
          order?.payment_status === "advance_paid"
        ) {
          return NextResponse.json({
            success: true,
            isPaid: true,
            tracker: tracker || "",
            state: "TRACKER_ENDED",
            details: {
              id: order.id,
              type: "order",
              referenceNumber: order.order_number || order.id,
              tracker: tracker || undefined,
              title: order.order_number
                ? `Order #${order.order_number}`
                : "Design Package Order",
              amountPkr:
                Number(order.advance_amount_pkr || order.total_amount_pkr) || 0,
              status: order.payment_status || "advance_paid",
              customerName: order.client_name,
              customerEmail: order.client_email,
              customerPhone: order.client_phone,
              date: order.created_at || new Date().toISOString(),
            },
          });
        }
      }
    }

    if (!tracker) {
      return NextResponse.json(
        {
          error:
            "No payment tracker or reference record found for this transaction",
        },
        { status: 400 },
      );
    }

    // Fetch tracker status from Safepay
    const statusData = await fetchSafepayTrackerStatus(tracker);

    const isPaid =
      Boolean(statusData.isCompleted) ||
      statusData.state === "TRACKER_ENDED" ||
      statusData.isSimulated === true;

    if (!isPaid) {
      return NextResponse.json({
        success: false,
        isPaid: false,
        tracker,
        state: statusData.state || "PENDING",
        error:
          statusData.error ||
          "Payment has not been completed on Safepay yet. Please wait a few moments or retry.",
      });
    }

    if (orderId) {
      if (type === "consultation") {
        try {
          const { processPaidConsultation } =
            await import("@/lib/server/consultationWorkflow");
          await processPaidConsultation(orderId, tracker);
        } catch (workflowErr) {
          console.error(
            "Error running consultation workflow in payment verify:",
            workflowErr,
          );
        }
      } else {
        try {
          const { error: orderErr } = await supabaseAdmin
            .from("orders")
            .update({
              payment_status: "advance_paid",
              safepay_tracker: tracker,
            })
            .eq("id", orderId);

          if (orderErr) {
            console.error(
              "Could not update order status on verify:",
              orderErr.message,
            );
          }
        } catch (dbErr) {
          console.warn("Could not update database status on verify:", dbErr);
        }
      }
    }

    let details: Record<string, unknown> | null = null;

    if (orderId) {
      if (type === "consultation") {
        const { data: c } = await supabaseAdmin
          .from("consultations")
          .select(
            "id, client_name, client_email, client_phone, tier_name, price_pkr, booking_date, booking_time, meeting_url, payment_status, created_at",
          )
          .eq("id", orderId)
          .maybeSingle();

        if (c) {
          details = {
            id: c.id,
            type: "consultation",
            referenceNumber: c.id,
            tracker: tracker || undefined,
            title: c.tier_name || "Architectural Consultation",
            amountPkr: Number(c.price_pkr) || 0,
            status: c.payment_status || "paid",
            customerName: c.client_name,
            customerEmail: c.client_email,
            customerPhone: c.client_phone,
            scheduledDate: c.booking_date,
            scheduledTime: c.booking_time,
            meetingUrl: c.meeting_url,
            date: c.created_at || new Date().toISOString(),
          };
        }
      } else {
        const { data: o } = await supabaseAdmin
          .from("orders")
          .select(
            "id, order_number, client_name, client_email, client_phone, total_amount_pkr, advance_amount_pkr, payment_status, payment_type, created_at",
          )
          .eq("id", orderId)
          .maybeSingle();

        if (o) {
          details = {
            id: o.id,
            type: "order",
            referenceNumber: o.order_number || o.id,
            tracker: tracker || undefined,
            title: o.order_number
              ? `Order #${o.order_number}`
              : "Design Package Order",
            amountPkr: Number(o.advance_amount_pkr || o.total_amount_pkr) || 0,
            status: o.payment_status || "advance_paid",
            customerName: o.client_name,
            customerEmail: o.client_email,
            customerPhone: o.client_phone,
            date: o.created_at || new Date().toISOString(),
          };
        }
      }
    }

    return NextResponse.json({
      success: true,
      isPaid,
      tracker,
      details,
      state: statusData.state || (isPaid ? "TRACKER_ENDED" : "UNKNOWN"),
      isSimulated: statusData.isSimulated || false,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: errorMsg || "Failed to verify payment" },
      { status: 500 },
    );
  }
}
