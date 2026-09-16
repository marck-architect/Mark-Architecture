"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { useStore } from "@/hooks/useStore";

export const Toast: React.FC = () => {
  const { toast } = useStore();

  return (
    <AnimatePresence>
      {toast.isOpen && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 glass-panel-dark text-white text-xs px-5 py-3.5 rounded-xl flex items-start gap-3 shadow-2xl pointer-events-none"
        >
          {toast.type === "success" ? (
            <CheckCircle className="text-tertiary w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertTriangle className="text-red-500 w-5 h-5 flex-shrink-0" />
          )}
          <span className="min-w-0 break-words font-inter font-medium tracking-wide">
            {toast.message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
