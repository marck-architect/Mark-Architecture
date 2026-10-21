"use client";

import React, { useState, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  UploadCloud,
  FileText,
  Loader2,
  AlertTriangle,
  Clock,
  ShoppingBag,
} from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { PaymentService } from "@/lib/payment";
import { ManualPaymentDetails } from "@/components/payment/ManualPaymentDetails";

const emptySubscribe = () => () => {};

export default function CheckoutPage() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const router = useRouter();
  const { cart, clearCart, addConfirmedOrder, showToast } = useStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [screenshot, setScreenshot] = useState<{ name: string; url: string } | null>(null);
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);
  const [screenshotError, setScreenshotError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const screenshotInputRef = useRef<HTMLInputElement>(null);

  const pkrSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isAdvanceOrder = cart.some(
    (item) =>
      item.title.toLowerCase().includes("50% advance") || item.title.toLowerCase().includes("advance"),
  );
  const chargedAmount = isAdvanceOrder ? Math.round(pkrSubtotal * 0.5) : pkrSubtotal;

  if (!isClient) return null;

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 pt-[4.5rem] text-center px-4">
        <ShoppingBag className="size-10 text-zinc-300" />
        <h1 className="font-playfair text-xl font-bold text-secondary dark:text-zinc-100">
          Your cart is empty
        </h1>
        <Link
          href="/collection"
          className="text-sm font-semibold text-tertiary hover:underline"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxBytes = 25 * 1024 * 1024;
    if (file.size > maxBytes) {
      setScreenshotError("File exceeds 25MB limit.");
      return;
    }

    setScreenshotError(null);
    setIsUploadingScreenshot(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "payment-proofs");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Upload failed. Please try again.");
      }

      setScreenshot({ name: file.name, url: data.url });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setScreenshotError(msg);
    } finally {
      setIsUploadingScreenshot(false);
    }
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg("Please fill in all contact fields.");
      return;
    }
    if (!screenshot) {
      setScreenshotError("Please upload a screenshot of your payment before confirming.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/checkout/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: name.trim(), email: email.trim(), phone: phone.trim() },
          items: cart,
          paymentType: isAdvanceOrder ? "50_percent_advance" : "full",
          attachmentUrls: [],
          paymentScreenshotUrl: screenshot.url,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit order.");
      }

      addConfirmedOrder({
        id: data.orderId,
        type: "order",
        referenceNumber: data.orderNumber,
        title: cart.length === 1 ? cart[0].title : `${cart.length} Packages`,
        amountPkr: data.chargedAmount,
        status: "pending_verification",
        date: new Date().toISOString(),
        customerName: name.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
        items: cart.map((i) => ({
          title: i.title,
          price: i.price,
          quantity: i.quantity,
          tier: i.tier,
          plotSize: i.plotSize,
        })),
      });

      clearCart();
      showToast?.("Order submitted! We'll verify your payment shortly.", "success");
      router.push(`/orders/${data.orderId}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg || "Checkout failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-low pt-[4.5rem] pb-20 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Link
          href="/collection"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-tertiary hover:underline"
        >
          <ArrowLeft className="size-3.5" /> Back to Products
        </Link>

        <h1 className="font-playfair text-2xl font-bold text-secondary dark:text-zinc-100 sm:text-3xl">
          Checkout
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Review your order, pay via bank transfer or JazzCash, then upload a screenshot to confirm.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Order summary with product images */}
          <div className="lg:col-span-2 lg:order-2">
            <div className="rounded-2xl border border-outline-variant/30 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 lg:sticky lg:top-24">
              <h2 className="mb-4 font-playfair text-sm font-bold text-secondary dark:text-zinc-100">
                Order Summary
              </h2>
              <div className="space-y-3">
                {cart.map((item, index) => (
                  <div key={`${item.title}-${index}`} className="flex gap-3">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-surface-container">
                      <Image src={item.image} alt={item.title} fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-xs font-semibold text-secondary dark:text-zinc-200">{item.title}</p>
                      {(item.tier || item.plotSize) && (
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                          {[item.tier, item.plotSize].filter(Boolean).join(" • ")}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-zinc-500 dark:text-zinc-400">Qty {item.quantity}</span>
                        <span className="font-mono font-semibold text-tertiary">
                          {PaymentService.formatPKR(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-1.5 border-t border-outline-variant/20 pt-4 text-xs">
                <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
                  <span>Subtotal</span>
                  <span>{PaymentService.formatPKR(pkrSubtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-secondary dark:text-zinc-100">
                  <span>{isAdvanceOrder ? "Due Now (50%)" : "Total Payable"}</span>
                  <span>{PaymentService.formatPKR(chargedAmount)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                <ShieldCheck className="size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>Manually reviewed & confirmed by our team.</span>
              </div>
            </div>
          </div>

          {/* Contact + payment form */}
          <div className="lg:col-span-3 lg:order-1">
            <form onSubmit={handleConfirmOrder} className="space-y-6">
              {errorMsg && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-medium text-red-500">
                  {errorMsg}
                </div>
              )}

              <div className="rounded-2xl border border-outline-variant/30 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="mb-4 font-playfair text-sm font-bold text-secondary dark:text-zinc-100">
                  Contact Details
                </h2>
                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name *"
                    className="w-full rounded-xl border border-outline-variant/40 bg-white px-3.5 py-2.5 text-xs text-zinc-900 focus:border-tertiary focus:outline-none dark:bg-zinc-950 dark:text-zinc-100 dark:border-zinc-800"
                  />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address *"
                      className="w-full rounded-xl border border-outline-variant/40 bg-white px-3.5 py-2.5 text-xs text-zinc-900 focus:border-tertiary focus:outline-none dark:bg-zinc-950 dark:text-zinc-100 dark:border-zinc-800"
                    />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone Number *"
                      className="w-full rounded-xl border border-outline-variant/40 bg-white px-3.5 py-2.5 text-xs text-zinc-900 focus:border-tertiary focus:outline-none dark:bg-zinc-950 dark:text-zinc-100 dark:border-zinc-800"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-outline-variant/30 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="mb-4 font-playfair text-sm font-bold text-secondary dark:text-zinc-100">
                  Payment
                </h2>
                <ManualPaymentDetails amountLabel={PaymentService.formatPKR(chargedAmount)} />

                <div className="mt-5 space-y-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Upload Payment Screenshot *
                  </label>
                  <input
                    type="file"
                    ref={screenshotInputRef}
                    onChange={handleScreenshotUpload}
                    accept=".jpg,.jpeg,.png,.webp"
                    className="hidden"
                  />
                  {isUploadingScreenshot ? (
                    <div className="rounded-xl border border-dashed border-tertiary/60 bg-tertiary/5 p-4 text-center">
                      <Loader2 className="mx-auto mb-2 size-5 animate-spin text-tertiary" />
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Uploading screenshot...</p>
                    </div>
                  ) : !screenshot ? (
                    <div
                      onClick={() => screenshotInputRef.current?.click()}
                      className={`cursor-pointer rounded-xl border border-dashed p-4 text-center transition-all ${
                        screenshotError
                          ? "border-red-500/70 bg-red-500/5"
                          : "border-outline-variant/40 hover:border-tertiary bg-white dark:bg-zinc-950/50 hover:bg-tertiary/5"
                      }`}
                    >
                      <UploadCloud className="mx-auto mb-1.5 size-5 text-tertiary" />
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        Click to upload your payment screenshot
                      </p>
                      <p className="mt-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">Max 25MB • JPG, PNG, WebP</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between rounded-xl border border-tertiary/40 bg-white p-3 dark:bg-zinc-950">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <FileText className="size-5 shrink-0 text-tertiary" />
                        <p className="truncate text-xs font-bold text-zinc-800 dark:text-zinc-200">
                          {screenshot.name}
                        </p>
                      </div>
                    </div>
                  )}
                  {screenshotError && (
                    <span className="mt-1 flex items-center gap-1 text-[11px] font-medium text-red-500">
                      <AlertTriangle className="size-3.5" />
                      {screenshotError}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-primary transition-colors hover:bg-tertiary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="size-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Confirm Order — {PaymentService.formatPKR(chargedAmount)}</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
