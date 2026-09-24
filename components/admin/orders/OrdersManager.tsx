"use client";

import React, { useState, useMemo } from "react";
import {
  Layers,
  Search,
  Download,
  CheckCircle2,
  Clock4,
  CreditCard,
  Copy,
  ChevronRight,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import type { OrderRecord } from "@/types";

interface OrdersManagerProps {
  orders: OrderRecord[];
  onInspect: (order: OrderRecord) => void;
  onRefresh?: () => void;
}

export const OrdersManager: React.FC<OrdersManagerProps> = ({
  orders,
  onInspect,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("all");
  const [copiedTracker, setCopiedTracker] = useState<string | null>(null);

  const copyToClipboard = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedTracker(text);
    setTimeout(() => setCopiedTracker(null), 2000);
  };

  // Metrics
  const metrics = useMemo(() => {
    const totalCount = orders.length;
    const paidTxs = orders.filter((o) =>
      ["paid", "advance_paid", "fully_paid"].includes(o.payment_status),
    );
    const totalOrderValue = orders.reduce(
      (sum, o) => sum + Number(o.total_amount_pkr || 0),
      0,
    );
    const advanceCollected = paidTxs.reduce(
      (sum, o) =>
        sum +
        (o.payment_status === "fully_paid"
          ? Number(o.total_amount_pkr || 0)
          : Number(o.advance_amount_pkr || 0)),
      0,
    );
    const totalOutstanding = orders.reduce(
      (sum, o) =>
        sum +
        (o.payment_status === "fully_paid"
          ? 0
          : Number(o.remaining_balance_pkr || 0)),
      0,
    );

    return {
      totalCount,
      paidCount: paidTxs.length,
      pendingCount: orders.filter((o) => o.payment_status === "pending").length,
      totalOrderValue,
      advanceCollected,
      totalOutstanding,
    };
  }, [orders]);

  // Filtering
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        o.order_number?.toLowerCase().includes(q) ||
        o.client_name?.toLowerCase().includes(q) ||
        o.client_email?.toLowerCase().includes(q) ||
        o.client_phone?.includes(q) ||
        o.plot_size?.toLowerCase().includes(q) ||
        o.safepay_tracker?.toLowerCase().includes(q);

      let matchesStatus = true;
      if (statusFilter === "pending") {
        matchesStatus = o.payment_status === "pending";
      } else if (statusFilter === "advance_paid") {
        matchesStatus = o.payment_status === "advance_paid";
      } else if (statusFilter === "fully_paid") {
        matchesStatus =
          o.payment_status === "fully_paid" || o.payment_status === "paid";
      } else if (statusFilter === "other") {
        matchesStatus = ["failed", "refunded"].includes(o.payment_status);
      }

      let matchesType = true;
      if (paymentTypeFilter !== "all") {
        matchesType = o.payment_type === paymentTypeFilter;
      }

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [orders, searchTerm, statusFilter, paymentTypeFilter]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Order Number",
      "Client Name",
      "Client Email",
      "Client Phone",
      "Plot Size",
      "Covered Area (Sq.Ft)",
      "Total Amount (PKR)",
      "Advance Amount (PKR)",
      "Remaining Balance (PKR)",
      "Billing Type",
      "Payment Status",
      "Safepay Tracker",
      "Date",
    ];

    const rows = filteredOrders.map((o) => [
      `"${o.order_number}"`,
      `"${o.client_name}"`,
      `"${o.client_email}"`,
      `"${o.client_phone}"`,
      `"${o.plot_size || ""}"`,
      `"${o.covered_area_sqft || ""}"`,
      `"${o.total_amount_pkr}"`,
      `"${o.advance_amount_pkr}"`,
      `"${o.remaining_balance_pkr}"`,
      `"${o.payment_type}"`,
      `"${o.payment_status}"`,
      `"${o.safepay_tracker || ""}"`,
      `"${new Date(o.created_at).toISOString()}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `mark-architects-orders-${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          label: "Pending",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-playfair text-2xl font-bold text-stone-900">
              Package & Collection Orders
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#1C1B1B] text-white">
              {orders.length}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Authoritative registry of architectural design commissions, turnkey
            packages, and Safepay payments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2.5 rounded-xl border border-stone-200 bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors shadow-2xs cursor-pointer"
              title="Refresh Orders"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 hover:text-stone-900 hover:bg-stone-50 transition-colors shadow-2xs text-xs font-semibold flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-stone-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 block mb-1">
            Total Package Orders
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-playfair text-2xl font-bold text-stone-900">
              {metrics.totalCount}
            </span>
            <span className="text-xs text-stone-500">
              ({metrics.pendingCount} pending)
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 block mb-1">
            Total Committed Value
          </span>
          <span className="font-playfair text-2xl font-bold text-stone-900">
            PKR {metrics.totalOrderValue.toLocaleString()}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-600 block mb-1">
            Advance / Collected
          </span>
          <span className="font-playfair text-2xl font-bold text-emerald-800">
            PKR {metrics.advanceCollected.toLocaleString()}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
          <span className="text-[10px] uppercase font-mono tracking-wider text-amber-600 block mb-1">
            Outstanding Receivables
          </span>
          <span className="font-playfair text-2xl font-bold text-amber-900">
            PKR {metrics.totalOutstanding.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order #, client name, email, phone, plot size, or tracker..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 bg-stone-50/50 text-xs text-stone-900 focus:outline-none focus:border-[#7E5714] focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-700 focus:outline-none focus:border-[#7E5714]"
            >
              <option value="all">All Payment Statuses</option>
              <option value="pending">Pending Payment</option>
              <option value="advance_paid">Advance Paid (50%)</option>
              <option value="fully_paid">Fully Paid (100%)</option>
              <option value="other">Failed / Refunded</option>
            </select>

            {/* Billing Model Filter */}
            <select
              value={paymentTypeFilter}
              onChange={(e) => setPaymentTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-700 focus:outline-none focus:border-[#7E5714]"
            >
              <option value="all">All Billing Models</option>
              <option value="50_percent_advance">50% Advance</option>
              <option value="full">Full Upfront</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List / Table */}
      <div className="bg-white border border-stone-200 rounded-2xl shadow-2xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Layers className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="font-playfair text-base font-bold text-stone-700">
              No orders found
            </h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              No architectural package or collection orders matched your search
              criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-mono text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-4">Order Reference</th>
                  <th className="py-3 px-4">Client Details</th>
                  <th className="py-3 px-4">Scope / Plot</th>
                  <th className="py-3 px-4">Financials (PKR)</th>
                  <th className="py-3 px-4">Safepay Tracker</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-inter">
                {filteredOrders.map((order) => {
                  const status = getStatusBadge(order.payment_status);
                  const StatusIcon = status.icon;

                  return (
                    <tr
                      key={order.id}
                      onClick={() => onInspect(order)}
                      className="hover:bg-stone-50/80 cursor-pointer transition-colors group"
                    >
                      {/* Order Ref */}
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-semibold text-stone-900 group-hover:text-[#7E5714] transition-colors block">
                          #{order.order_number}
                        </span>
                        <span className="text-[11px] text-stone-400 block mt-0.5">
                          {new Date(order.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </td>

                      {/* Client */}
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-stone-900 block truncate max-w-[160px]">
                          {order.client_name}
                        </span>
                        <span className="text-stone-500 text-[11px] block truncate max-w-[160px]">
                          {order.client_email}
                        </span>
                        <span className="text-stone-400 text-[10px] font-mono block">
                          {order.client_phone}
                        </span>
                      </td>

                      {/* Scope / Plot */}
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-stone-800 block">
                          {order.plot_size || "Design Package"}
                        </span>
                        {order.covered_area_sqft ? (
                          <span className="text-[11px] text-stone-500 font-mono block">
                            {Number(order.covered_area_sqft).toLocaleString()}{" "}
                            sq.ft.
                          </span>
                        ) : (
                          <span className="text-[11px] text-stone-400 italic block">
                            Standard Area
                          </span>
                        )}
                      </td>

                      {/* Financials */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-stone-400 font-mono">
                              Total:
                            </span>
                            <span className="font-semibold text-stone-900 font-mono">
                              PKR{" "}
                              {Number(
                                order.total_amount_pkr || 0,
                              ).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                            <span className="text-[10px] text-stone-400 font-mono">
                              Advance:
                            </span>
                            <span className="font-mono text-emerald-700 font-medium">
                              PKR{" "}
                              {Number(
                                order.advance_amount_pkr || 0,
                              ).toLocaleString()}
                            </span>
                          </div>
                          {Number(order.remaining_balance_pkr || 0) > 0 && (
                            <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                              <span className="text-[10px] font-mono">
                                Balance:
                              </span>
                              <span className="font-mono text-amber-800">
                                PKR{" "}
                                {Number(
                                  order.remaining_balance_pkr,
                                ).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Safepay Tracker */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        {order.safepay_tracker ? (
                          <div
                            onClick={(e) =>
                              copyToClipboard(order.safepay_tracker!, e)
                            }
                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer max-w-[140px]"
                            title="Click to copy tracker"
                          >
                            <span className="truncate">
                              {order.safepay_tracker}
                            </span>
                            {copiedTracker === order.safepay_tracker ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            ) : (
                              <Copy className="w-3 h-3 text-stone-400 shrink-0" />
                            )}
                          </div>
                        ) : (
                          <span className="text-stone-400 italic">None</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border ${status.bg}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onInspect(order);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 font-medium text-xs inline-flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
