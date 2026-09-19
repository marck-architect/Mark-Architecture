"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  SearchX,
  X,
  ChevronDown,
  PhoneCall,
  Share2,
  ArrowRight,
  ArrowDown,
  Video,
  HelpCircle,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useStore } from "@/hooks/useStore";
import { cn } from "@/lib/utils";
import {
  faqsData as fallbackFaqs,
  faqCategories,
  aeoQuickFacts,
  type FaqCategory,
} from "@/data/faqs";
import type { AdminFaq } from "@/types";

interface FaqViewProps {
  initialFaqs?: (AdminFaq | any)[];
}

export const FaqView: React.FC<FaqViewProps> = ({ initialFaqs }) => {
  const { showToast } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categoriesList = useMemo(() => {
    const list: { key: string; label: string; description?: string }[] = [
      ...faqCategories,
    ];

    if (initialFaqs && Array.isArray(initialFaqs)) {
      initialFaqs.forEach((f: any) => {
        if (!f.category) return;
        const cat = String(f.category).trim();
        const exists = list.some(
          (c) =>
            c.key.toLowerCase() === cat.toLowerCase() ||
            c.label.toLowerCase() === cat.toLowerCase(),
        );
        if (!exists) {
          list.push({
            key: cat.toLowerCase().replace(/\s+/g, "-"),
            label: cat,
            description: `Questions and guidelines about ${cat}.`,
          });
        }
      });
    }

    return list;
  }, [initialFaqs]);

  const isCategoryMatch = (itemCat: string, targetKey: string) => {
    if (targetKey === "all") return true;
    const itemLower = (itemCat || "").toLowerCase().trim();
    const targetLower = (targetKey || "").toLowerCase().trim();
    if (itemLower === targetLower) return true;
    if (itemLower.replace(/\s+/g, "-") === targetLower) return true;
    if (
      targetLower === "pricing" &&
      (itemLower.includes("pricing") || itemLower.includes("payment"))
    )
      return true;
    if (
      targetLower === "consultation" &&
      (itemLower.includes("consult") || itemLower.includes("booking"))
    )
      return true;
    if (
      targetLower === "approvals" &&
      (itemLower.includes("approval") ||
        itemLower.includes("pda") ||
        itemLower.includes("cda"))
    )
      return true;
    if (
      targetLower === "drawings" &&
      (itemLower.includes("drawing") || itemLower.includes("deliverable"))
    )
      return true;
    if (
      targetLower === "passive-solar" &&
      (itemLower.includes("solar") || itemLower.includes("passive"))
    )
      return true;
    return false;
  };

  const faqsData = useMemo(() => {
    const source =
      initialFaqs && initialFaqs.length > 0 ? initialFaqs : fallbackFaqs;
    return source.map((f: any, idx: number) => ({
      id: f.id || `faq-${idx}`,
      category: f.category || "general",
      question: f.question,
      shortAnswer: f.shortAnswer || f.answer || "",
      fullAnswer:
        Array.isArray(f.fullAnswer) && f.fullAnswer.length > 0
          ? f.fullAnswer
          : [f.answer || ""],
      keywords: Array.isArray(f.keywords)
        ? f.keywords
        : ["architecture", "mark-architects"],
      relatedLinks: f.relatedLinks || [],
    }));
  }, [initialFaqs]);

  // Single-open accordion: only one answer expanded at a time, so a
  // non-technical visitor is never scanning several long answer blocks at
  // once — opening a new question closes whichever was open before.
  const [openId, setOpenId] = useState<string | null>(
    "how-much-does-an-architect-charge-in-pakistan",
  );

  // Handle URL hash anchor on mount (deep linking for citations & AEO search engines)
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hashId = window.location.hash.replace("#", "");
      const exists = faqsData.find((f) => f.id === hashId);
      if (exists) {
        requestAnimationFrame(() => {
          setOpenId(hashId);
          const element = document.getElementById(hashId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        });
      }
    }
  }, []);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
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
      const matchesCategory = isCategoryMatch(item.category, activeCategory);

      if (!searchQuery.trim()) {
        return matchesCategory;
      }

      const q = searchQuery.toLowerCase();
      const matchesQuery =
        item.question.toLowerCase().includes(q) ||
        item.shortAnswer.toLowerCase().includes(q) ||
        item.fullAnswer.some((ans: string) => ans.toLowerCase().includes(q)) ||
        item.keywords.some((k: string) => k.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, activeCategory, faqsData]);

  return (
    <div className="relative overflow-x-hidden min-h-screen bg-surface dark:bg-zinc-950">
      {/* Editorial Header Section - Whole-screen Architectural Hero */}
      <header className="relative w-full min-h-[100dvh] flex items-center overflow-hidden border-b border-outline-variant/30">
        {/* Subtle Background Architectural Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

        {/* Large Subtle Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.03] dark:opacity-[0.05]">
          <span className="font-montserrat text-[20vw] font-black tracking-tighter">
            ANSWERS
          </span>
        </div>

        <div className="relative z-10 w-full max-w-container-max mx-auto px-4 md:px-margin-desktop pt-28 pb-16 sm:py-20 flex flex-col justify-center">
          <ScrollReveal>
            <div className="max-w-3xl space-y-5 sm:space-y-6">
              <h1
                className="font-playfair text-on-surface dark:text-zinc-100 font-normal leading-[1.12]"
                style={{ fontSize: "clamp(2.25rem, 1.75rem + 2.5vw, 3.75rem)" }}
              >
                Got Questions? <br />
                <span className="font-light text-tertiary">
                  We Have Clear Answers.
                </span>
              </h1>

              <p
                className="font-inter text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed"
                style={{
                  fontSize: "clamp(0.9375rem, 0.85rem + 0.3vw, 1.125rem)",
                }}
              >
                Straight answers to the questions we hear most, covering design
                fees, PDA and CDA approvals, and how our turnkey packages work.
              </p>

              {/* Action Buttons matching site header standards */}
              <div className="pt-2 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-stretch sm:items-center">
                <a
                  href="#faq-catalog"
                  className="w-full sm:w-auto bg-primary hover:bg-tertiary text-on-primary px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold tracking-wider transition-all duration-300 shadow-md active:scale-95 text-center inline-flex items-center justify-center gap-2 font-inter text-xs uppercase cursor-pointer min-h-[48px]"
                >
                  <span>Explore Questions</span>
                  <ArrowDown className="w-4 h-4" />
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </header>

      {/* Main FAQ Content Section */}
      <main
        id="faq-catalog"
        className="scroll-mt-20 max-w-container-max mx-auto px-4 md:px-margin-desktop py-12 md:py-16"
      >
        {/* Category Navigation Pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categoriesList.map((cat) => {
            const isActive = activeCategory === cat.key;
            const count =
              cat.key === "all"
                ? faqsData.length
                : faqsData.filter((f) => isCategoryMatch(f.category, cat.key))
                    .length;

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
            <div className="w-12 h-12 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center mx-auto">
              {faqsData.length === 0 ? (
                <HelpCircle className="w-5 h-5" />
              ) : (
                <SearchX className="w-5 h-5" />
              )}
            </div>
            <p className="font-playfair text-2xl font-bold text-secondary dark:text-zinc-200">
              {faqsData.length === 0
                ? "No questions published yet."
                : "No matching questions found."}
            </p>
            <p className="font-inter text-sm text-zinc-500 max-w-md mx-auto">
              {faqsData.length === 0
                ? "Frequently asked questions and client guidelines will appear here once published from the admin dashboard."
                : `We couldn't find an answer matching "${searchQuery}". Our principal architects are available for a direct 1-on-1 strategy call.`}
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
              const isOpen = openId === faq.id;

              return (
                <ScrollReveal key={faq.id} delay={Math.min(index * 0.04, 0.4)}>
                  <article
                    id={faq.id}
                    className={cn(
                      "rounded-3xl border transition-colors duration-300 scroll-mt-28 overflow-hidden",
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

                    {/* Accordion Answer Body — CSS grid 0fr/1fr collapse: a
                      pure-CSS, GPU-cheap height animation (no JS height
                      measurement, no layout thrash) that keeps the full
                      answer permanently in the DOM rather than mounting it
                      only when opened, which also means AEO crawlers can
                      always read the complete answer text. */}
                    <div
                      style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                      className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
                    >
                      <div
                        id={`faq-answer-${faq.id}`}
                        className={cn(
                          "overflow-hidden transition-opacity duration-300 motion-reduce:transition-none",
                          isOpen ? "opacity-100" : "opacity-0",
                        )}
                      >
                        <div className="px-6 md:px-7 pb-7 pt-2 space-y-4 border-t border-outline-variant/15">
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
                            {faq.fullAnswer.map(
                              (para: string, pIdx: number) => (
                                <p
                                  key={pIdx}
                                  className="flex items-start gap-2"
                                >
                                  <span className="text-tertiary mt-1">•</span>
                                  <span>{para}</span>
                                </p>
                              ),
                            )}
                          </div>

                          {/* Keywords & Entity Grounding */}
                          <div className="pt-3 flex flex-wrap items-center gap-1.5 border-t border-outline-variant/15">
                            <span className="text-[10px] font-inter font-bold text-zinc-400 mr-1 uppercase tracking-wider">
                              Related:
                            </span>
                            {faq.keywords.map((kw: string) => (
                              <span
                                key={kw}
                                className="text-[10px] font-inter px-2 py-0.5 rounded-md bg-surface-container dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </ScrollReveal>
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
