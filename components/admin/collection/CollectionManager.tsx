"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Save,
  Loader2,
  Layers,
  Search,
} from "lucide-react";
import { ImageUploadField } from "@/components/admin/ui/ImageUploadField";

export interface CollectionItem {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  tag?: string;
  covered_area_sqft: number;
  plot_dimensions?: string;
  price_pkr: number;
  estimated_construction_cost?: string;
  turnaround_weeks?: string;
  cover_image: string;
  gallery_urls?: string[];
  deliverables?: string[];
  specifications?: Record<string, any>;
  is_published: boolean;
  display_order: number;
}

export const CollectionManager: React.FC = () => {
  const [packages, setPackages] = useState<CollectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] =
    useState<Partial<CollectionItem> | null>(null);
  const [deliverablesText, setDeliverablesText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/collection");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.data) && data.data.length > 0) {
          setPackages(data.data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch collection packages:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleOpenCreate = () => {
    const defaultDeliverables = [
      "Comprehensive Diagnostic Report & Architectural Blueprint",
      "Structural Engineering & Material Feasibility",
      "Circulation, Room Sizing & Furniture Arrangement",
      "3D Exterior Elevations & High-Res Views",
    ];
    setEditingItem({
      name: "",
      slug: "",
      subtitle: "",
      tag: "Standard Package",
      covered_area_sqft: 4500,
      plot_dimensions: "10 Marla",
      price_pkr: 25000,
      estimated_construction_cost: "Market Standard",
      turnaround_weeks: "3–5 Days",
      cover_image: "/images/Full House Design Package.png",
      gallery_urls: [],
      deliverables: defaultDeliverables,
      is_published: true,
      display_order: packages.length + 1,
    });
    setDeliverablesText(defaultDeliverables.join("\n"));
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: CollectionItem) => {
    setEditingItem({ ...item });
    setDeliverablesText(
      Array.isArray(item.deliverables) ? item.deliverables.join("\n") : "",
    );
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name || !editingItem.price_pkr) return;

    setIsSaving(true);
    const isNew = !editingItem.id;
    const tempId = editingItem.id || `pkg_${Date.now()}`;
    const cleanDeliverables = deliverablesText
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean);

    const targetItem: CollectionItem = {
      id: tempId,
      slug:
        editingItem.slug ||
        editingItem.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      name: editingItem.name,
      subtitle: editingItem.subtitle || "",
      tag: editingItem.tag || "Standard Package",
      covered_area_sqft: Number(editingItem.covered_area_sqft) || 4500,
      plot_dimensions: editingItem.plot_dimensions || "10 Marla",
      price_pkr: Number(editingItem.price_pkr) || 25000,
      estimated_construction_cost:
        editingItem.estimated_construction_cost || "Market Standard",
      turnaround_weeks: editingItem.turnaround_weeks || "3–5 Days",
      cover_image:
        editingItem.cover_image || "/images/Full House Design Package.png",
      gallery_urls: Array.isArray(editingItem.gallery_urls)
        ? editingItem.gallery_urls
        : [editingItem.cover_image || "/images/Full House Design Package.png"],
      deliverables: cleanDeliverables,
      is_published: editingItem.is_published ?? true,
      display_order: Number(editingItem.display_order) || packages.length + 1,
    };

    // Optimistic UI update
    if (isNew) {
      setPackages((prev) => [targetItem, ...prev]);
    } else {
      setPackages((prev) =>
        prev.map((p) => (p.id === targetItem.id ? { ...p, ...targetItem } : p)),
      );
    }
    setIsModalOpen(false);
    setEditingItem(null);

    try {
      const url = isNew
        ? "/api/admin/collection"
        : `/api/admin/collection/${targetItem.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(targetItem),
      });

      if (res.ok) {
        const saved = await res.json();
        const savedItem = saved?.data || saved?.package;
        if (savedItem?.id) {
          setPackages((prev) =>
            prev.map((p) => (p.id === tempId ? { ...p, ...savedItem } : p)),
          );
        }
        setFeedback({
          type: "success",
          message: isNew
            ? "Package created and published successfully!"
            : "Package updated successfully!",
        });
        setTimeout(() => setFeedback(null), 4000);
      } else {
        const errData = await res.json();
        setFeedback({
          type: "error",
          message: errData.error || "Failed to save collection package.",
        });
        setTimeout(() => setFeedback(null), 5000);
        await fetchPackages();
      }
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to save.",
      });
      setTimeout(() => setFeedback(null), 5000);
      await fetchPackages();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Optimistic delete
    setPackages((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirmId(null);
    setFeedback({
      type: "success",
      message: "Package deleted successfully.",
    });
    setTimeout(() => setFeedback(null), 4000);

    try {
      const res = await fetch(`/api/admin/collection/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        await fetchPackages();
      }
    } catch (err) {
      console.error("Delete failed:", err);
      await fetchPackages();
    }
  };

  const filteredPackages = packages.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.plot_dimensions?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-stone-200 dark:border-zinc-800 shadow-xs">
        <div>
          <h2 className="text-xl font-playfair font-bold text-stone-900 dark:text-zinc-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#7E5714]" />
            <span>Curated Architectural Collection (/collection)</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
            Manage standardized design packages, turnkey blueprints,
            specifications, and instant checkout pricing.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search packages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl text-stone-900 dark:text-zinc-100 focus:outline-none focus:border-[#7E5714]"
            />
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 bg-[#7E5714] hover:bg-[#684710] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Design Package</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`px-4 py-3 rounded-2xl text-xs font-medium flex items-center justify-between transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-stone-400 hover:text-stone-600 ml-2 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Packages list display */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl">
          <Loader2 className="w-6 h-6 animate-spin text-[#7E5714] mb-2" />
          <span className="text-xs text-stone-500">
            Loading collection packages...
          </span>
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="text-center p-12 bg-white dark:bg-zinc-900 border border-dashed border-stone-200 dark:border-zinc-800 rounded-2xl">
          <Layers className="w-8 h-8 text-stone-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-stone-600 dark:text-zinc-400">
            No design packages found.
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="mt-3 text-xs text-[#7E5714] font-semibold hover:underline cursor-pointer"
          >
            Create your first design package
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] bg-stone-100 dark:bg-zinc-800">
                  <Image
                    src={
                      pkg.cover_image || "/images/Full House Design Package.png"
                    }
                    alt={pkg.name}
                    fill
                    className="object-cover"
                    unoptimized={
                      typeof pkg.cover_image === "string" &&
                      pkg.cover_image.startsWith("http")
                    }
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-md">
                    {pkg.tag || "Standard Package"}
                  </span>
                  <span
                    className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${
                      pkg.is_published
                        ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                        : "bg-stone-500/20 text-stone-700 dark:text-stone-400 border border-stone-500/30"
                    }`}
                  >
                    {pkg.is_published ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    <span>{pkg.is_published ? "Published" : "Draft"}</span>
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-playfair font-bold text-lg text-stone-900 dark:text-zinc-100">
                    {pkg.name}
                  </h3>
                  {pkg.subtitle && (
                    <p className="text-xs text-stone-500 dark:text-zinc-400 line-clamp-2 mt-1">
                      {pkg.subtitle}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-stone-100 dark:border-zinc-800 text-xs">
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase">
                        Covered Area
                      </span>
                      <span className="font-semibold text-stone-800 dark:text-zinc-200">
                        {pkg.covered_area_sqft} sq.ft
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase">
                        Plot Size
                      </span>
                      <span className="font-semibold text-stone-800 dark:text-zinc-200">
                        {pkg.plot_dimensions || "10 Marla"}
                      </span>
                    </div>
                    <div className="col-span-2 mt-1">
                      <span className="text-stone-400 block text-[10px] uppercase">
                        Turnkey Package Price
                      </span>
                      <span className="text-sm font-bold text-[#7E5714] dark:text-amber-500 font-mono">
                        PKR {Number(pkg.price_pkr).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-5 pt-0 flex justify-end gap-2 border-t border-stone-100 dark:border-zinc-800 pt-3">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(pkg)}
                  className="p-1.5 text-stone-500 hover:text-[#7E5714] hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                  title="Edit Package"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(pkg.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                  title="Delete Package"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="font-playfair font-bold text-lg text-stone-900 dark:text-zinc-100">
              Delete Package?
            </h3>
            <p className="text-xs text-stone-600 dark:text-zinc-400">
              Are you sure you want to remove this architectural package from
              the collection catalog? This action will update the public
              website.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl cursor-pointer"
              >
                Delete Package
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl max-w-2xl w-full p-6 md:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-zinc-800">
              <h3 className="font-playfair font-bold text-xl text-stone-900 dark:text-zinc-100">
                {editingItem.id
                  ? "Edit Architectural Package"
                  : "New Architectural Package"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Package Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.name || ""}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-+|-+$/g, "");
                      setEditingItem({
                        ...editingItem,
                        name,
                        slug: editingItem.id ? editingItem.slug : slug,
                      });
                    }}
                    placeholder="e.g. House Plan Correction (10 Marla)"
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl text-stone-900 dark:text-zinc-100 focus:outline-none focus:border-[#7E5714]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.slug || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, slug: e.target.value })
                    }
                    placeholder="e.g. hpc-standard"
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl text-stone-900 dark:text-zinc-100 font-mono focus:outline-none focus:border-[#7E5714]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={editingItem.tag || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, tag: e.target.value })
                    }
                    placeholder="e.g. Standard Package, Signature Villa, Premium"
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl text-stone-900 dark:text-zinc-100 focus:outline-none focus:border-[#7E5714]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Package Price (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingItem.price_pkr || 25000}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        price_pkr: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl text-stone-900 dark:text-zinc-100 focus:outline-none focus:border-[#7E5714]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Covered Area (Sq. Ft.)
                  </label>
                  <input
                    type="number"
                    value={editingItem.covered_area_sqft || 4500}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        covered_area_sqft: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl text-stone-900 dark:text-zinc-100 focus:outline-none focus:border-[#7E5714]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Plot Dimensions
                  </label>
                  <input
                    type="text"
                    value={editingItem.plot_dimensions || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        plot_dimensions: e.target.value,
                      })
                    }
                    placeholder="e.g. 10 Marla, 1 Kanal, Any Plot Size"
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl text-stone-900 dark:text-zinc-100 focus:outline-none focus:border-[#7E5714]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Turnaround Delivery Time
                  </label>
                  <input
                    type="text"
                    value={editingItem.turnaround_weeks || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        turnaround_weeks: e.target.value,
                      })
                    }
                    placeholder="e.g. 3–5 Days, 24–48 Hours"
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl text-stone-900 dark:text-zinc-100 focus:outline-none focus:border-[#7E5714]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Estimated Construction Cost
                  </label>
                  <input
                    type="text"
                    value={editingItem.estimated_construction_cost || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        estimated_construction_cost: e.target.value,
                      })
                    }
                    placeholder="e.g. PKR 35M – 45M"
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl text-stone-900 dark:text-zinc-100 focus:outline-none focus:border-[#7E5714]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Subtitle & Architectural Concept
                </label>
                <textarea
                  rows={2}
                  value={editingItem.subtitle || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, subtitle: e.target.value })
                  }
                  placeholder="e.g. Ultra-realistic 3D exterior visualization showcasing daytime lighting and premium materials..."
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl text-stone-900 dark:text-zinc-100 focus:outline-none focus:border-[#7E5714]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Package Inclusions & Deliverables (One per line)
                </label>
                <textarea
                  rows={4}
                  value={deliverablesText}
                  onChange={(e) => setDeliverablesText(e.target.value)}
                  placeholder="2 High-Res 3D Views (Front & Angle)&#10;Exterior Material & Paint Color Specs&#10;2 Design Revision Rounds"
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl text-stone-900 dark:text-zinc-100 focus:outline-none focus:border-[#7E5714]"
                />
              </div>

              {/* Cover Image Upload */}
              <ImageUploadField
                label="Package 3D Elevation / Render Cover Image"
                folder="collection"
                value={editingItem.cover_image || ""}
                onChange={(url) =>
                  setEditingItem({ ...editingItem, cover_image: url })
                }
              />

              {/* Publication Status & Display Order */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.is_published ?? true}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        is_published: e.target.checked,
                      })
                    }
                    className="rounded border-stone-300 text-[#7E5714] focus:ring-[#7E5714]"
                  />
                  <span className="text-xs font-medium text-stone-700 dark:text-zinc-300">
                    Publish immediately on /collection
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-stone-500 font-medium">
                    Display Order:
                  </label>
                  <input
                    type="number"
                    value={editingItem.display_order ?? 1}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        display_order: Number(e.target.value),
                      })
                    }
                    className="w-16 px-2 py-1 text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-lg text-stone-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-zinc-400 hover:bg-stone-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#7E5714] hover:bg-[#684710] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Save Package</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
