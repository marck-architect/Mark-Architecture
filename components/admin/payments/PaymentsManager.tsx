"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Download,
  Paperclip,
  CheckCircle2,
  Clock4,
  DollarSign,
  ShieldCheck,
  X,
  ExternalLink,
  Loader2,
} from "lucide-react";
import type { ConsultationRecord, OrderRecord } from "@/types";
import { AdminPagination } from "@/components/admin/ui/AdminPagination";
import { useStore } from "@/hooks/useStore";

interface PaymentsManagerProps {
  consultations: ConsultationRecord[];
  orders: OrderRecord[];
  onUpdateOrder?: (order: OrderRecord) => void;
  onUpdateConsultation?: (booking: ConsultationRecord) => void;
  onInspectOrder?: (order: OrderRecord) => void;
  onInspectConsultation?: (booking: ConsultationRecord) => void;
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
  paymentType?: string;
  paymentStatus: string;
  attachmentUrls: string[];
  createdAt: string;
}

export const PaymentsManager: React.FC<PaymentsManagerProps> = ({
  consultations,
  orders,
  onUpdateOrder,
  onUpdateConsultation,
  onInspectOrder,
  onInspectConsultation,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedTx, setSelectedTx] = useState<UnifiedTransaction | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter]);

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
        attachmentUrls: c.attachment_urls || [],
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
        paymentType: o.payment_type,
        paymentStatus: o.payment_status || "pending",
        attachmentUrls: o.attachment_urls || [],
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

    const withProof = transactions.filter((t) => t.attachmentUrls.length > 0).length;
    const successRate =
      transactions.length > 0
        ? Math.round((paidTxs.length / transactions.length) * 100)
        : 100;

    return { totalCaptured, totalPending, withProof, successRate };
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
          tx.clientPhone.includes(query);
        if (!matches) return false;
      }

      return true;
    });
  }, [transactions, typeFilter, statusFilter, searchTerm]);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const handleConfirmTxPayment = async (tx: UnifiedTransaction) => {
    setIsConfirming(true);
    setConfirmError(null);

    try {
      if (tx.type === "order") {
        const targetStatus =
          tx.paymentType === "50_percent_advance"
            ? "advance_paid"
            : "fully_paid";
        const res = await fetch(`/api/admin/orders/${tx.sourceId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payment_status: targetStatus }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to confirm order payment.");
        }
        const existingOrder = orders.find((o) => o.id === tx.sourceId);
        if (existingOrder && onUpdateOrder) {
          onUpdateOrder({
            ...existingOrder,
            ...(data.data || {}),
            payment_status: targetStatus,
          });
        }
        setSelectedTx({ ...tx, paymentStatus: targetStatus });
        useStore
          .getState()
          .showToast("Order payment verified & confirmed!");
      } else {
        const res = await fetch(`/api/admin/consultations/${tx.sourceId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            payment_status: "paid",
            confirm_payment: true,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(
            data.error || "Failed to confirm consultation payment.",
          );
        }
        const existingBooking = consultations.find(
          (c) => c.id === tx.sourceId,
        );
        if (existingBooking && onUpdateConsultation) {
          onUpdateConsultation({
            ...existingBooking,
            ...(data.data || {}),
            payment_status: "paid",
            consultation_status: "confirmed",
            confirmed_by_admin: true,
          });
        }
        setSelectedTx({ ...tx, paymentStatus: "paid" });
        useStore
          .getState()
          .showToast("Consultation payment verified & confirmed!");
      }
    } catch (err: unknown) {
      setConfirmError(
        err instanceof Error ? err.message : "Failed to confirm payment.",
      );
    } finally {
      setIsConfirming(false);
    }
  };

  const handleOpenFullRecord = (tx: UnifiedTransaction) => {
    setSelectedTx(null);
    if (tx.type === "order" && onInspectOrder) {
      const found = orders.find((o) => o.id === tx.sourceId);
      if (found) onInspectOrder(found);
    } else if (tx.type === "consultation" && onInspectConsultation) {
      const found = consultations.find((c) => c.id === tx.sourceId);
      if (found) onInspectConsultation(found);
    }
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
      "Payment Proof",
    ];
    const rows = filtered.map((tx) => [
      tx.id,
      new Date(tx.createdAt).toLocaleDateString(),
      tx.type,
      `"${tx.clientName.replace(/"/g, '""')}"`,
      tx.clientEmail,
      tx.amountPkr,
      tx.paymentStatus,
      tx.attachmentUrls[tx.attachmentUrls.length - 1] || "N/A",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `payment-transactions-${new Date().toISOString().split("T")[0]}.csv`,
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
            Financial Ledger
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 tracking-tight mt-1">
            Payments & Invoicing
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Reconcile bank transfer / JazzCash payment screenshots, consultation fees, and
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
            Verified & confirmed
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
            Awaiting payment verification
          </div>
        </div>

        <div className="bg-white border border-stone-200 p-5 rounded-sm shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500 uppercase tracking-wider font-mono">
              With Payment Proof
            </span>
            <div className="p-2 bg-blue-50 rounded-sm text-blue-700">
              <Paperclip className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-serif text-stone-900 mt-2">
            {metrics.withProof}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            Screenshot uploaded at checkout
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
              placeholder="Search by client name, email, or phone..."
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
                <th className="py-3 px-4">Payment Proof</th>
                <th className="py-3 px-4 text-right">Amount (PKR)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {paginatedTransactions.map((tx) => {
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
                      {tx.attachmentUrls.length > 0 ? (
                        <div className="flex items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={
                              tx.attachmentUrls[tx.attachmentUrls.length - 1]
                            }
                            alt="Payment proof"
                            className="w-8 h-8 rounded-sm object-cover border border-stone-200 bg-stone-50 shrink-0"
                          />
                          <a
                            href={
                              tx.attachmentUrls[tx.attachmentUrls.length - 1]
                            }
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[#7E5714] hover:text-[#684710] hover:underline font-medium"
                          >
                            <Paperclip className="w-3 h-3" />
                            View screenshot
                          </a>
                        </div>
                      ) : (
                        <span className="text-stone-400 italic">None uploaded</span>
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
                          setConfirmError(null);
                          setSelectedTx(tx);
                        }}
                        className={`text-[11px] font-medium py-1.5 px-3 rounded transition-colors cursor-pointer ${
                          !isPaid
                            ? "bg-amber-50 border border-amber-300 text-amber-900 hover:bg-[#7E5714] hover:text-white hover:border-[#7E5714] font-semibold"
                            : "text-[#7E5714] hover:text-[#684710] hover:bg-amber-50"
                        }`}
                      >
                        {!isPaid ? "Verify & Confirm" : "Receipt"}
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

      {/* Pagination Bar */}
      {filtered.length > 0 && (
        <AdminPagination
          currentPage={currentPage}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          pageSizeOptions={[10, 25, 50]}
          itemName="transactions"
        />
      )}

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-stone-200 rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div>
                <span className="text-[10px] font-mono text-[#7E5714] uppercase font-bold">
                  Payment Verification &amp; Receipt
                </span>
                <h3 className="text-base font-serif text-stone-900 font-medium">
                  {selectedTx.description}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {confirmError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {confirmError}
                </div>
              )}

              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-stone-400 uppercase">
                    Amount Charged
                  </div>
                  <div className="text-xl font-serif font-bold text-stone-900 mt-0.5">
                    PKR {selectedTx.amountPkr.toLocaleString()}
                  </div>
                </div>
                <span
                  className={`text-[11px] font-mono uppercase px-3 py-1 rounded-full font-medium flex items-center gap-1 ${
                    ["paid", "advance_paid", "fully_paid"].includes(
                      selectedTx.paymentStatus,
                    )
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {["paid", "advance_paid", "fully_paid"].includes(
                    selectedTx.paymentStatus,
                  ) ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Clock4 className="w-3.5 h-3.5" />
                  )}
                  {selectedTx.paymentStatus}
                </span>
              </div>

              {/* Inline Payment Screenshot Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-stone-500 font-bold">
                    Uploaded Payment Screenshot
                  </span>
                  {selectedTx.attachmentUrls.length > 0 && (
                    <a
                      href={
                        selectedTx.attachmentUrls[
                          selectedTx.attachmentUrls.length - 1
                        ]
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#7E5714] hover:underline"
                    >
                      <span>Open Full Size</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {selectedTx.attachmentUrls.length > 0 ? (
                  <a
                    href={
                      selectedTx.attachmentUrls[
                        selectedTx.attachmentUrls.length - 1
                      ]
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="group block overflow-hidden rounded-xl border border-stone-200 bg-stone-50 hover:border-[#7E5714] transition-all"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        selectedTx.attachmentUrls[
                          selectedTx.attachmentUrls.length - 1
                        ]
                      }
                      alt={`Payment screenshot from ${selectedTx.clientName}`}
                      className="max-h-60 w-full object-contain p-2 bg-stone-50"
                    />
                    <div className="flex items-center justify-between border-t border-stone-200/80 bg-white px-3 py-2 text-[11px] text-stone-600">
                      <span className="truncate font-mono">
                        {selectedTx.attachmentUrls[
                          selectedTx.attachmentUrls.length - 1
                        ]
                          .split("/")
                          .pop() || "payment-screenshot"}
                      </span>
                      <span className="font-semibold text-[#7E5714] group-hover:underline shrink-0 ml-2">
                        Click to enlarge ↗
                      </span>
                    </div>
                  </a>
                ) : (
                  <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-stone-400 italic">
                    No payment screenshot uploaded.
                  </div>
                )}
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
                  <span className="text-stone-500">Payment Method:</span>
                  <span className="text-stone-900 font-medium">
                    Bank Transfer / JazzCash
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

            <div className="p-4 border-t border-stone-200 bg-stone-50 flex flex-wrap items-center justify-between gap-2">
              {(onInspectOrder || onInspectConsultation) && (
                <button
                  type="button"
                  onClick={() => handleOpenFullRecord(selectedTx)}
                  className="px-3.5 py-2 border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Open Full{" "}
                  {selectedTx.type === "order" ? "Order" : "Consultation"}
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                {!["paid", "advance_paid", "fully_paid"].includes(
                  selectedTx.paymentStatus,
                ) && (
                  <button
                    type="button"
                    disabled={isConfirming}
                    onClick={() => handleConfirmTxPayment(selectedTx)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isConfirming ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Confirming...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verify &amp; Confirm Payment</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => setSelectedTx(null)}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
