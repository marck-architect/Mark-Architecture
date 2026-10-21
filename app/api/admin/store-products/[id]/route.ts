import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { logAdminAction } from "@/lib/server/audit";
import { defaultStoreProducts } from "@/data/storeProducts";
import type { StoreProduct } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LOCAL_FILE = path.join(process.cwd(), "data", "store_products.json");

function readLocal(): StoreProduct[] {
  try {
    if (fs.existsSync(LOCAL_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(LOCAL_FILE, "utf8"));
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn("Notice: Reading local store products:", err);
  }
  return [];
}

function writeLocal(products: StoreProduct[]): void {
  try {
    const dir = path.dirname(LOCAL_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_FILE, JSON.stringify(products, null, 2), "utf8");
  } catch (err) {
    console.warn("Notice: Writing local store products:", err);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- matches
// the `supabase as any` cast requireAdminAuth itself already returns.
async function syncToSupabase(updated: StoreProduct[], supabase: any) {
  try {
    await supabase.from("site_content").upsert(
      { section_key: "store_products", content: updated, updated_at: new Date().toISOString() },
      { onConflict: "section_key" },
    );
  } catch (err) {
    console.warn("Notice: Syncing store products to site_content:", err);
  }
}

async function handleUpdate(request: NextRequest, params: Promise<{ id: string }>) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;
    const { id } = await params;
    const { supabase, user } = authResult.admin;
    const body = await request.json();

    const current = readLocal();
    const base = current.length > 0 ? current : defaultStoreProducts;
    const existing = base.find((p) => p.id === id);

    const target: StoreProduct = {
      id,
      category_id: body.category_id ?? existing?.category_id ?? "lighting",
      subcategory: body.subcategory ?? existing?.subcategory ?? "",
      name: body.name ?? existing?.name ?? "Product",
      price_pkr: body.price_pkr !== undefined ? Number(body.price_pkr) : (existing?.price_pkr ?? 0),
      price_unit: body.price_unit !== undefined ? (body.price_unit || undefined) : existing?.price_unit,
      image_url: body.image_url ?? existing?.image_url ?? "",
      description: body.description ?? existing?.description ?? "",
      is_published: body.is_published !== undefined ? Boolean(body.is_published) : (existing?.is_published ?? true),
      display_order: body.display_order !== undefined ? Number(body.display_order) : (existing?.display_order ?? 99),
    };

    let found = false;
    const updated = base.map((p) => {
      if (p.id === id) {
        found = true;
        return target;
      }
      return p;
    });
    if (!found) updated.push(target);

    writeLocal(updated);
    await syncToSupabase(updated, supabase);

    try {
      await logAdminAction({
        adminEmail: user.email,
        action: "UPDATE_STORE_PRODUCT",
        entity: "store_products",
        entityId: id,
        metadata: { name: target.name },
      });
    } catch {
      // ignored
    }

    revalidatePath("/collection");

    return NextResponse.json({ success: true, data: target });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleUpdate(request, params);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return handleUpdate(request, params);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;
    const { id } = await params;
    const { supabase, user } = authResult.admin;

    const current = readLocal();
    const base = current.length > 0 ? current : defaultStoreProducts;
    const updated = base.filter((p) => p.id !== id);

    writeLocal(updated);
    await syncToSupabase(updated, supabase);

    try {
      await logAdminAction({
        adminEmail: user.email,
        action: "DELETE_STORE_PRODUCT",
        entity: "store_products",
        entityId: id,
      });
    } catch {
      // ignored
    }

    revalidatePath("/collection");

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
