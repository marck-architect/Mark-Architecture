"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  CheckCircle2,
  Video,
  Copy,
  RefreshCw,
  Clock,
} from "lucide-react";
import type { CommunicationLog } from "@/types";

export const CommunicationsManager: React.FC = () => {
  const [logs, setLogs] = useState<CommunicationLog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (typeFilter !== "all" && log.type !== typeFilter) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matches =
          log.client_name.toLowerCase().includes(q) ||
          log.recipient_email.toLowerCase().includes(q) ||
          (log.meeting_url && log.meeting_url.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [logs, typeFilter, searchTerm]);

  const handleCopyLink = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResend = (log: CommunicationLog) => {
    setResendingId(log.id);
    setTimeout(() => {
      setResendingId(null);
      setResendSuccess(log.id);
      setTimeout(() => setResendSuccess(null), 2500);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-[#7E5714] uppercase">
            Outbox & Dispatches
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 tracking-tight mt-1">
            Communication Logs
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Track automated meeting invitations, calendar schedules, and formal
            architectural correspondence.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-stone-200 p-4 rounded-sm shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by client name, email, or meeting link..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714] focus:bg-white text-stone-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-sm text-stone-700 focus:outline-none font-mono"
          >
            <option value="all">All Message Types</option>
            <option value="meeting_invite">Meeting Invitations</option>
            <option value="order_confirmation">Order Confirmations</option>
            <option value="reminder">Reminders</option>
          </select>
        </div>
      </div>

      {/* Communications Table */}
      <div className="bg-white border border-stone-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 uppercase text-[10px] tracking-wider text-stone-500 font-mono">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Message Type</th>
                <th className="py-3 px-4">Meeting Link</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-stone-50/70 transition-colors"
                >
                  <td className="py-3.5 px-4 text-stone-600 whitespace-nowrap">
                    {new Date(log.sent_at).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    <div className="font-serif font-medium text-stone-900 text-xs">
                      {log.client_name}
                    </div>
                    <div className="font-mono text-[10px] text-stone-400">
                      {log.recipient_email}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 bg-stone-100 rounded text-stone-700 uppercase text-[10px]">
                      {log.type.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {log.meeting_url ? (
                      <div className="flex items-center gap-1.5 max-w-xs truncate text-[#7E5714]">
                        <Video className="w-3 h-3 shrink-0" />
                        <span className="truncate">{log.meeting_url}</span>
                        <button
                          onClick={() =>
                            handleCopyLink(log.id, log.meeting_url!)
                          }
                          className="p-1 hover:text-[#684710]"
                          title="Copy Link"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        {copiedId === log.id && (
                          <span className="text-[10px] text-emerald-600">
                            Copied
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-stone-400 italic">
                        None attached
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono ${
                        log.status === "sent"
                          ? "bg-emerald-100 text-emerald-800"
                          : log.status === "manual"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {log.status === "sent" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-sans">
                    <button
                      onClick={() => handleResend(log)}
                      disabled={resendingId === log.id}
                      className="inline-flex items-center gap-1 text-[11px] text-[#7E5714] hover:text-[#684710] font-medium py-1 px-2.5 hover:bg-amber-50 rounded transition-colors disabled:opacity-50"
                    >
                      <RefreshCw
                        className={`w-3 h-3 ${
                          resendingId === log.id ? "animate-spin" : ""
                        }`}
                      />
                      {resendSuccess === log.id ? "Dispatched" : "Resend"}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    No communication dispatches found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
