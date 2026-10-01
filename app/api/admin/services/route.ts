import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { logAdminAction } from "@/lib/server/audit";
import type { AdminService } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const LOCAL_SERVICES_FILE = path.join(process.cwd(), "data", "services.json");

export function readLocalServices(): AdminService[] {
  try {
    if (fs.existsSync(LOCAL_SERVICES_FILE)) {
      const content = fs.readFileSync(LOCAL_SERVICES_FILE, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Notice: Reading local services data:", err);
  }
  return [];
}

export function writeLocalServices(services: AdminService[]): void {
  try {
    const dir = path.dirname(LOCAL_SERVICES_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      LOCAL_SERVICES_FILE,
      JSON.stringify(services, null, 2),
      "utf8",
    );
  } catch (err) {
    console.warn("Notice: Writing local services data:", err);
  }
}

export async function GET() {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) {
      return authResult.response;
    }

    const { supabase } = authResult.admin;

    // 1. Try dedicated services table
    try {
      const { data: services, error } = await supabase
        .from("services")
        .select("*, service_tiers(*, pricing_rules(*))")
        .order("popularity_rank", { ascending: true });

      if (!error && services && services.length > 0) {
        return NextResponse.json({ success: true, data: services });
      }
    } catch {
      // Fallback
    }

    // 2. Check local data/services.json
    const localServices = readLocalServices();
    if (localServices && localServices.length > 0) {
      return NextResponse.json({ success: true, data: localServices });
    }

    // 3. Fallback to site_content
    try {
      const { data: scData } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", "services")
        .single();

      if (scData?.content && Array.isArray(scData.content) && scData.content.length > 0) {
        return NextResponse.json({ success: true, data: scData.content });
      }
    } catch {
      // Fallback
    }

    return NextResponse.json({ success: true, data: localServices });
  } catch (err: unknown) {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) {
      return authResult.response;
    }

    const { supabase, user } = authResult.admin;
    const body = await request.json();
    const {
      title,
      slug,
      category,
      short_description,
      detailed_scope,
      image_url,
      pricing_type,
      popularity_rank,
      is_active,
      tiers,
    } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required." },
        { status: 400 },
      );
    }

    const newService: AdminService = {
      id: `srv_${Date.now()}`,
      title,
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      category: category || "General",
      short_description: short_description || "",
      detailed_scope: detailed_scope || null,
      image_url: image_url || "/images/Full House Design Package.png",
      pricing_type: pricing_type || "flat",
      popularity_rank: Number(popularity_rank) || 99,
      is_active: is_active !== undefined ? is_active : true,
      tiers: tiers || [],
      created_at: new Date().toISOString(),
    };

    // 1. Insert into Supabase services table
    try {
      const { data, error } = await supabase
        .from("services")
        .insert({
          title: newService.title,
          slug: newService.slug,
          category: newService.category,
          short_description: newService.short_description,
          detailed_scope: newService.detailed_scope,
          image_url: newService.image_url,
          pricing_type: newService.pricing_type,
          popularity_rank: newService.popularity_rank,
          is_active: newService.is_active,
          created_at: newService.created_at,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (!error && data) {
        newService.id = String(data.id);
      }
    } catch (dbErr) {
      console.warn("Notice: Inserting service to Supabase table:", dbErr);
    }

    // 2. Persist to local JSON file
    const current = readLocalServices();
    const updatedList = [newService, ...current];
    writeLocalServices(updatedList);

    // 3. Sync to Supabase site_content
    try {
      await supabase.from("site_content").upsert(
        {
          section_key: "services",
          content: updatedList,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "section_key" },
      );
    } catch (scErr) {
      console.warn("Notice: Updating site_content services:", scErr);
    }

    await logAdminAction({
      adminEmail: user.email,
      action: "CREATE_SERVICE",
      entity: "service",
      entityId: newService.id,
      metadata: { title },
    });

    try {
      revalidatePath("/services");
      revalidatePath("/");
    } catch (revalErr) {
      console.warn("revalidatePath error:", revalErr);
    }

    return NextResponse.json({ success: true, data: newService });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
