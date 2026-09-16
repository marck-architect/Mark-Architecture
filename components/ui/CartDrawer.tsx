"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ShoppingBag,
  X,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  ArrowRight,
  Clock,
  UploadCloud,
  FileText,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { SafepayService } from "@/lib/safepay";
import Image from "next/image";

export const CartDrawer: React.FC = () => {
  const {
    cartDrawerOpen,
    setCartDrawerOpen,
    cart,
    changeQuantity,
    removeFromCart,
    clearCart,
  } = useStore();

  React.useEffect(() => {
    if (!cartDrawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [cartDrawerOpen]);

  const [step, setStep] = React.useState<"cart" | "checkout">("cart");
  const [customerName, setCustomerName] = React.useState("");
  const [customerEmail, setCustomerEmail] = React.useState("");
  const [customerPhone, setCustomerPhone] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile] = React.useState<{
    name: string;
    url: string;
    size: number;
    isImage?: boolean;
  } | null>(null);
  const [isUploadingFile, setIsUploadingFile] = React.useState(false);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const pkrSubtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const isAdvanceOrder = cart.some(
    (item) =>
      item.title.toLowerCase().includes("50% advance") ||
      item.title.toLowerCase().includes("advance"),
  );

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

  const handleProceedToDetails = () => {
    if (cart.length === 0) return;
    setErrorMsg(null);
    setStep("checkout");
  };

  const handleSafepayCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !customerName.trim() ||
      !customerEmail.trim() ||
      !customerPhone.trim()
    ) {
      setErrorMsg("Please fill in all contact fields to proceed.");
      return;
    }

    if (isUploadingFile) {
      setErrorMsg("Please wait for your drawing to finish uploading.");
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
            name: customerName.trim(),
            email: customerEmail.trim(),
            phone: customerPhone.trim(),
          },
          items: cart,
          paymentType: isAdvanceOrder ? "50_percent_advance" : "full",
          attachmentUrls: attachedFile?.url ? [attachedFile.url] : [],
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.checkoutUrl) {
        throw new Error(data.error || "Failed to initialize Safepay session.");
      }

      // Clear cart and forward to Safepay
      clearCart();
      setAttachedFile(null);
      setCartDrawerOpen(false);
      setStep("cart");
      window.location.assign(data.checkoutUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Safepay cart checkout error:", msg);
      setErrorMsg(msg || "Checkout failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartDrawerOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Wrapper */}
          <div className="absolute inset-y-0 right-0 max-w-full min-w-0 flex">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
              role="dialog"
              aria-modal="true"
              aria-label="Shopping cart"
              className="w-[min(100vw,28rem)] max-w-full min-w-0 bg-white dark:bg-zinc-950 border-l border-outline-variant/35 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low dark:bg-zinc-900">
                <h3 className="font-playfair text-lg sm:text-xl font-bold text-secondary dark:text-white flex items-center gap-2 truncate">
                  <ShoppingBag className="text-tertiary w-5 h-5 shrink-0" />
                  <span className="truncate">
                    Selected Packages &amp; Orders
                  </span>
                </h3>
                <button
                  onClick={() => setCartDrawerOpen(false)}
                  className="p-2 rounded-full hover:bg-surface-container dark:hover:bg-zinc-800 transition-colors focus:outline-none cursor-pointer shrink-0 ml-2"
                  aria-label="Close Cart"
                >
                  <X className="text-secondary dark:text-zinc-400 w-5 h-5" />
                </button>
              </div>

              {/* Cart Items List or Checkout Form */}
              <div
                data-lenis-prevent
                className="flex-grow overflow-y-auto overscroll-contain min-h-0 p-4 sm:p-6 space-y-4 touch-pan-y"
              >
                {step === "checkout" ? (
                  <form
                    id="cart-checkout-form"
                    onSubmit={handleSafepayCheckout}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                      <span className="font-playfair text-sm font-bold text-secondary dark:text-zinc-200">
                        Client Contact Details
                      </span>
                      <button
                        type="button"
                        onClick={() => setStep("cart")}
                        className="text-xs text-tertiary hover:underline font-medium cursor-pointer"
                      >
                        ← Back to items
                      </button>
                    </div>

                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      Required by Safepay to issue your digital payment receipt
                      and studio booking credentials.
                    </p>

                    {errorMsg && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-medium">
                        {errorMsg}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Tariq Mehmood"
                        className="w-full bg-surface dark:bg-zinc-900 border border-outline-variant/50 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-tertiary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="tariq@example.com"
                        className="w-full bg-surface dark:bg-zinc-900 border border-outline-variant/50 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-tertiary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                        Contact / Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+92 300 1234567"
                        className="w-full bg-surface dark:bg-zinc-900 border border-outline-variant/50 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-tertiary"
                      />
                    </div>

                    {/* Attach Blueprint or Site Drawing */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
                          Attach Blueprint / Site Photo (Optional)
                        </label>
                        <span className="text-[10px] text-tertiary font-mono">
                          JPG, PNG, WebP (Sharp) or PDF
                        </span>
                      </div>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".jpg,.jpeg,.png,.webp,.pdf"
                        className="hidden"
                      />

                      {isUploadingFile ? (
                        <div className="border border-dashed border-tertiary/60 bg-tertiary/5 rounded-xl p-3.5 text-center">
                          <Loader2 className="w-5 h-5 text-tertiary animate-spin mx-auto mb-1.5" />
                          <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                            Resizing with Sharp &amp; Uploading to Supabase...
                          </p>
                          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                            Compressing blueprint for instant studio review.
                          </p>
                        </div>
                      ) : !attachedFile ? (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className={`border border-dashed rounded-xl p-3.5 text-center cursor-pointer transition-all ${
                            fileError
                              ? "border-red-500/70 bg-red-500/5"
                              : "border-outline-variant/50 hover:border-tertiary bg-surface dark:bg-zinc-900/50 hover:bg-tertiary/5"
                          }`}
                        >
                          <UploadCloud className="w-5 h-5 text-tertiary mx-auto mb-1" />
                          <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                            Click to attach drawings or site photo
                          </p>
                          <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                            Max 25MB • Formats: PDF, JPG, PNG, WebP
                          </p>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-surface dark:bg-zinc-900 border border-tertiary/40 flex items-center justify-between">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="w-5 h-5 text-tertiary shrink-0" />
                            <div className="overflow-hidden">
                              <div className="flex items-center gap-1.5">
                                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
                                  {attachedFile.name}
                                </p>
                                <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.2 rounded-sm border border-emerald-500/20 shrink-0">
                                  Supabase Storage
                                </span>
                              </div>
                              <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                                {(attachedFile.size / (1024 * 1024)).toFixed(2)}{" "}
                                MB • Sharp-optimized
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="p-1 hover:bg-red-500/10 text-zinc-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
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

                    {/* Summary Chip */}
                    <div className="p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-outline-variant/30 space-y-1.5 text-xs">
                      <div className="flex justify-between text-zinc-500">
                        <span>Items in Order</span>
                        <span>{cart.length} package(s)</span>
                      </div>
                      <div className="flex justify-between font-bold text-secondary dark:text-zinc-100">
                        <span>Payable via Safepay</span>
                        <span className="text-tertiary">
                          {SafepayService.formatPKR(pkrSubtotal)}
                        </span>
                      </div>
                    </div>
                  </form>
                ) : cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-on-surface-variant space-y-4">
                    <ShoppingBag className="w-12 h-12 text-outline-variant" />
                    <p className="font-playfair text-lg font-medium text-zinc-800 dark:text-zinc-200">
                      Your order is empty
                    </p>
                    <p className="text-xs max-w-xs font-light text-zinc-500">
                      Choose an architectural review, 3D elevation, or custom
                      design package to begin.
                    </p>
                    <button
                      onClick={() => setCartDrawerOpen(false)}
                      className="text-xs uppercase tracking-widest font-bold text-tertiary hover:underline pt-2 cursor-pointer"
                    >
                      Browse Architecture Catalog
                    </button>
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <div
                      key={`${item.title}-${item.tier}-${item.plotSize}-${index}`}
                      className="flex gap-4 p-4 bg-surface-container-low dark:bg-zinc-900/50 border border-outline-variant/30 rounded-xl relative group"
                    >
                      <div className="relative w-20 h-20 rounded-lg bg-surface-container overflow-hidden flex-shrink-0">
                        <Image
                          fill
                          src={item.image}
                          alt={item.title}
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow space-y-1 flex flex-col justify-center">
                        <h4 className="font-playfair text-sm font-bold text-secondary dark:text-zinc-200">
                          {item.title}
                        </h4>
                        {(item.tier || item.plotSize) && (
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-inter">
                            {item.tier && (
                              <span className="font-medium text-tertiary">
                                {item.tier}
                              </span>
                            )}
                            {item.tier && item.plotSize && " • "}
                            {item.plotSize && <span>{item.plotSize}</span>}
                          </p>
                        )}
                        <p className="text-tertiary font-montserrat font-semibold text-xs">
                          {SafepayService.formatPKR(item.price)}
                        </p>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-2.5 pt-2">
                          <button
                            onClick={() => changeQuantity(index, -1)}
                            className="w-6 h-6 border border-outline/30 hover:border-tertiary flex items-center justify-center rounded text-xs transition-colors dark:border-zinc-700 dark:text-zinc-300 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-montserrat text-xs font-semibold text-secondary dark:text-zinc-300">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => changeQuantity(index, 1)}
                            className="w-6 h-6 border border-outline/30 hover:border-tertiary flex items-center justify-center rounded text-xs transition-colors dark:border-zinc-700 dark:text-zinc-300 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="absolute top-2 right-2 text-outline-variant hover:text-red-700 transition-colors p-1 cursor-pointer"
                        aria-label="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Checkout Footer */}
              {cart.length > 0 && (
                <div className="p-4 sm:p-6 border-t border-outline-variant/30 bg-surface-container-low dark:bg-zinc-900 space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-inter text-xs sm:text-sm text-on-surface-variant font-medium dark:text-zinc-400">
                      Total Payable (PKR)
                    </span>
                    <span className="font-montserrat text-lg sm:text-xl font-bold text-secondary dark:text-zinc-100">
                      {SafepayService.formatPKR(pkrSubtotal)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/60 p-2 sm:p-2.5 rounded-lg">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>
                      Secured with Safepay Pakistan payment gateway. Instant
                      receipt issued.
                    </span>
                  </div>

                  {step === "checkout" ? (
                    <button
                      type="submit"
                      form="cart-checkout-form"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed text-on-primary py-3.5 sm:py-4 font-bold tracking-wider sm:tracking-widest text-xs uppercase rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer text-center flex items-center justify-center gap-2 min-h-[48px]"
                    >
                      {isSubmitting ? (
                        <>
                          <Clock className="w-4 h-4 animate-spin text-tertiary" />
                          <span>CONNECTING SAFEPAY...</span>
                        </>
                      ) : (
                        <>
                          <span>
                            PAY {SafepayService.formatPKR(pkrSubtotal)} VIA
                            SAFEPAY
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleProceedToDetails}
                      className="w-full bg-primary hover:bg-tertiary text-on-primary py-3.5 sm:py-4 font-bold tracking-wider sm:tracking-widest text-xs uppercase rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer text-center flex items-center justify-center gap-2 min-h-[48px]"
                    >
                      <span>PROCEED TO CHECKOUT</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
