"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useStore } from "@/hooks/useStore";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ShoppingBag, Zap, CheckCircle2, Clock } from "lucide-react";
import { SafepayService } from "@/lib/safepay";
import { DirectCheckoutModal } from "@/components/collection/DirectCheckoutModal";
import { ProductsHero } from "@/components/collection/ProductsHero";
import type { ArchitecturalPackage, CheckoutItem } from "@/types";
import { architecturalPackages as fallbackPackages } from "@/data/collection";

interface CollectionViewProps {
  initialPackages?: ArchitecturalPackage[];
}

export const CollectionView: React.FC<CollectionViewProps> = ({
  initialPackages,
}) => {
  const packages =
    initialPackages && initialPackages.length > 0
      ? initialPackages
      : fallbackPackages;
  const { addToCart, setCartDrawerOpen } = useStore();
  const [checkoutModalItem, setCheckoutModalItem] =
    useState<CheckoutItem | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null,
  );

  const handleSelectPackage = (pkgId: string) => {
    setSelectedPackageId(pkgId);
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
      <ProductsHero packages={packages} onSelectPackage={handleSelectPackage} />

      {/* Catalog Section with Scroll Anchor */}
      <div id="collection-catalog" className="scroll-mt-20">
        <div className="px-4 md:px-margin-desktop max-w-container-max mx-auto pt-16">
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-6 flex-wrap gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary block">
                Standardized Architecture
              </span>
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-secondary dark:text-zinc-100 mt-1">
                Design and Review Packages
              </h2>
            </div>
            <span className="text-xs font-inter text-zinc-500 font-medium">
              {packages.length} Ready Packages Available
            </span>
          </div>
        </div>

        {/* Packages Grid */}
        <section className="px-4 md:px-margin-desktop max-w-container-max mx-auto py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.length === 0 ? (
              <div className="col-span-full py-20 text-center border border-dashed border-outline-variant/30 rounded-3xl p-8 bg-surface-container-low/40 dark:bg-zinc-900/30">
                <p className="font-playfair text-2xl text-on-surface dark:text-zinc-200">
                  No standardized packages published yet
                </p>
                <p className="font-inter text-sm text-zinc-500 mt-2 max-w-md mx-auto">
                  Ready architectural packages will appear here once configured
                  and published from the admin dashboard.
                </p>
              </div>
            ) : (
              packages.map((pkg, idx) => (
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
              ))
            )}
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
