import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { fetchSafepayTrackerStatus } from "@/lib/server/safepay";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tracker = searchParams.get("tracker");
    const orderId = searchParams.get("orderId");
    const type = searchParams.get("type") || "consultation"; // 'consultation' or 'order'

    if (!tracker) {
      return NextResponse.json(
        { error: "Tracker token is required" },
        { status: 400 },
      );
    }

    // Fetch tracker status from Safepay
    const statusData = await fetchSafepayTrackerStatus(tracker);

    const isPaid =
      statusData.isCompleted ||
      statusData.state === "TRACKER_ENDED" ||
      statusData.isSimulated === true;

    if (isPaid && orderId) {
      const cookieStore = await cookies();
      const supabase = createClient(cookieStore);

      try {
        if (type === "consultation") {
          await supabase
            .from("consultations")
            .update({
              payment_status: "paid",
              safepay_tracker: tracker,
            })
            .eq("id", orderId);
        } else {
          await supabase
            .from("orders")
            .update({
              payment_status: "advance_paid",
              safepay_tracker: tracker,
            })
            .eq("id", orderId);
        }
      } catch (dbErr) {
        console.warn("Could not update database status on verify:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      isPaid,
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
