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

export function writeLocal(products: StoreProduct[]): void {
  try {
    const dir = path.dirname(LOCAL_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOCAL_FILE, JSON.stringify(products, null, 2), "utf8");
  } catch (err) {
    console.warn("Notice: Writing local store products:", err);
  }
}

export async function GET() {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;
    const { supabase } = authResult.admin;

    try {
      const { data, error } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", "store_products")
        .single();

      if (!error && Array.isArray(data?.content) && data.content.length > 0) {
        writeLocal(data.content);
        return NextResponse.json({ success: true, data: data.content });
      }
    } catch {
      // fall through to local/default
    }

    const local = readLocal();
    if (local.length > 0) {
      return NextResponse.json({ success: true, data: local });
    }

    return NextResponse.json({ success: true, data: defaultStoreProducts });
  } catch {
    const local = readLocal();
    return NextResponse.json({
      success: true,
      data: local.length > 0 ? local : defaultStoreProducts,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;
    const { supabase, user } = authResult.admin;
    const body = await request.json();

    const { category_id, subcategory, name, price_pkr, price_unit, image_url, description, is_published, display_order } = body;

    if (!category_id || !name || price_pkr === undefined) {
      return NextResponse.json(
        { error: "Category, product name, and price are required." },
        { status: 400 },
      );
    }

    const newProduct: StoreProduct = {
      id: `sp_${Date.now()}`,
      category_id,
      subcategory: subcategory || "",
      name,
      price_pkr: Number(price_pkr) || 0,
      price_unit: price_unit || undefined,
      image_url: image_url || "",
      description: description || "",
      is_published: is_published !== undefined ? Boolean(is_published) : true,
      display_order: Number(display_order) || 99,
    };

    const current = readLocal();
    const base = current.length > 0 ? current : defaultStoreProducts;
    const updated = [newProduct, ...base];
    writeLocal(updated);

    try {
      await supabase.from("site_content").upsert(
        { section_key: "store_products", content: updated, updated_at: new Date().toISOString() },
        { onConflict: "section_key" },
      );
    } catch (err) {
      console.warn("Notice: Syncing store products to site_content:", err);
    }

    try {
      await logAdminAction({
        adminEmail: user.email,
        action: "CREATE_STORE_PRODUCT",
        entity: "store_products",
        entityId: newProduct.id,
        metadata: { name, category_id },
      });
    } catch {
      // ignored
    }

    revalidatePath("/collection");

    return NextResponse.json({ success: true, data: newProduct });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
