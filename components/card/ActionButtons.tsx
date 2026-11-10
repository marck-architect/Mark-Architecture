"use client";

import { ArrowDownCircle, ArrowRightCircle } from "lucide-react";
import { profile } from "./profile.config";
import { buildVCard, downloadVCard } from "./vcard";
import { useToast } from "./Toast";

const base =
  "inline-flex w-full items-center justify-center gap-1 whitespace-nowrap rounded-md px-1.5 py-2 text-[11px] sm:gap-1.5 sm:text-xs font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-75 cursor-pointer";

export function ActionButtons() {
  const { notify } = useToast();

  const saveContact = () => {
    const vcard = buildVCard({
      name: profile.name,
      title: profile.title,
      company: profile.company,
      phone: profile.phone,
      secondaryPhone: profile.callPhone,
      email: profile.email,
      website: profile.website,
      address: profile.addressParts,
    });
    downloadVCard(vcard, `${profile.name.replace(/\s+/g, "-")}.vcf`);
    notify("Contact file downloaded");
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        className={`${base} bg-gold-deep text-white hover:bg-gold-darker`}
        onClick={() => notify("Feature coming soon")}
      >
        <ArrowRightCircle className="hidden size-4 shrink-0 min-[360px]:block" aria-hidden="true" />
        Exchange Info
      </button>
      <button
        type="button"
        onClick={saveContact}
        className={`${base} bg-cream text-ink hover:bg-gold-light`}
      >
        <ArrowDownCircle className="hidden size-4 shrink-0 min-[360px]:block" aria-hidden="true" />
        Save Contact
      </button>
    </div>
  );
}
