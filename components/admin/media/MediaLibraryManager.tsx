"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Upload,
  Image as ImageIcon,
  File,
  Trash2,
  Copy,
  Check,
  Search,
  ExternalLink,
  Grid,
  List,
  X,
  AlertCircle,
  Eye,
  FileText,
} from "lucide-react";
import type { MediaAsset } from "@/types";

export const MediaLibraryManager: React.FC = () => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/media")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data && Array.isArray(data.data)) {
          setAssets(data.data);
        }
      })
      .catch(() => {});
  }, []);

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    if (!searchTerm) return assets;
    const q = searchTerm.toLowerCase();
    return assets.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        (a.alt_text && a.alt_text.toLowerCase().includes(q)),
    );
  }, [assets, searchTerm]);

  // Handle File Upload
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload asset.");
      }

      if (data.asset) {
        setAssets((prev) => [data.asset, ...prev]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload error";
      setUploadError(msg);
      // Fallback local asset preview
      const localAsset: MediaAsset = {
        id: `med_${Date.now()}`,
        name: file.name,
        url: URL.createObjectURL(file),
        size_bytes: file.size,
        mime_type: file.type || "image/jpeg",
        alt_text: file.name.replace(/\.[^/.]+$/, ""),
        created_at: new Date().toISOString(),
      };
      setAssets((prev) => [localAsset, ...prev]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this media asset?")) {
      setAssets((prev) => prev.filter((a) => a.id !== id));
      if (selectedAsset?.id === id) setSelectedAsset(null);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-[#7E5714] uppercase">
            Architectural Assets & Media
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 tracking-tight mt-1">
            Studio Media Library
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Store, optimize, and organize architectural blueprints, 3D
            renderings, and portfolio photography.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            accept="image/*,application/pdf"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#7E5714] hover:bg-[#684710] text-white text-xs font-medium tracking-wider uppercase rounded-sm shadow-sm transition-all disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            <span>{isUploading ? "Optimizing WebP..." : "Upload Asset"}</span>
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-sm text-xs text-amber-800 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            {uploadError} (Loaded local preview)
          </span>
          <button
            onClick={() => setUploadError(null)}
            className="text-amber-700 hover:text-amber-900 font-mono text-[10px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Control Bar */}
      <div className="bg-white border border-stone-200 p-4 rounded-sm shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assets by filename or caption..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714] focus:bg-white text-stone-800"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-stone-400 font-mono mr-2">
            {filteredAssets.length} Assets
          </span>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-sm border transition-colors ${
              viewMode === "grid"
                ? "bg-stone-900 text-white border-stone-900"
                : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
            }`}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-sm border transition-colors ${
              viewMode === "list"
                ? "bg-stone-900 text-white border-stone-900"
                : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Assets Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white border border-stone-200 rounded-sm shadow-sm overflow-hidden group flex flex-col justify-between hover:border-stone-400 transition-colors"
            >
              <div
                onClick={() => setSelectedAsset(asset)}
                className="relative aspect-video bg-stone-100 cursor-pointer overflow-hidden flex items-center justify-center"
              >
                {asset.mime_type.startsWith("image/") ? (
                  <Image
                    src={asset.url}
                    alt={asset.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                ) : (
                  <FileText className="w-12 h-12 text-stone-300" />
                )}
                <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="p-2 bg-white/90 rounded-full text-stone-900">
                    <Eye className="w-4 h-4" />
                  </span>
                </div>
              </div>

              <div className="p-3 border-t border-stone-100 flex flex-col justify-between flex-1">
                <div>
                  <h4
                    className="text-xs font-mono font-medium text-stone-800 truncate"
                    title={asset.name}
                  >
                    {asset.name}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono mt-1">
                    <span>{formatBytes(asset.size_bytes)}</span>
                    <span>{asset.mime_type.split("/")[1]?.toUpperCase()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-stone-50">
                  <button
                    onClick={() => handleCopy(asset.url)}
                    className="text-[11px] font-mono text-[#7E5714] hover:text-[#684710] inline-flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedUrl === asset.url ? "Copied" : "Copy URL"}
                  </button>
                  <button
                    onClick={() => handleDelete(asset.id)}
                    className="text-stone-400 hover:text-red-600 transition-colors p-1"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-sm shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 uppercase text-[10px] tracking-wider text-stone-500 font-mono">
              <tr>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
              {filteredAssets.map((asset) => (
                <tr
                  key={asset.id}
                  className="hover:bg-stone-50/70 transition-colors"
                >
                  <td className="py-3 px-4 font-sans flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-stone-100 overflow-hidden relative shrink-0">
                      {asset.mime_type.startsWith("image/") ? (
                        <Image
                          src={asset.url}
                          alt={asset.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-stone-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-stone-900 truncate max-w-sm">
                        {asset.name}
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono">
                        {asset.url}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-stone-600 uppercase">
                    {asset.mime_type.split("/")[1]}
                  </td>
                  <td className="py-3 px-4 text-stone-600">
                    {formatBytes(asset.size_bytes)}
                  </td>
                  <td className="py-3 px-4 text-stone-500">
                    {new Date(asset.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2 font-sans">
                    <button
                      onClick={() => handleCopy(asset.url)}
                      className="text-stone-600 hover:text-[#7E5714] text-xs font-mono inline-flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      {copiedUrl === asset.url ? "Copied" : "Copy"}
                    </button>
                    <button
                      onClick={() => handleDelete(asset.id)}
                      className="text-stone-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Asset Preview Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-stone-200 rounded-sm shadow-xl max-w-2xl w-full overflow-hidden flex flex-col">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="text-xs font-mono font-medium text-stone-800 truncate max-w-md">
                {selectedAsset.name}
              </h3>
              <button
                onClick={() => setSelectedAsset(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="relative aspect-video bg-stone-100 rounded-sm overflow-hidden flex items-center justify-center">
                {selectedAsset.mime_type.startsWith("image/") ? (
                  <Image
                    src={selectedAsset.url}
                    alt={selectedAsset.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                ) : (
                  <FileText className="w-16 h-16 text-stone-400" />
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-stone-50 border border-stone-200 rounded-sm font-mono text-[11px]">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">
                    File Size
                  </span>
                  <span className="text-stone-800 font-medium">
                    {formatBytes(selectedAsset.size_bytes)}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">
                    Type
                  </span>
                  <span className="text-stone-800 font-medium uppercase">
                    {selectedAsset.mime_type}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">
                    Added On
                  </span>
                  <span className="text-stone-800 font-medium">
                    {new Date(selectedAsset.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-stone-500 block mb-1">
                  Public Resource URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={selectedAsset.url}
                    className="w-full text-xs font-mono p-2 bg-stone-50 border border-stone-200 rounded-sm text-stone-800 select-all"
                  />
                  <button
                    onClick={() => handleCopy(selectedAsset.url)}
                    className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-mono rounded-sm shrink-0"
                  >
                    {copiedUrl === selectedAsset.url ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
