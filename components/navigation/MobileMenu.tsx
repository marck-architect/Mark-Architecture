"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/hooks/useStore";
import { cn } from "@/lib/utils";
import { mobileMenuLinks } from "@/data/navigation";

export const MobileMenu: React.FC = () => {
  const { mobileMenuOpen, setMobileMenuOpen } = useStore();

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen, setMobileMenuOpen]);

  return (
    <>
      {/* Mobile backdrop overlay */}
      <div
        className={cn(
          "fixed inset-0 top-[4.5rem] z-[60] bg-black/50 backdrop-blur-xs transition-opacity duration-300 lg:hidden",
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-down Menu Drawer */}
      <div
        data-lenis-prevent
        className={cn(
          "fixed inset-x-0 top-[4.5rem] z-[65] border-t border-outline-variant/30 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl px-5 sm:px-6 py-6 sm:py-8 shadow-2xl transition-all duration-300 transform origin-top lg:hidden max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain",
          mobileMenuOpen
            ? "scale-y-100 opacity-100"
            : "scale-y-0 opacity-0 pointer-events-none",
        )}
      >
        <div className="flex flex-col gap-4 sm:gap-5 max-w-sm mx-auto">
          {mobileMenuLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
              className="font-inter text-base font-semibold text-on-surface hover:text-tertiary transition-colors py-1.5 flex items-center min-h-[44px]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/consultation"
            prefetch={true}
            onClick={() => setMobileMenuOpen(false)}
            className="w-full bg-primary text-on-primary py-3.5 rounded-xl font-bold mt-2 text-center block shadow-md hover:bg-tertiary active:scale-98 transition-all min-h-[48px] flex items-center justify-center font-inter text-xs uppercase tracking-wider"
          >
            Book Discovery Call
          </Link>
        </div>
      </div>
    </>
  );
};
