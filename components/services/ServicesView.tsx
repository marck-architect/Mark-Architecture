"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { FullHouseCalculator } from "@/components/calculator/FullHouseCalculator";
import { useStore } from "@/hooks/useStore";
import { SafepayService } from "@/lib/safepay";
import { Clock, CheckCircle2, ArrowRight, X, Send } from "lucide-react";

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

const serviceCatalog: ServiceData[] = [
  {
    id: "consultation",
    slug: "online-consultation",
    title: "Online Consultation (Video / Call)",
    category: "Consultation",
    popularityRank: 1,
    shortDesc:
      "Live 1-on-1 strategy sessions with a principal architect via Live HD Video.",
    image: "/images/For Call.png",
    pricingType: "flat",
    tiers: [
      {
        name: "Basic Call",
        deliveryTime: "30 Minutes Live",
        details: "Discussion + design guidance + immediate layout solutions.",
        deliverables: [
          "30 min Live Video Session",
          "Spatial Flow Guidance",
          "Live Q&A with Lead Architect",
        ],
        pricePKR: 3000,
      },
      {
        name: "Premium Call",
        deliveryTime: "60 Minutes Live",
        details:
          "Proper planning roadmap + material selections + budget allocation strategy.",
        deliverables: [
          "60 min In-Depth Session",
          "Comprehensive Layout Roadmap",
          "Material Grade Suggestions",
          "Budget Planning Strategy",
        ],
        pricePKR: 5000,
      },
    ],
  },
  {
    id: "plan-review",
    slug: "house-plan-review",
    title: "House Plan Review by Professional Architect",
    category: "Diagnostic Audit",
    popularityRank: 2,
    shortDesc:
      "Comprehensive blueprint audit identifying structural, ventilation, and circulation bottlenecks.",
    image: "/images/House Plan review.png",
    pricingType: "flat",
    tiers: [
      {
        name: "Basic",
        deliveryTime: "24 Hours",
        details:
          "Voice notes, marked plan (PDF/JPG), and 3–5 critical issue diagnostics.",
        deliverables: [
          "Annotated Marked Plan (PDF/JPG)",
          "Detailed Audio Voice Notes",
          "3–5 Critical Issue Solutions",
        ],
        pricePKR: 5000,
      },
      {
        name: "Standard",
        deliveryTime: "24–48 Hours",
        details:
          "Analytical report with circulation, ventilation, and dimensional sizing optimizations.",
        deliverables: [
          "Formal Analytical Report",
          "Circulation & Ventilation Audit",
          "Room Sizing Corrections",
          "Annotated Master Plan",
        ],
        pricePKR: 9000,
      },
      {
        name: "Premium",
        deliveryTime: "48 Hours",
        details:
          "Full review, improved rough layout sketch, furniture suggestions, and 2 revision rounds.",
        deliverables: [
          "Full Diagnostic Report",
          "Improved Rough Layout Sketch",
          "Optimal Furniture Placement",
          "2 Revision Cycles Included",
        ],
        pricePKR: 24000,
      },
    ],
  },
  {
    id: "plan-correction",
    slug: "house-plan-correction",
    title: "House Plan Correction",
    category: "Architectural Redrafting",
    popularityRank: 3,
    shortDesc:
      "Complete redrafting and spatial optimization of flawed blueprints according to plot scale.",
    image: "/images/House Plan Correction.png",
    pricingType: "size_based",
    tiers: [
      {
        name: "Basic",
        deliveryTime: "2–3 Days",
        details: "1 corrected layout option, 1 revision round.",
        deliverables: [
          "1 Optimized Blueprint Option",
          "1 Revision Cycle",
          "Updated Dimensioning Schedule",
        ],
        priceByPlot: {
          "5 Marla": 10000,
          "10 Marla": 15000,
          "1 Kanal": 26000,
        },
      },
      {
        name: "Standard",
        deliveryTime: "3–5 Days",
        details:
          "2 corrected layout options, scaled furniture layout, and 2 revision rounds.",
        deliverables: [
          "2 Layout Proposals",
          "Bespoke Furniture Plan",
          "Circulation Restructuring",
          "2 Revision Cycles",
        ],
        priceByPlot: {
          "5 Marla": 15000,
          "10 Marla": 22000,
          "1 Kanal": 40000,
        },
      },
      {
        name: "Premium",
        deliveryTime: "5–7 Days",
        details:
          "2 layout options, custom furniture plan, passive ventilation strategy, and 3 revision rounds.",
        deliverables: [
          "2 Complete Redesigns",
          "Custom Furniture Plan",
          "Passive Ventilation Strategy",
          "3 Revision Cycles Included",
        ],
        priceByPlot: {
          "5 Marla": 22000,
          "10 Marla": 38000,
          "1 Kanal": 70000,
        },
      },
    ],
  },
  {
    id: "elevation-3d",
    slug: "front-elevation-3d",
    title: "Front Elevation 3D (Exterior Render)",
    category: "3D Visualization",
    popularityRank: 4,
    shortDesc:
      "Photorealistic architectural facades, daylight & dusk renders, and modern material schedules.",
    image: "/images/Front Elevation 3D (Exterior Render).png",
    pricingType: "size_based",
    tiers: [
      {
        name: "Basic",
        deliveryTime: "2–4 Days",
        details: "1 realistic 3D front view, material suggestions, 1 revision.",
        deliverables: [
          "1 Realistic 3D Facade View",
          "Exterior Material Palette",
          "1 Revision Cycle",
        ],
        priceByPlot: {
          "5 Marla": 15000,
          "10 Marla": 17000,
          "1 Kanal": 23000,
        },
      },
      {
        name: "Standard",
        deliveryTime: "3–5 Days",
        details:
          "2 perspective views (front + angle), material & color options, 2 revisions.",
        deliverables: [
          "2 Views (Front + Dramatic Angle)",
          "Material & Color Specifications",
          "2 Revision Cycles",
        ],
        priceByPlot: {
          "5 Marla": 20000,
          "10 Marla": 25000,
          "1 Kanal": 31900,
        },
      },
      {
        name: "Premium",
        deliveryTime: "5–7 Days",
        details:
          "3 perspective views + night view, detailed material concept, 3 revisions.",
        deliverables: [
          "3 Views + Night Illumination Render",
          "Exhaustive Material Schedule",
          "Exterior Lighting Layout",
          "3 Revision Cycles",
        ],
        priceByPlot: {
          "5 Marla": 25000,
          "10 Marla": 29000,
          "1 Kanal": 36000,
        },
      },
    ],
  },
  {
    id: "interior-makeover",
    slug: "interior-room-makeover",
    title: "Interior Room Makeover",
    category: "Interior Architecture",
    popularityRank: 5,
    shortDesc:
      "Custom room transformations: moodboards, 3D interior renders, and false ceiling details.",
    image: "/images/Interior Room Makeover.png",
    pricingType: "flat",
    tiers: [
      {
        name: "Basic",
        deliveryTime: "2 Days",
        details:
          "Moodboard specifying color schemes, furniture styles, and ambient lighting.",
        deliverables: [
          "Aesthetic Moodboard",
          "Color Palette Schedule",
          "Furniture Sourcing Direction",
        ],
        pricePKR: 7000,
      },
      {
        name: "Standard",
        deliveryTime: "3–4 Days",
        details:
          "Moodboard + 2D scaled furniture layout + false ceiling & lighting design concepts.",
        deliverables: [
          "Concept Moodboard",
          "2D Scaled Furniture Layout",
          "Ceiling Geometry & Lighting Concept",
        ],
        pricePKR: 12000,
      },
      {
        name: "Premium",
        deliveryTime: "5–7 Days",
        details:
          "Moodboard + photorealistic 3D render + furniture layout + ceiling & lighting construction details.",
        deliverables: [
          "Photorealistic 3D Interior Render",
          "Complete Moodboard & Material Specs",
          "Scaled Furniture & Ceiling Plans",
          "2 Revisions",
        ],
        pricePKR: 30000,
      },
    ],
  },
  {
    id: "cost-estimate",
    slug: "construction-cost-estimate",
    title: "Construction Cost Estimate (Grey Structure)",
    category: "Cost Estimation",
    popularityRank: 6,
    shortDesc:
      "Market-verified bill of quantities and accurate material projections for grey structure.",
    image: "/images/Construction Cost Estimate.png",
    pricingType: "size_based",
    tiers: [
      {
        name: "Basic",
        deliveryTime: "2–3 Days",
        details:
          "Approximate grey structure cost breakdown with covered area statement.",
        deliverables: [
          "Grey Structure Cost Breakdown",
          "Covered Area Calculation",
          "Steel & Cement Quantities Summary",
        ],
        priceByPlot: {
          "5 Marla": 5000,
          "10 Marla": 7000,
          "1 Kanal": 9000,
        },
      },
      {
        name: "Detailed",
        deliveryTime: "4–6 Days",
        details:
          "Grey structure + finishing estimate, material grade suggestions, and bill of quantities.",
        deliverables: [
          "Grey Structure + Finishing Projections",
          "Material Grade Suggestions",
          "Itemized Bill of Quantities",
          "Contractor Negotiation Guide",
        ],
        priceByPlot: {
          "5 Marla": 16000,
          "10 Marla": 19000,
          "1 Kanal": 30000,
        },
      },
    ],
  },
  {
    id: "full-package",
    slug: "full-house-design-package",
    title: "Full House Design Package (Rate-Based)",
    category: "Flagship Full Turnkey Package",
    popularityRank: 7,
    shortDesc:
      "Complete architectural, structural, plumbing, electrical, and fire/safety blueprint suite billed by covered area.",
    image: "/images/Full House Design Package.png",
    pricingType: "rate_formula",
  },
];

export const ServicesView: React.FC = () => {
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
    <div className="relative overflow-x-hidden min-h-screen pt-20 bg-surface dark:bg-zinc-950">
      {/* Page Header */}
      <header className="px-4 md:px-margin-desktop max-w-container-max mx-auto py-16 md:py-24 border-b border-outline-variant/30">
        <ScrollReveal>
          <div className="max-w-4xl space-y-4">
            <span className="font-inter text-xs md:text-sm font-bold text-tertiary uppercase tracking-widest block">
              Authoritative Architectural Catalog
            </span>
            <h1 className="font-playfair text-3xl sm:text-5xl md:text-6xl text-on-surface dark:text-zinc-100 font-normal leading-tight">
              Bespoke Design, Audits &amp; <br />
              <span className="italic font-light">Engineering Packages.</span>
            </h1>
            <p className="font-inter text-base md:text-lg text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed max-w-3xl">
              Transparent, tiered architectural services engineered for
              Pakistani and international residential projects. All packages
              priced in PKR with secure Safepay checkout.
            </p>
          </div>
        </ScrollReveal>
      </header>

      {/* Flagship Quote Calculator (Service G) Highlight Banner */}
      <section className="px-4 md:px-margin-desktop max-w-container-max mx-auto py-16">
        <ScrollReveal>
          <div className="mb-8">
            <span className="font-inter text-xs font-bold text-tertiary uppercase tracking-widest block mb-2">
              Featured Flagship Solution
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl text-on-surface dark:text-zinc-100 font-normal">
              Full Turnkey Architectural Suite
            </h2>
          </div>
          <FullHouseCalculator />
        </ScrollReveal>
      </section>

      {/* Services Catalog Grid (Services A - F) */}
      <section className="px-4 md:px-margin-desktop max-w-container-max mx-auto py-16 border-t border-outline-variant/20">
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
          {serviceCatalog
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
                <ScrollReveal key={service.id} delay={0.08 * idx}>
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

                      <div className="absolute top-6 left-6 flex items-center gap-2">
                        <span className="bg-black/60 backdrop-blur-md text-tertiary text-[10px] font-inter font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border border-tertiary/30">
                          Priority #{service.popularityRank}
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
                                ["5 Marla", "10 Marla", "1 Kanal"] as PlotSize[]
                              ).map((plot) => (
                                <button
                                  key={plot}
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
                                  key={tier.name}
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
                                  key={dIdx}
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
            })}
        </div>
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
