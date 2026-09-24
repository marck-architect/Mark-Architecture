"use client";

import React, { useState } from "react";
import {
  X,
  Video,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  PhoneCall,
  Save,
  Loader2,
  Send,
  Copy,
  Calendar,
  RefreshCw,
  Mail,
} from "lucide-react";
import { useStore } from "@/hooks/useStore";
import type { ConsultationRecord, BookingDetailModalProps } from "@/types";

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
  const [bookingDate, setBookingDate] = useState(booking.booking_date || "");
  const [bookingTime, setBookingTime] = useState(booking.booking_time || "");

  const [isSaving, setIsSaving] = useState(false);
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [isRetryingMeeting, setIsRetryingMeeting] = useState(false);
  const [isRetryingEmail, setIsRetryingEmail] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  // Validate HTTPS meeting URL
  const validateMeetingUrl = (url: string) => {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  // Standard Save
  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const res = await fetch(`/api/admin/consultations/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meeting_url: meetingUrl,
          admin_notes: adminNotes,
          payment_status: paymentStatus,
          booking_date: bookingDate,
          booking_time: bookingTime,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update booking.");
      }

      const updated: ConsultationRecord = {
        ...booking,
        meeting_url: meetingUrl,
        admin_notes: adminNotes,
        payment_status: paymentStatus,
        booking_date: bookingDate,
        booking_time: bookingTime,
      };

      onUpdate(updated);
      useStore.getState().showToast("Changes successfully saved to database.");
      onClose();
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setIsSaving(false);
    }
  };

  // Admin Action: Retry / Create Google Meeting
  const handleRetryMeeting = async () => {
    setIsRetryingMeeting(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const res = await fetch(
        `/api/admin/consultations/${booking.id}/retry-meeting`,
        { method: "POST" },
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create Google Meet meeting.");
      }

      const updated: ConsultationRecord = {
        ...booking,
        meeting_status: "scheduled",
        meeting_url: data.data?.meetingUrl || meetingUrl,
        calendar_event_id:
          data.data?.calendarEventId || booking.calendar_event_id,
      };

      if (data.data?.meetingUrl) {
        setMeetingUrl(data.data.meetingUrl);
      }

      onUpdate(updated);
      setSaveSuccess(
        "Google Calendar event and Meet conference successfully generated!",
      );
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err: unknown) {
      setSaveError(
        err instanceof Error
          ? err.message
          : "Failed to retry meeting creation.",
      );
    } finally {
      setIsRetryingMeeting(false);
    }
  };

  // Admin Action: Retry Failed Email
  const handleRetryEmail = async () => {
    setIsRetryingEmail(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const res = await fetch(
        `/api/admin/consultations/${booking.id}/retry-email`,
        { method: "POST" },
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch email.");
      }

      const updated: ConsultationRecord = {
        ...booking,
        email_status: "sent",
        meeting_link_sent_at: new Date().toISOString(),
      };

      onUpdate(updated);
      setSaveSuccess("Confirmation email successfully sent via Resend!");
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err: unknown) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to dispatch email.",
      );
    } finally {
      setIsRetryingEmail(false);
    }
  };

  // Admin Action: Explicit Resend Confirmation Email
  const handleResendEmail = async () => {
    setIsResendingEmail(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const res = await fetch(
        `/api/admin/consultations/${booking.id}/resend-email`,
        { method: "POST" },
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to resend confirmation email.");
      }

      const updated: ConsultationRecord = {
        ...booking,
        email_status: "sent",
        meeting_link_sent_at: new Date().toISOString(),
      };

      onUpdate(updated);
      setSaveSuccess("Confirmation email resent successfully via Resend!");
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err: unknown) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to resend confirmation.",
      );
    } finally {
      setIsResendingEmail(false);
    }
  };

  // One-Click: Confirm Payment & Dispatch Meeting Invitation
  const handleConfirmAndSendLink = async () => {
    if (!validateMeetingUrl(meetingUrl)) {
      setSaveError(
        "Please enter a valid secure HTTPS meeting URL (e.g. https://meet.google.com/xyz).",
      );
      return;
    }

    setIsSendingLink(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const res = await fetch(
        `/api/admin/consultations/${booking.id}/send-meeting-link`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            meeting_url: meetingUrl,
            custom_note: adminNotes,
            client_email: booking.client_email,
            client_name: booking.client_name,
            tier_name: booking.tier_name,
            booking_date: bookingDate,
            booking_time: bookingTime,
          }),
        },
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch meeting link.");
      }

      const updated: ConsultationRecord = {
        ...booking,
        meeting_url: meetingUrl,
        payment_status: "paid",
        consultation_status: "confirmed",
        confirmed_by_admin: true,
        confirmed_at: new Date().toISOString(),
        meeting_link_sent_at: new Date().toISOString(),
        admin_notes: adminNotes,
        email_status: "sent",
      };

      setPaymentStatus("paid");
      onUpdate(updated);
      setSaveSuccess(
        "Payment confirmed and meeting invitation successfully dispatched to client!",
      );
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err: unknown) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to dispatch invitation.",
      );
    } finally {
      setIsSendingLink(false);
    }
  };

  const handleCopyInvitationText = () => {
    const text = `Dear ${booking.client_name},\n\nYour architectural consultation session (${booking.tier_name}) with MARK Architects is confirmed for ${bookingDate} at ${bookingTime} PKT.\n\nVideo Meeting Link: ${meetingUrl || "[Pending Meeting URL]"}\n\nPlease have your site surveys and architectural questions ready.\n\nMARK Architects Studio\nHotline: +92 300 1234567`;
    navigator.clipboard.writeText(text);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2500);
  };

  const cleanPhone = booking.client_phone
    ? booking.client_phone.replace(/[^0-9+]/g, "")
    : "";

  const meetingStatus =
    booking.meeting_status ||
    (booking.meeting_url ? "scheduled" : "not_created");
  const emailStatus =
    booking.email_status ||
    (booking.meeting_link_sent_at ? "sent" : "not_sent");
  const calendarEventExists = Boolean(booking.calendar_event_id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-xs animate-fadeIn font-inter">
      <div className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden text-stone-800">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="font-playfair text-xl text-stone-900 font-bold">
                Consultation Details
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold bg-amber-100 text-amber-900 border border-amber-200">
                {booking.tier_name}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5 font-mono">
              ID: {booking.id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-stone-500 hover:text-stone-900 shadow-2xs transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Banners */}
          {saveSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{saveSuccess}</span>
            </div>
          )}

          {saveError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-2 shadow-2xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-medium">{saveError}</span>
            </div>
          )}

          {/* 4-Pillar Pipeline Status Grid */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#7E5714] font-bold block">
              Workflow Status Pipeline
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              {/* Payment Status */}
              <div className="p-2.5 rounded-xl bg-white border border-stone-200 flex flex-col justify-between">
                <span className="text-[10px] text-stone-400 font-mono uppercase">
                  Payment
                </span>
                <span className="font-bold mt-1">
                  {paymentStatus === "paid" ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                    </span>
                  ) : paymentStatus === "failed" ? (
                    <span className="text-rose-700 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Failed
                    </span>
                  ) : (
                    <span className="text-amber-700">⏳ Pending</span>
                  )}
                </span>
              </div>

              {/* Calendar Event */}
              <div className="p-2.5 rounded-xl bg-white border border-stone-200 flex flex-col justify-between">
                <span className="text-[10px] text-stone-400 font-mono uppercase">
                  Calendar
                </span>
                <span className="font-bold mt-1">
                  {calendarEventExists ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Created
                    </span>
                  ) : meetingStatus === "failed" ? (
                    <span className="text-rose-700 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Failed
                    </span>
                  ) : (
                    <span className="text-stone-400">— Not Created</span>
                  )}
                </span>
              </div>

              {/* Google Meet Conference */}
              <div className="p-2.5 rounded-xl bg-white border border-stone-200 flex flex-col justify-between">
                <span className="text-[10px] text-stone-400 font-mono uppercase">
                  Google Meet
                </span>
                <span className="font-bold mt-1">
                  {meetingStatus === "scheduled" && booking.meeting_url ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Scheduled
                    </span>
                  ) : meetingStatus === "failed" ? (
                    <span className="text-rose-700 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Failed
                    </span>
                  ) : meetingStatus === "creating" ? (
                    <span className="text-amber-700 flex items-center gap-1">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Creating
                    </span>
                  ) : (
                    <span className="text-stone-400">— Not Created</span>
                  )}
                </span>
              </div>

              {/* Confirmation Email via Resend */}
              <div className="p-2.5 rounded-xl bg-white border border-stone-200 flex flex-col justify-between">
                <span className="text-[10px] text-stone-400 font-mono uppercase">
                  Resend Email
                </span>
                <span className="font-bold mt-1">
                  {emailStatus === "sent" ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Sent
                    </span>
                  ) : emailStatus === "failed" ? (
                    <span className="text-rose-700 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Failed
                    </span>
                  ) : (
                    <span className="text-stone-400">— Not Sent</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* 1. Client & Contact Information */}
          <div className="bg-stone-50/60 border border-stone-200/80 rounded-2xl p-4 space-y-3">
            <div className="text-[10px] uppercase font-mono tracking-widest text-[#7E5714] font-bold">
              Client Profile
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-stone-400 block text-[11px]">
                  Full Name
                </span>
                <span className="font-semibold text-stone-900 text-sm">
                  {booking.client_name}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[11px]">
                  Email Address
                </span>
                <a
                  href={`mailto:${booking.client_email}`}
                  className="font-medium text-[#7E5714] hover:underline break-all"
                >
                  {booking.client_email}
                </a>
              </div>
              <div>
                <span className="text-stone-400 block text-[11px]">
                  Phone Hotline
                </span>
                <a
                  href={`tel:${cleanPhone}`}
                  className="inline-flex items-center gap-1 font-semibold text-stone-800 hover:text-[#7E5714]"
                >
                  <PhoneCall className="w-3 h-3 text-[#7E5714]" />
                  <span>{booking.client_phone}</span>
                </a>
              </div>
            </div>

            {booking.notes && (
              <div className="pt-2 border-t border-stone-200/60">
                <span className="text-stone-400 block text-[10px] uppercase font-mono">
                  Project Notes
                </span>
                <p className="text-xs text-stone-700 mt-1 leading-relaxed whitespace-pre-wrap">
                  {booking.notes}
                </p>
              </div>
            )}

            {booking.attachment_urls && booking.attachment_urls.length > 0 && (
              <div className="pt-2 border-t border-stone-200/60">
                <span className="text-stone-400 block text-[10px] uppercase font-mono mb-1.5">
                  Uploaded Site Drawings &amp; Photos (
                  {booking.attachment_urls.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {booking.attachment_urls.map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-stone-200 text-[#7E5714] text-xs font-medium hover:border-stone-400 shadow-2xs"
                    >
                      <Paperclip className="w-3 h-3" />
                      <span>Attachment {idx + 1}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Safepay Gateway Details */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#7E5714] font-bold">
                Safepay Transaction Status
              </span>
              <span className="font-mono text-xs font-bold text-stone-900">
                PKR {Number(booking.price_pkr || 0).toLocaleString("en-PK")}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-stone-400 block text-[11px]">
                  Tracker Reference
                </span>
                <span className="font-mono text-stone-700 select-all">
                  {booking.safepay_tracker || "Awaiting Safepay Callback"}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block text-[11px]">
                  Payment Status
                </span>
                <select
                  value={paymentStatus}
                  onChange={(e) =>
                    setPaymentStatus(
                      e.target.value as ConsultationRecord["payment_status"],
                    )
                  }
                  className="mt-1 px-2.5 py-1 rounded-lg border border-stone-200 bg-white text-xs font-medium text-stone-800 focus:outline-none focus:border-[#7E5714]"
                >
                  <option value="pending">Pending Payment</option>
                  <option value="paid">Confirmed &amp; Paid</option>
                  <option value="completed">Session Completed</option>
                  <option value="rescheduled">Rescheduled</option>
                  <option value="failed">Failed / Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Google Meet & Calendar Actions */}
          <div className="p-5 rounded-2xl border-2 border-[#7E5714]/20 bg-amber-50/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-[#7E5714]" />
                <h3 className="font-playfair text-sm font-bold text-stone-900">
                  Google Meet &amp; Calendar Conference
                </h3>
              </div>
              {meetingUrl && (
                <span className="text-[10px] text-emerald-800 font-mono font-semibold bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Meet Ready ✓
                </span>
              )}
            </div>

            {/* Quick Link Buttons if Meeting Exists */}
            {meetingUrl && (
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href={meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join Google Meet</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>

                {booking.calendar_event_id && (
                  <a
                    href="https://calendar.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#7E5714]" />
                    <span>Open Calendar Event</span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </a>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-stone-700">
                Secure Video Conference URL (HTTPS)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  placeholder="https://meet.google.com/abc-defg-hij"
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-mono text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#7E5714] shadow-2xs"
                />
                {validateMeetingUrl(meetingUrl) && (
                  <a
                    href={meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-[#7E5714] hover:bg-stone-50 shadow-2xs flex items-center gap-1 font-semibold shrink-0"
                  >
                    <span>Test</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Smart Recovery / Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-[#7E5714]/15">
              {/* If meeting missing or failed: Retry Meeting Creation */}
              {(!meetingUrl || meetingStatus === "failed") && (
                <button
                  onClick={handleRetryMeeting}
                  disabled={isRetryingMeeting}
                  className="px-3.5 py-2 rounded-xl bg-[#7E5714] hover:bg-[#684710] text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isRetryingMeeting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  <span>Create / Retry Google Meeting</span>
                </button>
              )}

              {/* If email failed: Retry Email */}
              {emailStatus === "failed" && meetingUrl && (
                <button
                  onClick={handleRetryEmail}
                  disabled={isRetryingEmail}
                  className="px-3.5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isRetryingEmail ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Mail className="w-3.5 h-3.5" />
                  )}
                  <span>Retry Confirmation Email</span>
                </button>
              )}

              {/* If email already sent: Resend Confirmation */}
              {emailStatus === "sent" && meetingUrl && (
                <button
                  onClick={handleResendEmail}
                  disabled={isResendingEmail}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
                >
                  {isResendingEmail ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Mail className="w-3.5 h-3.5 text-[#7E5714]" />
                  )}
                  <span>Resend Confirmation</span>
                </button>
              )}

              {/* Manual Confirmation Dispatch */}
              <button
                onClick={handleConfirmAndSendLink}
                disabled={isSendingLink || !meetingUrl}
                className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSendingLink ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Send Manual Invitation</span>
              </button>

              <button
                onClick={handleCopyInvitationText}
                className="px-3 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs cursor-pointer ml-auto"
              >
                <Copy className="w-3.5 h-3.5 text-[#7E5714]" />
                <span>{copiedTemplate ? "Copied!" : "Copy Text"}</span>
              </button>
            </div>
          </div>

          {/* 4. Reschedule Coordinates & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-stone-600 font-medium mb-1">
                Appointment Date
              </label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:border-[#7E5714]"
              />
            </div>
            <div>
              <label className="block text-stone-600 font-medium mb-1">
                Timeslot (PKT)
              </label>
              <input
                type="text"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                placeholder="14:00"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:border-[#7E5714]"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-600 text-xs font-medium mb-1">
              Internal Principal Architect Notes
            </label>
            <textarea
              rows={2}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Internal architectural comments or review checklist..."
              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-900 text-xs focus:outline-none focus:border-[#7E5714] resize-none"
            />
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
