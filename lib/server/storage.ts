import "server-only";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

export const STORAGE_BUCKET = "client-attachments";

function getStorageClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase credentials not configured in environment.");
  }
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
}

/**
 * Ensures the destination bucket exists in Supabase Storage.
 */
async function ensureBucketExists(
  supabase: ReturnType<typeof getStorageClient>,
) {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (!error && buckets) {
      const exists = buckets.some(
        (b) => b.name === STORAGE_BUCKET || b.id === STORAGE_BUCKET,
      );
      if (!exists) {
        await supabase.storage.createBucket(STORAGE_BUCKET, {
          public: true,
          fileSizeLimit: 26214400, // 25MB
          allowedMimeTypes: [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/avif",
          ],
        });
      }
    }
  } catch (err) {
    // Non-fatal if bucket was already configured or permissions prevent bucket listing
    console.warn("Storage bucket check warning:", err);
  }
}

export interface ProcessUploadResult {
  url: string;
  path: string;
  originalName: string;
  processedSize: number;
  mimeType: string;
  isImage: boolean;
}

/**
 * Processes an uploaded file buffer (resizing images with sharp, keeping PDFs intact)
 * and stores it into Supabase Storage under the client-attachments bucket.
 */
export async function processAndUploadFile({
  fileBuffer,
  fileName,
  mimeType,
  folder = "consultations",
}: {
  fileBuffer: Buffer;
  fileName: string;
  mimeType: string;
  folder?: "consultations" | "orders";
}): Promise<ProcessUploadResult> {
  const supabase = getStorageClient();
  await ensureBucketExists(supabase);

  const isImage =
    mimeType.startsWith("image/") ||
    /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(fileName);
  const isPdf = mimeType === "application/pdf" || /\.pdf$/i.test(fileName);

  if (!isImage && !isPdf) {
    throw new Error(
      "Unsupported file format. Please upload an image (PNG, JPG, WebP) or PDF blueprint.",
    );
  }

  let finalBuffer: Buffer;
  let finalMimeType: string;
  let finalExtension: string;

  if (isImage) {
    // Resize & optimize image using sharp:
    // Max 1920x1920 box, fit inside, retain aspect ratio without enlargement.
    // Convert to webp with high quality (85) for optimal clarity on architectural drawings/photos.
    finalBuffer = await sharp(fileBuffer)
      .rotate() // auto-orient based on EXIF
      .resize({
        width: 1920,
        height: 1920,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 85, effort: 4 })
      .toBuffer();

    finalMimeType = "image/webp";
    finalExtension = "webp";
  } else {
    // PDF document: keep binary buffer intact
    finalBuffer = fileBuffer;
    finalMimeType = "application/pdf";
    finalExtension = "pdf";
  }

  // Create clean, collision-free storage path
  const baseName = fileName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const uniqueId = `${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const storagePath = `${folder}/${uniqueId}-${baseName || "drawing"}.${finalExtension}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, finalBuffer, {
      contentType: finalMimeType,
      upsert: true,
    });

  if (uploadError) {
    console.error("Supabase storage error:", uploadError);
    throw new Error(
      `Failed to upload to Supabase storage: ${uploadError.message}`,
    );
  }

  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(storagePath);

  return {
    url: urlData.publicUrl,
    path: storagePath,
    originalName: fileName,
    processedSize: finalBuffer.length,
    mimeType: finalMimeType,
    isImage,
  };
}
