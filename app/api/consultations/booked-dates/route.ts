import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { seedConsultations, seedBlockedDates } from "@/data/adminSeed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const bookedSet = new Set<string>();

  // Add initial seed dates & seed blocked dates (for fallback when database is fresh)
  seedConsultations.forEach((c) => {
    if (c.booking_date) {
      bookedSet.add(c.booking_date);
    }
  });
  seedBlockedDates.forEach((b) => {
    if (b.date && b.is_full_day) {
      bookedSet.add(b.date);
    }
  });

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // 1. Query consultations
    const { data: consultData, error: consultError } = await supabase
      .from("consultations")
      .select("booking_date, payment_status")
      .neq("payment_status", "failed");

    if (!consultError && consultData) {
      consultData.forEach((row: { booking_date: string }) => {
        if (row.booking_date) {
          bookedSet.add(row.booking_date);
        }
      });
    }

    // 2. Query admin blocked dates
    const { data: blockData, error: blockError } = await supabase
      .from("blocked_dates")
      .select("date, is_full_day");

    if (!blockError && blockData) {
      blockData.forEach((row: { date: string; is_full_day: boolean }) => {
        if (row.date && row.is_full_day) {
          bookedSet.add(row.date);
        }
      });
    }
  } catch (err) {
    console.warn(
      "Could not query consultations/blocked dates, using cache:",
      err,
    );
  }

  return NextResponse.json({
    bookedDates: Array.from(bookedSet),
  });
}
