"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  UserCheck,
  Plus,
  Search,
  CheckCircle2,
  X,
  Edit2,
  Trash2,
  Award,
  Mail,
  Eye,
  EyeOff,
} from "lucide-react";
import type { AdminTeamMember } from "@/types";
import { seedTeamMembers } from "@/data/adminSeed";

export const TeamManager: React.FC = () => {
  const [team, setTeam] = useState<AdminTeamMember[]>(seedTeamMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<AdminTeamMember | null>(
    null,
  );
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    credentials: "",
    bio: "",
    specialization: "",
    photo_url: "",
    email: "",
    is_active: true,
  });

  const filteredTeam = team.filter((m) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.credentials.toLowerCase().includes(q) ||
      (m.specialization && m.specialization.toLowerCase().includes(q))
    );
  });

  const handleOpenCreate = () => {
    setEditingMember(null);
    setFormData({
      name: "",
      role: "",
      credentials: "",
      bio: "",
      specialization: "",
      photo_url: "/images/Full House Design Package.png",
      email: "",
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: AdminTeamMember) => {
    setEditingMember(m);
    setFormData({
      name: m.name,
      role: m.role,
      credentials: m.credentials,
      bio: m.bio,
      specialization: m.specialization || "",
      photo_url: m.photo_url,
      email: m.email || "",
      is_active: m.is_active,
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    setTeam((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_active: !current } : m)),
    );
    try {
      await fetch(`/api/admin/team/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !current }),
      });
    } catch {
      // Ignored
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this team member from the studio directory?")) return;
    setTeam((prev) => prev.filter((m) => m.id !== id));
    try {
      await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
    } catch {
      // Ignored
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role) return;

    if (editingMember) {
      const updated: AdminTeamMember = {
        ...editingMember,
        ...formData,
      };
      setTeam((prev) =>
        prev.map((m) => (m.id === editingMember.id ? updated : m)),
      );
      try {
        await fetch(`/api/admin/team/${editingMember.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } catch {
        // Ignored
      }
    } else {
      const created: AdminTeamMember = {
        id: `tm_${Date.now()}`,
        ...formData,
        display_order: team.length + 1,
        created_at: new Date().toISOString(),
      };
      setTeam([...team, created]);
      try {
        await fetch("/api/admin/team", {
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
            Architectural Leadership & Associates
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 tracking-tight mt-1">
            Studio Team
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage public studio architects, partners, structural consultants,
            and credentials.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#7E5714] hover:bg-[#684710] text-white text-xs font-medium tracking-wider uppercase rounded-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Architect</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-stone-200 p-4 rounded-sm shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, role, or credentials..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714] focus:bg-white text-stone-800"
          />
        </div>
        <span className="text-xs font-mono text-stone-400">
          {filteredTeam.length} Practitioners
        </span>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeam.map((member) => (
          <div
            key={member.id}
            className="bg-white border border-stone-200 rounded-sm shadow-sm overflow-hidden flex flex-col justify-between hover:border-stone-400 transition-colors group"
          >
            <div>
              {/* Photo Banner */}
              <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                <Image
                  src={
                    member.photo_url || "/images/Full House Design Package.png"
                  }
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-102 transition-transform duration-300"
                  unoptimized
                />
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleToggleActive(member.id, member.is_active)
                    }
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider backdrop-blur-md shadow-sm ${
                      member.is_active
                        ? "bg-emerald-900/80 text-emerald-200"
                        : "bg-stone-900/80 text-stone-300"
                    }`}
                  >
                    {member.is_active ? "Active" : "Archived"}
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="p-5">
                <h3 className="font-serif text-base text-stone-900 font-semibold group-hover:text-[#7E5714] transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs font-medium text-[#7E5714] mt-0.5">
                  {member.role}
                </p>
                <p className="text-[10px] font-mono text-stone-400 mt-0.5 uppercase tracking-wider">
                  {member.credentials}
                </p>

                {member.specialization && (
                  <div className="mt-3 inline-block px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-[10px] font-mono">
                    {member.specialization}
                  </div>
                )}

                <p className="text-xs text-stone-600 font-sans mt-3 line-clamp-3 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>

            {/* Footer actions */}
            <div className="px-5 py-3 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between">
              {member.email ? (
                <a
                  href={`mailto:${member.email}`}
                  className="text-[11px] font-mono text-stone-500 hover:text-stone-800 flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" />
                  Email
                </a>
              ) : (
                <span className="text-[10px] text-stone-400 font-mono">
                  No email public
                </span>
              )}

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(member)}
                  className="p-1.5 text-stone-400 hover:text-stone-800 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
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

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-stone-200 rounded-sm shadow-xl max-w-lg w-full overflow-hidden">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="text-base font-serif text-stone-900 font-medium">
                {editingMember ? "Edit Practitioner" : "New Team Member"}
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
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Ar. Danial Rafiq"
                  className="w-full p-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Role / Position *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    placeholder="Principal Architect"
                    className="w-full p-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Credentials
                  </label>
                  <input
                    type="text"
                    value={formData.credentials}
                    onChange={(e) =>
                      setFormData({ ...formData, credentials: e.target.value })
                    }
                    placeholder="B.Arch, PCATP"
                    className="w-full p-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Specialization Focus
                </label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                  placeholder="e.g. Passive House Design & Sustainable Facades"
                  className="w-full p-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Photo URL
                </label>
                <input
                  type="text"
                  value={formData.photo_url}
                  onChange={(e) =>
                    setFormData({ ...formData, photo_url: e.target.value })
                  }
                  placeholder="/images/... or https://..."
                  className="w-full p-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714] font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Direct Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="name@markarchitects.com"
                  className="w-full p-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Biography & Architectural Philosophy
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows={4}
                  placeholder="Summarize architectural training, design philosophy, and key commissions..."
                  className="w-full p-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714] resize-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    className="accent-[#7E5714]"
                  />
                  <span className="text-stone-700">
                    Display on Public Studio Page
                  </span>
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
                  {editingMember ? "Save Changes" : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
