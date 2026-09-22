import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { processAndUploadFile, STORAGE_BUCKET } from "@/lib/server/storage";
import { logAdminAction } from "@/lib/server/audit";

export const runtime = "nodejs";

export async function GET() {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;

    const { supabase } = authResult.admin;

    try {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list("consultations", {
          limit: 100,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (!error && data && data.length > 0) {
        const assets = data.map((f: any) => {
          const { data: urlData } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(`consultations/${f.name}`);
          return {
            id: f.id || f.name,
            name: f.name,
            url: urlData.publicUrl,
            size_bytes: f.metadata?.size || 0,
            mime_type: f.metadata?.mimetype || "image/webp",
            created_at: f.created_at || new Date().toISOString(),
          };
        });
        return NextResponse.json({
          success: true,
          data: assets,
        });
      }
    } catch {
      // Fall through to empty list
    }

    return NextResponse.json({ success: true, data: [] });
  } catch (err: unknown) {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;

    const { user } = authResult.admin;
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await processAndUploadFile({
      fileBuffer: buffer,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      folder: "consultations",
    });

    await logAdminAction({
      adminEmail: user.email,
      action: "UPLOAD_MEDIA_ASSET",
      entity: "media",
      entityId: uploadResult.path,
      metadata: {
        originalName: uploadResult.originalName,
        size: uploadResult.processedSize,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: uploadResult.path,
        name: uploadResult.originalName,
        url: uploadResult.url,
        size_bytes: uploadResult.processedSize,
        mime_type: uploadResult.mimeType,
        created_at: new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
