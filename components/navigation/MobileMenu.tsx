"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/hooks/useStore";
import { cn } from "@/lib/utils";
import { mobileMenuLinks } from "@/data/navigation";

export const MobileMenu: React.FC = () => {
  const { mobileMenuOpen, setMobileMenuOpen } = useStore();

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-[73px] z-30 border-t border-outline-variant/30 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl px-6 py-8 shadow-xl transition-all duration-300 transform origin-top lg:hidden",
        mobileMenuOpen
          ? "scale-y-100 opacity-100"
          : "scale-y-0 opacity-0 pointer-events-none",
      )}
    >
      <div className="flex flex-col gap-5">
        {mobileMenuLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMobileMenuOpen(false)}
            className="font-inter text-base font-semibold text-on-surface hover:text-tertiary transition-colors"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/consultation"
          onClick={() => setMobileMenuOpen(false)}
          className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold mt-2 text-center block shadow-md hover:bg-tertiary transition-colors"
        >
          Book Discovery Call
        </Link>
      </div>
    </div>
  );
};
