"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Link2, Maximize2, Minimize2 } from "lucide-react";
import type { UploadFolder } from "@/lib/server/storage";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  folder?: UploadFolder;
  label?: string;
  shape?: "rectangle" | "circle" | "square";
  aspectRatio?: string; // e.g. "aspect-video", "aspect-square", "aspect-[3/4]"
  objectFit?: "cover" | "contain";
  hint?: string;
  previewClassName?: string;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  folder = "media",
  label = "Cover Image",
  shape = "rectangle",
  aspectRatio = "aspect-video",
  objectFit: initialObjectFit = "cover",
  hint = "PNG, JPG, WebP (Auto-resized & optimized with Sharp to high-clarity WebP)",
  previewClassName = "",
  maxWidth,
  maxHeight,
  quality,
  fit,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [manualUrl, setManualUrl] = useState(value);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadMeta, setUploadMeta] = useState<{
    width?: number;
    height?: number;
    processedSize?: number;
    originalSize?: number;
  } | null>(null);
  const [fitMode, setFitMode] = useState<"cover" | "contain">(initialObjectFit);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      if (maxWidth) formData.append("maxWidth", String(maxWidth));
      if (maxHeight) formData.append("maxHeight", String(maxHeight));
      if (quality) formData.append("quality", String(quality));
      if (fit) formData.append("fit", fit);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Failed to upload image.");
      }

      onChange(data.url);
      setManualUrl(data.url);
      if (data.width && data.height) {
        setUploadMeta({
          width: data.width,
          height: data.height,
          processedSize: data.processedSize,
          originalSize: data.originalSize,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed.";
      setUploadError(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleManualApply = () => {
    if (manualUrl.trim()) {
      onChange(manualUrl.trim());
      setUploadMeta(null);
      setShowManualUrl(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 uppercase tracking-wider">
          {label}
        </label>
        <div className="flex items-center gap-3">
          {value && (
            <button
              type="button"
              onClick={() =>
                setFitMode(fitMode === "cover" ? "contain" : "cover")
              }
              className="text-[11px] text-stone-500 hover:text-stone-800 dark:text-zinc-400 dark:hover:text-zinc-200 inline-flex items-center gap-1 cursor-pointer font-medium"
              title={
                fitMode === "cover"
                  ? "Switch to Full View (no cropping)"
                  : "Switch to Crop to Fill"
              }
            >
              {fitMode === "cover" ? (
                <>
                  <Minimize2 className="w-3 h-3" />
                  <span>Show Full Image</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3 h-3" />
                  <span>Fill Frame</span>
                </>
              )}
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowManualUrl(!showManualUrl)}
            className="text-[11px] text-[#7E5714] dark:text-amber-500 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <Link2 className="w-3 h-3" />
            <span>{showManualUrl ? "Upload File" : "Paste URL"}</span>
          </button>
        </div>
      </div>

      {showManualUrl ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://... or /images/..."
            className="flex-1 px-3 py-2 text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-lg text-stone-900 dark:text-zinc-100 focus:outline-none focus:border-[#7E5714]"
          />
          <button
            type="button"
            onClick={handleManualApply}
            className="px-3 py-2 text-xs font-semibold bg-[#7E5714] text-white rounded-lg hover:bg-[#684710] cursor-pointer"
          >
            Apply
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {value ? (
            <div className="space-y-2">
              <div
                className={`relative group overflow-hidden border border-stone-200 dark:border-zinc-700 bg-stone-100/90 dark:bg-zinc-800/90 rounded-xl shadow-xs ${previewClassName}`}
              >
                <div
                  className={`relative w-full ${
                    shape === "circle"
                      ? "w-40 h-40 mx-auto rounded-full overflow-hidden aspect-square border-2 border-stone-200"
                      : shape === "square"
                        ? "aspect-square max-w-xs mx-auto"
                        : aspectRatio
                  }`}
                >
                  <Image
                    src={value}
                    alt={label}
                    fill
                    className={`${
                      fitMode === "contain"
                        ? "object-contain p-1"
                        : "object-cover object-top"
                    }`}
                    unoptimized={value.startsWith("http")}
                  />
                </div>

                {/* Fit Mode Badge */}
                <div className="absolute top-2 left-2 pointer-events-none">
                  <span className="px-2 py-0.5 bg-stone-900/75 text-white text-[10px] rounded font-mono uppercase tracking-wider backdrop-blur-xs">
                    {fitMode === "contain" ? "Full View" : "Cover View"}
                  </span>
                </div>

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="p-2 bg-white/90 hover:bg-white text-stone-900 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Replace</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFitMode(fitMode === "cover" ? "contain" : "cover")
                    }
                    className="p-2 bg-stone-900/90 hover:bg-black text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    {fitMode === "cover" ? (
                      <Minimize2 className="w-3.5 h-3.5" />
                    ) : (
                      <Maximize2 className="w-3.5 h-3.5" />
                    )}
                    <span>{fitMode === "cover" ? "Full Fit" : "Fill"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onChange("");
                      setUploadMeta(null);
                    }}
                    className="p-2 bg-rose-600/90 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              {uploadMeta && (
                <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 dark:text-zinc-400 bg-stone-100 dark:bg-zinc-800/80 px-2.5 py-1 rounded-md border border-stone-200 dark:border-zinc-700">
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Sharp Optimized (WebP)
                  </span>
                  <span>
                    {uploadMeta.width && uploadMeta.height
                      ? `${uploadMeta.width}×${uploadMeta.height} px`
                      : ""}{" "}
                    {uploadMeta.processedSize
                      ? `• ${(uploadMeta.processedSize / 1024).toFixed(0)} KB`
                      : ""}
                    {uploadMeta.originalSize &&
                    uploadMeta.processedSize &&
                    uploadMeta.originalSize > uploadMeta.processedSize
                      ? ` (${Math.round((1 - uploadMeta.processedSize / uploadMeta.originalSize) * 100)}% smaller)`
                      : ""}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed border-stone-300 dark:border-zinc-700 hover:border-[#7E5714] dark:hover:border-amber-500/80 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-stone-50/50 dark:bg-zinc-900/50 ${
                shape === "circle" ? "w-36 h-36 mx-auto rounded-full" : ""
              } ${previewClassName}`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[#7E5714]" />
                  <span className="text-xs text-stone-500 dark:text-zinc-400 font-medium">
                    Uploading & optimizing...
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-10 h-10 rounded-full bg-[#7E5714]/10 dark:bg-amber-500/10 text-[#7E5714] dark:text-amber-500 flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-stone-700 dark:text-zinc-200">
                    Click to Upload Image
                  </span>
                  <span className="text-[10px] text-stone-400 dark:text-zinc-500 max-w-xs">
                    {hint}
                  </span>
                </div>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            onChange={handleFileChange}
            className="hidden"
          />

          {uploadError && (
            <p className="text-xs text-rose-600 dark:text-rose-400">
              {uploadError}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
