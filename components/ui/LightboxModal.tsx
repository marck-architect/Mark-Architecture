'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, MapPin } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import Image from 'next/image';

export const LightboxModal: React.FC = () => {
  const { lightbox, closeLightbox } = useStore();

  return (
    <AnimatePresence>
      {lightbox.isOpen && lightbox.project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl flex flex-col relative max-h-[90vh] z-10"
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 hover:bg-black text-white transition-all focus:outline-none cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="flex-grow flex items-center justify-center bg-black overflow-hidden relative min-h-[300px] md:min-h-[450px]">
              <Image
                fill
                src={lightbox.project.imageSrc}
                alt={lightbox.project.title}
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-contain"
              />
            </div>

            <div className="bg-inverse-surface dark:bg-zinc-950 p-6 md:p-8 text-white space-y-4 z-10">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="font-inter text-[10px] font-bold text-tertiary-fixed uppercase tracking-wider">
                    {lightbox.project.category}
                  </span>
                  <h3 className="font-playfair text-2xl font-bold mt-1 text-white">
                    {lightbox.project.title}
                  </h3>
                  <div className="font-inter text-xs text-white/50 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3 h-3 text-tertiary" />
                    <span>{lightbox.project.location}</span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="font-montserrat text-lg font-light text-white/40">
                    {lightbox.project.year}
                  </span>
                  {lightbox.project.price && (
                    <span className="font-montserrat text-xs md:text-sm font-bold text-tertiary-fixed-dim bg-tertiary/20 px-3 py-1 rounded-full border border-tertiary/30 uppercase tracking-wider block mt-1">
                      {lightbox.project.price}
                    </span>
                  )}
                </div>
              </div>
              <p className="font-inter text-sm text-white/70 font-light leading-relaxed">
                {lightbox.project.description}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
