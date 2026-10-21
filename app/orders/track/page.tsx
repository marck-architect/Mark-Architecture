"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";

export default function TrackOrderPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !contact.trim()) {
      setError("Please enter both your order number and email or phone.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber: orderNumber.trim(), contact: contact.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "No order found with those details.");
      }
      router.push(`/orders/${data.orderId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No order found with those details.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-container-low px-4 pt-[4.5rem] pb-20 dark:bg-zinc-950">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-tertiary hover:underline"
        >
          <ArrowLeft className="size-3.5" /> Back to Home
        </Link>

        <div className="rounded-3xl border border-outline-variant/30 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
          <h1 className="font-playfair text-xl font-bold text-secondary dark:text-zinc-100">
            Track Your Order
          </h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Lost your confirmation email or link? Find your order status and receipt here.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-medium text-red-500">
                <AlertTriangle className="size-3.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Order Number
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="ORD-123456-789"
                className="w-full rounded-xl border border-outline-variant/40 bg-white px-3.5 py-2.5 text-xs text-zinc-900 focus:border-tertiary focus:outline-none dark:bg-zinc-950 dark:text-zinc-100 dark:border-zinc-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Email or Phone Used at Checkout
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="you@example.com or 0300 1234567"
                className="w-full rounded-xl border border-outline-variant/40 bg-white px-3.5 py-2.5 text-xs text-zinc-900 focus:border-tertiary focus:outline-none dark:bg-zinc-950 dark:text-zinc-100 dark:border-zinc-800"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-on-primary transition-colors hover:bg-tertiary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <Search className="size-4" />
                  <span>Find My Order</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
