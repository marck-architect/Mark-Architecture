"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  DollarSign,
  Tag,
  Clock,
  X,
  Save,
  Loader2,
} from "lucide-react";
import type { AdminService } from "@/types";

interface ServicesManagerProps {
  services: AdminService[];
  onSaveService: (service: Partial<AdminService>) => Promise<void>;
  onDeleteService: (id: string) => Promise<void>;
}

export const ServicesManager: React.FC<ServicesManagerProps> = ({
  services,
  onSaveService,
  onDeleteService,
}) => {
  const [editingService, setEditingService] =
    useState<Partial<AdminService> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingService({
      title: "",
      slug: "",
      category: "Advisory",
      short_description: "",
      image_url: "/images/Full House Design Package.png",
      pricing_type: "flat",
      popularity_rank: (services.length || 0) + 1,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv: AdminService) => {
    setEditingService({ ...srv });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title || !editingService?.slug) return;
    setIsSaving(true);
    try {
      await onSaveService(editingService);
      setIsModalOpen(false);
      setEditingService(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDeleteService(id);
      setDeleteConfirmId(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900">
            Architectural Services &amp; Tiers
          </h2>
          <p className="text-xs text-stone-500 font-light mt-0.5">
            Manage public consultation categories, review packages, 3D facade
            pricing, and delivery timelines.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C1B1B] hover:bg-black text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>+ Add New Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#7E5714]/50 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold bg-amber-50 text-amber-900 border border-amber-200">
                  {srv.category}
                </span>

                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                    srv.is_active ? "text-emerald-700" : "text-stone-400"
                  }`}
                >
                  {srv.is_active ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  <span>{srv.is_active ? "Active" : "Archived"}</span>
                </span>
              </div>

              <div>
                <h3 className="font-playfair text-base font-bold text-stone-900">
                  {srv.title}
                </h3>
                <p className="text-xs text-stone-500 font-light mt-1 line-clamp-2 leading-relaxed">
                  {srv.short_description}
                </p>
              </div>

              {/* Tiers summary */}
              {srv.tiers && srv.tiers.length > 0 && (
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 space-y-1 text-xs">
                  <span className="text-[10px] font-mono text-stone-400 uppercase font-bold">
                    Configured Tiers ({srv.tiers.length})
                  </span>
                  <div className="divide-y divide-stone-100">
                    {srv.tiers.map((t) => (
                      <div
                        key={t.id}
                        className="py-1 flex items-center justify-between text-[11px]"
                      >
                        <span className="font-medium text-stone-800">
                          {t.tier_name}
                        </span>
                        <span className="text-stone-500 font-mono">
                          {t.pricing_rules?.[0]
                            ? `PKR ${t.pricing_rules[0].price_pkr.toLocaleString()}`
                            : "Formula"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[10px] font-mono text-stone-400 uppercase">
                Rank #{srv.popularity_rank} • {srv.pricing_type}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(srv)}
                  className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 cursor-pointer shadow-2xs"
                  title="Edit Service"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#7E5714]" />
                </button>

                <button
                  onClick={() => setDeleteConfirmId(srv.id)}
                  className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-rose-50 text-stone-400 hover:text-rose-600 cursor-pointer shadow-2xs"
                  title="Delete Service"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-stone-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-playfair text-lg font-bold text-stone-900">
              Delete Service?
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you wish to delete this service? If clients have
              booked this service in the past, it is recommended to archive it
              instead.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Service Modal */}
      {isModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white border border-stone-200 rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden text-stone-800">
            <div className="px-6 py-4.5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
              <h3 className="font-playfair text-lg font-bold text-stone-900">
                {editingService.id
                  ? "Edit Architecture Service"
                  : "Create Architecture Service"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="flex-1 overflow-y-auto p-6 space-y-4 text-xs"
            >
              <div>
                <label className="block text-stone-600 font-medium mb-1">
                  Service Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Front Elevation 3D Visuals"
                  value={editingService.title || ""}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-");
                    setEditingService({ ...editingService, title, slug });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-900 focus:border-[#7E5714]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.slug || ""}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        slug: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editingService.category || ""}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={editingService.short_description || ""}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      short_description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-900 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">
                    Pricing Model
                  </label>
                  <select
                    value={editingService.pricing_type || "flat"}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        pricing_type: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-900"
                  >
                    <option value="flat">Flat Pricing (PKR)</option>
                    <option value="size_based">
                      Plot Size Based (5/10 Marla, 1 Kanal)
                    </option>
                    <option value="rate_formula">
                      Rate Formula (PKR / sq.ft.)
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">
                    Popularity Rank (Ordering)
                  </label>
                  <input
                    type="number"
                    value={editingService.popularity_rank || 1}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        popularity_rank: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">
                  Featured Cover Image URL
                </label>
                <input
                  type="text"
                  value={editingService.image_url || ""}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      image_url: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-900 font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="srv_active"
                  checked={editingService.is_active !== false}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      is_active: e.target.checked,
                    })
                  }
                  className="rounded border-stone-300"
                />
                <label
                  htmlFor="srv_active"
                  className="text-stone-700 font-medium cursor-pointer"
                >
                  Publish on Architecture Website
                </label>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-[#7E5714] hover:bg-[#684710] text-white font-semibold flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save Service</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
