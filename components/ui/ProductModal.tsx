"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import Image from "next/image";

export const ProductModal: React.FC = () => {
  const { quickView, closeQuickView, addToCart } = useStore();

  useEffect(() => {
    if (!quickView.isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [quickView.isOpen]);

  const handleAddToCart = () => {
    if (!quickView.product) return;

    // Parse price string (e.g. "$8,400") to number
    const priceNum = parseInt(
      quickView.product.price.replace(/[^0-9]/g, ""),
      10,
    );

    addToCart({
      title: quickView.product.title,
      price: priceNum,
      image: quickView.product.image,
    });

    closeQuickView();
  };

  return (
    <AnimatePresence>
      {quickView.isOpen && quickView.product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain p-3 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuickView}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            role="dialog"
            aria-modal="true"
            aria-label="Product details"
            className="glass-panel w-full max-w-3xl bg-white/95 dark:bg-zinc-900/95 rounded-3xl shadow-2xl overflow-hidden relative max-h-[calc(100dvh-1.5rem)] sm:max-h-[90vh] flex flex-col z-10"
          >
            <button
              onClick={closeQuickView}
              className="absolute top-3.5 right-3.5 z-20 p-2.5 rounded-full bg-white/80 hover:bg-white dark:bg-zinc-800/80 dark:hover:bg-zinc-700 shadow-md transition-all focus:outline-none cursor-pointer"
              aria-label="Close Modal"
            >
              <X className="text-secondary w-5 h-5 dark:text-zinc-300" />
            </button>

            <div
              data-lenis-prevent
              className="overflow-y-auto overscroll-contain flex-grow touch-pan-y"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="aspect-square bg-surface-container dark:bg-zinc-800 relative w-full h-full min-h-[220px] sm:min-h-[300px]">
                  <Image
                    fill
                    src={quickView.product.image}
                    alt={quickView.product.title}
                    sizes="(max-width: 768px) 100vw, 384px"
                    priority
                    className="object-cover"
                  />
                </div>
                <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 flex flex-col justify-center">
                  <div className="space-y-1.5 sm:space-y-2">
                    <span className="font-inter text-[10px] font-bold text-tertiary tracking-widest uppercase">
                      {quickView.product.category}
                    </span>
                    <h3 className="font-playfair text-xl sm:text-2xl md:text-3xl font-bold text-secondary dark:text-zinc-100">
                      {quickView.product.title}
                    </h3>
                    <p className="text-secondary dark:text-tertiary-fixed font-montserrat font-extrabold text-lg sm:text-xl">
                      {quickView.product.price}
                    </p>
                  </div>
                  <p className="font-inter text-xs sm:text-sm text-on-surface-variant font-light leading-relaxed dark:text-zinc-400">
                    {quickView.product.description}
                  </p>

                  <div className="pt-4 border-t border-outline-variant/20 flex gap-4">
                    <button
                      onClick={handleAddToCart}
                      className="flex-grow bg-primary hover:bg-tertiary text-on-primary py-3.5 rounded-xl font-inter font-bold text-xs tracking-wider uppercase transition-colors active:scale-95 flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>ADD TO COLLECTION</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
