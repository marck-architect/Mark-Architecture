import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import type { ConsultationRecord } from "@/types";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { GATEKEEPER_COOKIE_NAME, isValidGatekeeperToken } = await import(
      "@/lib/server/adminGatekeeper"
    );
    const gatekeeperCookie = cookieStore.get(GATEKEEPER_COOKIE_NAME)?.value;
    const isGatekeeper = isValidGatekeeperToken(gatekeeperCookie);

    const adminEmail =
      process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    if (!user && !isGatekeeper) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      user &&
      adminEmail &&
      user.email?.toLowerCase() !== adminEmail.toLowerCase()
    ) {
      return NextResponse.json(
        { error: "Forbidden: Not an authorized administrator" },
        { status: 403 },
      );
    }

    const { getSupabaseAdminClient } = await import(
      "@/lib/server/supabaseAdmin"
    );
    const supabaseAdmin = getSupabaseAdminClient();

    let consultationsList: ConsultationRecord[] = [];
    const { data, error } = await supabaseAdmin
      .from("consultations")
      .select("*")
      .order("booking_date", { ascending: false })
      .order("booking_time", { ascending: false });

    if (error) {
      const { data: fbData, error: fbError } = await supabase
        .from("consultations")
        .select("*")
        .order("booking_date", { ascending: false })
        .order("booking_time", { ascending: false });
      if (fbError) throw fbError;
      consultationsList = ((fbData as ConsultationRecord[]) || []).map((c) => ({
        ...c,
      }));
    } else {
      consultationsList = ((data as ConsultationRecord[]) || []).map((c) => ({
        ...c,
      }));
    }

    return NextResponse.json({ success: true, data: consultationsList });
  } catch (err: unknown) {
    console.error("Failed to fetch admin consultations:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}

