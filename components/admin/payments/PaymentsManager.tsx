"use client";

import React, { useState, useMemo } from "react";
import {
  CreditCard,
  Search,
  Download,
  ExternalLink,
  CheckCircle2,
  Clock4,
  Copy,
  DollarSign,
  ShieldCheck,
  X,
} from "lucide-react";
import type { ConsultationRecord, OrderRecord } from "@/types";

interface PaymentsManagerProps {
  consultations: ConsultationRecord[];
  orders: OrderRecord[];
}

interface UnifiedTransaction {
  id: string;
  sourceId: string;
  type: "consultation" | "order";
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  description: string;
  amountPkr: number;
  paymentStatus: string;
  safepayTracker: string | null;
  safepayToken: string | null;
  createdAt: string;
}

export const PaymentsManager: React.FC<PaymentsManagerProps> = ({
  consultations,
  orders,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedTx, setSelectedTx] = useState<UnifiedTransaction | null>(null);
  const [copiedTracker, setCopiedTracker] = useState<string | null>(null);

  // Normalize into unified transactions
  const transactions: UnifiedTransaction[] = useMemo(() => {
    const list: UnifiedTransaction[] = [];

    // Consultations
    consultations.forEach((c) => {
      list.push({
        id: `tx_c_${c.id}`,
        sourceId: c.id,
        type: "consultation",
        clientName: c.client_name,
        clientEmail: c.client_email,
        clientPhone: c.client_phone,
        description: `Consultation — ${c.tier_name}`,
        amountPkr: Number(c.price_pkr || 0),
        paymentStatus: c.payment_status || "pending",
        safepayTracker: c.safepay_tracker || null,
        safepayToken: c.safepay_token || null,
        createdAt: c.created_at || c.booking_date,
      });
    });

    // Orders
    orders.forEach((o) => {
      list.push({
        id: `tx_o_${o.id}`,
        sourceId: o.id,
        type: "order",
        clientName: o.client_name,
        clientEmail: o.client_email,
        clientPhone: o.client_phone,
        description: `Design Package Order #${o.order_number}${o.plot_size ? ` (${o.plot_size})` : ""}`,
        amountPkr: Number(o.advance_amount_pkr || o.total_amount_pkr || 0),
        paymentStatus: o.payment_status || "pending",
        safepayTracker: o.safepay_tracker || null,
        safepayToken: null,
        createdAt: o.created_at,
      });
    });

    // Sort newest first
    return list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [consultations, orders]);

  // Financial Metrics
  const metrics = useMemo(() => {
    const paidTxs = transactions.filter((t) =>
      ["paid", "advance_paid", "fully_paid"].includes(t.paymentStatus),
    );
    const totalCaptured = paidTxs.reduce((sum, t) => sum + t.amountPkr, 0);

    const pendingTxs = transactions.filter(
      (t) => t.paymentStatus === "pending",
    );
    const totalPending = pendingTxs.reduce((sum, t) => sum + t.amountPkr, 0);

    const withTracker = transactions.filter((t) => !!t.safepayTracker).length;
    const successRate =
      transactions.length > 0
        ? Math.round((paidTxs.length / transactions.length) * 100)
        : 100;

    return { totalCaptured, totalPending, withTracker, successRate };
  }, [transactions]);

  // Filtered transactions
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      // Type
      if (typeFilter !== "all" && tx.type !== typeFilter) return false;

      // Status
      if (statusFilter !== "all") {
        if (
          statusFilter === "paid" &&
          !["paid", "advance_paid", "fully_paid"].includes(tx.paymentStatus)
        ) {
          return false;
        }
        if (statusFilter === "pending" && tx.paymentStatus !== "pending") {
          return false;
        }
      }

      // Search
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matches =
          tx.clientName.toLowerCase().includes(query) ||
          tx.clientEmail.toLowerCase().includes(query) ||
          tx.clientPhone.includes(query) ||
          (tx.safepayTracker &&
            tx.safepayTracker.toLowerCase().includes(query)) ||
          (tx.safepayToken && tx.safepayToken.toLowerCase().includes(query));
        if (!matches) return false;
      }

      return true;
    });
  }, [transactions, typeFilter, statusFilter, searchTerm]);

  const handleCopyTracker = (tracker: string) => {
    navigator.clipboard.writeText(tracker);
    setCopiedTracker(tracker);
    setTimeout(() => setCopiedTracker(null), 2000);
  };

  const handleExportCsv = () => {
    const headers = [
      "Transaction ID",
      "Date",
      "Type",
      "Client Name",
      "Client Email",
      "Amount (PKR)",
      "Payment Status",
      "Safepay Tracker",
      "Safepay Token",
    ];
    const rows = filtered.map((tx) => [
      tx.id,
      new Date(tx.createdAt).toLocaleDateString(),
      tx.type,
      `"${tx.clientName.replace(/"/g, '""')}"`,
      tx.clientEmail,
      tx.amountPkr,
      tx.paymentStatus,
      tx.safepayTracker || "N/A",
      tx.safepayToken || "N/A",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `safepay-transactions-${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-[#7E5714] uppercase">
            Financial & Gateway Ledger
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 tracking-tight mt-1">
            Safepay Payments & Invoicing
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Reconcile live Safepay tracker receipts, consultation fees, and
            design retainer transactions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-4 py-2 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-mono uppercase tracking-wider rounded-sm shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200 p-5 rounded-sm shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 uppercase tracking-wider font-mono">
              Captured Revenue
            </span>
            <div className="p-2 bg-emerald-50 rounded-sm text-emerald-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif text-stone-900 mt-2">
            PKR {metrics.totalCaptured.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-mono">
            Settled via Safepay Checkout
          </div>
        </div>

        <div className="bg-white border border-stone-200 p-5 rounded-sm shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 uppercase tracking-wider font-mono">
              Pending Receivables
            </span>
            <div className="p-2 bg-amber-50 rounded-sm text-amber-700">
              <Clock4 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif text-stone-900 mt-2">
            PKR {metrics.totalPending.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            Awaiting Safepay checkout
          </div>
        </div>

        <div className="bg-white border border-stone-200 p-5 rounded-sm shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 uppercase tracking-wider font-mono">
              Tracked Transactions
            </span>
            <div className="p-2 bg-blue-50 rounded-sm text-blue-700">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif text-stone-900 mt-2">
            {metrics.withTracker}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            With verified gateway tracker
          </div>
        </div>

        <div className="bg-white border border-stone-200 p-5 rounded-sm shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 uppercase tracking-wider font-mono">
              Checkout Success
            </span>
            <div className="p-2 bg-stone-100 rounded-sm text-stone-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif text-stone-900 mt-2">
            {metrics.successRate}%
          </div>
          <div className="text-[11px] text-stone-500 mt-1 font-mono">
            Direct conversion rate
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-stone-200 p-4 rounded-sm shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by client, tracker ID (track_...), or token..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714] focus:bg-white text-stone-800"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-sm text-stone-700 focus:outline-none font-mono"
            >
              <option value="all">All Services</option>
              <option value="consultation">Consultations Only</option>
              <option value="order">Design Packages Only</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-sm text-stone-700 focus:outline-none font-mono"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid & Settled</option>
              <option value="pending">Pending Payment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-stone-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 uppercase text-[10px] tracking-wider text-stone-500 font-mono">
              <tr>
                <th className="py-3 px-4">Transaction / Date</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Safepay Tracker</th>
                <th className="py-3 px-4 text-right">Amount (PKR)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((tx) => {
                const isPaid = ["paid", "advance_paid", "fully_paid"].includes(
                  tx.paymentStatus,
                );

                return (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="hover:bg-stone-50/70 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono">
                      <div className="text-stone-900 font-medium">
                        {new Date(tx.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {tx.type === "consultation"
                          ? "CONSULTATION"
                          : "PACKAGE"}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-serif text-stone-900 group-hover:text-[#7E5714] font-medium transition-colors">
                        {tx.clientName}
                      </div>
                      <div className="font-mono text-[11px] text-stone-400">
                        {tx.clientEmail}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 max-w-xs truncate">
                      {tx.description}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      {tx.safepayTracker ? (
                        <div className="flex items-center gap-1 text-stone-700">
                          <span className="truncate max-w-[140px]">
                            {tx.safepayTracker}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyTracker(tx.safepayTracker!);
                            }}
                            title="Copy Tracker"
                            className="p-1 hover:text-[#7E5714] transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          {copiedTracker === tx.safepayTracker && (
                            <span className="text-[10px] text-emerald-600">
                              Copied
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-stone-400 italic">
                          No tracker
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-medium text-stone-900">
                      PKR {tx.amountPkr.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2.5 py-1 rounded-full ${
                          isPaid
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {isPaid ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock4 className="w-3 h-3" />
                        )}
                        {tx.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTx(tx);
                        }}
                        className="text-[11px] text-[#7E5714] hover:text-[#684710] font-medium py-1 px-2.5 hover:bg-amber-50 rounded transition-colors"
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No transactions match the selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-stone-200 rounded-sm shadow-xl max-w-lg w-full overflow-hidden">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div>
                <span className="text-[10px] font-mono text-[#7E5714] uppercase">
                  Safepay Transaction Receipt
                </span>
                <h3 className="text-base font-serif text-stone-900 font-medium">
                  {selectedTx.description}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-sm flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-stone-400 uppercase">
                    Amount Charged
                  </div>
                  <div className="text-xl font-serif font-bold text-stone-900 mt-0.5">
                    PKR {selectedTx.amountPkr.toLocaleString()}
                  </div>
                </div>
                <span
                  className={`text-[11px] font-mono uppercase px-3 py-1 rounded-full font-medium ${
                    ["paid", "advance_paid", "fully_paid"].includes(
                      selectedTx.paymentStatus,
                    )
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {selectedTx.paymentStatus}
                </span>
              </div>

              <div className="space-y-2.5 divide-y divide-stone-100 font-mono">
                <div className="flex justify-between pt-2">
                  <span className="text-stone-500">Client:</span>
                  <span className="text-stone-900 font-sans font-medium">
                    {selectedTx.clientName}
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-stone-500">Email:</span>
                  <span className="text-stone-900">
                    {selectedTx.clientEmail}
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-stone-500">Phone:</span>
                  <span className="text-stone-900">
                    {selectedTx.clientPhone}
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-stone-500">Gateway:</span>
                  <span className="text-stone-900 font-medium">
                    Safepay Pakistan
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-stone-500">Safepay Tracker:</span>
                  <span className="text-stone-900 select-all">
                    {selectedTx.safepayTracker || "None assigned"}
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-stone-500">Payment Token:</span>
                  <span className="text-stone-900 select-all">
                    {selectedTx.safepayToken || "None assigned"}
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-stone-500">Timestamp:</span>
                  <span className="text-stone-900">
                    {new Date(selectedTx.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
              <a
                href="https://merchant.getsafepay.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 font-medium font-mono"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Safepay Merchant Portal
              </a>
              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-sm transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
