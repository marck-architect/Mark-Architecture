"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  Clock,
  Video,
  Search,
  CheckCircle2,
  Clock4,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Download,
  Mail,
  Paperclip,
  CalendarCheck,
  RefreshCw,
  Link as LinkIcon,
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
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const [googleConnected, setGoogleConnected] = useState<boolean | null>(null);
  const [googleEmail, setGoogleEmail] = useState<string | null>(null);
  const [isDisconnectingGoogle, setIsDisconnectingGoogle] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    async function checkGoogleStatus() {
      try {
        const res = await fetch("/api/admin/google/status");
        if (res.ok) {
          const data = await res.json();
          setGoogleConnected(Boolean(data.connected));
          setGoogleEmail(data.accountEmail || null);
        }
      } catch (err) {
        console.warn("Could not check Google status:", err);
      }
    }
    checkGoogleStatus();
  }, []);

  const handleDisconnectGoogle = async () => {
    if (
      !confirm(
        "Are you sure you want to disconnect Google Calendar integration?",
      )
    ) {
      return;
    }
    setIsDisconnectingGoogle(true);
    try {
      const res = await fetch("/api/admin/google/disconnect", {
        method: "POST",
      });
      if (res.ok) {
        setGoogleConnected(false);
        setGoogleEmail(null);
      }
    } catch (err) {
      console.error("Disconnect error:", err);
    } finally {
      setIsDisconnectingGoogle(false);
    }
  };

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
      } else if (statusFilter === "meeting_failed") {
        matchesStatus = item.meeting_status === "failed";
      } else if (statusFilter === "email_failed") {
        matchesStatus = item.email_status === "failed";
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
      "Meeting Status",
      "Email Status",
      "Meeting URL",
      "Calendar Event ID",
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
      c.meeting_status || (c.meeting_url ? "scheduled" : "not_created"),
      c.email_status || (c.meeting_link_sent_at ? "sent" : "not_sent"),
      c.meeting_url || "",
      c.calendar_event_id || "",
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
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Paid
        </span>
      );
    }
    if (status === "completed") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-sky-50 text-sky-800 border border-sky-200">
          <CheckCircle2 className="w-3 h-3 text-sky-600" /> Completed
        </span>
      );
    }
    if (status === "rescheduled") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
          <Clock4 className="w-3 h-3 text-amber-600" /> Rescheduled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 text-stone-700 border border-stone-200">
        <Clock className="w-3 h-3 text-stone-500" /> Pending
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
            Automated Google Meet scheduling, Resend confirmations, and Safepay
            transaction management.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 rounded-xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 shadow-2xs transition-colors cursor-pointer"
              title="Refresh Consultations"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#7E5714]" />
            <span>Export CSV ({filtered.length})</span>
          </button>
        </div>
      </div>

      {/* Google Integration Status Banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-[#7E5714] shrink-0">
            <CalendarCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-900">
                Google Calendar &amp; Meet Integration
              </span>
              {googleConnected === true ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Connected
                </span>
              ) : googleConnected === false ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  Not Connected
                </span>
              ) : null}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {googleConnected
                ? `Authorized for: ${googleEmail || "Atelier Google Account"}. Automatically creating Calendar events & Meet links.`
                : "Connect your atelier Google account once to enable automatic Google Meet video room creation."}
            </p>
          </div>
        </div>

        <div>
          {googleConnected ? (
            <button
              onClick={handleDisconnectGoogle}
              disabled={isDisconnectingGoogle}
              className="px-3 py-1.5 rounded-xl border border-stone-200 hover:border-stone-300 text-stone-600 hover:text-stone-900 text-xs font-medium cursor-pointer shadow-2xs"
            >
              {isDisconnectingGoogle ? "Disconnecting..." : "Disconnect Google"}
            </button>
          ) : (
            <a
              href="/api/admin/google/connect"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7E5714] hover:bg-[#684710] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Connect Google Account</span>
            </a>
          )}
        </div>
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
              <option value="paid">Paid &amp; Confirmed</option>
              <option value="needs_link">Needs Meeting Link</option>
              <option value="meeting_failed">Meeting Creation Failed</option>
              <option value="email_failed">Email Dispatch Failed</option>
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
                  <th className="px-5 py-3.5">Tier &amp; Fee</th>
                  <th className="px-5 py-3.5">Payment</th>
                  <th className="px-5 py-3.5">Meeting &amp; Email</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filtered.map((b) => {
                  const isToday = b.booking_date === today;
                  const hasLink = Boolean(b.meeting_url);
                  const meetingStatus =
                    b.meeting_status ||
                    (b.meeting_url ? "scheduled" : "not_created");
                  const emailStatus =
                    b.email_status ||
                    (b.meeting_link_sent_at ? "sent" : "not_sent");

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

                      {/* Payment */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {getStatusBadge(b.payment_status, hasLink)}
                      </td>

                      {/* Meeting & Email Pipeline */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {/* Meet Pill */}
                          <div className="flex items-center gap-1.5">
                            {b.meeting_url ? (
                              <a
                                href={b.meeting_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold hover:bg-emerald-100 transition-colors"
                              >
                                <Video className="w-3 h-3" />
                                <span>Join Meet</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            ) : meetingStatus === "failed" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                                <AlertCircle className="w-3 h-3" /> Meet Failed
                              </span>
                            ) : (
                              <span className="text-[10px] text-stone-400 font-mono">
                                Meet: Pending
                              </span>
                            )}
                          </div>

                          {/* Email Pill */}
                          <div>
                            {emailStatus === "sent" ? (
                              <span className="inline-flex items-center gap-1 text-[10px] text-stone-500 font-mono">
                                <Mail className="w-3 h-3 text-emerald-600" />{" "}
                                Email: Sent ✓
                              </span>
                            ) : emailStatus === "failed" ? (
                              <span className="inline-flex items-center gap-1 text-[10px] text-rose-600 font-mono font-bold">
                                <AlertCircle className="w-3 h-3 text-rose-600" />{" "}
                                Email: Failed
                              </span>
                            ) : (
                              <span className="text-[10px] text-stone-400 font-mono">
                                Email: Not sent
                              </span>
                            )}
                          </div>
                        </div>
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
