"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import type { ServiceData, PlotSize, Tier } from "@/types";
import { useStore } from "@/hooks/useStore";
import { SafepayService } from "@/lib/safepay";

const PLOT_SIZES: PlotSize[] = ["5 Marla", "10 Marla", "1 Kanal"];

export const ServiceSlugView: React.FC<{ service: ServiceData }> = ({
  service,
}) => {
  const [selectedPlot, setSelectedPlot] = useState<PlotSize>("10 Marla");
  const [selectedTierIndex, setSelectedTierIndex] = useState<number>(0);

  const { addToCart, setCartDrawerOpen } = useStore();

  const tiers = service.tiers || [];
  const activeTier: Tier | undefined = tiers[selectedTierIndex];

  // Price computation
  let price = 0;
  if (activeTier) {
    if (service.pricingType === "flat") {
      price = activeTier.pricePKR || 0;
    } else if (service.pricingType === "size_based") {
      price = activeTier.priceByPlot?.[selectedPlot] || 0;
    }
  }

  const handleAddToCart = () => {
    if (!activeTier) return;

    addToCart({
      title: `${service.title} (${activeTier.name})`,
      price,
      image: service.image,
      currency: "PKR",
      tier: activeTier.name,
      plotSize: service.pricingType === "size_based" ? selectedPlot : undefined,
    });

    setCartDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FCF8F8] text-[#1C1B1B] pt-28 pb-20 px-4 md:px-8">
      {/* Background Architectural Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="relative max-w-5xl mx-auto z-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-8">
          <Link href="/" className="hover:text-stone-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <Link
            href="/services"
            className="hover:text-stone-900 transition-colors"
          >
            Services
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-800 font-medium truncate max-w-[200px] sm:max-w-none">
            {service.title}
          </span>
        </nav>

        {/* Main Service Card */}
        <div className="bg-white border border-stone-200 rounded-3xl shadow-xl shadow-stone-200/50 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left: Image & Category Meta */}
            <div className="lg:col-span-5 relative bg-stone-100 p-6 md:p-8 flex flex-col justify-between min-h-[280px] lg:min-h-full">
              {service.image && (
                <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden shadow-md">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 400px"
                    priority
                  />
                </div>
              )}

              <div className="mt-6 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#7E5714] text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Rank #{service.popularityRank} Atelier Service</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Licensed Architect Oversight Guaranteed</span>
                </div>
              </div>
            </div>

            {/* Right: Service Detail & Options */}
            <div className="lg:col-span-7 p-6 md:p-10 flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest text-[#7E5714] font-semibold">
                  {service.category}
                </span>

                <h1 className="font-playfair text-2xl md:text-3xl text-stone-900 font-medium leading-tight">
                  {service.title}
                </h1>

                <p className="text-sm text-stone-600 leading-relaxed font-light">
                  {service.shortDesc}
                </p>

                {/* Plot Size Selector (if size_based) */}
                {service.pricingType === "size_based" && (
                  <div className="pt-2">
                    <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-2">
                      Select Plot Dimension
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {PLOT_SIZES.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedPlot(size)}
                          className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                            selectedPlot === size
                              ? "border-[#7E5714] bg-amber-50 text-[#7E5714] shadow-2xs font-semibold"
                              : "border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tier Selector */}
                {tiers.length > 0 && (
                  <div className="pt-2">
                    <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-2">
                      Select Package Tier
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {tiers.map((t, idx) => (
                        <button
                          key={t.name}
                          type="button"
                          onClick={() => setSelectedTierIndex(idx)}
                          className={`py-2 px-4 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                            selectedTierIndex === idx
                              ? "border-[#7E5714] bg-amber-50 text-[#7E5714] shadow-2xs font-semibold"
                              : "border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300"
                          }`}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Active Tier Details & Deliverables */}
                {activeTier && (
                  <div className="pt-4 border-t border-stone-200 space-y-4">
                    <div className="flex items-center justify-between text-xs text-stone-600">
                      {activeTier.deliveryTime && (
                        <span className="flex items-center gap-1.5 font-medium text-stone-700">
                          <Clock className="w-3.5 h-3.5 text-[#7E5714]" />
                          Turnaround: {activeTier.deliveryTime}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed italic bg-stone-50 p-3 rounded-xl border border-stone-200/70">
                      {activeTier.details}
                    </p>

                    {activeTier.deliverables && (
                      <div className="space-y-2">
                        <span className="text-[11px] font-semibold text-stone-700 uppercase tracking-wider block">
                          Included Deliverables:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {activeTier.deliverables.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-xs text-stone-700"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Price & Checkout Section */}
              <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                    Fixed Price (PKR)
                  </span>
                  <span className="font-montserrat text-2xl font-bold text-stone-900">
                    {SafepayService.formatPKR(price)}
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {service.id === "consultation" ? (
                    <Link
                      href="/consultation"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#7E5714] hover:bg-[#684710] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-[0.98]"
                    >
                      <span>Book Call Slot</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#7E5714] hover:bg-[#684710] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-[0.98] cursor-pointer"
                    >
                      <span>Add to Cart & Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
