"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, MapPin } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import Image from "next/image";

export const LightboxModal: React.FC = () => {
  const { lightbox, closeLightbox } = useStore();

  useEffect(() => {
    if (!lightbox.isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [lightbox.isOpen]);

  return (
    <AnimatePresence>
      {lightbox.isOpen && lightbox.project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain p-3 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            role="dialog"
            aria-modal="true"
            aria-label="Project details"
            className="w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl flex flex-col relative max-h-[calc(100dvh-1.5rem)] sm:max-h-[90vh] z-10"
          >
            <button
              onClick={closeLightbox}
              className="absolute top-3.5 right-3.5 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black text-white transition-all focus:outline-none cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="flex-grow flex items-center justify-center bg-black overflow-hidden relative min-h-[220px] sm:min-h-[300px] md:min-h-[450px]">
              <Image
                fill
                src={lightbox.project.imageSrc}
                alt={lightbox.project.title}
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-contain"
              />
            </div>

            <div
              data-lenis-prevent
              className="bg-inverse-surface dark:bg-zinc-950 p-4 sm:p-6 md:p-8 text-white space-y-3 sm:space-y-4 z-10 overflow-y-auto max-h-[45vh] sm:max-h-none"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4">
                <div>
                  <span className="font-inter text-[10px] font-bold text-tertiary-fixed uppercase tracking-wider">
                    {lightbox.project.category}
                  </span>
                  <h3 className="font-playfair text-xl sm:text-2xl font-bold mt-0.5 text-white">
                    {lightbox.project.title}
                  </h3>
                  <div className="font-inter text-xs text-white/50 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3 h-3 text-tertiary shrink-0" />
                    <span>{lightbox.project.location}</span>
                  </div>
                </div>
                <div className="text-left sm:text-right flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
                  <span className="font-montserrat text-sm sm:text-lg font-light text-white/40">
                    {lightbox.project.year}
                  </span>
                  {lightbox.project.price && (
                    <span className="font-montserrat text-xs md:text-sm font-bold text-tertiary-fixed-dim bg-tertiary/20 px-3 py-1 rounded-full border border-tertiary/30 uppercase tracking-wider block">
                      {lightbox.project.price}
                    </span>
                  )}
                </div>
              </div>
              <p className="font-inter text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                {lightbox.project.description}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
