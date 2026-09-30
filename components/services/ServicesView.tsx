"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { FullHouseCalculator } from "@/components/calculator/FullHouseCalculator";
import { useStore } from "@/hooks/useStore";
import { SafepayService } from "@/lib/safepay";
import { Clock, CheckCircle2, ArrowRight, X, Send, Briefcase, PhoneCall, Sparkles, Video } from "lucide-react";
import { ServicesHero } from "@/components/services/ServicesHero";
import type { AdminService, PricingSettingsContent } from "@/types";

type PlotSize = "5 Marla" | "10 Marla" | "1 Kanal";

interface Tier {
  name: string;
  deliveryTime?: string;
  details: string;
  deliverables: string[];
  pricePKR?: number; // for flat pricing
  priceByPlot?: Record<PlotSize, number>; // for size_based
}

interface ServiceData {
  id: string;
  slug: string;
  title: string;
  category: string;
  popularityRank: number;
  shortDesc: string;
  image: string;
  pricingType: "flat" | "size_based" | "rate_formula";
  tiers?: Tier[];
}

const fallbackServiceCatalog: ServiceData[] = [];

interface ServicesViewProps {
  initialServices?: (AdminService | any)[];
  initialPricing?: PricingSettingsContent;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  initialServices,
  initialPricing,
}) => {
  const serviceCatalog = useMemo<ServiceData[]>(() => {
    if (!initialServices || initialServices.length === 0) {
      return fallbackServiceCatalog;
    }

    return initialServices.map((s: any, sIdx: number) => {
      if (s.shortDesc && s.tiers) return s as ServiceData;

      const serviceId = s.slug || s.id || `service-${sIdx}`;
      return {
        id: serviceId,
        slug: s.slug || serviceId,
        title: s.title || "Architectural Service",
        category: s.category || "Architectural Service",
        popularityRank: s.popularity_rank || 99,
        shortDesc: s.short_description || s.shortDesc || "",
        image:
          s.image_url || s.image || "/images/Full House Design Package.png",
        pricingType: s.pricing_type || s.pricing_model || s.pricingType || "flat",
        tiers:
          s.tiers && s.tiers.length > 0
            ? s.tiers.map((t: any, tIdx: number) => ({
                name: t.tier_name || t.name || `Tier ${tIdx + 1}`,
                deliveryTime:
                  t.delivery_time ||
                  (t.delivery_days ? `${t.delivery_days} Days` : undefined) ||
                  t.deliveryTime ||
                  "Prompt",
                details: t.description || t.details || "",
                deliverables: t.deliverables || [],
                pricePKR:
                  t.pricing_rules?.find((r: any) => r.plot_size === "Any")
                    ?.price_pkr ||
                  Number(t.base_price_pkr ?? t.pricePKR) ||
                  undefined,
                priceByPlot:
                  t.pricing_rules?.reduce((acc: any, r: any) => {
                    if (r.plot_size !== "Any") {
                      acc[r.plot_size] = r.price_pkr;
                    }
                    return acc;
                  }, t.priceByPlot || {}) || t.priceByPlot,
              }))
            : undefined,
      };
    });
  }, [initialServices]);

  const { addToCart, setCartDrawerOpen, showToast } = useStore();

  // Selected plot size state for size-based services
  const [selectedPlots, setSelectedPlots] = useState<Record<string, PlotSize>>({
    "plan-correction": "10 Marla",
    "elevation-3d": "10 Marla",
    "cost-estimate": "10 Marla",
  });

  // Selected tier indices per service
  const [selectedTiers, setSelectedTiers] = useState<Record<string, number>>({
    consultation: 0,
    "plan-review": 1,
    "plan-correction": 1,
    "elevation-3d": 1,
    "interior-makeover": 1,
    "cost-estimate": 1,
  });

  // Inquiry drawer state
  const [activeInquiryService, setActiveInquiryService] =
    useState<ServiceData | null>(null);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryNotes, setInquiryNotes] = useState("");

  const handlePlotChange = (serviceId: string, size: PlotSize) => {
    setSelectedPlots((prev) => ({ ...prev, [serviceId]: size }));
  };

  const handleTierChange = (serviceId: string, tierIndex: number) => {
    setSelectedTiers((prev) => ({ ...prev, [serviceId]: tierIndex }));
  };

  const handleAddToCart = (service: ServiceData) => {
    if (!service.tiers) return;
    const tierIdx = selectedTiers[service.id] ?? 0;
    const tier = service.tiers[tierIdx];
    const plot = selectedPlots[service.id];

    let price = 0;
    if (service.pricingType === "flat") {
      price = tier.pricePKR || 0;
    } else if (
      service.pricingType === "size_based" &&
      tier.priceByPlot &&
      plot
    ) {
      price = tier.priceByPlot[plot];
    }

    addToCart({
      title: service.title,
      price,
      image: service.image,
      currency: "PKR",
      tier: tier.name,
      plotSize: service.pricingType === "size_based" ? plot : undefined,
    });

    setCartDrawerOpen(true);
  };

  const handleOpenInquiry = (service: ServiceData) => {
    setActiveInquiryService(service);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail) {
      showToast("Please provide your name and email.", "warning");
      return;
    }
    showToast(
      `Inquiry for "${activeInquiryService?.title}" dispatched successfully.`,
    );
    setActiveInquiryService(null);
    setInquiryName("");
    setInquiryEmail("");
    setInquiryPhone("");
    setInquiryNotes("");
  };

  return (
    <div className="relative overflow-x-hidden min-h-screen bg-surface dark:bg-zinc-950 font-inter">
      {/* Editorial Page Header */}
      <ServicesHero />

      {/* Flagship Quote Calculator (Service G) Highlight Banner */}
      <section id="full-house-calculator" className="scroll-mt-20 px-4 md:px-margin-desktop max-w-container-max mx-auto py-16">
        <ScrollReveal>
          <div className="mb-8">
            <span className="font-inter text-xs font-bold text-tertiary uppercase tracking-widest block mb-2">
              Featured Flagship Solution
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl text-on-surface dark:text-zinc-100 font-normal">
              Full Turnkey Architectural Suite
            </h2>
          </div>
          <FullHouseCalculator
            disciplinesList={initialPricing?.calculator?.disciplines}
            advancePercentage={initialPricing?.calculator?.advancePercentage}
            presets={initialPricing?.calculator?.plotPresets}
          />
        </ScrollReveal>
      </section>

      {/* Services Catalog Grid (Services A - F) */}
      <section id="services-catalog" className="scroll-mt-20 px-4 md:px-margin-desktop max-w-container-max mx-auto py-16 border-t border-outline-variant/20">
        <ScrollReveal>
          <div className="space-y-3 mb-16">
            <span className="font-inter text-xs font-bold text-tertiary uppercase tracking-widest block">
              Priority Ranked Services
            </span>
            <h2 className="font-playfair text-3xl md:text-5xl text-on-surface dark:text-zinc-100 font-normal">
              Specialized Design Packages.
            </h2>
            <p className="font-inter text-sm md:text-base text-on-surface-variant dark:text-zinc-400 font-light max-w-2xl">
              Select your preferred tier or plot size. Add directly to your
              order for instant Safepay checkout or submit a custom inquiry
              brief.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-16">
          {serviceCatalog.filter((s) => s.id !== "full-package").length ===
          0 ? (
            <div className="py-20 text-center border border-dashed border-outline-variant/30 rounded-3xl p-8 bg-surface-container-low/40 dark:bg-zinc-900/30">
              <p className="font-playfair text-2xl text-on-surface dark:text-zinc-200">
                No specialized design packages published yet
              </p>
              <p className="font-inter text-sm text-zinc-500 mt-2 max-w-md mx-auto">
                Services will appear here once configured and published from the
                admin dashboard.
              </p>
            </div>
          ) : (
            serviceCatalog
              .filter((s) => s.id !== "full-package")
              .map((service, idx) => {
                const currentTierIdx = selectedTiers[service.id] ?? 0;
                const currentTier = service.tiers?.[currentTierIdx];
                const currentPlot = selectedPlots[service.id] || "10 Marla";

                let currentPrice = 0;
                if (currentTier) {
                  if (service.pricingType === "flat") {
                    currentPrice = currentTier.pricePKR || 0;
                  } else if (
                    service.pricingType === "size_based" &&
                    currentTier.priceByPlot
                  ) {
                    currentPrice = currentTier.priceByPlot[currentPlot];
                  }
                }

                return (
                  <ScrollReveal key={service.id || `service-${idx}`} delay={0.08 * idx}>
                    <div className="bg-surface-container-low dark:bg-zinc-900/60 border border-outline-variant/30 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col lg:flex-row">
                      {/* Left: Service Image & Badges */}
                      <div className="lg:w-2/5 relative min-h-[300px] lg:min-h-auto bg-zinc-900 overflow-hidden group">
                        <Image
                          fill
                          src={service.image}
                          alt={service.title}
                          sizes="(max-width: 1024px) 100vw, 40vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                        <div className="absolute top-6 left-6 flex flex-wrap items-center gap-2">
                          <span className="bg-[#1C1B1B]/85 backdrop-blur-md text-[#e8c889] text-[10px] font-inter font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border border-[#e8c889]/30 flex items-center gap-1.5 shadow-xs">
                            <Briefcase className="w-3 h-3 text-[#e8c889]" />
                            <span>Bespoke Service</span>
                          </span>
                          <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-inter font-semibold uppercase px-3 py-1.5 rounded-full">
                            {service.category}
                          </span>
                        </div>

                        <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                          <h3 className="font-playfair text-2xl font-bold leading-snug drop-shadow-md">
                            {service.title}
                          </h3>
                          <p className="font-inter text-xs text-zinc-300 font-light line-clamp-2">
                            {service.shortDesc}
                          </p>
                        </div>
                      </div>

                      {/* Right: Tiers, Plot Selector & Pricing */}
                      <div className="lg:w-3/5 p-5 sm:p-7 md:p-10 flex flex-col justify-between space-y-6">
                        <div className="space-y-6">
                          {/* Plot Size Selector (if size_based) */}
                          {service.pricingType === "size_based" && (
                            <div className="space-y-2">
                              <label className="font-inter text-[11px] font-bold text-on-surface dark:text-zinc-300 uppercase tracking-wider block">
                                Select Plot Scale
                              </label>
                              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                                {(
                                  [
                                    "5 Marla",
                                    "10 Marla",
                                    "1 Kanal",
                                  ] as PlotSize[]
                                ).map((plot) => (
                                  <button
                                    key={`${service.id}-plot-${plot}`}
                                    type="button"
                                    onClick={() =>
                                      handlePlotChange(service.id, plot)
                                    }
                                    className={`py-2 sm:py-2.5 px-1.5 sm:px-3 rounded-xl border text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer text-center min-h-[40px] flex items-center justify-center ${
                                      currentPlot === plot
                                        ? "bg-tertiary text-white border-tertiary shadow-sm"
                                        : "bg-surface dark:bg-zinc-800/60 border-outline-variant/40 text-on-surface dark:text-zinc-300 hover:border-tertiary/60"
                                    }`}
                                  >
                                    {plot}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Tier Selection Tabs */}
                          {service.tiers && (
                            <div className="space-y-2">
                              <label className="font-inter text-[11px] font-bold text-on-surface dark:text-zinc-300 uppercase tracking-wider block">
                                Select Tier
                              </label>
                              <div className="flex flex-wrap gap-2">
                                {service.tiers.map((tier, tIdx) => (
                                  <button
                                    key={`${service.id}-tier-${tIdx}-${tier.name}`}
                                    type="button"
                                    onClick={() =>
                                      handleTierChange(service.id, tIdx)
                                    }
                                    className={`px-3.5 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer min-h-[38px] flex items-center justify-center ${
                                      currentTierIdx === tIdx
                                        ? "bg-primary text-white border border-primary dark:bg-zinc-100 dark:text-zinc-950 font-bold shadow-sm"
                                        : "bg-surface dark:bg-zinc-800/40 border border-outline-variant/40 text-on-surface dark:text-zinc-400 hover:border-tertiary"
                                    }`}
                                  >
                                    {tier.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Active Tier Description & Deliverables */}
                          {currentTier && (
                            <div className="bg-surface dark:bg-zinc-950 p-4 sm:p-5 rounded-2xl border border-outline-variant/30 space-y-3">
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/20 pb-3">
                                <span className="font-playfair text-base font-bold text-on-surface dark:text-zinc-200">
                                  {currentTier.name} Package Scope
                                </span>
                                {currentTier.deliveryTime && (
                                  <span className="flex items-center gap-1.5 text-xs text-tertiary font-inter font-medium">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>
                                      Delivery: {currentTier.deliveryTime}
                                    </span>
                                  </span>
                                )}
                              </div>

                              <p className="font-inter text-xs text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                                {currentTier.details}
                              </p>

                              <div className="space-y-1.5 pt-1">
                                {currentTier.deliverables.map((d, dIdx) => (
                                  <div
                                    key={`${service.id}-deliv-${dIdx}`}
                                    className="flex items-center gap-2 text-xs text-on-surface dark:text-zinc-300"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span>{d}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Pricing Summary & Actions */}
                        <div className="pt-4 border-t border-outline-variant/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div>
                            <span className="text-[11px] font-inter font-bold text-on-surface-variant dark:text-zinc-400 uppercase tracking-wider block">
                              Fixed Price (PKR)
                            </span>
                            <span className="font-montserrat text-xl sm:text-2xl font-extrabold text-secondary dark:text-zinc-100">
                              {SafepayService.formatPKR(currentPrice)}
                            </span>
                          </div>

                          <div className="flex flex-col xs:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                            <button
                              type="button"
                              onClick={() => handleOpenInquiry(service)}
                              className="flex-1 sm:flex-none border border-outline-variant hover:border-tertiary hover:text-tertiary px-4 sm:px-5 py-3 rounded-xl font-inter font-bold text-xs tracking-wider uppercase transition-all text-center cursor-pointer min-h-[44px] flex items-center justify-center"
                            >
                              Inquire Brief
                            </button>

                            {service.id === "consultation" ? (
                              <Link
                                href="/consultation"
                                className="flex-1 sm:flex-none bg-primary hover:bg-tertiary text-on-primary px-5 sm:px-6 py-3 rounded-xl font-inter font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 text-center flex items-center justify-center gap-1.5 min-h-[44px]"
                              >
                                <span>Book Call Slot</span>
                                <ArrowRight className="w-4 h-4" />
                              </Link>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAddToCart(service)}
                                className="flex-1 sm:flex-none bg-primary hover:bg-tertiary text-on-primary px-5 sm:px-6 py-3 rounded-xl font-inter font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 text-center cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px]"
                              >
                                <span>Direct Checkout</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })
          )}
        </div>
      </section>

      {/* 1-on-1 Consultation Strategy Call Gateway */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <ScrollReveal>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border border-tertiary/20 p-8 sm:p-12 shadow-2xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-tertiary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary/10 border border-tertiary/20 text-tertiary text-xs font-semibold uppercase tracking-wider">
                  <Video className="w-3.5 h-3.5" />
                  <span>Unsure Which Service You Need?</span>
                </div>
                <h3 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  Book a 1-on-1 Video Consultation with Our Principal Architect
                </h3>
                <p className="font-inter text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
                  Before committing to a full bespoke package, schedule a live 30 or 60-minute strategy session. We review your site drawings, audit circulation flow, and provide municipal zoning clarity.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-zinc-400 font-inter">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-tertiary" />
                    Live Google Meet Screen-Share
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-tertiary" />
                    Starting from PKR 3,000
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-tertiary" />
                    Same-Day Calendar Slot Booking
                  </span>
                </div>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
                <Link
                  href="/consultation"
                  className="inline-flex items-center justify-center gap-2.5 bg-tertiary hover:bg-tertiary/90 text-primary px-8 py-4 rounded-2xl font-inter font-bold text-sm tracking-wider uppercase transition-all shadow-lg active:scale-95 text-center"
                >
                  <Video className="w-4 h-4" />
                  <span>Schedule Consultation</span>
                </Link>
                <Link
                  href="/consultation"
                  className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 px-6 py-3.5 rounded-2xl font-inter text-xs font-semibold tracking-wider uppercase transition-all text-center"
                >
                  <span>View Available Slots</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Tailored Service Inquiry Modal */}
      {activeInquiryService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative my-8 max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto overscroll-contain bg-surface dark:bg-zinc-900 border border-outline-variant/40 rounded-3xl p-6 md:p-8 shadow-2xl">
            <button
              onClick={() => setActiveInquiryService(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-surface-container dark:hover:bg-zinc-800 text-on-surface-variant cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 mb-6">
              <span className="font-inter text-[10px] font-bold text-tertiary uppercase tracking-widest block">
                Dedicated Service Inquiry
              </span>
              <h3 className="font-playfair text-2xl font-bold text-on-surface dark:text-white">
                {activeInquiryService.title}
              </h3>
              <p className="font-inter text-xs text-on-surface-variant dark:text-zinc-400 font-light">
                Submit your specific plot details and questions to receive an
                architect appraisal.
              </p>
            </div>

            <form onSubmit={handleSendInquiry} className="space-y-4">
              <div>
                <label className="font-inter text-xs font-bold text-on-surface dark:text-zinc-300 uppercase tracking-wider block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  placeholder="e.g. Tariq Mansoor"
                  className="w-full bg-white dark:bg-zinc-950 border border-outline-variant/40 rounded-xl px-4 py-2.5 text-xs text-on-surface dark:text-white focus:border-tertiary focus:outline-none"
                />
              </div>

              <div>
                <label className="font-inter text-xs font-bold text-on-surface dark:text-zinc-300 uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-white dark:bg-zinc-950 border border-outline-variant/40 rounded-xl px-4 py-2.5 text-xs text-on-surface dark:text-white focus:border-tertiary focus:outline-none"
                />
              </div>

              <div>
                <label className="font-inter text-xs font-bold text-on-surface dark:text-zinc-300 uppercase tracking-wider block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full bg-white dark:bg-zinc-950 border border-outline-variant/40 rounded-xl px-4 py-2.5 text-xs text-on-surface dark:text-white focus:border-tertiary focus:outline-none"
                />
              </div>

              <div>
                <label className="font-inter text-xs font-bold text-on-surface dark:text-zinc-300 uppercase tracking-wider block mb-1">
                  Project Notes &amp; Scope Requirements
                </label>
                <textarea
                  rows={3}
                  value={inquiryNotes}
                  onChange={(e) => setInquiryNotes(e.target.value)}
                  placeholder="Mention your plot dimensions, sector/city, current stage, and specific goals..."
                  className="w-full bg-white dark:bg-zinc-950 border border-outline-variant/40 rounded-xl px-4 py-2.5 text-xs text-on-surface dark:text-white focus:border-tertiary focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-primary hover:bg-tertiary text-on-primary px-8 py-3.5 rounded-xl font-inter font-bold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span>Submit Inquiry</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
