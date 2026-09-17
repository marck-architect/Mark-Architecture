"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FolderGit2,
  Plus,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  XCircle,
  ExternalLink,
  X,
  Save,
  Loader2,
  MapPin,
  Calendar,
} from "lucide-react";
import type { AdminProject } from "@/types";

interface ProjectsManagerProps {
  projects: AdminProject[];
  onSaveProject: (project: Partial<AdminProject>) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
}

export const ProjectsManager: React.FC<ProjectsManagerProps> = ({
  projects,
  onSaveProject,
  onDeleteProject,
}) => {
  const [editingProject, setEditingProject] =
    useState<Partial<AdminProject> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingProject({
      title: "",
      slug: "",
      category: "residential",
      location: "Lahore, Pakistan",
      year: new Date().getFullYear().toString(),
      area_sqft: 5000,
      description: "",
      short_description: "",
      cover_image: "/images/Full House Design Package.png",
      gallery_urls: [],
      is_featured: false,
      is_published: true,
      display_order: (projects.length || 0) + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj: AdminProject) => {
    setEditingProject({ ...proj });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title || !editingProject?.slug) return;
    setIsSaving(true);
    try {
      await onSaveProject(editingProject);
      setIsModalOpen(false);
      setEditingProject(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDeleteProject(id);
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
            Portfolio Projects &amp; Case Studies
          </h2>
          <p className="text-xs text-stone-500 font-light mt-0.5">
            Showcase finished villas, commercial headquarters, and residential
            designs on the atelier website.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C1B1B] hover:bg-black text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>+ Add Portfolio Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between hover:border-[#7E5714]/50 transition-all"
          >
            {/* Image Preview */}
            <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
              <Image
                src={
                  proj.cover_image || "/images/Full House Design Package.png"
                }
                alt={proj.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#1C1B1B]/80 text-[#D4AF37] backdrop-blur-md">
                  {proj.category}
                </span>
                {proj.is_featured && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-stone-900 flex items-center gap-0.5 shadow-xs">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    <span>Featured</span>
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <h3 className="font-playfair text-base font-bold text-stone-900 line-clamp-1">
                  {proj.title}
                </h3>
                <div className="flex items-center gap-3 text-stone-500 text-[11px]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#7E5714]" />
                    <span>{proj.location}</span>
                  </span>
                  <span>•</span>
                  <span>{proj.year}</span>
                </div>
                <p className="text-xs text-stone-500 font-light line-clamp-2 leading-relaxed pt-1">
                  {proj.short_description || proj.description}
                </p>
              </div>

              {/* Actions Row */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span
                  className={`text-[11px] font-semibold flex items-center gap-1 ${proj.is_published ? "text-emerald-700" : "text-stone-400"}`}
                >
                  {proj.is_published ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  <span>{proj.is_published ? "Published" : "Draft"}</span>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(proj)}
                    className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 cursor-pointer shadow-2xs"
                    title="Edit Project"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#7E5714]" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(proj.id)}
                    className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-rose-50 text-stone-400 hover:text-rose-600 cursor-pointer shadow-2xs"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
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
              Delete Project?
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you wish to delete this portfolio project from the
              website?
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

      {/* Create / Edit Project Modal */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden text-stone-800">
            <div className="px-6 py-4.5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
              <h3 className="font-playfair text-lg font-bold text-stone-900">
                {editingProject.id
                  ? "Edit Portfolio Project"
                  : "Add Portfolio Project"}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">
                    Project Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Margalla Ridge Villa"
                    value={editingProject.title || ""}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-");
                      setEditingProject({ ...editingProject, title, slug });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.slug || ""}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        slug: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">
                    Category
                  </label>
                  <select
                    value={editingProject.category || "residential"}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-900"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="interior">Interior</option>
                    <option value="landscape">Landscape</option>
                    <option value="renovation">Renovation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="DHA Phase 6, Lahore"
                    value={editingProject.location || ""}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        location: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    value={editingProject.year || ""}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        year: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.cover_image || ""}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      cover_image: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={editingProject.short_description || ""}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      short_description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-900 resize-none"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">
                  Full Architectural Narrative
                </label>
                <textarea
                  rows={4}
                  value={editingProject.description || ""}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-900"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 text-stone-700 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProject.is_featured)}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        is_featured: e.target.checked,
                      })
                    }
                    className="rounded border-stone-300"
                  />
                  <span>Mark as Featured Project</span>
                </label>

                <label className="flex items-center gap-2 text-stone-700 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProject.is_published !== false}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        is_published: e.target.checked,
                      })
                    }
                    className="rounded border-stone-300"
                  />
                  <span>Publish to Portfolio</span>
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
                  <span>Save Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
