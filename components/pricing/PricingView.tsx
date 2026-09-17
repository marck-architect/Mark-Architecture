"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowDown,
  ArrowRight,
  Search,
  ShoppingBag,
  AlertCircle,
  Video,
  FileSearch,
  PencilRuler,
  Building2,
  Home,
  Calculator,
  Building,
  PhoneCall,
  LayoutGrid,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useStore } from "@/hooks/useStore";
import {
  pricingMenuCategories,
  paymentPolicyPoints,
  type PricingCategory,
  type PricingTier,
} from "@/data/pricing";

export const PricingView: React.FC = () => {
  const router = useRouter();
  const { addToCart, setCartDrawerOpen, showToast } = useStore();

  const [activeCategoryFilter, setActiveCategoryFilter] =
    useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  // Category Icon Resolver
  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case "consultation":
        return <Video className="w-4 h-4" />;
      case "plan-review":
        return <FileSearch className="w-4 h-4" />;
      case "plan-redesign":
        return <PencilRuler className="w-4 h-4" />;
      case "elevation-3d":
        return <Building2 className="w-4 h-4" />;
      case "interior-makeover":
        return <Home className="w-4 h-4" />;
      case "cost-estimate":
        return <Calculator className="w-4 h-4" />;
      case "full-house":
        return <Building className="w-4 h-4" />;
      default:
        return <LayoutGrid className="w-4 h-4" />;
    }
  };

  // Handle Online Cart / Booking
  const handleTierBooking = (category: PricingCategory, tier: PricingTier) => {
    if (tier.actionType === "consultation") {
      router.push("/consultation");
      return;
    }

    const priceNumber =
      typeof tier.pricePKR === "number"
        ? tier.pricePKR
        : parseInt(String(tier.pricePKR).replace(/[^0-9]/g, "")) || 80000;

    addToCart({
      title: `${category.title} – ${tier.name}`,
      price: priceNumber,
      image: "/images/Full House Design Package.png",
      currency: "PKR",
      tier: tier.name,
    });
    setCartDrawerOpen(true);
    showToast(`Added "${tier.name}" to your cart!`, "success");
  };

  // Filter Categories & Tiers
  const filteredCategories = pricingMenuCategories
    .filter((cat) => {
      if (activeCategoryFilter === "all") return true;
      return cat.id === activeCategoryFilter;
    })
    .map((cat) => {
      if (!searchQuery.trim()) return cat;
      const q = searchQuery.toLowerCase();
      const filteredTiers = cat.tiers.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.inclusions.some((inc) => inc.toLowerCase().includes(q)) ||
          t.priceFormatted.toLowerCase().includes(q) ||
          (t.tag && t.tag.toLowerCase().includes(q)),
      );
      return {
        ...cat,
        tiers: filteredTiers,
      };
    })
    .filter((cat) => cat.tiers.length > 0);

  const pricingFaqs = [
    {
      q: "Why is a 50% advance required before work starts?",
      a: "Architectural modeling, structural review, and CAD drafts require dedicated hours from certified principal architects. The 50% advance secures your dedicated studio slot, and the remaining 50% milestone is settled upon final delivery of high-resolution sheets.",
    },
    {
      q: "What payment gateway is used for checkout?",
      a: "All online consultations, review orders, and milestone payments are processed through Safepay, our official secure payment gateway. Safepay provides end-to-end 256-bit encryption and supports Visa, Mastercard, PayPak, local bank transfers, and digital wallets. Instant automated receipts and invoice confirmations are generated upon payment.",
    },
    {
      q: "How are design revisions handled?",
      a: "Each package clearly states the number of revision rounds included (typically 1 to 3 rounds). A revision includes spatial rearrangements, door/window shifts, or material color adjustments. Extra revisions beyond the package limits are charged at nominal standard studio rates.",
    },
    {
      q: "What file formats will I receive?",
      a: "Depending on your package, deliverables are handed over as annotated vector PDFs, high-resolution 4K JPG/PNG 3D renders, CAD-ready drawings, and audio voice-note walkthroughs directly via secure download links or email.",
    },
    {
      q: "Can I upgrade my package midway through the project?",
      a: "Yes! If you start with a House Plan Review (PKR 4,000) and decide you need a full Layout Redesign or 3D Elevation, the review fee is credited toward your upgraded package.",
    },
  ];

  return (
    <div className="relative overflow-x-hidden min-h-screen bg-surface dark:bg-zinc-950 font-inter">
      {/* Whole-screen Architectural Hero */}
      <header className="relative w-full min-h-[100dvh] flex items-center overflow-hidden border-b border-outline-variant/30">
        {/* Background Drafting Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

        {/* Large Subtle Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.03] dark:opacity-[0.05]">
          <span className="font-montserrat text-[22vw] font-black tracking-tighter">
            PRICING
          </span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-container-max mx-auto px-4 md:px-margin-desktop pt-20 pb-16">
          <ScrollReveal>
            <div className="max-w-4xl space-y-5">
              <h1
                className="font-playfair text-on-surface dark:text-zinc-100 font-normal leading-[1.08] tracking-tight"
                style={{ fontSize: "clamp(2.25rem, 1.5rem + 3vw, 4rem)" }}
              >
                Transparent <br />
                <span className="italic font-light text-tertiary">
                  pricing and packages.
                </span>
              </h1>

              <p
                className="font-inter text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed max-w-3xl"
                style={{
                  fontSize: "clamp(0.9375rem, 0.85rem + 0.3vw, 1.125rem)",
                }}
              >
                Explore our full menu of architectural services. Every package
                has fixed deliverables, a clear price, and secure checkout
                through Safepay.
              </p>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-stretch sm:items-center">
                <a
                  href="#pricing-catalog"
                  className="bg-primary hover:bg-tertiary text-on-primary px-8 py-4 rounded-xl font-bold tracking-wider transition-all duration-300 shadow-md active:scale-95 text-center inline-flex items-center justify-center gap-2 text-xs uppercase cursor-pointer min-h-[48px]"
                >
                  <span>Browse Package Menu</span>
                  <ArrowDown className="w-4 h-4" />
                </a>

                <a
                  href="#payment-policy"
                  className="border border-outline-variant/80 hover:border-tertiary hover:text-tertiary bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md text-on-surface dark:text-zinc-200 px-6 py-4 rounded-xl font-bold tracking-wider transition-all duration-300 text-center inline-flex items-center justify-center gap-2 text-xs uppercase cursor-pointer min-h-[48px]"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Payment Policy (50% Advance)</span>
                </a>

                <Link
                  href="/consultation"
                  className="border border-outline-variant/80 hover:border-tertiary hover:text-tertiary bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md text-on-surface dark:text-zinc-200 px-6 py-4 rounded-xl font-bold tracking-wider transition-all duration-300 text-center inline-flex items-center justify-center gap-2 text-xs uppercase cursor-pointer min-h-[48px]"
                >
                  <Video className="w-4 h-4 text-tertiary" />
                  <span>Book Consultation Call</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </header>

      {/* Payment Policy Sticky / Highlight Banner */}
      <section
        id="payment-policy"
        className="scroll-mt-24 border-y border-outline-variant/30 bg-surface-container-low dark:bg-zinc-900/70 py-10 px-4 md:px-margin-desktop"
      >
        <div className="max-w-container-max mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary block">
                Standardized Terms
              </span>
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-secondary dark:text-zinc-100 mt-1">
                Studio Payment &amp; Revision Policy
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Applies to all online architectural packages</span>
            </div>
          </div>

          {/* 4 Policy Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paymentPolicyPoints.map((pt, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-outline-variant/40 dark:border-zinc-800 shadow-xs space-y-2 hover:border-tertiary/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <h4 className="font-playfair text-sm font-bold text-on-surface dark:text-zinc-100">
                    {pt.title}
                  </h4>
                </div>
                <p className="text-xs text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                  {pt.description}
                </p>
              </div>
            ))}
          </div>

          {/* Supported Methods Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-outline-variant/20 text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-tertiary" />
              <span>
                Official Payment Gateway:{" "}
                <strong className="text-secondary dark:text-zinc-100">
                  Safepay
                </strong>{" "}
                (Visa, Mastercard, PayPak, Direct Bank Wire &amp; Digital Mobile
                Accounts).
              </span>
            </div>
            <span className="text-[11px] text-tertiary font-bold uppercase tracking-wider">
              100% Encrypted &amp; PCI-DSS Compliant
            </span>
          </div>
        </div>
      </section>

      {/* Main Pricing Catalog Section */}
      <main
        id="pricing-catalog"
        className="scroll-mt-24 py-16 px-4 md:px-margin-desktop max-w-container-max mx-auto space-y-12"
      >
        {/* Navigation & Search Filter Bar */}
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary block">
                Complete Package Menu
              </span>
              <h2 className="font-playfair text-2xl md:text-4xl font-bold text-secondary dark:text-zinc-100 mt-1">
                Select Your Design Package
              </h2>
            </div>

            {/* Quick Search Box */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search packages, tiers, or features..."
                className="w-full bg-white dark:bg-zinc-900 border border-outline-variant/50 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-on-surface dark:text-zinc-100 focus:outline-none focus:border-tertiary transition-colors"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveCategoryFilter("all")}
              className={`px-4 py-2.5 rounded-xl font-inter text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shrink-0 min-h-[40px] flex items-center gap-1.5 ${
                activeCategoryFilter === "all"
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container-low dark:bg-zinc-900 border border-outline-variant/40 hover:border-tertiary text-on-surface dark:text-zinc-300"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>All 7 Categories</span>
            </button>

            {pricingMenuCategories.map((cat) => {
              const isSelected = activeCategoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategoryFilter(cat.id)}
                  className={`px-4 py-2.5 rounded-xl font-inter text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shrink-0 min-h-[40px] flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-tertiary text-white shadow-sm"
                      : "bg-surface-container-low dark:bg-zinc-900 border border-outline-variant/40 hover:border-tertiary text-on-surface dark:text-zinc-300"
                  }`}
                >
                  {getCategoryIcon(cat.id)}
                  <span>
                    {cat.letter}) {cat.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories & Tiers Output */}
        <div className="space-y-16">
          {filteredCategories.map((cat, catIdx) => (
            <section
              key={cat.id}
              id={cat.id}
              className="scroll-mt-28 space-y-6 pt-4 border-t border-outline-variant/20"
            >
              {/* Category Header */}
              <ScrollReveal delay={0.05}>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-tertiary text-white flex items-center justify-center font-montserrat font-bold text-xs">
                        {cat.letter}
                      </span>
                      {cat.badge && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary px-2.5 py-0.5 rounded-full bg-tertiary/10 border border-tertiary/20">
                          {cat.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="font-playfair text-2xl md:text-3xl font-bold text-secondary dark:text-zinc-100">
                      {cat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  {cat.clientRequirementNote && (
                    <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-3 max-w-md text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                      <span>{cat.clientRequirementNote}</span>
                    </div>
                  )}
                </div>
              </ScrollReveal>

              {/* Tiers Grid */}
              <div
                className={`grid gap-6 ${
                  cat.tiers.length === 1
                    ? "grid-cols-1 max-w-2xl mx-auto"
                    : cat.tiers.length === 2
                      ? "grid-cols-1 md:grid-cols-2"
                      : "grid-cols-1 md:grid-cols-3"
                }`}
              >
                {cat.tiers.map((tier, tIdx) => (
                  <ScrollReveal key={tier.id} delay={0.06 * tIdx}>
                    <div
                      className={`relative bg-surface-container-low dark:bg-zinc-900 border rounded-3xl p-6 sm:p-7 flex flex-col justify-between h-full transition-all duration-300 shadow-sm hover:shadow-xl group ${
                        tier.popular
                          ? "border-tertiary ring-1 ring-tertiary/40 bg-tertiary/[0.02]"
                          : "border-outline-variant/40 hover:border-tertiary/60"
                      }`}
                    >
                      {/* Popular / Best Value Badge */}
                      {tier.popular && (
                        <span className="absolute -top-3 right-6 rounded-full bg-tertiary px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                          {tier.tag || "Most Popular"}
                        </span>
                      )}

                      <div className="space-y-4">
                        {/* Title & Delivery Time */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider block">
                              Tier {tIdx + 1}
                            </span>
                            <h4 className="font-playfair text-xl font-bold text-on-surface dark:text-zinc-100 mt-0.5">
                              {tier.name}
                            </h4>
                          </div>

                          {tier.deliveryTime && (
                            <span className="text-[11px] font-inter font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1 shrink-0 bg-white/70 dark:bg-zinc-800/70 px-2.5 py-1 rounded-full border border-outline-variant/20">
                              <Clock className="w-3 h-3 text-tertiary" />
                              <span>{tier.deliveryTime}</span>
                            </span>
                          )}
                        </div>

                        {/* Price Badge */}
                        <div className="py-2 border-y border-outline-variant/20 flex items-baseline justify-between">
                          <span className="text-xs text-zinc-400 uppercase tracking-wider">
                            Package Fee
                          </span>
                          <span className="font-montserrat text-2xl font-black text-secondary dark:text-zinc-100">
                            {tier.priceFormatted}
                          </span>
                        </div>

                        {/* Inclusions */}
                        <div className="space-y-2.5 pt-1">
                          <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider block">
                            Included Deliverables
                          </span>
                          {tier.inclusions.map((inc, iIdx) => (
                            <div
                              key={iIdx}
                              className="flex items-start gap-2.5 text-xs text-on-surface dark:text-zinc-300"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="leading-snug">{inc}</span>
                            </div>
                          ))}
                        </div>

                        {tier.notes && (
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 italic pt-2 border-t border-outline-variant/15">
                            {tier.notes}
                          </p>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="pt-6 border-t border-outline-variant/20 space-y-2.5 mt-6">
                        <button
                          type="button"
                          onClick={() => handleTierBooking(cat, tier)}
                          className="w-full bg-primary hover:bg-tertiary text-on-primary py-3.5 px-4 rounded-xl font-inter font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer min-h-[46px]"
                        >
                          {tier.actionType === "consultation" ? (
                            <>
                              <Video className="w-4 h-4" />
                              <span>Schedule Video Session</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4" />
                              <span>Acquire Package • Add to Cart</span>
                            </>
                          )}
                        </button>

                        <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-400 pt-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            50% Advance Milestone • Safepay Payment Gateway
                          </span>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Lead Architect Direct Studio Hotline CTA */}
        <div className="p-8 sm:p-10 rounded-3xl bg-tertiary/10 border border-tertiary/30 space-y-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <PhoneCall className="w-4 h-4 text-tertiary" />
              <span className="font-inter text-xs font-bold uppercase tracking-wider text-secondary dark:text-zinc-200">
                Custom Plot or Bespoke Commercial Scope?
              </span>
            </div>
            <h3 className="font-playfair text-xl sm:text-2xl font-bold text-on-surface dark:text-zinc-100">
              Speak Directly with Lead Architect
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-light leading-relaxed max-w-xl">
              Have plot anomalies, DHA/CDA height regulation questions, or a
              commercial plaza project? Book a direct video consultation with
              our principal studio architect.
            </p>
          </div>

          <Link
            href="/consultation"
            className="bg-primary hover:bg-tertiary text-on-primary px-8 py-4 rounded-xl font-bold tracking-wider transition-all duration-300 shadow-md active:scale-95 text-center inline-flex items-center justify-center gap-2 text-xs uppercase cursor-pointer min-h-[48px] shrink-0 w-full sm:w-auto"
          >
            <span>Book Consultation Call</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
};
