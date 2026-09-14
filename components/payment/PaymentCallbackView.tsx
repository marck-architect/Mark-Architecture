"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  AlertCircle,
  Copy,
  ExternalLink,
} from "lucide-react";

function PaymentCallbackContent() {
  const searchParams = useSearchParams();

  const tracker = searchParams.get("tracker") || "";
  const orderId = searchParams.get("orderId") || "";
  const type = searchParams.get("type") || "consultation";
  const isSimulated = searchParams.get("simulated") === "true";

  const [isVerifying, setIsVerifying] = useState(Boolean(tracker));
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(
    tracker ? null : "No payment tracker reference received from Safepay.",
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!tracker) return;

    let isMounted = true;

    async function verifyPayment() {
      try {
        const res = await fetch(
          `/api/payment/verify?tracker=${encodeURIComponent(tracker)}&orderId=${encodeURIComponent(orderId)}&type=${encodeURIComponent(type)}`,
        );
        const data = await res.json();

        if (isMounted) {
          if (data.isPaid || data.success) {
            setIsSuccess(true);
          } else {
            setErrorMsg(
              data.error ||
                "Payment could not be verified yet. Our team will verify it manually.",
            );
          }
          setIsVerifying(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Verification fetch error:", err);
          // If in simulated or offline mode, still render success for seamless developer testing
          if (isSimulated) {
            setIsSuccess(true);
          } else {
            setErrorMsg("Network error verifying transaction with Safepay.");
          }
          setIsVerifying(false);
        }
      }
    }

    verifyPayment();

    return () => {
      isMounted = false;
    };
  }, [tracker, orderId, type, isSimulated]);

  const handleCopyTracker = () => {
    if (!tracker) return;
    navigator.clipboard.writeText(tracker);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello MARK Architects! I have completed my payment via Safepay.\n\n` +
      `Reference / Order ID: ${orderId}\n` +
      `Safepay Tracker: ${tracker}\n\n` +
      `Please confirm receipt and dispatch meeting coordinates.`,
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 py-16 relative overflow-hidden font-inter">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-tertiary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
        {/* Sandbox Notice Banner */}
        {isSimulated && (
          <div className="mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 font-bold uppercase text-[10px] tracking-wider">
              Sandbox Mode
            </span>
            <span>
              This transaction was processed in Safepay Developer Test Mode.
            </span>
          </div>
        )}

        <div className="bg-zinc-900/90 border border-zinc-800 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl space-y-8">
          {/* Header Status */}
          <div className="text-center space-y-3">
            {isVerifying ? (
              <div className="w-16 h-16 rounded-full bg-tertiary/10 border border-tertiary/30 text-tertiary flex items-center justify-center mx-auto animate-pulse">
                <Clock className="w-8 h-8 animate-spin" />
              </div>
            ) : isSuccess ? (
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
            )}

            <div>
              <p className="text-xs uppercase font-bold tracking-widest text-zinc-400">
                MARK Architects Atelier
              </p>
              <h1 className="font-playfair text-2xl md:text-3xl font-bold text-zinc-100 mt-1">
                {isVerifying
                  ? "Verifying Safepay Transaction..."
                  : isSuccess
                    ? "Payment Successfully Processed"
                    : "Payment Attention Required"}
              </h1>
            </div>

            <p className="text-xs md:text-sm text-zinc-400 font-light max-w-md mx-auto leading-relaxed">
              {isVerifying
                ? "Connecting with Safepay gateway to confirm cryptographic transaction receipt..."
                : isSuccess
                  ? "Your transaction has been authenticated by Safepay. A confirmation email and project intake receipt have been generated."
                  : errorMsg}
            </p>
          </div>

          {/* Details Box */}
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-5 space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-800/60">
              <span className="text-zinc-500">Transaction Status</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded-full ${
                  isSuccess
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {isVerifying
                  ? "Verifying"
                  : isSuccess
                    ? "Completed"
                    : "Pending"}
              </span>
            </div>

            {orderId && (
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800/60">
                <span className="text-zinc-500">Reference Number</span>
                <span className="font-mono text-zinc-200 font-medium">
                  {orderId}
                </span>
              </div>
            )}

            {tracker && (
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">Safepay Tracker</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-tertiary">
                    {tracker.length > 20
                      ? `${tracker.slice(0, 16)}...`
                      : tracker}
                  </span>
                  <button
                    onClick={handleCopyTracker}
                    className="text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                    title="Copy Tracker"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {copied && (
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      Copied
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <a
              href={`https://wa.me/923001234567?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Notify Principal Architect on WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="flex items-center gap-3">
              <Link
                href="/consultation"
                className="flex-1 py-3 px-4 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-medium text-center transition-all"
              >
                Schedule Another Call
              </Link>

              <Link
                href="/"
                className="flex-1 py-3 px-4 rounded-xl bg-tertiary hover:bg-tertiary-hover text-zinc-950 text-xs font-bold text-center flex items-center justify-center gap-2 transition-all"
              >
                <span>Return to Atelier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 pt-2 border-t border-zinc-800/40">
            <ShieldCheck className="w-4 h-4 text-emerald-500/80" />
            <span>Secured by Safepay Pakistan • 256-Bit SSL Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const PaymentCallbackView: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
          <Clock className="w-6 h-6 animate-spin text-tertiary" />
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
};
