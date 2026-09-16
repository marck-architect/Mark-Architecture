"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  Video,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Clock4,
  AlertCircle,
  Layers,
  TrendingUp,
  DollarSign,
  ChevronRight,
} from "lucide-react";
import { BookingDetailModal } from "./BookingDetailModal";
import type {
  ConsultationRecord,
  OrderRecord,
  AdminDashboardViewProps,
} from "@/types";

export type { OrderRecord };

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  initialConsultations,
  initialOrders,
}) => {
  const [consultations, setConsultations] =
    useState<ConsultationRecord[]>(initialConsultations);
  const [orders] = useState<OrderRecord[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<"consultations" | "orders">(
    "consultations",
  );

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Inspection Modal
  const [selectedBooking, setSelectedBooking] =
    useState<ConsultationRecord | null>(null);

  // Compute Metrics
  const metrics = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];

    const paidConsultations = consultations.filter(
      (c) => c.payment_status === "paid",
    );
    const totalConsultationRev = paidConsultations.reduce(
      (sum, c) => sum + Number(c.price_pkr || 0),
      0,
    );

    const paidOrders = orders.filter((o) =>
      ["advance_paid", "fully_paid", "paid"].includes(o.payment_status),
    );
    const totalOrderRev = paidOrders.reduce(
      (sum, o) => sum + Number(o.advance_amount_pkr || 0),
      0,
    );

    const todayBookings = consultations.filter((c) => c.booking_date === today);
    const upcomingBookings = consultations.filter(
      (c) =>
        c.booking_date >= today &&
        ["pending", "paid"].includes(c.payment_status),
    );

    return {
      totalBookings: consultations.length,
      todayCount: todayBookings.length,
      upcomingCount: upcomingBookings.length,
      totalRevenue: totalConsultationRev + totalOrderRev,
      pendingCount: consultations.filter((c) => c.payment_status === "pending")
        .length,
    };
  }, [consultations, orders]);

  // Filtered Consultations
  const filteredConsultations = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];

    return consultations.filter((item) => {
      // Search matches
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        item.client_name?.toLowerCase().includes(query) ||
        item.client_email?.toLowerCase().includes(query) ||
        item.client_phone?.includes(query);

      // Status match
      const matchesStatus =
        statusFilter === "all" || item.payment_status === statusFilter;

      // Tier match
      const matchesTier = tierFilter === "all" || item.tier_name === tierFilter;

      // Date match
      let matchesDate = true;
      if (dateFilter === "today") {
        matchesDate = item.booking_date === today;
      } else if (dateFilter === "upcoming") {
        matchesDate = item.booking_date >= today;
      } else if (dateFilter === "past") {
        matchesDate = item.booking_date < today;
      }

      return matchesSearch && matchesStatus && matchesTier && matchesDate;
    });
  }, [consultations, searchTerm, statusFilter, tierFilter, dateFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((item) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        item.client_name?.toLowerCase().includes(query) ||
        item.client_email?.toLowerCase().includes(query) ||
        item.order_number?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || item.payment_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const handleUpdateBooking = (updated: ConsultationRecord) => {
    setConsultations((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c)),
    );
    setSelectedBooking(updated);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
      case "fully_paid":
      case "advance_paid":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Confirmed / Paid
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-sky-50 text-sky-800 border border-sky-200">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case "rescheduled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <Clock4 className="w-3 h-3" />
            Rescheduled
          </span>
        );
      case "failed":
      case "refunded":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-rose-50 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3 h-3" />
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-stone-100 text-stone-700 border border-stone-200">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-500" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bookings */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-500 uppercase tracking-widest font-medium block mb-1">
              Consultation Calls
            </span>
            <div className="text-2xl font-semibold text-stone-900 font-mono">
              {metrics.totalBookings}
            </div>
            <span className="text-[11px] text-stone-500 mt-1 block">
              {metrics.upcomingCount} upcoming scheduled
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#7E5714]">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-500 uppercase tracking-widest font-medium block mb-1">
              Today&apos;s Schedule
            </span>
            <div className="text-2xl font-semibold text-stone-900 font-mono">
              {metrics.todayCount}
            </div>
            <span className="text-[11px] text-emerald-700 mt-1 block flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3" /> Live PKT Schedule
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-center text-emerald-700">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Total PKR Collected */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-500 uppercase tracking-widest font-medium block mb-1">
              Safepay Processed
            </span>
            <div className="text-2xl font-semibold text-stone-900 font-mono">
              PKR {metrics.totalRevenue.toLocaleString("en-PK")}
            </div>
            <span className="text-[11px] text-stone-500 mt-1 block">
              Calls & 50% Design Advances
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#7E5714]">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Actions */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-500 uppercase tracking-widest font-medium block mb-1">
              Pending Payments
            </span>
            <div className="text-2xl font-semibold text-stone-900 font-mono">
              {metrics.pendingCount}
            </div>
            <span className="text-[11px] text-amber-700 mt-1 block font-medium">
              Awaiting Safepay checkout
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tab Navigation & Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        {/* Tabs */}
        <div className="flex max-w-full items-center gap-2 overflow-x-auto p-1 bg-stone-100 border border-stone-200/80 rounded-xl">
          <button
            onClick={() => setActiveTab("consultations")}
            className={`flex shrink-0 items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === "consultations"
                ? "bg-white text-stone-900 shadow-xs font-semibold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#7E5714]" />
            <span>Consultation Schedule ({consultations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex shrink-0 items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === "orders"
                ? "bg-white text-stone-900 shadow-xs font-semibold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#7E5714]" />
            <span>Design Orders & 50% Advances ({orders.length})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by client, email, phone..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#7E5714] focus:ring-1 focus:ring-[#7E5714]/20 shadow-xs transition-all"
            />
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="text-stone-500 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter by:
        </span>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 shadow-xs focus:outline-none focus:border-[#7E5714] focus:ring-1 focus:ring-[#7E5714]/20"
        >
          <option value="all">All Statuses</option>
          <option value="paid">Confirmed & Paid</option>
          <option value="pending">Pending Payment</option>
          <option value="completed">Session Completed</option>
          <option value="rescheduled">Rescheduled</option>
        </select>

        {activeTab === "consultations" && (
          <>
            {/* Tier Filter */}
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 shadow-xs focus:outline-none focus:border-[#7E5714] focus:ring-1 focus:ring-[#7E5714]/20"
            >
              <option value="all">All Call Tiers</option>
              <option value="Basic Call">Basic Call (30 min)</option>
              <option value="Premium Call">Premium Call (60 min)</option>
              <option value="Executive Advisory">
                Executive Advisory (90 min)
              </option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 shadow-xs focus:outline-none focus:border-[#7E5714] focus:ring-1 focus:ring-[#7E5714]/20"
            >
              <option value="all">All Dates</option>
              <option value="today">Today&apos;s Schedule</option>
              <option value="upcoming">Upcoming Sessions</option>
              <option value="past">Past History</option>
            </select>
          </>
        )}

        {(searchTerm ||
          statusFilter !== "all" ||
          tierFilter !== "all" ||
          dateFilter !== "all") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setTierFilter("all");
              setDateFilter("all");
            }}
            className="text-[11px] text-[#7E5714] font-medium hover:underline ml-auto"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Main Content Table Area */}
      {activeTab === "consultations" ? (
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
          {filteredConsultations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50/90 text-stone-600 uppercase tracking-wider font-semibold border-b border-stone-200">
                  <tr>
                    <th className="px-5 py-3.5">Booking Timeslot</th>
                    <th className="px-5 py-3.5">Client Information</th>
                    <th className="px-5 py-3.5">Tier & Fee</th>
                    <th className="px-5 py-3.5">Safepay Status</th>
                    <th className="px-5 py-3.5">Meeting Link</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {filteredConsultations.map((booking) => {
                    const isToday =
                      booking.booking_date ===
                      new Date().toISOString().split("T")[0];

                    return (
                      <tr
                        key={booking.id}
                        className={`hover:bg-stone-50/70 transition-colors ${
                          isToday ? "bg-amber-50/40" : ""
                        }`}
                      >
                        {/* Date & Time Slot */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center text-[#7E5714] shrink-0 shadow-2xs">
                              <Calendar className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-medium text-stone-900 flex items-center gap-1.5">
                                <span>
                                  {new Date(
                                    booking.booking_date,
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                                {isToday && (
                                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                                    Today
                                  </span>
                                )}
                              </div>
                              <div className="text-[#7E5714] font-mono text-[11px] flex items-center gap-1 mt-0.5 font-medium">
                                <Clock className="w-3 h-3" />
                                <span>{booking.booking_time} PKT</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Client Details */}
                        <td className="px-5 py-4">
                          <div className="font-medium text-stone-900">
                            {booking.client_name}
                          </div>
                          <div className="text-stone-500 text-[11px] font-mono">
                            {booking.client_email}
                          </div>
                          <div className="text-stone-500 text-[11px]">
                            {booking.client_phone}
                          </div>
                        </td>

                        {/* Tier & Price */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="text-stone-900 font-medium">
                            {booking.tier_name}
                          </div>
                          <div className="text-stone-600 font-mono text-[11px]">
                            PKR{" "}
                            {Number(booking.price_pkr).toLocaleString("en-PK")}
                          </div>
                        </td>

                        {/* Payment Status */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          {getStatusBadge(booking.payment_status)}
                        </td>

                        {/* Meeting Link */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          {booking.meeting_url ? (
                            <a
                              href={booking.meeting_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-200 text-[#7E5714] hover:text-[#684710] hover:border-stone-300 text-xs transition-colors shadow-2xs font-medium"
                            >
                              <Video className="w-3 h-3" />
                              <span>Join Meet</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ) : (
                            <button
                              onClick={() => setSelectedBooking(booking)}
                              className="text-[11px] text-stone-400 hover:text-[#7E5714] underline decoration-stone-300 cursor-pointer"
                            >
                              + Set Meet Link
                            </button>
                          )}
                        </td>

                        {/* Action: Inspect */}
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-[#7E5714] hover:text-white text-stone-700 text-xs font-medium border border-stone-200 transition-all cursor-pointer shadow-2xs"
                          >
                            <span>Inspect</span>
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
            <div className="p-12 text-center">
              <Calendar className="w-10 h-10 text-stone-400 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-stone-800">
                No Consultation Bookings Found
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Try adjusting your search query or status filter.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Orders Tab */
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
          {filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50/90 text-stone-600 uppercase tracking-wider font-semibold border-b border-stone-200">
                  <tr>
                    <th className="px-5 py-3.5">Order Number</th>
                    <th className="px-5 py-3.5">Client</th>
                    <th className="px-5 py-3.5">Plot Size & Area</th>
                    <th className="px-5 py-3.5">50% Advance Paid</th>
                    <th className="px-5 py-3.5">Remaining Balance</th>
                    <th className="px-5 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-stone-50/70 transition-colors"
                    >
                      <td className="px-5 py-4 font-mono font-medium text-[#7E5714] whitespace-nowrap">
                        {order.order_number}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-stone-900">
                          {order.client_name}
                        </div>
                        <div className="text-stone-500 text-[11px] font-mono">
                          {order.client_email}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-medium text-stone-800">
                          {order.plot_size || "Standard Plot"}
                        </span>
                        {order.covered_area_sqft && (
                          <div className="text-stone-500 text-[11px]">
                            {order.covered_area_sqft} sq. ft.
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap font-mono text-stone-900 font-medium">
                        PKR{" "}
                        {Number(order.advance_amount_pkr).toLocaleString(
                          "en-PK",
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap font-mono text-stone-500">
                        PKR{" "}
                        {Number(order.remaining_balance_pkr).toLocaleString(
                          "en-PK",
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {getStatusBadge(order.payment_status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Layers className="w-10 h-10 text-stone-400 mx-auto mb-3" />
              <h3 className="text-sm font-medium text-stone-800">
                No Design Orders Found
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                New 50% advance design package acquisitions will appear here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal
          key={selectedBooking.id}
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdate={handleUpdateBooking}
        />
      )}
    </div>
  );
};
