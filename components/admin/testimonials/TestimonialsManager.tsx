"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  MessageSquareQuote,
  Star,
  Plus,
  Search,
  CheckCircle2,
  X,
  Edit2,
  Trash2,
  Building2,
  Award,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import type { AdminTestimonial } from "@/types";

export const TestimonialsManager: React.FC = () => {
  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "published" | "draft"
  >("all");
  const [editingItem, setEditingItem] = useState<AdminTestimonial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/admin/testimonials");
      if (res.ok) {
        const data = await res.json();
        if (data?.data && Array.isArray(data.data)) {
          setTestimonials(data.data);
        }
      }
    } catch (err) {
      console.warn("Notice: Fetching testimonials fallback:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);
  const [formData, setFormData] = useState({
    client_name: "",
    company: "",
    position: "",
    project_title: "",
    rating: 5,
    review: "",
    is_featured: false,
    is_published: true,
  });

  const filtered = useMemo(() => {
    return testimonials.filter((t) => {
      if (filterStatus === "published" && !t.is_published) return false;
      if (filterStatus === "draft" && t.is_published) return false;

      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matches =
          t.client_name.toLowerCase().includes(q) ||
          t.review.toLowerCase().includes(q) ||
          (t.company && t.company.toLowerCase().includes(q)) ||
          (t.project_title && t.project_title.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [testimonials, filterStatus, searchTerm]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      client_name: "",
      company: "",
      position: "",
      project_title: "",
      rating: 5,
      review: "",
      is_featured: false,
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AdminTestimonial) => {
    setEditingItem(item);
    setFormData({
      client_name: item.client_name,
      company: item.company || "",
      position: item.position || "",
      project_title: item.project_title || "",
      rating: item.rating,
      review: item.review,
      is_featured: item.is_featured,
      is_published: item.is_published,
    });
    setIsModalOpen(true);
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_published: !current } : t)),
    );
    try {
      await fetch(`/api/admin/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !current }),
      });
    } catch {
      // Ignored for optimistic UI
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_featured: !current } : t)),
    );
    try {
      await fetch(`/api/admin/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_featured: !current }),
      });
    } catch {
      // Ignored
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    try {
      await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    } catch {
      // Ignored
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_name || !formData.review) return;

    if (editingItem) {
      const updated: AdminTestimonial = {
        ...editingItem,
        ...formData,
      };
      setTestimonials((prev) =>
        prev.map((t) => (t.id === editingItem.id ? updated : t)),
      );
      try {
        await fetch(`/api/admin/testimonials/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } catch {
        // Ignored
      }
    } else {
      const created: AdminTestimonial = {
        id: `t_${Date.now()}`,
        ...formData,
        display_order: testimonials.length + 1,
        created_at: new Date().toISOString(),
      };
      setTestimonials([created, ...testimonials]);
      try {
        await fetch("/api/admin/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } catch {
        // Ignored
      }
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-[#7E5714] uppercase">
            Client Accolades & Reviews
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 tracking-tight mt-1">
            Testimonials & Endorsements
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Curate verified homeowner and commercial developer testimonials for
            the public studio website.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#7E5714] hover:bg-[#684710] text-white text-xs font-medium tracking-wider uppercase rounded-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-stone-200 p-4 rounded-sm shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client name, project, or review..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714] focus:bg-white text-stone-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as "all" | "published" | "draft")
            }
            className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-sm text-stone-700 focus:outline-none font-mono"
          >
            <option value="all">All Testimonials</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-stone-200 rounded-sm p-6 shadow-sm flex flex-col justify-between hover:border-stone-400 transition-colors relative group"
          >
            <div>
              {/* Rating and Badges */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < item.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-stone-300"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  {item.is_featured && (
                    <span className="px-2 py-0.5 bg-amber-100 text-[#7E5714] text-[10px] font-mono uppercase rounded-full">
                      Featured
                    </span>
                  )}
                  <button
                    onClick={() =>
                      handleTogglePublish(item.id, item.is_published)
                    }
                    className={`p-1 rounded-sm text-xs ${
                      item.is_published
                        ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                        : "text-stone-400 bg-stone-100 hover:bg-stone-200"
                    }`}
                    title={item.is_published ? "Published" : "Draft (Hidden)"}
                  >
                    {item.is_published ? (
                      <Eye className="w-3.5 h-3.5" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Quote */}
              <p className="text-xs text-stone-700 leading-relaxed italic font-serif relative">
                &ldquo;{item.review}&rdquo;
              </p>

              {/* Project Reference */}
              {item.project_title && (
                <div className="mt-3 text-[11px] font-mono text-[#7E5714] flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  <span>{item.project_title}</span>
                </div>
              )}
            </div>

            {/* Author details & footer */}
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <h4 className="font-serif text-stone-900 text-xs font-semibold">
                  {item.client_name}
                </h4>
                {(item.position || item.company) && (
                  <p className="text-[10px] text-stone-400 font-mono">
                    {item.position}
                    {item.position && item.company && ", "}
                    {item.company}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() =>
                    handleToggleFeatured(item.id, item.is_featured)
                  }
                  className={`p-1.5 rounded transition-colors text-xs ${
                    item.is_featured
                      ? "text-[#7E5714] bg-amber-50"
                      : "text-stone-400 hover:text-stone-600"
                  }`}
                  title={item.is_featured ? "Unfeature" : "Feature on Homepage"}
                >
                  <Award className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 text-stone-400 hover:text-stone-800 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isLoading && (
        <div className="p-12 text-center bg-white border border-stone-200 rounded-sm text-stone-400 text-xs font-mono flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#7E5714]" />
          <span>Loading client testimonials...</span>
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="p-12 text-center bg-white border border-stone-200 rounded-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <MessageSquareQuote className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-base text-stone-800 font-medium">
              {testimonials.length === 0
                ? "No client testimonials added yet"
                : "No testimonials match the current filter"}
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 font-sans">
              {testimonials.length === 0
                ? "You can upload and curate verified client reviews and endorsements when you're ready."
                : "Try adjusting your search keywords or switching the status filter."}
            </p>
          </div>
          {testimonials.length === 0 && (
            <div className="pt-2">
              <button
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#7E5714] hover:bg-[#684710] text-white text-xs font-medium tracking-wider uppercase rounded-sm transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Testimonial</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Testimonial Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-stone-200 rounded-sm shadow-xl max-w-lg w-full overflow-hidden">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="text-base font-serif text-stone-900 font-medium">
                {editingItem ? "Edit Testimonial" : "New Client Endorsement"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.client_name}
                  onChange={(e) =>
                    setFormData({ ...formData, client_name: e.target.value })
                  }
                  placeholder="e.g. Barrister Kamran Chaudhry"
                  className="w-full p-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    placeholder="e.g. Homeowner"
                    className="w-full p-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Company / Location
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    placeholder="e.g. DHA Phase 5 Lahore"
                    className="w-full p-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Linked Project Title
                </label>
                <input
                  type="text"
                  value={formData.project_title}
                  onChange={(e) =>
                    setFormData({ ...formData, project_title: e.target.value })
                  }
                  placeholder="e.g. The Cantilever Residence"
                  className="w-full p-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Star Rating (1 to 5)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1 text-amber-500 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= formData.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-stone-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-mono text-stone-600 text-xs ml-2">
                    {formData.rating} Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Endorsement / Review Text *
                </label>
                <textarea
                  required
                  value={formData.review}
                  onChange={(e) =>
                    setFormData({ ...formData, review: e.target.value })
                  }
                  rows={4}
                  placeholder="Paste client review..."
                  className="w-full p-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714] resize-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_published: e.target.checked,
                      })
                    }
                    className="accent-[#7E5714]"
                  />
                  <span className="text-stone-700">Published on Website</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_featured: e.target.checked,
                      })
                    }
                    className="accent-[#7E5714]"
                  />
                  <span className="text-stone-700">Featured Highlight</span>
                </label>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-600 hover:bg-stone-50 rounded-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#7E5714] hover:bg-[#684710] text-white font-medium rounded-sm transition-colors"
                >
                  {editingItem ? "Save Changes" : "Create Endorsement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
