"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ShieldCheck,
  Clock,
  Sparkles,
  UploadCloud,
  FileText,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { PaymentService } from "@/lib/payment";
import { ManualPaymentDetails } from "@/components/payment/ManualPaymentDetails";
import { useStore } from "@/hooks/useStore";

import type { CheckoutItem, DirectCheckoutModalProps } from "@/types";

export type { CheckoutItem };

const emptySubscribe = () => () => {};

type Step = "details" | "payment" | "success";

export const DirectCheckoutModal: React.FC<DirectCheckoutModalProps> = ({
  isOpen,
  item,
  onClose,
}) => {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const { addConfirmedOrder } = useStore();
  const router = useRouter();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const screenshotInputRef = React.useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("details");
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    url: string;
    size: number;
    isImage?: boolean;
  } | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [screenshot, setScreenshot] = useState<{ name: string; url: string } | null>(null);
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);
  const [screenshotError, setScreenshotError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Lock background body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Reset local wizard state and notify the parent to close
  const handleClose = React.useCallback(() => {
    setStep("details");
    setName("");
    setEmail("");
    setPhone("");
    setNotes("");
    setAttachedFile(null);
    setScreenshot(null);
    setScreenshotError(null);
    setErrorMsg(null);
    setIsSubmitting(false);
    setConfirmedOrderId(null);
    onClose();
  }, [onClose]);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, handleClose]);

  if (!isClient || !isOpen || !item) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxBytes = 25 * 1024 * 1024;
    if (file.size > maxBytes) {
      setFileError(
        "File exceeds 25MB limit. Please attach a compressed file or PDF.",
      );
      return;
    }

    setFileError(null);
    setIsUploadingFile(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "orders");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Upload failed. Please try again.");
      }

      setAttachedFile({
        name: file.name,
        url: data.url,
        size: data.processedSize || file.size,
        isImage: data.isImage,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setFileError(msg);
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg("Please fill in all required contact fields.");
      return;
    }
    if (isUploadingFile) {
      setErrorMsg("Please wait for your drawing to finish uploading.");
      return;
    }
    setErrorMsg(null);
    setStep("payment");
  };

  const handleConfirmOrder = async () => {
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
          customer: {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
          },
          items: [
            {
              title: item.title,
              price: item.price,
              quantity: 1,
              tier: item.tier,
              plotSize: item.plotSize,
            },
          ],
          paymentType: "full",
          notes: notes.trim() || undefined,
          attachmentUrls: attachedFile?.url ? [attachedFile.url] : [],
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
        title: item.title,
        amountPkr: item.price,
        status: "pending_verification",
        date: new Date().toISOString(),
        customerName: name.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
        items: [{ title: item.title, price: item.price, quantity: 1, tier: item.tier, plotSize: item.plotSize }],
      });

      setConfirmedOrderId(data.orderId);
      setStep("success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Direct order submission error:", msg);
      setErrorMsg(msg || "Failed to process order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <AnimatePresence>
      <div
        data-lenis-prevent
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto overscroll-contain"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !isSubmitting && handleClose()}
          className="fixed inset-0 bg-zinc-950/85 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative z-10 w-full max-w-xl max-h-[90vh] sm:max-h-[86vh] bg-white dark:bg-zinc-950 border border-outline-variant/30 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col font-inter my-auto"
        >
          {/* Header */}
          <div className="shrink-0 p-5 sm:p-6 border-b border-outline-variant/20 dark:border-zinc-800/80 flex justify-between items-center bg-surface-container-low dark:bg-zinc-900/70">
            <div>
              <span className="text-[10px] font-inter font-bold uppercase tracking-widest text-tertiary block">
                {step === "success" ? "Order Submitted" : "Direct Order"}
              </span>
              <h3 className="font-playfair text-lg md:text-xl font-bold text-secondary dark:text-zinc-100 mt-0.5">
                {step === "payment" ? "Complete Payment" : "Acquire Architectural Package"}
              </h3>
            </div>
            <button
              onClick={() => !isSubmitting && handleClose()}
              disabled={isSubmitting}
              className="p-2 rounded-full hover:bg-surface-container dark:hover:bg-zinc-800 text-secondary dark:text-zinc-400 transition-colors cursor-pointer disabled:opacity-50"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body Container */}
          <div
            data-lenis-prevent
            className="overflow-y-auto overscroll-contain flex-1 min-h-0 p-5 sm:p-6 space-y-6 touch-pan-y"
          >
            {step === "success" ? (
              <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                <span className="grid size-16 place-items-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-8" />
                </span>
                <h4 className="font-playfair text-xl font-bold text-secondary dark:text-zinc-100">
                  Thank you, {name.trim().split(" ")[0]}!
                </h4>
                <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
                  We&apos;ve received your order and payment screenshot. Our team will verify it and confirm your
                  order shortly by email or phone.
                </p>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  {confirmedOrderId && (
                    <button
                      type="button"
                      onClick={() => {
                        const orderId = confirmedOrderId;
                        handleClose();
                        router.push(`/orders/${orderId}`);
                      }}
                      className="rounded-xl border border-tertiary px-6 py-3 text-xs font-bold uppercase tracking-widest text-tertiary transition-colors hover:bg-tertiary/10 cursor-pointer"
                    >
                      View Status & Receipt
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-xl bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest text-on-primary transition-colors hover:bg-tertiary cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Selected Package Banner */}
                <div className="flex gap-4 p-4 rounded-2xl bg-surface-container-low dark:bg-zinc-900 border border-outline-variant/25 dark:border-zinc-800/80 items-center">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-outline-variant/20 bg-zinc-800">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex-grow space-y-1">
                    <div className="flex items-center gap-2">
                      {item.tier && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-tertiary/15 text-tertiary font-semibold uppercase tracking-wider">
                          {item.tier}
                        </span>
                      )}
                      {item.plotSize && (
                        <span className="text-[10px] text-zinc-500 font-medium">{item.plotSize}</span>
                      )}
                    </div>
                    <h4 className="font-playfair text-base font-bold text-secondary dark:text-zinc-100 leading-snug">
                      {item.title}
                    </h4>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-tertiary font-montserrat font-bold text-base">
                        {PaymentService.formatPKR(item.price)}
                      </span>
                      {item.deliveryTime && (
                        <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.deliveryTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-medium">
                    {errorMsg}
                  </div>
                )}

                {step === "details" ? (
                  <form id="direct-checkout-form" onSubmit={handleContinueToPayment} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Tariq Mehmood"
                        className="w-full bg-white dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-tertiary transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="tariq@example.com"
                          className="w-full bg-white dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-tertiary transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
                          Contact / Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+92 300 1234567"
                          className="w-full bg-white dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-tertiary transition-colors"
                        />
                      </div>
                    </div>

                    {/* Attach Blueprint or Site Drawing */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
                          Attach Blueprint or Plot Photo (Optional)
                        </label>
                        <span className="text-[10px] text-tertiary font-mono">JPG, PNG, WebP (Sharp) or PDF</span>
                      </div>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".jpg,.jpeg,.png,.webp,.pdf"
                        className="hidden"
                      />

                      {isUploadingFile ? (
                        <div className="border border-dashed border-tertiary/60 bg-tertiary/5 rounded-xl p-4 text-center">
                          <Loader2 className="w-5 h-5 text-tertiary animate-spin mx-auto mb-2" />
                          <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                            Resizing with Sharp &amp; Uploading to Supabase...
                          </p>
                          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                            Optimizing blueprint / image for fast architect review.
                          </p>
                        </div>
                      ) : !attachedFile ? (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className={`border border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                            fileError
                              ? "border-red-500/70 bg-red-500/5"
                              : "border-outline-variant/40 hover:border-tertiary bg-white dark:bg-zinc-900/50 hover:bg-tertiary/5"
                          }`}
                        >
                          <UploadCloud className="w-5 h-5 text-tertiary mx-auto mb-1.5" />
                          <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                            Click to attach architectural drawings or plot site photo
                          </p>
                          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                            Max 25MB • Formats: PDF, JPG, PNG, WebP
                          </p>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-tertiary/40 flex items-center justify-between">
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <FileText className="w-5 h-5 text-tertiary shrink-0" />
                            <div className="overflow-hidden">
                              <div className="flex items-center gap-1.5">
                                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
                                  {attachedFile.name}
                                </p>
                                <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded-sm border border-emerald-500/20 shrink-0">
                                  Supabase Storage
                                </span>
                              </div>
                              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                                {(attachedFile.size / (1024 * 1024)).toFixed(2)} MB • Sharp-optimized
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="p-1.5 hover:bg-red-500/10 text-zinc-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {fileError && (
                        <span className="text-[11px] text-red-500 font-medium block mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {fileError}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
                        Project Notes or Plot Location (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Plot number, city, or special design instructions..."
                        className="w-full bg-white dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-tertiary transition-colors resize-none"
                      />
                    </div>
                  </form>
                ) : (
                  <div className="space-y-5">
                    <button
                      type="button"
                      onClick={() => setStep("details")}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-tertiary hover:underline cursor-pointer"
                    >
                      <ArrowLeft className="size-3.5" /> Back to details
                    </button>

                    <ManualPaymentDetails amountLabel={PaymentService.formatPKR(item.price)} />

                    <div className="space-y-1.5">
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
                              : "border-outline-variant/40 bg-white hover:border-tertiary hover:bg-tertiary/5 dark:bg-zinc-900/50"
                          }`}
                        >
                          <UploadCloud className="mx-auto mb-1.5 size-5 text-tertiary" />
                          <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                            Click to upload your payment screenshot
                          </p>
                          <p className="mt-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">Max 25MB • JPG, PNG, WebP</p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between rounded-xl border border-tertiary/40 bg-white p-3 dark:bg-zinc-900">
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <FileText className="size-5 shrink-0 text-tertiary" />
                            <p className="truncate text-xs font-bold text-zinc-800 dark:text-zinc-200">
                              {screenshot.name}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setScreenshot(null);
                              if (screenshotInputRef.current) screenshotInputRef.current.value = "";
                            }}
                            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-500 cursor-pointer"
                          >
                            <X className="size-4" />
                          </button>
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
                )}
              </>
            )}
          </div>

          {/* Footer CTA */}
          {step !== "success" && (
            <div className="shrink-0 p-5 sm:p-6 border-t border-outline-variant/20 dark:border-zinc-800 bg-surface-container-low dark:bg-zinc-900/90 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Total Payable</span>
                <span className="font-montserrat font-extrabold text-xl text-secondary dark:text-zinc-100">
                  {PaymentService.formatPKR(item.price)}
                </span>
              </div>

              {step === "details" ? (
                <button
                  type="submit"
                  form="direct-checkout-form"
                  className="w-full bg-primary hover:bg-tertiary text-on-primary py-4 font-bold tracking-widest text-xs uppercase rounded-xl transition-all duration-300 shadow-xl active:scale-95 cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  <span>Continue to Payment</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmOrder}
                  disabled={isSubmitting || !screenshot}
                  className="w-full bg-primary hover:bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed text-on-primary py-4 font-bold tracking-widest text-xs uppercase rounded-xl transition-all duration-300 shadow-xl active:scale-95 cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin text-tertiary" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Confirm Order</span>
                  )}
                </button>
              )}

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Manually reviewed &amp; confirmed by our team</span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
