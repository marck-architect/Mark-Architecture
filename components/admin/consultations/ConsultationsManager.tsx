"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  Video,
  Search,
  Filter,
  CheckCircle2,
  Clock4,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Download,
  Mail,
  Phone,
  Paperclip,
} from "lucide-react";
import type { ConsultationRecord } from "@/types";

interface ConsultationsManagerProps {
  consultations: ConsultationRecord[];
  onInspect: (booking: ConsultationRecord) => void;
  onRefresh?: () => void;
}

export const ConsultationsManager: React.FC<ConsultationsManagerProps> = ({
  consultations,
  onInspect,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const today = new Date().toISOString().split("T")[0];

  const filtered = useMemo(() => {
    return consultations.filter((item) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        item.client_name?.toLowerCase().includes(q) ||
        item.client_email?.toLowerCase().includes(q) ||
        item.client_phone?.includes(q) ||
        item.safepay_tracker?.toLowerCase().includes(q);

      let matchesStatus = true;
      if (statusFilter === "needs_link") {
        matchesStatus = item.payment_status === "paid" && !item.meeting_url;
      } else if (statusFilter !== "all") {
        matchesStatus = item.payment_status === statusFilter;
      }

      const matchesTier = tierFilter === "all" || item.tier_name === tierFilter;

      let matchesDate = true;
      if (dateFilter === "today") matchesDate = item.booking_date === today;
      else if (dateFilter === "upcoming")
        matchesDate = item.booking_date >= today;
      else if (dateFilter === "past") matchesDate = item.booking_date < today;

      return matchesSearch && matchesStatus && matchesTier && matchesDate;
    });
  }, [consultations, searchTerm, statusFilter, tierFilter, dateFilter, today]);

  const handleExportCsv = () => {
    const headers = [
      "ID",
      "Client Name",
      "Email",
      "Phone",
      "Tier",
      "Price PKR",
      "Booking Date",
      "Booking Time",
      "Payment Status",
      "Meeting URL",
      "Created At",
    ];

    const rows = filtered.map((c) => [
      c.id,
      `"${c.client_name}"`,
      c.client_email,
      c.client_phone,
      `"${c.tier_name}"`,
      c.price_pkr,
      c.booking_date,
      c.booking_time,
      c.payment_status,
      c.meeting_url || "",
      c.created_at || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `consultations-export-${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string, hasLink: boolean) => {
    if (status === "paid") {
      return (
        <div className="flex flex-col gap-0.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Paid & Confirmed
          </span>
          {!hasLink && (
            <span className="text-[9px] font-mono text-amber-700 font-semibold">
              Needs Meeting Link
            </span>
          )}
        </div>
      );
    }
    if (status === "completed") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-sky-50 text-sky-800 border border-sky-200">
          <CheckCircle2 className="w-3 h-3" /> Completed
        </span>
      );
    }
    if (status === "rescheduled") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
          <Clock4 className="w-3 h-3" /> Rescheduled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-700 border border-stone-200">
        <Clock className="w-3 h-3" /> Pending Checkout
      </span>
    );
  };

  return (
    <div className="space-y-6 font-inter">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900">
            Consultation Appointments
          </h2>
          <p className="text-xs text-stone-500 font-light mt-0.5">
            Manage client appointments, confirm Safepay transactions, and
            dispatch video meeting URLs.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#7E5714]" />
          <span>Export CSV ({filtered.length})</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by client name, email, phone, or Safepay tracker..."
              className="w-full pl-9 pr-4 py-2 bg-stone-50/50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#7E5714] focus:ring-1 focus:ring-[#7E5714]/20 transition-all"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-stone-50/50 border border-stone-200 text-stone-700 text-xs focus:outline-none focus:border-[#7E5714]"
            >
              <option value="all">All Statuses</option>
              <option value="needs_link">Needs Meeting Link</option>
              <option value="paid">Confirmed & Paid</option>
              <option value="pending">Pending Payment</option>
              <option value="completed">Completed</option>
              <option value="rescheduled">Rescheduled</option>
            </select>

            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-stone-50/50 border border-stone-200 text-stone-700 text-xs focus:outline-none focus:border-[#7E5714]"
            >
              <option value="all">All Tiers</option>
              <option value="Basic Call">Basic Call (30m)</option>
              <option value="Premium Call">Premium Call (60m)</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-stone-50/50 border border-stone-200 text-stone-700 text-xs focus:outline-none focus:border-[#7E5714]"
            >
              <option value="all">All Dates</option>
              <option value="today">Today&apos;s Appointments</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>
      </div>

      {/* Consultations Table */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50/80 text-stone-600 uppercase font-mono tracking-wider text-[11px] border-b border-stone-200">
                <tr>
                  <th className="px-5 py-3.5">Date &amp; Timeslot</th>
                  <th className="px-5 py-3.5">Client Details</th>
                  <th className="px-5 py-3.5">Call Tier &amp; Fee</th>
                  <th className="px-5 py-3.5">Safepay Status</th>
                  <th className="px-5 py-3.5">Video Meeting Link</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filtered.map((b) => {
                  const isToday = b.booking_date === today;
                  const hasLink = Boolean(b.meeting_url);

                  return (
                    <tr
                      key={b.id}
                      className={`hover:bg-stone-50/70 transition-colors ${
                        isToday ? "bg-amber-50/30" : ""
                      }`}
                    >
                      {/* Slot */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-[#7E5714] shrink-0 font-mono font-bold text-xs">
                            <Calendar className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-semibold text-stone-900 flex items-center gap-1">
                              <span>{b.booking_date}</span>
                              {isToday && (
                                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">
                                  Today
                                </span>
                              )}
                            </div>
                            <div className="text-[#7E5714] font-mono text-[11px] flex items-center gap-1 font-medium">
                              <Clock className="w-3 h-3" />
                              <span>{b.booking_time} PKT</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Client */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-stone-900">
                          {b.client_name}
                        </div>
                        <div className="text-stone-500 text-[11px] font-mono truncate max-w-xs">
                          {b.client_email}
                        </div>
                        <div className="text-stone-500 text-[11px] flex items-center gap-1 mt-0.5">
                          <span>{b.client_phone}</span>
                          {b.attachment_urls &&
                            b.attachment_urls.length > 0 && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded">
                                <Paperclip className="w-2.5 h-2.5" />
                                {b.attachment_urls.length}
                              </span>
                            )}
                        </div>
                      </td>

                      {/* Tier & Fee */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-medium text-stone-900">
                          {b.tier_name}
                        </div>
                        <div className="text-stone-600 font-mono text-[11px]">
                          PKR {Number(b.price_pkr || 0).toLocaleString("en-PK")}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {getStatusBadge(b.payment_status, hasLink)}
                      </td>

                      {/* Meeting URL */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {b.meeting_url ? (
                          <div className="flex items-center gap-2">
                            <a
                              href={b.meeting_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors shadow-2xs"
                            >
                              <Video className="w-3 h-3" />
                              <span>Meet Link</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                            {b.meeting_link_sent_at && (
                              <span
                                className="text-[10px] text-stone-400 font-mono"
                                title={`Sent: ${b.meeting_link_sent_at}`}
                              >
                                Sent ✓
                              </span>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => onInspect(b)}
                            className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-[11px] font-bold cursor-pointer transition-colors"
                          >
                            + Assign Link
                          </button>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => onInspect(b)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-[#7E5714] hover:text-white text-stone-800 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                        >
                          <span>Manage</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <Clock className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="text-stone-600 font-medium text-sm">
              No consultations match your criteria.
            </p>
            <p className="text-stone-400 text-xs">
              Try adjusting filters or clearing the search query.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
