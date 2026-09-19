import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { logAdminAction } from "@/lib/server/audit";
import { defaultPricingSettings } from "@/data/pricing";
import type { PricingSettingsContent } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const LOCAL_PRICING_FILE = path.join(
  process.cwd(),
  "data",
  "pricing_settings.json",
);

function readLocalPricing(): PricingSettingsContent | null {
  try {
    if (fs.existsSync(LOCAL_PRICING_FILE)) {
      const data = fs.readFileSync(LOCAL_PRICING_FILE, "utf8");
      return JSON.parse(data) as PricingSettingsContent;
    }
  } catch (err) {
    console.warn("Notice: Reading local pricing settings:", err);
  }
  return null;
}

function writeLocalPricing(content: PricingSettingsContent): void {
  try {
    const dir = path.dirname(LOCAL_PRICING_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      LOCAL_PRICING_FILE,
      JSON.stringify(content, null, 2),
      "utf8",
    );
  } catch (err) {
    console.warn("Notice: Writing local pricing settings:", err);
  }
}

/**
 * GET /api/admin/pricing
 * Retrieve studio pricing configuration (calculator rates, consultation fees, and package tiers)
 */
export async function GET() {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;

    const { supabase } = authResult.admin;

    // 1. Try Supabase cloud database
    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("content, updated_at")
        .eq("section_key", "pricing_settings")
        .single();

      if (!error && data?.content) {
        return NextResponse.json({
          success: true,
          data: data.content as PricingSettingsContent,
          updated_at: data.updated_at,
          source: "supabase",
        });
      }
    } catch {
      // Supabase table missing or connection fallback
    }

    // 2. Try Local File
    const local = readLocalPricing();
    if (local) {
      return NextResponse.json({
        success: true,
        data: local,
        source: "local",
      });
    }

    // 3. Fallback to default studio values
    return NextResponse.json({
      success: true,
      data: defaultPricingSettings,
      source: "default",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

/**
 * PUT /api/admin/pricing
 * Update complete studio pricing configuration
 */
export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;

    const { supabase, user } = authResult.admin;
    const body = await request.json();

    const pricingData = body.pricing as PricingSettingsContent;

    if (!pricingData) {
      return NextResponse.json(
        { error: "Pricing payload is required." },
        { status: 400 },
      );
    }

    const payload: PricingSettingsContent = {
      ...pricingData,
      updatedAt: new Date().toISOString(),
    };

    // 1. Always persist to local storage file immediately
    writeLocalPricing(payload);

    // 2. Attempt Supabase cloud upsert
    let supabaseSuccess = false;
    let supabaseErrorNotice: string | null = null;

    try {
      const { error } = await supabase.from("site_content").upsert(
        {
          section_key: "pricing_settings",
          content: payload,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "section_key" },
      );

      if (!error) {
        supabaseSuccess = true;
      } else {
        supabaseErrorNotice = error.message;
        console.warn(
          "Supabase site_content upsert notice (run supabase/create_site_content.sql to enable cloud sync):",
          error.message,
        );
      }
    } catch (dbErr: unknown) {
      supabaseErrorNotice =
        dbErr instanceof Error ? dbErr.message : String(dbErr);
    }

    // 3. Audit Log (non-blocking)
    try {
      await logAdminAction({
        adminEmail: user.email,
        action: "UPDATE_PRICING",
        entity: "pricing_settings",
        entityId: "pricing_settings",
        metadata: {
          disciplineCount: payload.calculator?.disciplines?.length,
          categoryCount: payload.menuCategories?.length,
          consultationBasic: payload.consultationCalls?.basicCallPrice,
          consultationPremium: payload.consultationCalls?.premiumCallPrice,
          supabaseSynced: supabaseSuccess,
        },
      });
    } catch {
      // Ignored non-fatal audit log
    }

    // 4. Invalidate cached pages using pricing
    try {
      revalidatePath("/pricing");
      revalidatePath("/services");
      revalidatePath("/consultation");
      revalidatePath("/");
    } catch {
      // Ignored in non-ISR runtime
    }

    return NextResponse.json({
      success: true,
      message: supabaseSuccess
        ? "Studio pricing and rates updated and synced to Supabase database successfully."
        : "Pricing saved! (Run supabase/create_site_content.sql in Supabase to sync to remote database).",
      supabaseSynced: supabaseSuccess,
      supabaseNotice: supabaseErrorNotice,
      data: payload,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Admin Pricing Update Error:", errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return PUT(request);
}
