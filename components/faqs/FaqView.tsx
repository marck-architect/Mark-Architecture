"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  X,
  ChevronDown,
  PhoneCall,
  Share2,
  ArrowRight,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useStore } from "@/hooks/useStore";
import { cn } from "@/lib/utils";
import {
  faqsData,
  faqCategories,
  aeoQuickFacts,
  type FaqCategory,
} from "@/data/faqs";

export const FaqView: React.FC = () => {
  const { showToast } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<FaqCategory["key"]>("all");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "how-much-does-an-architect-charge-in-pakistan": true,
    "does-mark-architects-provide-pda-and-cda-approved-drawings": true,
  });

  // Handle URL hash anchor on mount (deep linking for citations & AEO search engines)
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hashId = window.location.hash.replace("#", "");
      const exists = faqsData.find((f) => f.id === hashId);
      if (exists) {
        requestAnimationFrame(() => {
          setOpenItems((prev) => ({ ...prev, [hashId]: true }));
          const element = document.getElementById(hashId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        });
      }
    }
  }, []);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopyLink = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/faqs#${id}`;
      navigator.clipboard.writeText(url);
      showToast("Question anchor link copied to clipboard!");
    }
  };

  // Filtered questions based on search and category
  const filteredFaqs = useMemo(() => {
    return faqsData.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;

      if (!searchQuery.trim()) {
        return matchesCategory;
      }

      const q = searchQuery.toLowerCase();
      const matchesQuery =
        item.question.toLowerCase().includes(q) ||
        item.shortAnswer.toLowerCase().includes(q) ||
        item.fullAnswer.some((ans) => ans.toLowerCase().includes(q)) ||
        item.keywords.some((k) => k.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="relative overflow-x-hidden min-h-screen bg-surface dark:bg-zinc-950">
      {/* Editorial Header Section */}
      <header className="relative w-full pt-32 pb-16 border-b border-outline-variant/30 overflow-hidden">
        {/* Subtle Background Architectural Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

        {/* Large Subtle Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.03] dark:opacity-[0.05]">
          <span className="font-montserrat text-[20vw] font-black tracking-tighter">
            ANSWERS
          </span>
        </div>

        <div className="relative z-10 max-w-container-max mx-auto px-4 md:px-margin-desktop">
          <ScrollReveal>
            <div className="max-w-3xl space-y-6">
              <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl text-on-surface dark:text-zinc-100 font-normal leading-[1.12]">
                Architectural Clarity. <br />
                <span className="italic font-light text-tertiary">
                  Direct Answers for Every Query.
                </span>
              </h1>

              <p className="font-inter text-base md:text-lg text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                Clear, factual answers optimized for AI engines and discerning
                clients. Explore our authoritative guidelines on design fees,
                PDA &amp; CDA municipal approvals, and turnkey engineering
                packages.
              </p>
            </div>
          </ScrollReveal>

          {/* AEO Quick Facts / Metric Strip */}
          <ScrollReveal delay={0.1}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-10 p-4 rounded-2xl bg-surface-container-low/80 dark:bg-zinc-900/60 border border-outline-variant/30 backdrop-blur-md">
              {aeoQuickFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="px-3 py-2 space-y-1 border-l-2 border-tertiary/50 pl-3"
                >
                  <p className="text-[10px] font-inter font-bold text-zinc-500 uppercase tracking-wider">
                    {fact.label}
                  </p>
                  <p className="font-montserrat text-sm font-extrabold text-on-surface dark:text-zinc-200">
                    {fact.value}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Interactive Search Bar */}
          <ScrollReveal delay={0.15}>
            <div className="mt-8 max-w-2xl relative">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-tertiary pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask a question (e.g. 'how much for 1 kanal', 'pda approval', 'safepay')..."
                  className="w-full pl-12 pr-10 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 text-sm md:text-base font-inter focus:outline-none focus:ring-2 focus:ring-tertiary/40 shadow-sm transition-all"
                  aria-label="Search frequently asked questions"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 p-1 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </header>

      {/* Main FAQ Content Section */}
      <main className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-12 md:py-16">
        {/* Category Navigation Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-10">
          {faqCategories.map((cat) => {
            const isActive = activeCategory === cat.key;
            const count =
              cat.key === "all"
                ? faqsData.length
                : faqsData.filter((f) => f.category === cat.key).length;

            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-xs font-inter font-bold tracking-wider uppercase transition-all duration-300 whitespace-nowrap cursor-pointer flex items-center gap-2",
                  isActive
                    ? "bg-primary text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm"
                    : "bg-surface-container-low dark:bg-zinc-900 border border-outline-variant/40 text-on-surface-variant hover:border-tertiary hover:text-tertiary",
                )}
              >
                <span>{cat.label}</span>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full",
                    isActive
                      ? "bg-white/20 text-white dark:bg-zinc-950/20 dark:text-zinc-950"
                      : "bg-surface-container-high text-zinc-500",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results Counter if filtering */}
        {(searchQuery || activeCategory !== "all") && (
          <div className="flex items-center justify-between mb-6 text-xs font-inter text-zinc-500">
            <span>
              Showing {filteredFaqs.length} of {faqsData.length} answers
              {searchQuery && ` for "${searchQuery}"`}
            </span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="text-tertiary font-semibold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* FAQ Accordion List */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-20 bg-surface-container-low dark:bg-zinc-900/40 rounded-3xl border border-outline-variant/30 space-y-4">
            <p className="font-playfair text-2xl font-bold text-secondary dark:text-zinc-200">
              No matching questions found.
            </p>
            <p className="font-inter text-sm text-zinc-500 max-w-md mx-auto">
              We couldn&apos;t find an answer matching &ldquo;{searchQuery}
              &rdquo;. Our principal architects are available for a direct
              1-on-1 strategy call.
            </p>
            <div className="pt-2">
              <Link
                href="/consultation"
                className="bg-primary hover:bg-tertiary text-on-primary px-6 py-3 rounded-xl font-inter font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2"
              >
                <span>Ask via Consultation (PKR 3,000)</span>
                <PhoneCall className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => {
              const isOpen = Boolean(openItems[faq.id]);

              return (
                <article
                  key={faq.id}
                  id={faq.id}
                  className={cn(
                    "rounded-3xl border transition-all duration-300 scroll-mt-28 overflow-hidden",
                    isOpen
                      ? "bg-surface-container-low dark:bg-zinc-900 border-tertiary/40 shadow-sm"
                      : "bg-surface dark:bg-zinc-900/50 border-outline-variant/30 hover:border-outline-variant/70",
                  )}
                >
                  {/* Accordion Trigger Header */}
                  <button
                    type="button"
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                    className="w-full text-left p-6 md:p-7 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-inter font-bold uppercase tracking-wider text-tertiary">
                          {faq.category.replace("-", " ")}
                        </span>
                        <span className="text-zinc-300 dark:text-zinc-700">
                          •
                        </span>
                        <span className="text-[10px] font-inter text-zinc-400">
                          FAQ #{index + 1}
                        </span>
                      </div>
                      <h3 className="font-playfair text-lg md:text-xl font-bold text-on-surface dark:text-zinc-100 pr-4">
                        {faq.question}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-1">
                      {/* Copy Direct Anchor Link Button */}
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => handleCopyLink(faq.id, e)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleCopyLink(
                              faq.id,
                              e as unknown as React.MouseEvent,
                            );
                          }
                        }}
                        className="p-2 rounded-xl text-zinc-400 hover:text-tertiary hover:bg-tertiary/10 transition-colors cursor-pointer"
                        title="Copy direct link to this answer"
                        aria-label="Copy direct answer link"
                      >
                        <Share2 className="w-4 h-4" />
                      </span>

                      <div
                        className={cn(
                          "w-8 h-8 rounded-full border flex items-center justify-center transition-transform duration-300",
                          isOpen
                            ? "bg-tertiary text-white border-tertiary rotate-180"
                            : "border-outline-variant/50 text-zinc-400",
                        )}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </button>

                  {/* Accordion Answer Body */}
                  {isOpen && (
                    <div
                      id={`faq-answer-${faq.id}`}
                      className="px-6 md:px-7 pb-7 pt-2 space-y-4 border-t border-outline-variant/15"
                    >
                      {/* AEO Direct Snippet Callout (BLUF) */}
                      <div className="p-4 md:p-5 rounded-2xl bg-tertiary/10 border-l-4 border-tertiary space-y-1">
                        <span className="text-[10px] font-inter font-bold uppercase tracking-widest text-tertiary block">
                          Direct Answer Summary
                        </span>
                        <p className="font-inter text-sm md:text-base font-semibold text-on-surface dark:text-zinc-100 leading-relaxed">
                          {faq.shortAnswer}
                        </p>
                      </div>

                      {/* Extended Nuanced Answer */}
                      <div className="space-y-2 pt-1 font-inter text-xs md:text-sm text-on-surface-variant dark:text-zinc-300 font-light leading-relaxed">
                        {faq.fullAnswer.map((para, pIdx) => (
                          <p key={pIdx} className="flex items-start gap-2">
                            <span className="text-tertiary mt-1">•</span>
                            <span>{para}</span>
                          </p>
                        ))}
                      </div>

                      {/* Keywords & Entity Grounding */}
                      <div className="pt-3 flex flex-wrap items-center gap-1.5 border-t border-outline-variant/15">
                        <span className="text-[10px] font-inter font-bold text-zinc-400 mr-1 uppercase tracking-wider">
                          Related:
                        </span>
                        {faq.keywords.map((kw) => (
                          <span
                            key={kw}
                            className="text-[10px] font-inter px-2 py-0.5 rounded-md bg-surface-container dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {/* Bottom Conversion / Still Have Questions Card */}
        <section className="mt-16 p-8 md:p-12 rounded-3xl bg-surface-container-low dark:bg-zinc-900 border border-outline-variant/30 text-center space-y-6">
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="font-inter text-xs font-bold text-tertiary uppercase tracking-widest block">
              Personalized Guidance
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl font-normal text-on-surface dark:text-zinc-100">
              Have a custom estate or commercial plot?
            </h2>
            <p className="font-inter text-sm text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
              Every plot in Pakistan has distinct topography, sun exposure, and
              municipal by-laws. Upload your site plan for a tailored 1-on-1
              strategy audit.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
            <Link
              href="/consultation"
              className="bg-primary hover:bg-tertiary text-on-primary px-8 py-4 rounded-xl font-inter font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md active:scale-95 inline-flex items-center gap-2"
            >
              <span>Book Strategy Call (PKR 3,000)</span>
              <PhoneCall className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/portfolio"
              className="border border-outline-variant hover:border-tertiary hover:text-tertiary px-8 py-4 rounded-xl font-inter font-bold text-xs uppercase tracking-wider transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <span>Explore Realized Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};
