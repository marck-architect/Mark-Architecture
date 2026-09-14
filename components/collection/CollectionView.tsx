"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useStore } from "@/hooks/useStore";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  Eye,
  ShoppingBag,
  Zap,
  CheckCircle2,
  Clock,
  ArrowDown,
} from "lucide-react";
import { OrbitViewer } from "@/components/collection/OrbitViewer";
import { SafepayService } from "@/lib/safepay";
import { DirectCheckoutModal } from "@/components/collection/DirectCheckoutModal";
import type { ArchitecturalPackage, Product, CheckoutItem } from "@/types";
import { architecturalPackages, physicalProducts } from "@/data/collection";

export const CollectionView: React.FC = () => {
  const { addToCart, openQuickView, setCartDrawerOpen } = useStore();
  const [activeTab, setActiveTab] = useState<"packages" | "artifacts">(
    "packages",
  );
  const [checkoutModalItem, setCheckoutModalItem] =
    useState<CheckoutItem | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

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

  const handleDirectProductCheckout = (p: Product) => {
    setCheckoutModalItem({
      title: p.title,
      price: p.price,
      image: p.image,
      tier: p.category,
    });
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="relative overflow-x-hidden min-h-screen bg-surface dark:bg-zinc-950">
      {/* Whole-screen Hero Section (Full Initial Page down to Browse Collection) */}
      <header className="relative w-full h-screen min-h-[100dvh] flex items-center overflow-hidden border-b border-outline-variant/30">
        {/* Background Architectural Drafting Grid Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

        {/* Large Subtle Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.03] dark:opacity-[0.05]">
          <span className="font-montserrat text-[20vw] font-black tracking-tighter">
            EDITIONS
          </span>
        </div>

        {/* Center Main Hero Content */}
        <div className="relative z-10 w-full max-w-container-max mx-auto px-4 md:px-margin-desktop pt-16">
          <ScrollReveal>
            <div className="max-w-4xl space-y-6">
              <h1 className="font-playfair text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-on-surface dark:text-zinc-100 font-normal leading-[1.08] tracking-tight">
                Design packages &amp; <br />
                <span className="italic font-light text-tertiary">
                  atelier artifacts.
                </span>
              </h1>

              <p className="font-inter text-base sm:text-lg md:text-xl text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed max-w-3xl">
                Explore standardized fixed-price architectural design packages
                with direct one-click checkout, alongside handcrafted bespoke
                furniture and stone artifacts.
              </p>

              {/* Action Buttons & Tabs */}
              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <a
                  href="#collection-catalog"
                  className="bg-primary hover:bg-tertiary text-on-primary px-8 py-4 rounded-xl font-bold tracking-wider transition-all duration-300 shadow-md active:scale-95 text-center inline-flex items-center gap-2 font-inter text-xs uppercase cursor-pointer"
                >
                  <span>Browse Collection</span>
                  <ArrowDown className="w-4 h-4" />
                </a>

                {/* Quick View Switch Tabs */}
                <div className="flex gap-1.5 p-1 bg-surface-container-low dark:bg-zinc-900 border border-outline-variant/40 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("packages");
                      const el = document.getElementById("collection-catalog");
                      const lenis = (
                        window as unknown as {
                          lenis?: {
                            scrollTo: (target: HTMLElement | string) => void;
                          };
                        }
                      ).lenis;
                      if (lenis && el) {
                        lenis.scrollTo(el);
                      } else {
                        el?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className={`px-5 py-3 rounded-lg font-inter text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === "packages"
                        ? "bg-primary text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Packages
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("artifacts");
                      const el = document.getElementById("collection-catalog");
                      const lenis = (
                        window as unknown as {
                          lenis?: {
                            scrollTo: (target: HTMLElement | string) => void;
                          };
                        }
                      ).lenis;
                      if (lenis && el) {
                        lenis.scrollTo(el);
                      } else {
                        el?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className={`px-5 py-3 rounded-lg font-inter text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeTab === "artifacts"
                        ? "bg-primary text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Artifacts
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </header>

      {/* Catalog Section with Scroll Anchor & Filter Bar */}
      <div id="collection-catalog" className="scroll-mt-20">
        <div className="px-4 md:px-margin-desktop max-w-container-max mx-auto pt-16">
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-6 flex-wrap gap-4">
            <div className="flex gap-2 p-1 bg-surface-container-low dark:bg-zinc-900 border border-outline-variant/40 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab("packages")}
                className={`px-5 py-2.5 rounded-lg font-inter text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "packages"
                    ? "bg-primary text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Standardized Packages
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("artifacts")}
                className={`px-5 py-2.5 rounded-lg font-inter text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "artifacts"
                    ? "bg-primary text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Physical Artifacts
              </button>
            </div>
            <span className="text-xs font-inter text-zinc-500 font-medium">
              {activeTab === "packages"
                ? `${architecturalPackages.length} Ready Blueprints`
                : `${physicalProducts.length} Atelier Artifacts`}
            </span>
          </div>
        </div>

        {/* Content based on Tab */}
        {activeTab === "packages" ? (
          <section className="px-4 md:px-margin-desktop max-w-container-max mx-auto py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {architecturalPackages.map((pkg, idx) => (
                <ScrollReveal key={pkg.id} delay={0.06 * idx}>
                  <div className="bg-surface-container-low dark:bg-zinc-900 border border-outline-variant/30 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full group">
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
                          className="border border-outline-variant hover:border-tertiary hover:text-tertiary py-3 rounded-xl font-inter font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDirectCheckout(pkg)}
                          className="bg-primary hover:bg-tertiary text-on-primary py-3 rounded-xl font-inter font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Buy Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        ) : (
          <section className="px-4 md:px-margin-desktop max-w-container-max mx-auto py-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Featured Physical Product */}
              {physicalProducts
                .filter((p) => p.isFeatured)
                .map((p) => (
                  <div
                    key={p.title}
                    className="md:col-span-8 group relative aspect-[16/10] overflow-hidden rounded-3xl shadow-lg border border-outline-variant/20"
                  >
                    <div className="absolute inset-0 z-0">
                      <Image
                        fill
                        src={p.image}
                        alt={p.title}
                        sizes="(max-width: 1024px) 100vw, 896px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors z-1" />
                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex justify-between items-end glass-panel z-10">
                      <div>
                        <span className="font-inter text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">
                          {p.category}
                        </span>
                        <h3 className="font-playfair text-xl md:text-2xl font-bold mt-1 text-on-surface">
                          {p.title}
                        </h3>
                        <p className="text-tertiary font-montserrat font-bold mt-1.5">
                          {SafepayService.formatPKR(p.price)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <button
                          onClick={() =>
                            openQuickView({
                              title: p.title,
                              price: SafepayService.formatPKR(p.price),
                              category: p.category,
                              image: p.image,
                              description: p.description,
                            })
                          }
                          className="w-10 h-10 rounded-xl border border-outline/50 flex items-center justify-center hover:bg-tertiary hover:text-white hover:border-tertiary transition-all cursor-pointer bg-white/80 shrink-0"
                          aria-label="Quick View"
                        >
                          <Eye className="w-4 h-4 text-secondary hover:text-white" />
                        </button>
                        <button
                          onClick={() => {
                            addToCart({
                              title: p.title,
                              price: p.price,
                              image: p.image,
                              currency: "PKR",
                            });
                            setCartDrawerOpen(true);
                          }}
                          className="border border-outline-variant bg-white/90 hover:bg-zinc-100 text-secondary px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all font-inter font-bold text-xs tracking-wider uppercase active:scale-95 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Cart</span>
                        </button>
                        <button
                          onClick={() => handleDirectProductCheckout(p)}
                          className="bg-primary hover:bg-tertiary text-on-primary px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all font-inter font-bold text-xs tracking-wider uppercase shadow-md active:scale-95 cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Buy Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              {/* Small Physical Products */}
              {physicalProducts
                .filter((p) => !p.isFeatured)
                .map((p) => (
                  <div
                    key={p.title}
                    className="md:col-span-4 group relative aspect-square overflow-hidden rounded-3xl shadow-lg border border-outline-variant/20"
                  >
                    <div className="absolute inset-0 z-0">
                      <Image
                        fill
                        src={p.image}
                        alt={p.title}
                        sizes="(max-width: 768px) 100vw, 384px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors z-1" />
                    <div className="absolute bottom-0 left-0 w-full p-6 glass-panel translate-y-[70%] group-hover:translate-y-0 transition-transform duration-500 flex flex-col justify-between h-44 z-10">
                      <div>
                        <span className="font-inter text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">
                          {p.category}
                        </span>
                        <h3 className="font-playfair text-lg font-bold mt-1 text-on-surface">
                          {p.title}
                        </h3>
                        <p className="text-tertiary font-montserrat font-bold mt-1">
                          {SafepayService.formatPKR(p.price)}
                        </p>
                      </div>
                      <div className="flex gap-2 pt-2 items-center">
                        <button
                          onClick={() =>
                            openQuickView({
                              title: p.title,
                              price: SafepayService.formatPKR(p.price),
                              category: p.category,
                              image: p.image,
                              description: p.description,
                            })
                          }
                          className="border border-outline/50 hover:bg-secondary hover:text-white px-2.5 py-2 text-xs font-bold font-inter tracking-wider transition-all rounded-lg text-center cursor-pointer bg-white/80 shrink-0"
                          title="Quick View"
                        >
                          <Eye className="w-3.5 h-3.5 text-secondary hover:text-white" />
                        </button>
                        <button
                          onClick={() => {
                            addToCart({
                              title: p.title,
                              price: p.price,
                              image: p.image,
                              currency: "PKR",
                            });
                            setCartDrawerOpen(true);
                          }}
                          className="border border-outline-variant hover:border-tertiary bg-white/90 hover:bg-zinc-100 text-secondary px-2.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                          title="Add to cart"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDirectProductCheckout(p)}
                          className="bg-primary text-white hover:bg-tertiary flex-grow py-2 px-3 text-xs font-bold font-inter uppercase tracking-wider rounded-lg transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Buy</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-16">
              <OrbitViewer />
            </div>
          </section>
        )}
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
