"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useStore } from "@/hooks/useStore";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  ShoppingBag,
  Zap,
  CheckCircle2,
  Clock,
  ArrowDown,
  Layers,
  ChevronDown,
} from "lucide-react";
import { SafepayService } from "@/lib/safepay";
import { DirectCheckoutModal } from "@/components/collection/DirectCheckoutModal";
import type { ArchitecturalPackage, CheckoutItem } from "@/types";
import { architecturalPackages } from "@/data/collection";

export const CollectionView: React.FC = () => {
  const { addToCart, setCartDrawerOpen } = useStore();
  const [checkoutModalItem, setCheckoutModalItem] =
    useState<CheckoutItem | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null,
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectPackage = (pkgId: string) => {
    setSelectedPackageId(pkgId);
    setIsDropdownOpen(false);
    const el = document.getElementById(`pkg-${pkgId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleDirectCheckout = (pkg: ArchitecturalPackage) => {
    setCheckoutModalItem({
      title: pkg.title,
      price: pkg.pricePKR,
      image: pkg.image,
      tier: pkg.tier,
      plotSize: pkg.plotSize,
      deliveryTime: pkg.deliveryTime,
    });
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="relative overflow-x-hidden min-h-screen bg-surface dark:bg-zinc-950">
      {/* Whole-screen Hero Section (Full Initial Page down to Browse Collection) */}
      <header className="relative w-full min-h-[100dvh] flex items-center overflow-hidden border-b border-outline-variant/30">
        {/* Background Architectural Drafting Grid Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

        {/* Large Subtle Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.03] dark:opacity-[0.05]">
          <span className="font-montserrat text-[20vw] font-black tracking-tighter">
            PACKAGES
          </span>
        </div>

        {/* Center Main Hero Content */}
        <div className="relative z-10 w-full max-w-container-max mx-auto px-4 md:px-margin-desktop pt-16">
          <ScrollReveal>
            <div className="max-w-4xl space-y-6">
              <h1 className="font-playfair text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-on-surface dark:text-zinc-100 font-normal leading-[1.08] tracking-tight">
                Standardized <br />
                <span className="italic font-light text-tertiary">
                  design packages.
                </span>
              </h1>

              <p className="font-inter text-sm sm:text-base md:text-lg lg:text-xl text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed max-w-3xl">
                Explore standardized fixed-price architectural design packages
                with direct one-click checkout, verified deliverables, and
                dedicated studio review.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-stretch sm:items-center">
                <a
                  href="#collection-catalog"
                  className="w-full sm:w-auto bg-primary hover:bg-tertiary text-on-primary px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold tracking-wider transition-all duration-300 shadow-md active:scale-95 text-center inline-flex items-center justify-center gap-2 font-inter text-xs uppercase cursor-pointer min-h-[48px]"
                >
                  <span>Explore Design Packages</span>
                  <ArrowDown className="w-4 h-4" />
                </a>

                {/* Select Service / Package Dropdown with working Lenis scrolling */}
                <div
                  ref={dropdownRef}
                  className="relative w-full sm:w-auto min-w-[280px]"
                >
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="w-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-outline-variant/60 hover:border-tertiary rounded-xl px-5 py-3.5 flex items-center justify-between gap-3 text-left transition-all shadow-xs cursor-pointer group min-h-[48px]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Layers className="w-4 h-4 text-tertiary shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-tertiary block">
                          Select Service / Package
                        </span>
                        <span className="font-playfair text-xs sm:text-sm font-bold text-on-surface dark:text-zinc-100 truncate block">
                          {selectedPackageId
                            ? architecturalPackages.find(
                                (p) => p.id === selectedPackageId,
                              )?.title || "Browse All Packages"
                            : "Jump to Package..."}
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0 ${
                        isDropdownOpen ? "rotate-180 text-tertiary" : ""
                      }`}
                    />
                  </button>

                  {/* Floating Dropdown Menu */}
                  {isDropdownOpen && (
                    <div
                      data-lenis-prevent
                      onWheel={(e) => e.stopPropagation()}
                      className="absolute top-full left-0 right-0 sm:right-auto sm:w-96 mt-2 z-50 bg-white dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 rounded-2xl shadow-2xl p-2 space-y-1 max-h-[340px] overflow-y-auto overscroll-contain touch-pan-y backdrop-blur-xl"
                    >
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 border-b border-outline-variant/20 mb-1 flex items-center justify-between">
                        <span>
                          Available Packages ({architecturalPackages.length})
                        </span>
                        <span className="text-[9px] text-tertiary font-normal">
                          Scroll &amp; Select
                        </span>
                      </div>

                      {architecturalPackages.map((pkg) => {
                        const isSelected = selectedPackageId === pkg.id;
                        return (
                          <div
                            key={pkg.id}
                            onClick={() => handleSelectPackage(pkg.id)}
                            className={`flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer group ${
                              isSelected
                                ? "bg-tertiary/10 border border-tertiary/30 text-tertiary"
                                : "hover:bg-surface-container dark:hover:bg-zinc-800/80 text-on-surface dark:text-zinc-200"
                            }`}
                          >
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-zinc-950 shrink-0 border border-outline-variant/20">
                              <Image
                                src={pkg.image}
                                alt={pkg.title}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-tertiary truncate">
                                  {pkg.tier}
                                </span>
                                <span className="text-[10px] font-bold text-secondary dark:text-zinc-300 shrink-0 font-montserrat">
                                  {SafepayService.formatPKR(pkg.pricePKR)}
                                </span>
                              </div>
                              <p className="font-playfair text-xs font-bold truncate group-hover:text-tertiary transition-colors">
                                {pkg.title}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-zinc-400">
                                {pkg.plotSize && <span>{pkg.plotSize}</span>}
                                {pkg.deliveryTime && (
                                  <span>• {pkg.deliveryTime}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </header>

      {/* Catalog Section with Scroll Anchor */}
      <div id="collection-catalog" className="scroll-mt-20">
        <div className="px-4 md:px-margin-desktop max-w-container-max mx-auto pt-16">
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-6 flex-wrap gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary block">
                Standardized Architecture
              </span>
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-secondary dark:text-zinc-100 mt-1">
                Design &amp; Review Packages
              </h2>
            </div>
            <span className="text-xs font-inter text-zinc-500 font-medium">
              {architecturalPackages.length} Ready Packages Available
            </span>
          </div>
        </div>

        {/* Packages Grid */}
        <section className="px-4 md:px-margin-desktop max-w-container-max mx-auto py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {architecturalPackages.map((pkg, idx) => (
              <ScrollReveal key={pkg.id} delay={0.06 * idx}>
                <div
                  id={`pkg-${pkg.id}`}
                  className={`scroll-mt-28 bg-surface-container-low dark:bg-zinc-900 border rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-between h-full group ${
                    selectedPackageId === pkg.id
                      ? "border-tertiary ring-2 ring-tertiary/40 shadow-xl"
                      : "border-outline-variant/30"
                  }`}
                >
                  <div>
                    {/* Image Header */}
                    <div className="relative aspect-[16/10] bg-zinc-950 overflow-hidden">
                      <Image
                        fill
                        src={pkg.image}
                        alt={pkg.title}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-black/60 backdrop-blur-md text-tertiary text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-tertiary/30">
                          {pkg.tier}
                        </span>
                        {pkg.plotSize && (
                          <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-semibold uppercase px-3 py-1 rounded-full">
                            {pkg.plotSize}
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-3 right-4 flex items-center gap-1.5 text-white text-xs font-inter font-light">
                        <Clock className="w-3.5 h-3.5 text-tertiary" />
                        <span>{pkg.deliveryTime}</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-6 space-y-4">
                      <h3 className="font-playfair text-xl font-bold text-on-surface dark:text-zinc-100">
                        {pkg.title}
                      </h3>
                      <p className="font-inter text-xs text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                        {pkg.description}
                      </p>

                      {/* Inclusions List */}
                      <div className="space-y-2 pt-2 border-t border-outline-variant/20">
                        <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider block">
                          Included Deliverables
                        </span>
                        {pkg.inclusions.map((item, iIdx) => (
                          <div
                            key={iIdx}
                            className="flex items-center gap-2 text-xs text-on-surface dark:text-zinc-300"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="p-6 pt-0 space-y-4">
                    <div className="flex justify-between items-center border-t border-outline-variant/20 pt-4">
                      <span className="text-[11px] font-inter font-bold text-zinc-500 uppercase tracking-wider">
                        Package Total
                      </span>
                      <span className="font-montserrat text-xl font-extrabold text-secondary dark:text-zinc-100">
                        {SafepayService.formatPKR(pkg.pricePKR)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          addToCart({
                            title: pkg.title,
                            price: pkg.pricePKR,
                            image: pkg.image,
                            currency: "PKR",
                            tier: pkg.tier,
                            plotSize: pkg.plotSize,
                          });
                          setCartDrawerOpen(true);
                        }}
                        className="border border-outline-variant hover:border-tertiary hover:text-tertiary py-3 px-2 rounded-xl font-inter font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                        <span>Add to Cart</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDirectCheckout(pkg)}
                        className="bg-primary hover:bg-tertiary text-on-primary py-3 px-2 rounded-xl font-inter font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
                      >
                        <Zap className="w-3.5 h-3.5 shrink-0" />
                        <span>Buy Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      </div>

      {/* Direct Safepay Checkout Modal */}
      <DirectCheckoutModal
        isOpen={isCheckoutModalOpen}
        item={checkoutModalItem}
        onClose={() => setIsCheckoutModalOpen(false)}
      />
    </div>
  );
};
