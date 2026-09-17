"use client";

import React, { useState, useMemo } from "react";
import {
  HelpCircle,
  Plus,
  Search,
  CheckCircle2,
  X,
  Edit2,
  Trash2,
  Save,
  Phone,
  Mail,
  MapPin,
  Eye,
  EyeOff,
} from "lucide-react";
import type { AdminFaq } from "@/types";
import { seedFaqs } from "@/data/adminSeed";

export const ContentManager: React.FC = () => {
  const [subTab, setSubTab] = useState<"faqs" | "studio">("faqs");
  const [faqs, setFaqs] = useState<AdminFaq[]>(seedFaqs);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // FAQ Modal state
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<AdminFaq | null>(null);
  const [faqForm, setFaqForm] = useState({
    question: "",
    answer: "",
    category: "Consultations",
    is_published: true,
  });

  // Studio Profile Copy State
  const [studioCopy, setStudioCopy] = useState({
    studioName: "MARK Architects",
    tagline:
      "Contemporary architectural design, structural clarity, and bespoke residential sanctuaries.",
    philosophy:
      "We believe architecture is an enduring dialogue between natural light, structural proportion, and human experience. Each residence is tailored meticulously to the client's way of living.",
    officeAddress: "Plot 42-C, Phase 6 Commercial, DHA Lahore, Pakistan",
    primaryPhone: "+92 300 8472910",
    primaryEmail: "info@markarchitects.com",
    officeHours: "Monday – Saturday: 09:00 AM – 06:00 PM PKT",
    consultationNotice:
      "Clients must provide plot size, survey drawings, or photos before consultation sessions to ensure maximal productive time.",
  });
  const [studioSaved, setStudioSaved] = useState(false);

  // Categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    faqs.forEach((f) => {
      if (f.category) set.add(f.category);
    });
    return Array.from(set);
  }, [faqs]);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return faqs.filter((f) => {
      if (categoryFilter !== "all" && f.category !== categoryFilter)
        return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matches =
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [faqs, categoryFilter, searchTerm]);

  // FAQ CRUD handlers
  const handleOpenCreateFaq = () => {
    setEditingFaq(null);
    setFaqForm({
      question: "",
      answer: "",
      category: "Consultations",
      is_published: true,
    });
    setIsFaqModalOpen(true);
  };

  const handleOpenEditFaq = (f: AdminFaq) => {
    setEditingFaq(f);
    setFaqForm({
      question: f.question,
      answer: f.answer,
      category: f.category || "General",
      is_published: f.is_published,
    });
    setIsFaqModalOpen(true);
  };

  const handleTogglePublishFaq = async (id: string, current: boolean) => {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, is_published: !current } : f)),
    );
    try {
      await fetch(`/api/admin/faqs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_published: !current }),
      });
    } catch {
      // Ignored
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    try {
      await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
    } catch {
      // Ignored
    }
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question || !faqForm.answer) return;

    if (editingFaq) {
      const updated: AdminFaq = {
        ...editingFaq,
        ...faqForm,
      };
      setFaqs((prev) =>
        prev.map((f) => (f.id === editingFaq.id ? updated : f)),
      );
      try {
        await fetch(`/api/admin/faqs/${editingFaq.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(faqForm),
        });
      } catch {
        // Ignored
      }
    } else {
      const created: AdminFaq = {
        id: `faq_${Date.now()}`,
        ...faqForm,
        display_order: faqs.length + 1,
      };
      setFaqs([...faqs, created]);
      try {
        await fetch("/api/admin/faqs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(faqForm),
        });
      } catch {
        // Ignored
      }
    }

    setIsFaqModalOpen(false);
  };

  const handleSaveStudioProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setStudioSaved(true);
    setTimeout(() => setStudioSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-[#7E5714] uppercase">
            Content & Knowledge Base
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 tracking-tight mt-1">
            Studio Content CMS
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Maintain public answers to architectural inquiries, studio
            philosophies, and contact metadata.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center bg-stone-100 p-1 rounded-sm">
          <button
            onClick={() => setSubTab("faqs")}
            className={`px-4 py-1.5 text-xs font-medium rounded-sm transition-all ${
              subTab === "faqs"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            FAQs ({faqs.length})
          </button>
          <button
            onClick={() => setSubTab("studio")}
            className={`px-4 py-1.5 text-xs font-medium rounded-sm transition-all ${
              subTab === "studio"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            Studio Information
          </button>
        </div>
      </div>

      {subTab === "faqs" ? (
        <div className="space-y-6">
          {/* FAQ Controls */}
          <div className="bg-white border border-stone-200 p-4 rounded-sm shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search FAQs by question or answer..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714] focus:bg-white text-stone-800"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-sm text-stone-700 font-mono"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <button
                onClick={handleOpenCreateFaq}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#7E5714] hover:bg-[#684710] text-white text-xs font-medium uppercase tracking-wider rounded-sm transition-all shadow-sm shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>New FAQ</span>
              </button>
            </div>
          </div>

          {/* FAQ Accordion/Cards */}
          <div className="space-y-3">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white border border-stone-200 rounded-sm p-5 shadow-sm hover:border-stone-400 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-50 text-[#7E5714] rounded-sm mt-0.5 shrink-0">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-[10px] font-mono uppercase">
                          {faq.category || "General"}
                        </span>
                        {!faq.is_published && (
                          <span className="px-2 py-0.5 bg-stone-200 text-stone-500 rounded text-[10px] font-mono uppercase">
                            Draft (Hidden)
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-serif font-semibold text-stone-900 mt-1.5">
                        {faq.question}
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed font-sans mt-2">
                        {faq.answer}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() =>
                        handleTogglePublishFaq(faq.id, faq.is_published)
                      }
                      className={`p-1.5 rounded transition-colors ${
                        faq.is_published
                          ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                          : "text-stone-400 bg-stone-100 hover:bg-stone-200"
                      }`}
                      title={faq.is_published ? "Published" : "Hidden"}
                    >
                      {faq.is_published ? (
                        <Eye className="w-3.5 h-3.5" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleOpenEditFaq(faq)}
                      className="p-1.5 text-stone-400 hover:text-stone-800 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredFaqs.length === 0 && (
              <div className="p-12 text-center bg-white border border-stone-200 rounded-sm text-stone-400 text-xs font-mono">
                No FAQs match the current filter.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Studio Profile Tab */
        <form
          onSubmit={handleSaveStudioProfile}
          className="bg-white border border-stone-200 p-6 rounded-sm shadow-sm space-y-6 max-w-3xl"
        >
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h3 className="font-serif text-lg text-stone-900 font-semibold">
                Studio Identity & Philosophy
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Brand narrative, contact phone numbers, and physical studio
                office details.
              </p>
            </div>
            {studioSaved && (
              <span className="text-xs text-emerald-600 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-4 h-4" />
                Updated
              </span>
            )}
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-700 font-medium mb-1">
                Studio Practice Name
              </label>
              <input
                type="text"
                value={studioCopy.studioName}
                onChange={(e) =>
                  setStudioCopy({ ...studioCopy, studioName: e.target.value })
                }
                className="w-full p-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714]"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">
                Hero Tagline
              </label>
              <input
                type="text"
                value={studioCopy.tagline}
                onChange={(e) =>
                  setStudioCopy({ ...studioCopy, tagline: e.target.value })
                }
                className="w-full p-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714]"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">
                Architectural Statement & Philosophy
              </label>
              <textarea
                rows={4}
                value={studioCopy.philosophy}
                onChange={(e) =>
                  setStudioCopy({ ...studioCopy, philosophy: e.target.value })
                }
                className="w-full p-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714] resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Primary Studio Phone
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={studioCopy.primaryPhone}
                    onChange={(e) =>
                      setStudioCopy({
                        ...studioCopy,
                        primaryPhone: e.target.value,
                      })
                    }
                    className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Studio Inquiries Email
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    value={studioCopy.primaryEmail}
                    onChange={(e) =>
                      setStudioCopy({
                        ...studioCopy,
                        primaryEmail: e.target.value,
                      })
                    }
                    className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">
                Atelier Address
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={studioCopy.officeAddress}
                  onChange={(e) =>
                    setStudioCopy({
                      ...studioCopy,
                      officeAddress: e.target.value,
                    })
                  }
                  className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714]"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">
                Consultation Disclaimer Notice
              </label>
              <textarea
                rows={3}
                value={studioCopy.consultationNotice}
                onChange={(e) =>
                  setStudioCopy({
                    ...studioCopy,
                    consultationNotice: e.target.value,
                  })
                }
                className="w-full p-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714] resize-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7E5714] hover:bg-[#684710] text-white text-xs font-medium tracking-wider uppercase rounded-sm shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Studio Details</span>
            </button>
          </div>
        </form>
      )}

      {/* FAQ Modal */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-stone-200 rounded-sm shadow-xl max-w-lg w-full overflow-hidden">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="text-base font-serif text-stone-900 font-medium">
                {editingFaq ? "Edit FAQ" : "Create New FAQ"}
              </h3>
              <button
                onClick={() => setIsFaqModalOpen(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Category
                </label>
                <input
                  type="text"
                  required
                  value={faqForm.category}
                  onChange={(e) =>
                    setFaqForm({ ...faqForm, category: e.target.value })
                  }
                  placeholder="e.g. Consultations, Design Packages, Safepay..."
                  className="w-full p-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  value={faqForm.question}
                  onChange={(e) =>
                    setFaqForm({ ...faqForm, question: e.target.value })
                  }
                  placeholder="What happens if I need revisions after the plan review?"
                  className="w-full p-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Comprehensive Answer *
                </label>
                <textarea
                  required
                  value={faqForm.answer}
                  onChange={(e) =>
                    setFaqForm({ ...faqForm, answer: e.target.value })
                  }
                  rows={5}
                  placeholder="Explain architectural procedure, deliverables, or payment milestones..."
                  className="w-full p-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714] resize-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={faqForm.is_published}
                    onChange={(e) =>
                      setFaqForm({ ...faqForm, is_published: e.target.checked })
                    }
                    className="accent-[#7E5714]"
                  />
                  <span className="text-stone-700">
                    Publish immediately to public website
                  </span>
                </label>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-600 hover:bg-stone-50 rounded-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#7E5714] hover:bg-[#684710] text-white font-medium rounded-sm transition-colors"
                >
                  {editingFaq ? "Save Changes" : "Create FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
