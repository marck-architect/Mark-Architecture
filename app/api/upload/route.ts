import { NextRequest, NextResponse } from "next/server";
import { processAndUploadFile, type UploadFolder } from "@/lib/server/storage";

export const runtime = "nodejs";

// Max body size configuration for file uploads (up to 25MB)
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as UploadFolder) || "media";
    const bucket = formData.get("bucket") as string | undefined;
    const maxWidthRaw = formData.get("maxWidth") as string | null;
    const maxHeightRaw = formData.get("maxHeight") as string | null;
    const qualityRaw = formData.get("quality") as string | null;
    const fitRaw = formData.get("fit") as string | null;

    const maxWidth = maxWidthRaw ? parseInt(maxWidthRaw, 10) : undefined;
    const maxHeight = maxHeightRaw ? parseInt(maxHeightRaw, 10) : undefined;
    const quality = qualityRaw ? parseInt(qualityRaw, 10) : undefined;
    const fit = fitRaw as any;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided in upload request." },
        { status: 400 },
      );
    }

    // Size validation: 25MB max
    const maxBytes = 25 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: "File exceeds maximum permitted size of 25MB." },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const result = await processAndUploadFile({
      fileBuffer,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      folder,
      bucket,
      maxWidth,
      maxHeight,
      quality,
      fit,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("File upload error:", message);
    return NextResponse.json(
      { error: message || "Failed to process and upload file." },
      { status: 500 },
    );
  }
}
