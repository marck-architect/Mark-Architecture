"use client";

import React, { useState } from "react";
import {
  X,
  Save,
  Loader2,
  Copy,
  CheckCircle2,
  Clock4,
  CreditCard,
  User,
  Layers,
  Paperclip,
  ExternalLink,
  MessageCircle,
  Compass,
  AlertCircle,
} from "lucide-react";
import type { OrderRecord } from "@/types";
import { useStore } from "@/hooks/useStore";

interface OrderDetailModalProps {
  order: OrderRecord;
  onClose: () => void;
  onUpdate: (updatedOrder: OrderRecord) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onUpdate,
}) => {
  const [paymentStatus, setPaymentStatus] = useState(
    order.payment_status || "pending",
  );
  const [notes, setNotes] = useState(order.notes || "");
  const [plotSize, setPlotSize] = useState(order.plot_size || "");
  const [coveredAreaSqft, setCoveredAreaSqft] = useState(
    order.covered_area_sqft ? String(order.covered_area_sqft) : "",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_status: paymentStatus,
          notes,
          plot_size: plotSize || null,
          covered_area_sqft: coveredAreaSqft ? Number(coveredAreaSqft) : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update order details.");
      }

      const updated: OrderRecord = {
        ...order,
        payment_status: paymentStatus,
        notes,
        plot_size: plotSize || null,
        covered_area_sqft: coveredAreaSqft ? Number(coveredAreaSqft) : null,
        updated_at: new Date().toISOString(),
      };

      onUpdate(updated);
      useStore.getState().showToast("Order changes successfully updated.");
      setSaveSuccess("Order successfully saved!");
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: unknown) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to save order updates.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const cleanPhone = order.client_phone
    ? order.client_phone.replace(/[^0-9]/g, "")
    : "";
  const whatsappPhone = cleanPhone.startsWith("92")
    ? cleanPhone
    : cleanPhone.startsWith("0")
      ? `92${cleanPhone.slice(1)}`
      : `92${cleanPhone}`;

  // Parse disciplines if available
  let disciplinesList: string[] = [];
  if (Array.isArray(order.selected_disciplines)) {
    disciplinesList = order.selected_disciplines.map(String);
  } else if (
    order.selected_disciplines &&
    typeof order.selected_disciplines === "object"
  ) {
    disciplinesList = Object.keys(order.selected_disciplines);
  }

  const attachments = Array.isArray(order.attachment_urls)
    ? order.attachment_urls
    : [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "fully_paid":
      case "paid":
        return {
          bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
          icon: CheckCircle2,
          label: "Fully Paid",
        };
      case "advance_paid":
        return {
          bg: "bg-blue-50 text-blue-800 border-blue-200",
          icon: CreditCard,
          label: "Advance Paid (50%)",
        };
      case "refunded":
        return {
          bg: "bg-purple-50 text-purple-800 border-purple-200",
          icon: AlertCircle,
          label: "Refunded",
        };
      case "failed":
        return {
          bg: "bg-rose-50 text-rose-800 border-rose-200",
          icon: AlertCircle,
          label: "Failed",
        };
      default:
        return {
          bg: "bg-amber-50 text-amber-800 border-amber-200",
          icon: Clock4,
          label: "Pending Payment",
        };
    }
  };

  const statusBadge = getStatusBadge(paymentStatus);
  const StatusIcon = statusBadge.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-xs animate-fadeIn font-inter">
      <div className="relative w-full max-w-3xl bg-white border border-stone-200 rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden text-stone-800">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1C1B1B] text-amber-400 flex items-center justify-center shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-playfair text-xl text-stone-900 font-bold">
                  Order Details
                </h2>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${statusBadge.bg}`}
                >
                  <StatusIcon className="w-3 h-3" />
                  {statusBadge.label}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-mono text-[#7E5714] font-semibold">
                  #{order.order_number}
                </span>
                <span className="text-xs text-stone-400">•</span>
                <span className="text-xs text-stone-500 font-mono">
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(order.order_number, "orderNumber")}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer"
              title="Copy Order Number"
            >
              {copiedField === "orderNumber" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Feedback Alerts */}
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{saveSuccess}</span>
            </div>
          )}
          {saveError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{saveError}</span>
            </div>
          )}

          {/* Section 1: Financial Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
              <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 block mb-1">
                Total Order Value
              </span>
              <span className="font-playfair text-xl font-bold text-stone-900 block">
                PKR {Number(order.total_amount_pkr || 0).toLocaleString()}
              </span>
              <span className="text-[11px] text-stone-500 mt-1 block capitalize">
                Billing Model:{" "}
                {order.payment_type?.replace(/_/g, " ") || "Full"}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60">
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-800 block mb-1">
                Advance Paid / Due
              </span>
              <span className="font-playfair text-xl font-bold text-[#7E5714] block">
                PKR {Number(order.advance_amount_pkr || 0).toLocaleString()}
              </span>
              <span className="text-[11px] text-amber-700/80 mt-1 block">
                {order.payment_status === "paid" ||
                order.payment_status === "advance_paid" ||
                order.payment_status === "fully_paid"
                  ? "Captured via Safepay"
                  : "Awaiting payment"}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
              <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 block mb-1">
                Outstanding Balance
              </span>
              <span className="font-playfair text-xl font-bold text-stone-900 block">
                PKR {Number(order.remaining_balance_pkr || 0).toLocaleString()}
              </span>
              <span className="text-[11px] text-stone-500 mt-1 block">
                Due before final CAD release
              </span>
            </div>
          </div>

          {/* Section 2: Client Profile */}
          <div className="p-5 rounded-2xl border border-stone-200 bg-white shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#7E5714]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Client Profile
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-mono">
                  Full Name
                </span>
                <span className="font-semibold text-stone-900 text-sm mt-0.5 block">
                  {order.client_name}
                </span>
              </div>

              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-mono">
                  Email Address
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <a
                    href={`mailto:${order.client_email}`}
                    className="font-medium text-[#7E5714] hover:underline truncate"
                  >
                    {order.client_email}
                  </a>
                  <button
                    onClick={() =>
                      copyToClipboard(order.client_email, "clientEmail")
                    }
                    className="text-stone-400 hover:text-stone-700 p-0.5"
                    title="Copy Email"
                  >
                    {copiedField === "clientEmail" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-mono">
                  Contact Number
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <a
                    href={`tel:${order.client_phone}`}
                    className="font-medium text-stone-800 hover:underline"
                  >
                    {order.client_phone}
                  </a>
                  {cleanPhone && (
                    <a
                      href={`https://wa.me/${whatsappPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                      title="Open WhatsApp Chat"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Project Specifications & Scope */}
          <div className="p-5 rounded-2xl border border-stone-200 bg-white shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#7E5714]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Architectural Specifications & Scope
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-stone-400 block text-[10px] uppercase font-mono mb-1">
                  Plot Dimensions / Scope
                </label>
                <input
                  type="text"
                  value={plotSize}
                  onChange={(e) => setPlotSize(e.target.value)}
                  placeholder="e.g. 10 Marla (35x70) or 1 Kanal"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-xs focus:outline-none focus:border-[#7E5714]"
                />
              </div>

              <div>
                <label className="text-stone-400 block text-[10px] uppercase font-mono mb-1">
                  Covered Area (Sq.Ft.)
                </label>
                <input
                  type="number"
                  value={coveredAreaSqft}
                  onChange={(e) => setCoveredAreaSqft(e.target.value)}
                  placeholder="e.g. 4500"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-xs focus:outline-none focus:border-[#7E5714]"
                />
              </div>
            </div>

            {/* Selected Disciplines */}
            {disciplinesList.length > 0 && (
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-mono mb-1.5">
                  Selected Engineering Disciplines
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {disciplinesList.map((disc, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-stone-100 text-stone-700 border border-stone-200"
                    >
                      {disc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Client Notes */}
            <div>
              <label className="text-stone-400 block text-[10px] uppercase font-mono mb-1">
                Client Project Notes & Site Details
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Client notes, location coordinates, municipal constraints..."
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-xs focus:outline-none focus:border-[#7E5714] resize-none"
              />
            </div>

            {/* Uploaded Attachments */}
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-mono mb-2">
                Client Uploaded Drawings & Documents ({attachments.length})
              </span>
              {attachments.length === 0 ? (
                <div className="p-3 rounded-xl bg-stone-50 text-stone-400 text-xs italic border border-stone-100">
                  No survey drawings or site files attached.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {attachments.map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors group text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Paperclip className="w-3.5 h-3.5 text-[#7E5714] shrink-0" />
                        <span className="truncate text-stone-700 font-mono">
                          {url.split("/").pop() || `Document ${idx + 1}`}
                        </span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-800 shrink-0 ml-2" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Gateway Tracking & Admin Status */}
          <div className="p-5 rounded-2xl border border-stone-200 bg-white shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#7E5714]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Safepay & Order Management
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-stone-400 block text-[10px] uppercase font-mono mb-1">
                  Safepay Gateway Tracker
                </label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="font-mono text-stone-700 text-xs truncate flex-1">
                    {order.safepay_tracker || "No tracker generated"}
                  </span>
                  {order.safepay_tracker && (
                    <button
                      onClick={() =>
                        copyToClipboard(order.safepay_tracker!, "tracker")
                      }
                      className="text-stone-400 hover:text-stone-700 p-0.5"
                      title="Copy Tracker"
                    >
                      {copiedField === "tracker" ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="text-stone-400 block text-[10px] uppercase font-mono mb-1">
                  Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-900 text-xs focus:outline-none focus:border-[#7E5714] font-medium"
                >
                  <option value="pending">Pending Payment</option>
                  <option value="advance_paid">Advance Paid (50%)</option>
                  <option value="fully_paid">Fully Paid (100%)</option>
                  <option value="refunded">Refunded</option>
                  <option value="failed">Failed / Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-stone-600 hover:text-stone-900 border border-stone-200 bg-white hover:bg-stone-50 shadow-2xs transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-[#1C1B1B] hover:bg-black text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
