"use client";

import React from "react";
import Image from "next/image";
import { Copy, Check, Landmark, Smartphone } from "lucide-react";

interface CopyFieldProps {
  label: string;
  value: string;
  fieldKey: string;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
}

const CopyField: React.FC<CopyFieldProps> = ({ label, value, fieldKey, copiedKey, onCopy }) => (
  <div className="flex items-center justify-between gap-3 py-1.5">
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="truncate font-mono text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">{value}</p>
    </div>
    <button
      type="button"
      onClick={() => onCopy(value, fieldKey)}
      className="shrink-0 grid size-8 place-items-center rounded-lg border border-outline-variant/30 text-zinc-500 transition-colors hover:border-tertiary hover:text-tertiary cursor-pointer dark:border-zinc-700"
      aria-label={`Copy ${label}`}
    >
      {copiedKey === fieldKey ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
    </button>
  </div>
);

interface ManualPaymentDetailsProps {
  amountLabel: string;
}

/**
 * Shared manual-payment instructions panel (bank transfer + JazzCash) shown
 * at checkout in place of a hosted payment-gateway redirect. The customer
 * pays via either method, then uploads a screenshot as proof — reviewed and
 * confirmed from the admin panel.
 */
export const ManualPaymentDetails: React.FC<ManualPaymentDetailsProps> = ({ amountLabel }) => {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-tertiary/30 bg-tertiary/5 p-4 text-center">
        <p className="text-[11px] font-bold uppercase tracking-wider text-tertiary">Amount Payable</p>
        <p className="font-montserrat text-2xl font-extrabold text-secondary dark:text-zinc-100">{amountLabel}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Askari Bank */}
        <div className="rounded-2xl border border-outline-variant/30 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="mb-3 flex items-center gap-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-tertiary/10 text-tertiary">
              <Landmark className="size-4" />
            </span>
            <span className="text-sm font-bold text-secondary dark:text-zinc-100">Askari Bank</span>
          </div>
          <div className="relative mx-auto mb-3 aspect-[480/458] w-full max-w-[200px] overflow-hidden rounded-xl border border-outline-variant/20 bg-white">
            <Image
              src="/images/payment/askari-bank-qr.png"
              alt="Askari Bank payment QR code for MARK Architects"
              fill
              sizes="200px"
              className="object-contain"
            />
          </div>
          <div className="divide-y divide-outline-variant/15 dark:divide-zinc-800">
            <CopyField
              label="Account Title"
              value="Mark Architects"
              fieldKey="ab-title"
              copiedKey={copiedKey}
              onCopy={handleCopy}
            />
            <CopyField
              label="IBAN"
              value="PK16ASCM0007550200010044"
              fieldKey="ab-iban"
              copiedKey={copiedKey}
              onCopy={handleCopy}
            />
          </div>
        </div>

        {/* JazzCash */}
        <div className="rounded-2xl border border-outline-variant/30 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="mb-3 flex items-center gap-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-tertiary/10 text-tertiary">
              <Smartphone className="size-4" />
            </span>
            <span className="text-sm font-bold text-secondary dark:text-zinc-100">JazzCash</span>
          </div>
          <div className="relative mx-auto mb-3 aspect-[560/266] w-full max-w-[220px] overflow-hidden rounded-xl border border-outline-variant/20 bg-white">
            <Image
              src="/images/payment/jazzcash-qr.png"
              alt="JazzCash payment QR code for Muhammad Arslan"
              fill
              sizes="220px"
              className="object-contain"
            />
          </div>
          <div className="divide-y divide-outline-variant/15 dark:divide-zinc-800">
            <CopyField
              label="Account Title"
              value="Muhammad Arslan"
              fieldKey="jc-title"
              copiedKey={copiedKey}
              onCopy={handleCopy}
            />
            <CopyField
              label="JazzCash Number"
              value="0344 9240884"
              fieldKey="jc-number"
              copiedKey={copiedKey}
              onCopy={handleCopy}
            />
          </div>
        </div>
      </div>

      <p className="text-center text-[11.5px] leading-relaxed text-zinc-500 dark:text-zinc-400">
        Scan a QR code or transfer manually using the details above, then upload a screenshot of your payment
        confirmation below. Our team verifies every payment and confirms your booking shortly after.
      </p>
    </div>
  );
};

export default ManualPaymentDetails;
