"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  ShoppingBag,
} from "lucide-react";
import type { PlotSize, ServiceDetailModalProps } from "@/types";
import { getStartingPriceText } from "@/data/services";
import { SafepayService } from "@/lib/safepay";
import { useStore } from "@/hooks/useStore";

const emptySubscribe = () => () => {};

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  isOpen,
  onClose,
  service,
  onApplyToBrief,
}) => {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const [selectedPlot, setSelectedPlot] = useState<PlotSize>("10 Marla");
  const [selectedTierIndex, setSelectedTierIndex] = useState<number>(0);
  const { addToCart, setCartDrawerOpen, showToast } = useStore();

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isClient || !service) return null;

  const activeTier = service.tiers?.[selectedTierIndex];

  const handleApply = () => {
    if (onApplyToBrief) {
      onApplyToBrief(service, activeTier, selectedPlot);
    }
    onClose();
  };

  const handleDirectCheckout = () => {
    if (!service) return;

    if (service.id === "full-package") {
      onClose();
      const calcSection = document.getElementById("turnkey-calculator");
      if (calcSection) {
        calcSection.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    if (!service.tiers || service.tiers.length === 0) return;

    const tier = activeTier || service.tiers[0];
    let price = 0;
    if (service.pricingType === "flat") {
      price = tier.pricePKR || 0;
    } else if (service.pricingType === "size_based" && tier.priceByPlot) {
      price = tier.priceByPlot[selectedPlot] || 0;
    }

    addToCart({
      title: service.title,
      price,
      image: service.image,
      currency: "PKR",
      tier: tier.name,
      plotSize: service.pricingType === "size_based" ? selectedPlot : undefined,
    });

    showToast(`Added ${service.title} (${tier.name}) to cart`);
    onClose();
    setCartDrawerOpen(true);
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          data-lenis-prevent
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto overscroll-contain"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/85 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-4xl max-h-[92vh] md:max-h-[88vh] bg-surface-container-lowest dark:bg-zinc-900 border border-outline-variant/30 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col font-inter my-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/70 hover:bg-black text-white/90 hover:text-white transition-all cursor-pointer backdrop-blur-md border border-white/20 shadow-xl"
              aria-label="Close service modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Content Container */}
            <div
              data-lenis-prevent
              className="overflow-y-auto overscroll-contain max-h-[92vh] md:max-h-[88vh] divide-y divide-outline-variant/20 dark:divide-zinc-800"
            >
              {/* Hero Banner Section */}
              <div className="relative h-60 sm:h-68 md:h-72 w-full overflow-hidden bg-zinc-950 shrink-0">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  priority
                  className="object-cover brightness-[0.65] contrast-[1.05]"
                  sizes="(max-width: 1024px) 100vw, 900px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                {/* Banner Text Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 text-white space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-tertiary/90 text-on-tertiary text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-sm">
                      {service.category}
                    </span>
                    <span className="bg-white/20 backdrop-blur-md text-white/90 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full">
                      Rank #{service.popularityRank}
                    </span>
                    <span className="text-tertiary-fixed font-bold text-xs ml-auto">
                      {getStartingPriceText(service)}
                    </span>
                  </div>

                  <h2 className="font-playfair text-2xl md:text-3xl font-bold leading-snug text-white">
                    {service.title}
                  </h2>
                  <p className="font-inter text-xs md:text-sm text-white/80 font-light max-w-2xl leading-relaxed">
                    {service.shortDesc}
                  </p>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 md:p-8 space-y-8 pb-16 md:pb-20">
                {/* Size-Based Plot Selector */}
                {service.pricingType === "size_based" && (
                  <div className="space-y-3 bg-surface dark:bg-zinc-950/50 p-4 md:p-5 rounded-2xl border border-outline-variant/30 dark:border-zinc-800">
                    <div className="flex justify-between items-center">
                      <span className="font-inter text-xs font-bold uppercase tracking-wider text-secondary dark:text-zinc-300">
                        Select Your Plot Scale
                      </span>
                      <span className="text-[11px] text-zinc-500 font-medium">
                        Live price calculation per plot size
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {(["5 Marla", "10 Marla", "1 Kanal"] as PlotSize[]).map(
                        (plot) => (
                          <button
                            key={plot}
                            type="button"
                            onClick={() => setSelectedPlot(plot)}
                            className={`py-2.5 px-3 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer ${
                              selectedPlot === plot
                                ? "bg-tertiary text-white shadow-md"
                                : "bg-white dark:bg-zinc-800 text-on-surface dark:text-zinc-300 border border-outline-variant/40 dark:border-zinc-700 hover:border-tertiary"
                            }`}
                          >
                            {plot}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Tier Selection & Deliverables Breakdown */}
                {service.tiers && service.tiers.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-playfair text-lg font-bold text-on-surface dark:text-zinc-100">
                        Available Service Tiers
                      </h3>
                      <span className="text-xs text-zinc-500">
                        Click a tier to inspect deliverables
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {service.tiers.map((tier, idx) => {
                        const isSelected = selectedTierIndex === idx;
                        const price =
                          service.pricingType === "size_based" &&
                          tier.priceByPlot
                            ? tier.priceByPlot[selectedPlot]
                            : tier.pricePKR || 0;

                        return (
                          <div
                            key={tier.name}
                            onClick={() => setSelectedTierIndex(idx)}
                            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                              isSelected
                                ? "border-tertiary bg-tertiary/5 dark:bg-tertiary/10 shadow-lg ring-2 ring-tertiary/40"
                                : "border-outline-variant/30 dark:border-zinc-800 bg-surface dark:bg-zinc-950/40 hover:border-tertiary/50"
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <span className="font-playfair text-lg font-bold text-on-surface dark:text-white">
                                  {tier.name}
                                </span>
                                {tier.deliveryTime && (
                                  <span className="text-[10px] font-semibold text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Clock className="w-2.5 h-2.5" />
                                    {tier.deliveryTime}
                                  </span>
                                )}
                              </div>

                              <p className="font-inter text-xs text-on-surface-variant dark:text-zinc-400 font-light">
                                {tier.details}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-outline-variant/20 dark:border-zinc-800 flex justify-between items-baseline">
                              <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                                Fixed Fee
                              </span>
                              <span className="font-montserrat text-lg font-extrabold text-secondary dark:text-zinc-100">
                                {SafepayService.formatPKR(price)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Deliverables Checklist for Active Tier */}
                    {activeTier && (
                      <div className="p-5 rounded-2xl bg-surface-container-low dark:bg-zinc-950/70 border border-outline-variant/30 dark:border-zinc-800 space-y-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-tertiary" />
                          <h4 className="font-inter text-xs font-bold uppercase tracking-wider text-secondary dark:text-zinc-200">
                            Deliverables Included with {activeTier.name} Tier
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                          {activeTier.deliverables.map((item, dIdx) => (
                            <div
                              key={dIdx}
                              className="flex items-start gap-2.5 text-xs text-on-surface dark:text-zinc-300"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Flagship Full House Design Package Special View */
                  <div className="space-y-4 bg-surface dark:bg-zinc-950/50 p-6 rounded-2xl border border-outline-variant/30 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-tertiary/10 text-tertiary">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-playfair text-lg font-bold text-on-surface dark:text-zinc-100">
                          Complete Turnkey Blueprint Suite
                        </h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light">
                          Billed per square foot of covered area (PKR 280–380 /
                          sq ft) with 50% advance milestone.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      {[
                        "Complete Architectural Floor Plans & Elevations",
                        "Structural Analysis & Beam/Column Reinforcements",
                        "Public Health, Plumbing & Drainage Blueprints",
                        "Electrical, Distribution & Lighting Layouts",
                        "3D Photorealistic Exterior Facade Renders",
                        "Official Municipal Approval Drawing Sets",
                      ].map((pkgItem, pIdx) => (
                        <div
                          key={pIdx}
                          className="flex items-start gap-2.5 text-xs text-on-surface dark:text-zinc-300"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{pkgItem}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          const calcElement =
                            document.getElementById("turnkey-calculator");
                          if (calcElement) {
                            calcElement.scrollIntoView({ behavior: "smooth" });
                          }
                        }}
                        className="bg-tertiary hover:bg-tertiary-fixed text-on-tertiary px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 inline-flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <span>Open Turnkey Calculator</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Bottom Actions Bar */}
                <div className="pt-6 border-t border-outline-variant/20 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>PCATP Registered Architectural Practice</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    {service.id !== "full-package" && service.tiers && (
                      <button
                        type="button"
                        onClick={handleDirectCheckout}
                        className="flex-1 sm:flex-initial px-5 py-3 rounded-xl border border-tertiary text-tertiary hover:bg-tertiary/10 dark:border-tertiary/70 dark:hover:bg-tertiary/20 text-xs font-bold uppercase tracking-wider text-center transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Direct Order (Safepay)</span>
                      </button>
                    )}

                    {onApplyToBrief && (
                      <button
                        type="button"
                        onClick={handleApply}
                        className="flex-1 sm:flex-initial bg-primary hover:bg-tertiary text-on-primary px-6 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-lg active:scale-95 cursor-pointer"
                      >
                        <span>Book for This Service</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
