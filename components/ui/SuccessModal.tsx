"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useStore } from "@/hooks/useStore";

export const SuccessModal: React.FC = () => {
  const { successModal, closeSuccessModal } = useStore();

  useEffect(() => {
    if (!successModal.isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [successModal.isOpen]);

  return (
    <AnimatePresence>
      {successModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSuccessModal}
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
            aria-labelledby="success-modal-title"
            className="glass-panel max-h-[calc(100dvh-2rem)] max-w-md w-full overflow-y-auto bg-white/95 dark:bg-zinc-900/95 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl z-10"
          >
            <div className="w-16 h-16 bg-tertiary/10 rounded-full flex items-center justify-center mx-auto text-tertiary">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3
              id="success-modal-title"
              className="font-playfair text-2xl font-bold text-secondary dark:text-zinc-100 break-words"
            >
              {successModal.title}
            </h3>
            <p className="font-inter text-sm text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
              {successModal.description}
            </p>
            <button
              onClick={closeSuccessModal}
              className="bg-primary hover:bg-tertiary text-on-primary w-full py-3.5 rounded-xl font-inter font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer"
            >
              CLOSE WINDOW
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
