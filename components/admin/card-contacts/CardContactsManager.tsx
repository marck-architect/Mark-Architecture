"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Mail,
  Phone,
  MessageCircle,
  Copy,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Download,
  RefreshCw,
  Clock,
  User,
  Filter,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import type { CardContactRecord } from "@/types";
import { AdminPagination } from "@/components/admin/ui/AdminPagination";

export const CardContactsManager: React.FC = () => {
  const [contacts, setContacts] = useState<CardContactRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "contacted" | "archived">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchContacts = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/card-contacts");
      if (!res.ok) {
        throw new Error("Failed to load digital card contacts");
      }
      const data = await res.json();
      setContacts(Array.isArray(data.contacts) ? data.contacts : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching contacts");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Handle status update
  const handleUpdateStatus = async (
    id: string,
    newStatus: CardContactRecord["status"],
  ) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/card-contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)),
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update contact");
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle delete
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the contact record for "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/card-contacts/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete contact");

      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete contact");
    } finally {
      setDeletingId(null);
    }
  };

  // Quick Copy
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // CSV Export
  const handleExportCSV = () => {
    if (contacts.length === 0) return;

    const headers = ["Name", "Email", "Phone", "Status", "Received Date"];
    const rows = contacts.map((c) => [
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.email.replace(/"/g, '""')}"`,
      `"${c.phone.replace(/"/g, '""')}"`,
      `"${c.status}"`,
      `"${new Date(c.created_at).toLocaleString()}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `mark_card_contacts_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = contacts.length;
    const newCount = contacts.filter((c) => c.status === "new").length;
    const contactedCount = contacts.filter((c) => c.status === "contacted").length;

    const todayStr = new Date().toISOString().slice(0, 10);
    const todayCount = contacts.filter((c) =>
      c.created_at.startsWith(todayStr),
    ).length;

    return { total, newCount, contactedCount, todayCount };
  }, [contacts]);

  // Filtering
  const filteredContacts = useMemo(() => {
    return contacts.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          item.name.toLowerCase().includes(q) ||
          item.email.toLowerCase().includes(q) ||
          item.phone.toLowerCase().includes(q) ||
          (item.notes && item.notes.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [contacts, statusFilter, searchQuery]);

  // Paginated
  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredContacts.slice(start, start + pageSize);
  }, [filteredContacts, currentPage, pageSize]);

  return (
    <div className="space-y-6 animate-fadeIn font-inter">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-widest text-[#7E5714] uppercase font-semibold">
              Digital Atelier • Networking
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-stone-100 text-stone-700 border border-stone-200">
              /card
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 tracking-tight mt-1 font-bold">
            Digital Card Contacts &amp; Leads
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-2xl">
            Real-time inquiries and contact information exchanged from visitors on
            Muhammad Arslan&apos;s digital business card.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/card"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-2xs transition-colors"
          >
            <span>Preview Card</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
          </a>

          <button
            onClick={() => fetchContacts(true)}
            disabled={isRefreshing || isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#7E5714] ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={contacts.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-[11px] font-mono text-stone-500 uppercase">Total Exchanged</div>
          <div className="text-2xl font-bold font-serif text-stone-900 mt-1">
            {metrics.total}
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">Lifetime card inquiries</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/40 to-white shadow-2xs">
          <div className="text-[11px] font-mono text-amber-800 uppercase flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            New / Uncontacted
          </div>
          <div className="text-2xl font-bold font-serif text-amber-900 mt-1">
            {metrics.newCount}
          </div>
          <div className="text-[10px] text-amber-700/80 mt-0.5">Awaiting first follow-up</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50/30 to-white shadow-2xs">
          <div className="text-[11px] font-mono text-emerald-800 uppercase">Contacted</div>
          <div className="text-2xl font-bold font-serif text-emerald-900 mt-1">
            {metrics.contactedCount}
          </div>
          <div className="text-[10px] text-emerald-700/80 mt-0.5">Follow-up completed</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="text-[11px] font-mono text-stone-500 uppercase">Received Today</div>
          <div className="text-2xl font-bold font-serif text-[#7E5714] mt-1">
            {metrics.todayCount}
          </div>
          <div className="text-[10px] text-stone-400 mt-0.5">New leads in last 24h</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200 p-4 rounded-2xl shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#7E5714] focus:bg-white text-stone-800 transition-colors shadow-2xs"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl w-full sm:w-auto overflow-x-auto">
          {(
            [
              { id: "all", label: "All Contacts", count: contacts.length },
              { id: "new", label: "New", count: metrics.newCount },
              { id: "contacted", label: "Contacted", count: metrics.contactedCount },
              { id: "archived", label: "Archived", count: contacts.filter((c) => c.status === "archived").length },
            ] as const
          ).map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? "bg-white text-stone-900 shadow-2xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    active
                      ? "bg-stone-100 text-stone-800 font-bold"
                      : "bg-stone-200/70 text-stone-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Table */}
      {isLoading ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-16 text-center shadow-2xs">
          <Loader2 className="w-8 h-8 text-[#7E5714] animate-spin mx-auto mb-3" />
          <p className="text-xs text-stone-500">Loading card contact exchanges...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center text-rose-800">
          <AlertCircle className="w-6 h-6 mx-auto mb-2 text-rose-600" />
          <p className="text-sm font-semibold">{error}</p>
          <button
            onClick={() => fetchContacts()}
            className="mt-3 px-3.5 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-16 text-center shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-[#7E5714] flex items-center justify-center mx-auto mb-3">
            <User className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-base font-bold text-stone-900">
            {searchQuery || statusFilter !== "all"
              ? "No matching card contacts"
              : "No card contacts exchanged yet"}
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search keywords or clearing your status filters."
              : "When visitors click 'Exchange Info' on your digital business card at /card and submit their info, their details will automatically appear here."}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/70 text-[11px] font-mono uppercase tracking-wider text-stone-500">
                  <th className="py-3 px-5 font-semibold">Contact Details</th>
                  <th className="py-3 px-5 font-semibold">Email &amp; Direct Reply</th>
                  <th className="py-3 px-5 font-semibold">Phone &amp; WhatsApp</th>
                  <th className="py-3 px-5 font-semibold">Date Received</th>
                  <th className="py-3 px-5 font-semibold">Status</th>
                  <th className="py-3 px-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {paginatedContacts.map((contact) => {
                  const cleanPhone = contact.phone.replace(/[^0-9]/g, "");
                  const isUpdating = updatingId === contact.id;
                  const isDeleting = deletingId === contact.id;

                  const dateFormatted = new Date(contact.created_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  });

                  return (
                    <tr
                      key={contact.id}
                      className="hover:bg-amber-50/20 transition-colors group"
                    >
                      {/* Contact Info */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#7E5714] to-[#a87a2a] text-white flex items-center justify-center font-bold text-xs uppercase shadow-2xs shrink-0">
                            {contact.name.slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-stone-900 text-sm">
                              {contact.name}
                            </div>
                            <div className="text-[11px] text-stone-400 font-mono">
                              ID: {contact.id.slice(0, 8)}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:${contact.email}?subject=Nice%20connecting%20with%20you%20-%20Muhammad%20Arslan%20%7C%20MARK%20Architects`}
                            className="font-medium text-[#7E5714] hover:underline"
                          >
                            {contact.email}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopy(contact.id + "-email", contact.email)}
                            title="Copy Email"
                            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                          >
                            {copiedId === contact.id + "-email" ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        {contact.email_sent && (
                          <span className="text-[10px] text-emerald-700 flex items-center gap-1 mt-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Notification Sent
                          </span>
                        )}
                      </td>

                      {/* Phone & WhatsApp */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${contact.phone}`}
                            className="font-medium text-stone-800 hover:underline"
                          >
                            {contact.phone}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopy(contact.id + "-phone", contact.phone)}
                            title="Copy Phone"
                            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                          >
                            {copiedId === contact.id + "-phone" ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        {cleanPhone && (
                          <a
                            href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(contact.name)},%20thank%20you%20for%20connecting%20via%20my%20digital%20card.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-emerald-700 hover:text-emerald-800 font-semibold mt-0.5 hover:underline"
                          >
                            <MessageCircle className="w-3 h-3 text-emerald-600" />
                            <span>WhatsApp Chat</span>
                          </a>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-5 whitespace-nowrap text-stone-600">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>{dateFormatted}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <select
                          value={contact.status}
                          disabled={isUpdating}
                          onChange={(e) =>
                            handleUpdateStatus(
                              contact.id,
                              e.target.value as CardContactRecord["status"],
                            )
                          }
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none transition-colors ${
                            contact.status === "new"
                              ? "bg-amber-100/80 text-amber-900 border-amber-200"
                              : contact.status === "contacted"
                                ? "bg-emerald-100/80 text-emerald-900 border-emerald-200"
                                : "bg-stone-100 text-stone-600 border-stone-200"
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Mail */}
                          <a
                            href={`mailto:${contact.email}?subject=Nice%20connecting%20with%20you%20-%20Muhammad%20Arslan%20%7C%20MARK%20Architects`}
                            title="Send Email"
                            className="p-2 rounded-xl bg-stone-50 hover:bg-[#7E5714] hover:text-white text-stone-600 border border-stone-200 transition-colors shadow-2xs"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>

                          {/* Quick WhatsApp */}
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(contact.name)},%20thank%20you%20for%20connecting%20via%20my%20digital%20card.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Chat on WhatsApp"
                              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-200 transition-colors shadow-2xs"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(contact.id, contact.name)}
                            disabled={isDeleting}
                            title="Delete Contact Record"
                            className="p-2 rounded-xl bg-stone-50 hover:bg-rose-600 hover:text-white text-stone-400 hover:border-rose-600 border border-stone-200 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
                          >
                            {isDeleting ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-stone-100">
            <AdminPagination
              currentPage={currentPage}
              totalItems={filteredContacts.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              pageSizeOptions={[10, 20, 50]}
              itemName="card contacts"
            />
          </div>
        </div>
      )}
    </div>
  );
};
