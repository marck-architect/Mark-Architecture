"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, X, FileCode } from "lucide-react";
import type { AuditLogEntry } from "@/types";

export const AuditLogsView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  // Fetch live logs if available
  useEffect(() => {
    fetch("/api/admin/audit")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data && Array.isArray(data.data)) {
          setLogs(data.data);
        } else if (data?.logs && Array.isArray(data.logs)) {
          setLogs(data.logs);
        }
      })
      .catch(() => {});
  }, []);

  // Filter logs
  const filtered = useMemo(() => {
    return logs.filter((log) => {
      if (actionFilter !== "all" && log.action !== actionFilter) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matches =
          log.admin_email.toLowerCase().includes(q) ||
          log.action.toLowerCase().includes(q) ||
          log.entity.toLowerCase().includes(q) ||
          log.entity_id.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [logs, actionFilter, searchTerm]);

  const actions = useMemo(() => {
    const set = new Set<string>();
    logs.forEach((l) => set.add(l.action));
    return Array.from(set);
  }, [logs]);

  const getActionBadgeClass = (action: string) => {
    if (action.includes("CONFIRM") || action.includes("PAYMENT")) {
      return "bg-emerald-100 text-emerald-800";
    }
    if (action.includes("MEETING") || action.includes("LINK")) {
      return "bg-blue-100 text-blue-800";
    }
    if (action.includes("DELETE") || action.includes("BLOCK")) {
      return "bg-rose-100 text-rose-800";
    }
    if (action.includes("UPDATE")) {
      return "bg-amber-100 text-amber-800";
    }
    return "bg-stone-100 text-stone-700";
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-[#7E5714] uppercase">
            Security & Forensics
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 tracking-tight mt-1">
            Administrative Audit Trail
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Immutable log of all payment confirmations, meeting link dispatches,
            calendar updates, and studio mutations.
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white border border-stone-200 p-4 rounded-sm shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by action, email, or entity ID..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714] focus:bg-white text-stone-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-sm text-stone-700 font-mono"
          >
            <option value="all">All Actions</option>
            {actions.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white border border-stone-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700 font-mono">
            <thead className="bg-stone-50 border-b border-stone-200 uppercase text-[10px] tracking-wider text-stone-500">
              <tr>
                <th className="py-3 px-4">Timestamp (PKT)</th>
                <th className="py-3 px-4">Admin Principal</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Entity Identifier</th>
                <th className="py-3 px-4 text-right">Forensic Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-[11px]">
              {filtered.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-stone-50/70 transition-colors"
                >
                  <td className="py-3.5 px-4 text-stone-600 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="py-3.5 px-4 font-sans text-stone-800">
                    {log.admin_email}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${getActionBadgeClass(
                        log.action,
                      )}`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-stone-600 uppercase">
                    {log.entity}
                  </td>
                  <td className="py-3.5 px-4 text-stone-500 truncate max-w-xs">
                    {log.entity_id}
                  </td>
                  <td className="py-3.5 px-4 text-right font-sans">
                    {log.metadata ? (
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="inline-flex items-center gap-1 text-[11px] text-[#7E5714] hover:text-[#684710] font-medium py-1 px-2.5 hover:bg-amber-50 rounded transition-colors"
                      >
                        <FileCode className="w-3.5 h-3.5" />
                        Payload
                      </button>
                    ) : (
                      <span className="text-stone-400 italic">None</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-stone-400 font-sans"
                  >
                    No audit logs match current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forensic Payload Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-stone-200 rounded-sm shadow-xl max-w-lg w-full overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#7E5714]" />
                <h3 className="text-xs font-mono font-medium text-stone-900 uppercase">
                  Audit Payload: {selectedLog.action}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 font-mono text-xs">
              <div className="text-stone-500 text-[11px]">
                <div>
                  Target: {selectedLog.entity} ({selectedLog.entity_id})
                </div>
                <div>Author: {selectedLog.admin_email}</div>
                <div>
                  Time: {new Date(selectedLog.created_at).toISOString()}
                </div>
              </div>

              <pre className="p-4 bg-stone-900 text-stone-100 rounded-sm text-[11px] overflow-x-auto max-h-72 leading-relaxed">
                {JSON.stringify(selectedLog.metadata, null, 2)}
              </pre>
            </div>

            <div className="p-3 border-t border-stone-100 bg-stone-50 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 bg-stone-900 text-white text-xs rounded-sm hover:bg-stone-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
