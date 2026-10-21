"use client";

import React, { useEffect, useState, use as usePromise } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Hourglass,
  XCircle,
  Download,
  ShieldCheck,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { PaymentService } from "@/lib/payment";

interface OrderItem {
  title?: string;
  name?: string;
  price?: number;
  quantity?: number;
  tier?: string;
  plotSize?: string;
}

interface OrderLookup {
  id: string;
  order_number: string;
  client_name: string;
  total_amount_pkr: number;
  advance_amount_pkr: number;
  remaining_balance_pkr: number;
  payment_type: string;
  payment_status: string;
  selected_disciplines: OrderItem[] | null;
  attachment_urls: string[] | null;
  notes: string | null;
  created_at: string;
}

const isConfirmed = (status: string) =>
  ["paid", "advance_paid", "fully_paid"].includes(status);
const isFailed = (status: string) => ["failed", "refunded"].includes(status);

export default function OrderStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = usePromise(params);
  const [order, setOrder] = useState<OrderLookup | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Order not found.");
        }
        if (isMounted) setOrder(data.order);
      } catch (err: unknown) {
        if (isMounted) setError(err instanceof Error ? err.message : "Order not found.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center pt-[4.5rem]">
        <Loader2 className="size-8 animate-spin text-tertiary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 pt-[4.5rem] text-center px-4">
        <XCircle className="size-10 text-red-500" />
        <h1 className="font-playfair text-xl font-bold text-secondary dark:text-zinc-100">
          Order Not Found
        </h1>
        <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
          We couldn&apos;t find an order with this link. Double-check the URL, or look it up below.
        </p>
        <Link href="/orders/track" className="mt-2 text-sm font-semibold text-tertiary hover:underline">
          Track an Order
        </Link>
        <Link href="/" className="text-xs font-medium text-zinc-400 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  const confirmed = isConfirmed(order.payment_status);
  const failed = isFailed(order.payment_status);
  const items = Array.isArray(order.selected_disciplines) ? order.selected_disciplines : [];

  return (
    <div className="min-h-screen bg-surface-container-low pt-[4.5rem] pb-20 dark:bg-zinc-950">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <Link
          href="/collection"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-tertiary hover:underline print:hidden"
        >
          <ArrowLeft className="size-3.5" /> Continue Browsing
        </Link>

        <div
          id="receipt"
          className="overflow-hidden rounded-3xl border border-outline-variant/30 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          {/* Status banner */}
          <div
            className={`flex flex-col items-center gap-2 p-8 text-center ${
              confirmed
                ? "bg-emerald-50 dark:bg-emerald-500/10"
                : failed
                  ? "bg-red-50 dark:bg-red-500/10"
                  : "bg-amber-50 dark:bg-amber-500/10"
            }`}
          >
            <span
              className={`grid size-14 place-items-center rounded-full ${
                confirmed
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : failed
                    ? "bg-red-500/15 text-red-600 dark:text-red-400"
                    : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
              }`}
            >
              {confirmed ? (
                <CheckCircle2 className="size-7" />
              ) : failed ? (
                <XCircle className="size-7" />
              ) : (
                <Hourglass className="size-7" />
              )}
            </span>
            <h1 className="font-playfair text-xl font-bold text-secondary dark:text-zinc-100 sm:text-2xl">
              {confirmed
                ? "Payment Confirmed"
                : failed
                  ? "Payment Not Verified"
                  : "Order Received — Pending Verification"}
            </h1>
            <p className="max-w-sm text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
              {confirmed
                ? "Your payment has been verified and your order is confirmed. Thank you!"
                : failed
                  ? "We couldn't verify this payment. Please contact us for assistance."
                  : "Thanks! We've received your order and payment screenshot. Our team typically verifies payments within a few hours."}
            </p>
          </div>

          {/* Order summary */}
          <div className="space-y-5 p-6 sm:p-8">
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>Order Reference</span>
              <span className="font-mono font-semibold text-secondary dark:text-zinc-200">
                {order.order_number}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>Date</span>
              <span className="font-medium text-secondary dark:text-zinc-200">
                {new Date(order.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>Billed To</span>
              <span className="font-medium text-secondary dark:text-zinc-200">{order.client_name}</span>
            </div>

            {items.length > 0 && (
              <div className="space-y-2 border-t border-outline-variant/20 pt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Items
                </span>
                {items.map((it, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {it.title || it.name || "Item"}
                      {it.tier ? ` (${it.tier})` : ""}
                      {Number(it.quantity) > 1 ? ` x${it.quantity}` : ""}
                    </span>
                    <span className="font-mono text-zinc-500 dark:text-zinc-400">
                      {it.price ? PaymentService.formatPKR(it.price * (it.quantity || 1)) : ""}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-1.5 rounded-2xl bg-surface-container-low p-4 dark:bg-zinc-950/60">
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>Total Amount</span>
                <span>{PaymentService.formatPKR(order.total_amount_pkr)}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-secondary dark:text-zinc-100">
                <span>{order.payment_type === "50_percent_advance" ? "Advance Paid" : "Amount Paid"}</span>
                <span>{PaymentService.formatPKR(order.advance_amount_pkr)}</span>
              </div>
              {order.remaining_balance_pkr > 0 && (
                <div className="flex items-center justify-between text-xs text-amber-600 dark:text-amber-400">
                  <span>Remaining Balance</span>
                  <span>{PaymentService.formatPKR(order.remaining_balance_pkr)}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
              <ShieldCheck className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Manually reviewed & confirmed by our team — no card data is ever collected.</span>
            </div>
          </div>
        </div>

        {confirmed && (
          <button
            type="button"
            onClick={() => window.print()}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-on-primary transition-colors hover:bg-tertiary print:hidden"
          >
            <Download className="size-4" />
            Download Receipt (PDF)
          </button>
        )}

        <p className="mt-4 text-center text-[11px] text-zinc-400 print:hidden">
          Bookmark this page to check your payment status anytime.
        </p>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #receipt, #receipt * { visibility: visible; }
          #receipt { position: absolute; left: 0; top: 0; width: 100%; border: none; box-shadow: none; }
        }
      `}</style>
    </div>
  );
}
