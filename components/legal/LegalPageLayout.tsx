"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Printer,
  Share2,
  Check,
  ChevronRight,
  Shield,
  FileText,
  Mail,
  MapPin,
  ArrowUp,
  Clock,
  Calendar,
  Lock,
} from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { cn } from "@/lib/utils";

export interface LegalSectionItem {
  id: string;
  title: string;
  badge?: string;
}

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  documentType: "Privacy Policy" | "Terms of Service";
  effectiveDate: string;
  lastUpdated: string;
  version: string;
  sections: LegalSectionItem[];
  children: React.ReactNode;
}

export const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({
  title,
  subtitle,
  documentType,
  effectiveDate,
  lastUpdated,
  version,
  sections,
  children,
}) => {
  const { showToast } = useStore();
  const [activeSection, setActiveSection] = useState<string>(
    sections[0]?.id || "",
  );
  const [copiedLink, setCopiedLink] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitor scroll for active section highlight and scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      showToast("Document URL copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen bg-surface dark:bg-zinc-950 font-inter text-on-surface dark:text-zinc-100 selection:bg-tertiary-fixed selection:text-on-tertiary-fixed">
      {/* Background Subtle Drafting Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Hero Header */}
      <header className="relative pt-32 pb-14 md:pt-40 md:pb-16 border-b border-outline-variant/30 dark:border-zinc-800/80 bg-gradient-to-b from-surface via-surface to-stone-50/60 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-mono text-stone-500 dark:text-zinc-400 mb-6"
          >
            <Link
              href="/"
              className="hover:text-tertiary dark:hover:text-amber-400 transition-colors"
            >
              Atelier Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 dark:text-zinc-600" />
            <span className="text-stone-400 dark:text-zinc-500">
              Legal Governance
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 dark:text-zinc-600" />
            <span className="font-semibold text-tertiary dark:text-amber-400">
              {documentType}
            </span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#7E5714] dark:text-amber-400 text-xs font-mono font-semibold">
                {documentType === "Privacy Policy" ? (
                  <Shield className="w-3.5 h-3.5" />
                ) : (
                  <FileText className="w-3.5 h-3.5" />
                )}
                <span>Statutory Compliance & Legal Standards</span>
              </div>

              <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-stone-900 dark:text-white leading-[1.15]">
                {title}
              </h1>

              <p className="text-sm sm:text-base text-stone-600 dark:text-zinc-400 font-light leading-relaxed max-w-2xl">
                {subtitle}
              </p>
            </div>

            {/* Quick Actions & Metadata Pill */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 pt-2 lg:pt-0">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-zinc-800 transition-all text-xs font-semibold inline-flex items-center gap-2 shadow-2xs cursor-pointer active:scale-95"
                title="Print or save as PDF"
              >
                <Printer className="w-4 h-4 text-stone-500 dark:text-zinc-400" />
                <span>Print PDF</span>
              </button>

              <button
                onClick={handleShare}
                className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-zinc-800 transition-all text-xs font-semibold inline-flex items-center gap-2 shadow-2xs cursor-pointer active:scale-95"
                title="Copy link to document"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-700 dark:text-emerald-400">
                      Copied!
                    </span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-stone-500 dark:text-zinc-400" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Document Metadata Strip */}
          <div className="mt-8 pt-6 border-t border-stone-200/80 dark:border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span className="text-stone-400 dark:text-zinc-500 block text-[10px] uppercase">
                Effective Date
              </span>
              <span className="text-stone-800 dark:text-zinc-300 font-medium mt-0.5 block">
                {effectiveDate}
              </span>
            </div>
            <div>
              <span className="text-stone-400 dark:text-zinc-500 block text-[10px] uppercase">
                Last Revision
              </span>
              <span className="text-stone-800 dark:text-zinc-300 font-medium mt-0.5 block">
                {lastUpdated}
              </span>
            </div>
            <div>
              <span className="text-stone-400 dark:text-zinc-500 block text-[10px] uppercase">
                Document Version
              </span>
              <span className="text-stone-800 dark:text-zinc-300 font-medium mt-0.5 block">
                v{version} (PCATP / SBP)
              </span>
            </div>
            <div>
              <span className="text-stone-400 dark:text-zinc-500 block text-[10px] uppercase">
                Governing Law
              </span>
              <span className="text-stone-800 dark:text-zinc-300 font-medium mt-0.5 block truncate">
                Islamic Republic of Pakistan
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Two-Column Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Sticky Left Sidebar: Table of Contents */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28 self-start space-y-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-100 dark:border-zinc-800">
                <FileText className="w-4 h-4 text-tertiary dark:text-amber-400" />
                <h3 className="font-mono text-xs uppercase font-bold tracking-wider text-stone-700 dark:text-zinc-200">
                  Contents Index
                </h3>
              </div>

              <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
                {sections.map((section, idx) => {
                  const isActive = activeSection === section.id;
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className={cn(
                        "group flex items-start gap-2.5 px-3 py-2 rounded-xl text-xs transition-all duration-200",
                        isActive
                          ? "bg-stone-100 dark:bg-zinc-800 text-stone-900 dark:text-white font-semibold"
                          : "text-stone-600 dark:text-zinc-400 hover:bg-stone-50 dark:hover:bg-zinc-800/60 hover:text-stone-900 dark:hover:text-zinc-200",
                      )}
                    >
                      <span
                        className={cn(
                          "font-mono text-[10px] font-bold mt-0.5 shrink-0 w-4",
                          isActive
                            ? "text-tertiary dark:text-amber-400"
                            : "text-stone-400 dark:text-zinc-500 group-hover:text-stone-600 dark:group-hover:text-zinc-400",
                        )}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="leading-snug">{section.title}</span>
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Atelier Contact Card */}
            <div className="p-5 rounded-2xl bg-stone-900 text-white border border-stone-800 shadow-md space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>Atelier Legal Counsel</span>
              </div>
              <p className="text-xs text-stone-300 font-light leading-relaxed">
                For contract inquiries, municipal power of attorney, or CAD
                licensing queries, reach our legal desk:
              </p>
              <div className="pt-1 space-y-2 text-xs">
                <a
                  href="mailto:briefs@markarchitects.com"
                  className="flex items-center gap-2 text-stone-300 hover:text-amber-300 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">briefs@markarchitects.com</span>
                </a>
                <div className="flex items-start gap-2 text-stone-400 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    4A, Al-Haj Sher Tower, Ring Rd, Peshawar / Islamabad
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Legal Content */}
          <main className="lg:col-span-8 min-w-0 prose prose-stone dark:prose-invert max-w-none">
            {children}
          </main>
        </div>
      </div>

      {/* Floating Scroll To Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20 dark:border-zinc-800"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
