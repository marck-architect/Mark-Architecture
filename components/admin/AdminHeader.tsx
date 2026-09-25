"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { LogOut, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import type { AdminHeaderProps } from "@/types";

export const AdminHeader: React.FC<AdminHeaderProps> = ({ adminEmail }) => {
  const router = useRouter();
  const supabase = createClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/markarchit/admin/login");
    router.refresh();
  };

  const handleLockPortal = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/auth/lock", { method: "POST" });
      await supabase.auth.signOut();
    } catch {
      // Fallback
    }
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 border-b border-stone-200/80 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Badge */}
        <div className="flex items-center gap-3">
          <Link
            href="/markarchit/admin"
            className="flex items-center gap-2.5 text-stone-900 hover:text-[#7E5714] transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center p-1.5 group-hover:scale-105 transition-transform">
              <Image
                src="/images/icon-dark.png"
                alt="MARK"
                width={20}
                height={20}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-playfair text-base sm:text-lg font-medium tracking-wide">
                MARK Architects
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] tracking-widest text-[#7E5714] uppercase font-semibold bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                Admin Atelier
              </span>
            </div>
          </Link>
        </div>

        {/* Right Section: Admin Profile & Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Admin Email Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200/80 text-stone-700 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] text-stone-700">
              {adminEmail}
            </span>
          </div>

          {/* Return to Public Website */}
          <Link
            href="/"
            target="_blank"
            className="text-xs text-stone-600 hover:text-stone-900 transition-colors hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 hover:border-stone-300 bg-stone-50/70"
          >
            <span>Live Site</span>
          </Link>

          {/* Lock Portal Button */}
          <button
            onClick={handleLockPortal}
            disabled={isLoggingOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all cursor-pointer disabled:opacity-50"
            title="Lock Portal (Revoke URL Key Cookie and return to Live Site)"
          >
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Lock Portal</span>
          </button>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:text-rose-600 hover:bg-rose-50 border border-stone-200 hover:border-rose-200 transition-all cursor-pointer disabled:opacity-50"
            title="Sign out of Admin Session"
          >
            {isLoggingOut ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <LogOut className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
