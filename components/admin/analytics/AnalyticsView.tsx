"use client";

import React, { useMemo, useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle2,
  Award,
  ArrowUpRight,
} from "lucide-react";
import type { ConsultationRecord, OrderRecord } from "@/types";

interface AnalyticsViewProps {
  consultations: ConsultationRecord[];
  orders: OrderRecord[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  consultations,
  orders,
}) => {
  const [timeRange, setTimeRange] = useState<"all" | "30d" | "90d">("all");

  const analytics = useMemo(() => {
    // 1. Revenue
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
      (sum, o) => sum + Number(o.advance_amount_pkr || o.total_amount_pkr || 0),
      0,
    );

    const totalRevenue = consultationRev + orderRev;

    // 2. Service popularity distribution
    const tierCounts: Record<string, { count: number; rev: number }> = {};
    consultations.forEach((c) => {
      const name = c.tier_name || "General Consultation";
      if (!tierCounts[name]) {
        tierCounts[name] = { count: 0, rev: 0 };
      }
      tierCounts[name].count += 1;
      if (c.payment_status === "paid") {
        tierCounts[name].rev += Number(c.price_pkr || 0);
      }
    });

    const tierBreakdown = Object.entries(tierCounts).map(([name, data]) => ({
      name,
      count: data.count,
      rev: data.rev,
      percentage: Math.round((data.count / (consultations.length || 1)) * 100),
    }));

    // 3. Day of week demand
    const dayCounts = [0, 0, 0, 0, 0, 0, 0]; // Sun to Sat
    consultations.forEach((c) => {
      if (c.booking_date) {
        const d = new Date(c.booking_date).getDay();
        dayCounts[d] += 1;
      }
    });

    // 4. Conversion funnel
    const totalInitiated = consultations.length;
    const paidCount = paidConsultations.length;
    const meetingSentCount = consultations.filter(
      (c) => !!c.meeting_url,
    ).length;

    return {
      totalRevenue,
      consultationRev,
      orderRev,
      consultationCount: consultations.length,
      orderCount: orders.length,
      tierBreakdown,
      dayCounts,
      funnel: {
        totalInitiated,
        paidCount,
        meetingSentCount,
        conversionRate:
          totalInitiated > 0
            ? Math.round((paidCount / totalInitiated) * 100)
            : 100,
      },
    };
  }, [consultations, orders]);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-[#7E5714] uppercase">
            Executive Intelligence & Insights
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 tracking-tight mt-1">
            Studio Performance Analytics
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Financial velocity, consultation conversion rates, and client demand
            distribution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) =>
              setTimeRange(e.target.value as "all" | "30d" | "90d")
            }
            className="px-3 py-2 text-xs bg-white border border-stone-200 rounded-sm text-stone-700 font-mono shadow-sm"
          >
            <option value="all">All-Time Performance</option>
            <option value="90d">Past 90 Days</option>
            <option value="30d">Past 30 Days</option>
          </select>
        </div>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200 p-5 rounded-sm shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 uppercase tracking-wider font-mono">
              Gross Volume
            </span>
            <div className="p-2 bg-emerald-50 rounded-sm text-emerald-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif text-stone-900 mt-2">
            PKR {analytics.totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-mono">
            <ArrowUpRight className="w-3 h-3" />
            <span>Consultations & Design</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200 p-5 rounded-sm shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 uppercase tracking-wider font-mono">
              Online Bookings
            </span>
            <div className="p-2 bg-stone-100 rounded-sm text-stone-700">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif text-stone-900 mt-2">
            {analytics.consultationCount}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 font-mono">
            Total consultation requests
          </div>
        </div>

        <div className="bg-white border border-stone-200 p-5 rounded-sm shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 uppercase tracking-wider font-mono">
              Safepay Conversion
            </span>
            <div className="p-2 bg-blue-50 rounded-sm text-blue-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif text-stone-900 mt-2">
            {analytics.funnel.conversionRate}%
          </div>
          <div className="text-[11px] text-blue-600 mt-1 font-mono">
            Direct checkout completion
          </div>
        </div>

        <div className="bg-white border border-stone-200 p-5 rounded-sm shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 uppercase tracking-wider font-mono">
              Meeting Dispatch
            </span>
            <div className="p-2 bg-amber-50 rounded-sm text-[#7E5714]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif text-stone-900 mt-2">
            {analytics.funnel.meetingSentCount}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 font-mono">
            Google Meet invitations sent
          </div>
        </div>
      </div>

      {/* Visual Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Popularity Breakdown */}
        <div className="bg-white border border-stone-200 p-6 rounded-sm shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-serif text-base text-stone-900 font-medium">
                Consultation Tier Popularity
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Client volume and billing by consultation package.
              </p>
            </div>
            <Award className="w-4 h-4 text-[#7E5714]" />
          </div>

          <div className="space-y-4">
            {analytics.tierBreakdown.map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-serif text-stone-800 font-medium">
                    {item.name}
                  </span>
                  <div className="font-mono text-stone-500">
                    <span>{item.count} sessions</span>
                    <span className="mx-2 text-stone-300">|</span>
                    <span className="text-stone-900 font-medium">
                      PKR {item.rev.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#7E5714] rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(item.percentage, 5)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Studio Funnel Conversion */}
        <div className="bg-white border border-stone-200 p-6 rounded-sm shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-serif text-base text-stone-900 font-medium">
                Safepay Conversion Pipeline
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                From initial slot reservation to confirmed meeting dispatch.
              </p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-sm flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase text-stone-400">
                  Step 1: Session Reserved
                </div>
                <div className="font-semibold text-stone-900 text-sm mt-0.5">
                  {analytics.funnel.totalInitiated} Consultations
                </div>
              </div>
              <span className="text-xs text-stone-500">100%</span>
            </div>

            <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-sm flex items-center justify-between text-emerald-900">
              <div>
                <div className="text-[10px] uppercase text-emerald-600">
                  Step 2: Safepay Paid & Settled
                </div>
                <div className="font-semibold text-emerald-900 text-sm mt-0.5">
                  {analytics.funnel.paidCount} Confirmed
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700">
                {analytics.funnel.conversionRate}%
              </span>
            </div>

            <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-sm flex items-center justify-between text-[#7E5714]">
              <div>
                <div className="text-[10px] uppercase text-amber-700">
                  Step 3: Meeting Link Dispatched
                </div>
                <div className="font-semibold text-[#7E5714] text-sm mt-0.5">
                  {analytics.funnel.meetingSentCount} Calendar Links Active
                </div>
              </div>
              <span className="text-xs font-semibold text-amber-800">
                {analytics.funnel.totalInitiated > 0
                  ? Math.round(
                      (analytics.funnel.meetingSentCount /
                        analytics.funnel.totalInitiated) *
                        100,
                    )
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Demand Heatmap */}
      <div className="bg-white border border-stone-200 p-6 rounded-sm shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-5">
          <div>
            <h3 className="font-serif text-base text-stone-900 font-medium">
              Consultation Demand by Day of Week
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Identifies peak client traffic to optimize architect working
              hours.
            </p>
          </div>
          <Calendar className="w-4 h-4 text-stone-400" />
        </div>

        <div className="grid grid-cols-7 gap-3 text-center">
          {daysOfWeek.map((day, idx) => {
            const count = analytics.dayCounts[idx];
            const isPeak =
              count === Math.max(...analytics.dayCounts) && count > 0;

            return (
              <div
                key={day}
                className={`p-4 rounded-sm border transition-all ${
                  isPeak
                    ? "bg-amber-50 border-amber-300 text-[#7E5714]"
                    : "bg-stone-50 border-stone-200 text-stone-700"
                }`}
              >
                <div className="text-[11px] font-mono uppercase text-stone-400">
                  {day}
                </div>
                <div className="text-xl font-serif font-bold mt-1">{count}</div>
                <div className="text-[10px] font-mono text-stone-500 mt-1">
                  {count === 1 ? "session" : "sessions"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
