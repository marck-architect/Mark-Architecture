import "server-only";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

export const DEFAULT_MEDIA_BUCKET = "media";
export const STORAGE_BUCKET = DEFAULT_MEDIA_BUCKET;
export const ATTACHMENTS_BUCKET = "client-attachments";

export type UploadFolder =
  | "projects"
  | "services"
  | "collection"
  | "team"
  | "media"
  | "site"
  | "consultations"
  | "orders";

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
  bucketName: string,
) {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (!error && buckets) {
      const exists = buckets.some(
        (b) => b.name === bucketName || b.id === bucketName,
      );
      if (!exists) {
        await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 26214400, // 25MB
          allowedMimeTypes: [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/avif",
            "image/gif",
          ],
        });
      }
    }
  } catch (err) {
    // Non-fatal if bucket already exists or permissions restrict listing
    console.warn(`Storage bucket ${bucketName} check notice:`, err);
  }
}

export interface ProcessUploadResult {
  url: string;
  path: string;
  originalName: string;
  processedSize: number;
  mimeType: string;
  isImage: boolean;
  width?: number;
  height?: number;
}

/**
 * Processes an uploaded file buffer (optimizing images with sharp, keeping PDFs intact)
 * and stores it into Supabase Storage.
 */
export async function processAndUploadFile({
  fileBuffer,
  fileName,
  mimeType,
  folder = "media",
  bucket,
}: {
  fileBuffer: Buffer;
  fileName: string;
  mimeType: string;
  folder?: UploadFolder;
  bucket?: string;
}): Promise<ProcessUploadResult> {
  const supabase = getStorageClient();
  const targetBucket =
    bucket ||
    (folder === "consultations" || folder === "orders"
      ? ATTACHMENTS_BUCKET
      : DEFAULT_MEDIA_BUCKET);

  await ensureBucketExists(supabase, targetBucket);

  const isImage =
    mimeType.startsWith("image/") ||
    /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(fileName);
  const isPdf = mimeType === "application/pdf" || /\.pdf$/i.test(fileName);

  if (!isImage && !isPdf) {
    throw new Error(
      "Unsupported file format. Please upload an image (PNG, JPG, WebP, AVIF) or PDF blueprint.",
    );
  }

  let finalBuffer: Buffer;
  let finalMimeType: string;
  let finalExtension: string;
  let imageWidth: number | undefined;
  let imageHeight: number | undefined;

  if (isImage) {
    // Resize & optimize image using sharp:
    // Max 2560x2560 box, fit inside, retain aspect ratio without enlargement.
    // Convert to webp with high quality (88) for optimal architectural clarity.
    const imagePipeline = sharp(fileBuffer).rotate();
    const metadata = await imagePipeline.metadata();

    finalBuffer = await imagePipeline
      .resize({
        width: 2560,
        height: 2560,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 88, effort: 4 })
      .toBuffer();

    const finalMeta = await sharp(finalBuffer).metadata();
    imageWidth = finalMeta.width;
    imageHeight = finalMeta.height;
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
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const uniqueId = `${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const storagePath = `${folder}/${uniqueId}-${baseName || "asset"}.${finalExtension}`;

  const { error: uploadError } = await supabase.storage
    .from(targetBucket)
    .upload(storagePath, finalBuffer, {
      contentType: finalMimeType,
      upsert: true,
    });

  if (uploadError) {
    console.error("Supabase storage error:", uploadError);
    if (uploadError.message?.toLowerCase().includes("bucket not found")) {
      throw new Error(
        `Supabase Storage bucket '${targetBucket}' was not found. Please create a public bucket named '${targetBucket}' in your Supabase Dashboard (Storage -> New Bucket -> Toggle Public) or run the SQL in 'supabase/create_buckets_only.sql'.`,
      );
    }
    throw new Error(
      `Failed to upload to Supabase storage: ${uploadError.message}`,
    );
  }

  const { data: urlData } = supabase.storage
    .from(targetBucket)
    .getPublicUrl(storagePath);

  const publicUrl = urlData.publicUrl;

  // Track in media_assets table if non-consultation upload
  if (folder !== "consultations" && folder !== "orders") {
    try {
      await supabase.from("media_assets").insert({
        file_name: fileName,
        file_path: storagePath,
        public_url: publicUrl,
        folder,
        mime_type: finalMimeType,
        size_bytes: finalBuffer.length,
        dimensions:
          imageWidth && imageHeight
            ? { width: imageWidth, height: imageHeight }
            : null,
      });
    } catch (dbErr) {
      console.warn("Media asset db record warning:", dbErr);
    }
  }

  return {
    url: publicUrl,
    path: storagePath,
    originalName: fileName,
    processedSize: finalBuffer.length,
    mimeType: finalMimeType,
    isImage,
    width: imageWidth,
    height: imageHeight,
  };
}
