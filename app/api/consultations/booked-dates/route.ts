import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { seedConsultations } from "@/data/adminSeed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const bookedSet = new Set<string>();

  // Add initial seed dates (for demo/fallback when database is fresh)
  seedConsultations.forEach((c) => {
    if (c.booking_date) {
      bookedSet.add(c.booking_date);
    }
  });

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("consultations")
      .select("booking_date, payment_status")
      .neq("payment_status", "failed");

    if (!error && data) {
      data.forEach((row: { booking_date: string }) => {
        if (row.booking_date) {
          bookedSet.add(row.booking_date);
        }
      });
    }
  } catch (err) {
    console.warn(
      "Could not query consultations for booked dates, using cache:",
      err,
    );
  }

  return NextResponse.json({
    bookedDates: Array.from(bookedSet),
  });
}
