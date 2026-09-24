"use client";

import React from "react";
import {
  Calendar,
  Clock,
  DollarSign,
  CheckCircle2,
  Video,
  ArrowRight,
  FolderGit2,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import type {
  ConsultationRecord,
  OrderRecord,
  AdminProject,
  AdminService,
  AdminTabType,
} from "@/types";

interface DashboardOverviewProps {
  consultations: ConsultationRecord[];
  orders: OrderRecord[];
  projects: AdminProject[];
  services: AdminService[];
  onNavigateTab: (tab: AdminTabType) => void;
  onInspectConsultation: (booking: ConsultationRecord) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  consultations,
  orders,
  projects,
  services,
  onNavigateTab,
  onInspectConsultation,
}) => {
  const today = new Date().toISOString().split("T")[0];

  // Calculations
  const paidConsultations = consultations.filter(
    (c) => c.payment_status === "paid",
  );
  const consultationRev = paidConsultations.reduce(
    (sum, c) => sum + Number(c.price_pkr || 0),
    0,
  );

  const paidOrders = orders.filter((o) =>
    ["advance_paid", "fully_paid", "paid"].includes(o.payment_status),
  );
  const orderRev = paidOrders.reduce(
    (sum, o) => sum + Number(o.advance_amount_pkr || 0),
    0,
  );
  const totalRev = consultationRev + orderRev;

  const todayBookings = consultations.filter((c) => c.booking_date === today);
  const upcomingBookings = consultations.filter(
    (c) =>
      c.booking_date >= today && ["pending", "paid"].includes(c.payment_status),
  );

  // Needs Attention items
  const needsLink = consultations.filter(
    (c) => c.payment_status === "paid" && !c.meeting_url,
  );
  const pendingPayment = consultations.filter(
    (c) => c.payment_status === "pending",
  );

  return (
    <div className="space-y-8 font-inter">
      {/* 1. Atelier Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#1C1B1B] text-white relative overflow-hidden shadow-xl border border-stone-800">
        <div className="absolute right-0 bottom-0 pointer-events-none opacity-10 translate-x-12 translate-y-12">
          <span className="font-playfair text-[14rem] font-bold text-white leading-none">
            M
          </span>
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-bold uppercase tracking-widest font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Executive Studio Command Center</span>
          </div>
          <h1 className="font-playfair text-2xl sm:text-4xl text-white font-normal leading-tight">
            MARK Architects <br />
            <span className="italic text-[#D4AF37] font-light">
              Atelier Administration
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
            Welcome to the centralized management dashboard. Oversee live video
            consultations, Safepay transaction confirmations, portfolio
            projects, and availability schedules across Pakistan.
          </p>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Bookings */}
        <div
          onClick={() => onNavigateTab("consultations")}
          className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-[#7E5714]/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400 font-semibold">
              Consultations
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#7E5714] group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 mt-2">
            {consultations.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-1 font-medium">
            <span>{upcomingBookings.length} upcoming scheduled</span>
            <ArrowRight className="w-3 h-3 text-[#7E5714] group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Package Orders */}
        <div
          onClick={() => onNavigateTab("orders")}
          className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-blue-500/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400 font-semibold">
              Package Orders
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 mt-2">
            {orders.length}
          </div>
          <div className="text-[11px] text-blue-700 mt-1 flex items-center gap-1 font-medium">
            <span>
              {orders.filter((o) => o.payment_status === "pending").length}{" "}
              pending
            </span>
            <ArrowRight className="w-3 h-3 text-blue-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Today's Schedule */}
        <div
          onClick={() => onNavigateTab("calendar")}
          className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-emerald-500/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400 font-semibold">
              Today&apos;s Schedule
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 mt-2">
            {todayBookings.length}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active appointments</span>
          </div>
        </div>

        {/* Safepay Revenue */}
        <div
          onClick={() => onNavigateTab("payments")}
          className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-[#7E5714]/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400 font-semibold">
              Safepay Processed
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#7E5714] group-hover:scale-105 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900 mt-2 truncate">
            PKR {totalRev.toLocaleString("en-PK")}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-1 font-medium">
            <span>Verified gate revenue</span>
            <ArrowRight className="w-3 h-3 text-[#7E5714] group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Active Architecture Assets */}
        <div
          onClick={() => onNavigateTab("projects")}
          className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-[#7E5714]/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-400 font-semibold">
              Studio Catalog
            </span>
            <div className="w-9 h-9 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 group-hover:scale-105 transition-transform">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 mt-2">
            {projects.length + services.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {services.length} Services • {projects.length} Projects
          </div>
        </div>
      </div>

      {/* 3. "Needs Attention" Action Board */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
            <h2 className="font-playfair text-lg sm:text-xl font-bold text-stone-900">
              Needs Studio Attention
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-mono">
            {needsLink.length + pendingPayment.length} action items
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card A: Paid sessions awaiting meeting link */}
          <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs">
                <Video className="w-4 h-4 text-[#7E5714]" />
                <span>Paid Sessions Missing Meeting Link</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono text-[10px] font-bold">
                {needsLink.length}
              </span>
            </div>

            {needsLink.length > 0 ? (
              <div className="space-y-2">
                {needsLink.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onInspectConsultation(item)}
                    className="p-2.5 rounded-xl bg-white border border-amber-200/80 flex items-center justify-between text-xs hover:border-[#7E5714] transition-colors cursor-pointer shadow-2xs"
                  >
                    <div>
                      <div className="font-semibold text-stone-900">
                        {item.client_name}
                      </div>
                      <div className="text-[11px] text-stone-500 font-mono">
                        {item.booking_date} at {item.booking_time} PKT
                      </div>
                    </div>
                    <button className="px-2.5 py-1 rounded-lg bg-[#7E5714] text-white text-[10px] font-semibold hover:bg-[#684710] transition-colors">
                      + Set Link
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-stone-500 italic py-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  All paid sessions have active meeting links assigned.
                </span>
              </div>
            )}
          </div>

          {/* Card B: Pending payment verifications */}
          <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-800 font-semibold text-xs">
                <Clock className="w-4 h-4 text-stone-500" />
                <span>Pending Safepay Checkouts</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 font-mono text-[10px] font-bold">
                {pendingPayment.length}
              </span>
            </div>

            {pendingPayment.length > 0 ? (
              <div className="space-y-2">
                {pendingPayment.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onInspectConsultation(item)}
                    className="p-2.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between text-xs hover:border-stone-400 transition-colors cursor-pointer shadow-2xs"
                  >
                    <div>
                      <div className="font-semibold text-stone-900">
                        {item.client_name}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {item.tier_name} • PKR {item.price_pkr.toLocaleString()}
                      </div>
                    </div>
                    <span className="text-[10px] text-stone-500 font-mono">
                      {item.booking_date}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-stone-500 italic py-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>No checkout sessions pending verification.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Today's Studio Schedule */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#7E5714] font-mono block">
              Daily Roster
            </span>
            <h2 className="font-playfair text-xl font-bold text-stone-900 mt-0.5">
              Today&apos;s Appointments
            </h2>
          </div>
          <span className="text-xs font-mono text-stone-500">{today}</span>
        </div>

        {todayBookings.length > 0 ? (
          <div className="divide-y divide-stone-100">
            {todayBookings.map((b) => (
              <div
                key={b.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#7E5714] font-mono font-bold shrink-0">
                    {b.booking_time}
                  </div>
                  <div>
                    <div className="font-semibold text-stone-900 text-sm">
                      {b.client_name}
                    </div>
                    <div className="text-stone-500 text-[11px]">
                      {b.tier_name} ({b.duration_minutes || 60}m) •{" "}
                      {b.client_phone}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {b.meeting_url ? (
                    <a
                      href={b.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs flex items-center gap-1.5 hover:bg-emerald-100 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Video className="w-3 h-3 text-emerald-700" />
                      <span>Launch Video Call</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ) : (
                    <button
                      onClick={() => onInspectConsultation(b)}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-semibold text-xs hover:bg-amber-100 cursor-pointer"
                    >
                      + Assign Meet URL
                    </button>
                  )}

                  <button
                    onClick={() => onInspectConsultation(b)}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium cursor-pointer"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-stone-50/60 rounded-2xl border border-stone-200/60 space-y-2">
            <Clock className="w-6 h-6 text-stone-400 mx-auto" />
            <p className="text-xs text-stone-600 font-medium">
              No consultations scheduled for today.
            </p>
            <button
              onClick={() => onNavigateTab("calendar")}
              className="text-xs text-[#7E5714] font-semibold hover:underline cursor-pointer"
            >
              View upcoming calendar days &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
