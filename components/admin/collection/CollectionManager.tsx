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
  Sparkles,
  DollarSign,
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
  is_published: boolean;
  display_order: number;
}

export const CollectionManager: React.FC = () => {
  const [packages, setPackages] = useState<CollectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] =
    useState<Partial<CollectionItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/collection");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.data)) {
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
    setEditingItem({
      name: "",
      slug: "",
      subtitle: "",
      tag: "Signature Villa",
      covered_area_sqft: 5000,
      plot_dimensions: "50' x 90' (1 Kanal)",
      price_pkr: 28000,
      estimated_construction_cost: "PKR 45M – 55M",
      turnaround_weeks: "3-4 weeks delivery",
      cover_image: "/images/hero-3d-render.webp",
      gallery_urls: [],
      deliverables: [
        "Architectural Working Drawings",
        "Structural Engineering & Foundation Calculations",
        "MEP (Plumbing & Electrical) Layouts",
        "3D Exterior Elevations & Material Schedules",
      ],
      is_published: true,
      display_order: packages.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: CollectionItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name || !editingItem.price_pkr) return;

    setIsSaving(true);
    try {
      const isNew = !editingItem.id;
      const url = isNew
        ? "/api/admin/collection"
        : `/api/admin/collection/${editingItem.id}`;
      const method = isNew ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingItem(null);
        await fetchPackages();
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to save collection package.");
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/collection/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteConfirmId(null);
        await fetchPackages();
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const filteredPackages = packages.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tag?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-stone-200 dark:border-zinc-800 shadow-xs">
        <div>
          <h2 className="text-xl font-playfair font-bold text-stone-900 dark:text-zinc-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#7E5714]" />
            <span>Curated Architectural Villas (/collection)</span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1">
            Manage signature villa models, turnkey blueprints, specifications,
            and instant purchase pricing.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search villa designs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl text-stone-900 dark:text-zinc-100 focus:outline-none focus:border-[#7E5714]"
            />
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-[#7E5714] hover:bg-[#684710] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Villa Design</span>
          </button>
        </div>
      </div>

      {/* Grid of packages */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-stone-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#7E5714] mb-2" />
          <span className="text-xs">Loading collection from Supabase...</span>
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-stone-200 dark:border-zinc-800 rounded-2xl">
          <p className="text-sm font-medium text-stone-600 dark:text-zinc-400">
            No villa models found.
          </p>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="mt-3 text-xs text-[#7E5714] font-semibold hover:underline"
          >
            Create your first villa package
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="relative aspect-[16/10] bg-stone-100 dark:bg-zinc-800">
                <Image
                  src={pkg.cover_image}
                  alt={pkg.name}
                  fill
                  className="object-cover"
                  unoptimized={pkg.cover_image.startsWith("http")}
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-md">
                  {pkg.tag || "Signature Villa"}
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

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
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
                        {pkg.plot_dimensions || "1 Kanal"}
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

                <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-stone-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(pkg)}
                    className="p-2 text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-lg text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(pkg.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg text-xs font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl max-w-sm w-full p-6 space-y-4">
            <h4 className="font-playfair font-bold text-lg text-stone-900 dark:text-zinc-100">
              Delete Villa Design?
            </h4>
            <p className="text-xs text-stone-500 dark:text-zinc-400">
              Are you sure you want to delete this villa package from the
              collection catalog? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg cursor-pointer"
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
                    Villa Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.name || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, name: e.target.value })
                    }
                    placeholder="e.g. Villa Serenità"
                    className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl text-stone-900 dark:text-zinc-100 focus:outline-none focus:border-[#7E5714]"
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
                    placeholder="e.g. Signature Villa, Minimalist Estate"
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
                    value={editingItem.price_pkr || 28000}
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
                    value={editingItem.covered_area_sqft || 5000}
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
                    placeholder="e.g. 50' x 90' (1 Kanal)"
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
                    placeholder="e.g. PKR 45M – 55M"
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
                  placeholder="e.g. Modernist cantilevered pavilion villa featuring courtyards and skylights..."
                  className="w-full px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl text-stone-900 dark:text-zinc-100 focus:outline-none focus:border-[#7E5714]"
                />
              </div>

              {/* Cover Image Upload to Supabase Storage */}
              <ImageUploadField
                label="Villa 3D Elevation / Render Image"
                folder="collection"
                value={editingItem.cover_image || ""}
                onChange={(url) =>
                  setEditingItem({ ...editingItem, cover_image: url })
                }
              />

              {/* Publication Status */}
              <div className="flex items-center gap-3 pt-2">
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
                  <span>Save Villa Package</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
