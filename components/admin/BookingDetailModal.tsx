"use client";

import React, { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Video,
  FileText,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock4,
  Paperclip,
  CreditCard,
  MessageSquare,
  Save,
  Loader2,
} from "lucide-react";

import type { ConsultationRecord, BookingDetailModalProps } from "@/types";

export type { ConsultationRecord };

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  booking,
  onClose,
  onUpdate,
}) => {
  const [meetingUrl, setMeetingUrl] = useState(booking.meeting_url || "");
  const [adminNotes, setAdminNotes] = useState(booking.admin_notes || "");
  const [paymentStatus, setPaymentStatus] = useState<
    ConsultationRecord["payment_status"]
  >(booking.payment_status || "pending");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const cleanPhone = booking.client_phone
    ? booking.client_phone.replace(/[^0-9+]/g, "")
    : "";
  const waLink = `https://wa.me/${cleanPhone.replace("+", "")}?text=Hello%20${encodeURIComponent(
    booking.client_name,
  )},%20regarding%20your%20scheduled%20architectural%20consultation%20with%20MARK%20Architects...`;

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/admin/consultations/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meeting_url: meetingUrl,
          admin_notes: adminNotes,
          payment_status: paymentStatus,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update booking");
      }

      const updated = {
        ...booking,
        meeting_url: meetingUrl,
        admin_notes: adminNotes,
        payment_status: paymentStatus,
      };

      onUpdate(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to save changes",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed & Paid
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-800 border border-sky-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Session Completed
          </span>
        );
      case "rescheduled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <Clock4 className="w-3.5 h-3.5" /> Rescheduled
          </span>
        );
      case "failed":
      case "refunded":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" /> {status.toUpperCase()}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200">
            <Clock className="w-3.5 h-3.5" /> Pending Payment
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden text-stone-800">
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-playfair text-xl text-stone-900 font-medium">
                Consultation Booking Details
              </h2>
              {getStatusBadge(booking.payment_status)}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              ID: <span className="font-mono text-stone-700">{booking.id}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow">
          {/* Scheduled Timeslot Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center text-[#7E5714]">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-[#7E5714] uppercase tracking-widest font-semibold">
                  {booking.tier_name}
                </div>
                <div className="text-base font-semibold text-stone-900">
                  {new Date(booking.booking_date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-800 text-sm font-mono font-medium shadow-2xs">
              <Clock className="w-4 h-4 text-[#7E5714]" />
              <span>{booking.booking_time} (PKT / UTC+5)</span>
            </div>

            <div className="text-right">
              <span className="text-xs text-stone-500 block">Fee</span>
              <span className="text-sm font-semibold text-stone-900 font-mono">
                PKR {Number(booking.price_pkr).toLocaleString("en-PK")}
              </span>
            </div>
          </div>

          {/* Client Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Client Name */}
            <div className="p-3.5 rounded-xl bg-stone-50/80 border border-stone-200/80">
              <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                <User className="w-3.5 h-3.5 text-[#7E5714]" />
                <span>Client Name</span>
              </div>
              <p className="text-sm font-medium text-stone-900">
                {booking.client_name}
              </p>
            </div>

            {/* Client Email */}
            <div className="p-3.5 rounded-xl bg-stone-50/80 border border-stone-200/80">
              <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                <Mail className="w-3.5 h-3.5 text-[#7E5714]" />
                <span>Email Address</span>
              </div>
              <a
                href={`mailto:${booking.client_email}`}
                className="text-sm font-medium text-[#7E5714] hover:underline break-all"
              >
                {booking.client_email}
              </a>
            </div>

            {/* Client Phone & WhatsApp */}
            <div className="p-3.5 rounded-xl bg-stone-50/80 border border-stone-200/80 sm:col-span-2 flex items-center justify-between flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                  <Phone className="w-3.5 h-3.5 text-[#7E5714]" />
                  <span>Phone Number</span>
                </div>
                <p className="text-sm font-medium text-stone-900">
                  {booking.client_phone}
                </p>
              </div>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80 text-xs font-medium transition-colors cursor-pointer shadow-2xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Open WhatsApp Chat</span>
              </a>
            </div>
          </div>

          {/* Client Notes / Spatial Requirements */}
          {booking.notes && (
            <div className="p-4 rounded-xl bg-stone-50/80 border border-stone-200/80">
              <div className="flex items-center gap-2 text-xs text-stone-500 mb-2 font-medium">
                <FileText className="w-3.5 h-3.5 text-[#7E5714]" />
                <span>Client Project Requirements / Notes</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 whitespace-pre-wrap leading-relaxed">
                {booking.notes}
              </p>
            </div>
          )}

          {/* Uploaded Attachments */}
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-600 mb-2.5 uppercase tracking-wider font-semibold">
              <Paperclip className="w-3.5 h-3.5 text-[#7E5714]" />
              <span>
                Attached Files ({booking.attachment_urls?.length || 0})
              </span>
            </div>

            {booking.attachment_urls && booking.attachment_urls.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {booking.attachment_urls.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-white border border-stone-200 hover:border-[#7E5714] hover:bg-stone-50 text-xs text-stone-800 shadow-2xs transition-all group"
                  >
                    <span className="truncate max-w-[200px] font-mono">
                      {url.split("/").pop() || `Attachment ${index + 1}`}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#7E5714] shrink-0" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-500 italic p-3 rounded-lg bg-stone-50 border border-stone-200">
                No attachments uploaded by client for this booking.
              </p>
            )}
          </div>

          {/* Safepay Transaction Reference */}
          <div className="p-4 rounded-xl bg-stone-50/90 border border-stone-200/80">
            <div className="flex items-center gap-2 text-xs text-stone-600 mb-3 font-semibold">
              <CreditCard className="w-3.5 h-3.5 text-[#7E5714]" />
              <span>Safepay Transaction Meta</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-stone-500 block mb-0.5">
                  Tracker Token:
                </span>
                <span className="font-mono text-stone-800 break-all font-medium">
                  {booking.safepay_tracker || "Not Generated / Offline"}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block mb-0.5">
                  Payment Reference:
                </span>
                <span className="font-mono text-stone-800 break-all font-medium">
                  {booking.safepay_token || "Awaiting Verification"}
                </span>
              </div>
            </div>
          </div>

          {/* Admin Editable Fields */}
          <div className="pt-4 border-t border-stone-200 space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-[#7E5714] font-semibold">
              Admin Controls & Meeting Setup
            </h3>

            {/* Status Selector */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1.5">
                Booking Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) =>
                  setPaymentStatus(
                    e.target.value as ConsultationRecord["payment_status"],
                  )
                }
                className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm focus:outline-none focus:border-[#7E5714] focus:ring-1 focus:ring-[#7E5714]/20 shadow-2xs transition-colors"
              >
                <option value="pending">Pending Payment</option>
                <option value="paid">Confirmed & Paid</option>
                <option value="completed">Session Completed</option>
                <option value="rescheduled">Rescheduled</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Meeting URL */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1.5 flex items-center justify-between">
                <span>Google Meet / Zoom URL</span>
                {meetingUrl && (
                  <a
                    href={meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#7E5714] font-medium hover:underline flex items-center gap-1"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Video className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  placeholder="https://meet.google.com/xyz-abcd-efg"
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:border-[#7E5714] focus:ring-1 focus:ring-[#7E5714]/20 shadow-2xs transition-colors"
                />
              </div>
            </div>

            {/* Internal Notes */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1.5">
                Internal Architect Notes (Private)
              </label>
              <textarea
                rows={3}
                placeholder="Architect notes (e.g. reviewed site survey; prepared 3D massing model)..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:border-[#7E5714] focus:ring-1 focus:ring-[#7E5714]/20 shadow-2xs transition-colors resize-none"
              />
            </div>

            {/* Feedback message */}
            {saveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Booking details successfully updated in database.</span>
              </div>
            )}
            {saveError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>{saveError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
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
            className="px-5 py-2.5 rounded-xl bg-[#7E5714] hover:bg-[#684710] active:scale-[0.98] text-white font-medium text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
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
