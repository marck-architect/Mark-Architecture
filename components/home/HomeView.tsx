"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TextReveal } from "@/components/ui/TextReveal";
import { HeroCinematic } from "@/components/home/HeroCinematic";
import { CredentialsRow } from "@/components/home/CredentialsRow";
import {
  MapPin,
  ArrowRight,
  Clock,
  PhoneCall,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Star,
  Award,
} from "lucide-react";

import {
  featuredServices as fallbackFeaturedServices,
  curatedProjects as fallbackCuratedProjects,
} from "@/data/home";
import type {
  FeaturedService,
  CuratedProject,
  AdminTestimonial,
} from "@/types";

interface HomeViewProps {
  initialFeaturedServices?: FeaturedService[];
  initialCuratedProjects?: CuratedProject[];
  initialTestimonials?: AdminTestimonial[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  initialFeaturedServices,
  initialCuratedProjects,
  initialTestimonials,
}) => {
  const featuredServices =
    initialFeaturedServices && initialFeaturedServices.length > 0
      ? initialFeaturedServices
      : fallbackFeaturedServices;
  const curatedProjects =
    initialCuratedProjects && initialCuratedProjects.length > 0
      ? initialCuratedProjects
      : fallbackCuratedProjects;

  const testimonials = useMemo(() => {
    return (initialTestimonials || []).filter((t) => t.is_published !== false);
  }, [initialTestimonials]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (testimonials.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length, isPaused]);

  useEffect(() => {
    if (currentIndex >= testimonials.length && testimonials.length > 0) {
      setCurrentIndex(0);
    }
  }, [testimonials.length, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1,
    );
  };

  const currentTestimonial = testimonials[currentIndex];
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f7f4ef]">
      {/* Hero: interactive orbit viewer that crossfades into a scroll-driven
          balcony push-in on desktop (see HeroCinematic) — one continuous
          pinned section, not a separate section stacked below it. */}
      <HeroCinematic />

      {/* Practice Principles Tailored to Pakistan */}
      <section className="mx-auto max-w-container-max px-4 py-24 md:px-margin-desktop md:py-32">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <ScrollReveal>
            <span className="font-inter text-xs font-bold uppercase tracking-[0.3em] text-[#8a6125] md:text-sm">
              The MARK standard
            </span>
            <h2 className="font-playfair text-4xl font-normal leading-[1.05] text-[#272522] md:text-6xl">
              Beauty is better when it performs.
            </h2>
            <p className="font-inter text-base font-light leading-relaxed text-[#77716a]">
              We engineer luxury spaces with mathematical precision, resolving
              local soil conditions, earthquake resistance, and passive cooling.
            </p>
          </ScrollReveal>
        </div>

        <CredentialsRow />
      </section>

      {/* Testimonials Carousel Section (Interactive Architectural Carousel - Text Only, No Image) */}
      {testimonials.length > 0 && currentTestimonial && (
        <section
          className="relative overflow-hidden bg-[#292722] px-4 py-24 text-white md:px-margin-desktop md:py-32"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Subtle architectural background geometry */}
          <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full border border-[#c9a86e]/15" />
          <div className="pointer-events-none absolute -right-8 top-8 h-80 w-80 rounded-full border border-[#c9a86e]/10" />
          <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full border border-[#c9a86e]/10" />

          <div className="max-w-4xl mx-auto relative z-10">
            {/* Eyebrow and Section Header */}
            <div className="text-center mb-10 md:mb-14">
              <ScrollReveal>
                <span className="font-inter text-xs font-bold uppercase tracking-[0.3em] text-[#c9a86e]">
                  Client Testimonials &amp; Endorsements
                </span>
                <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-normal text-white mt-2">
                  Trusted by Homeowners and Developers
                </h2>
              </ScrollReveal>
            </div>

            {/* Testimonial Carousel Card */}
            <ScrollReveal delay={0.1}>
              <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xs p-6 sm:p-10 md:p-14 shadow-2xl transition-all duration-500">
                {/* Top Row: Rating, Featured Badge & Linked Project */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    {/* Rating Stars */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            i < (currentTestimonial.rating || 5)
                              ? "fill-[#e8c889] text-[#e8c889]"
                              : "text-white/20"
                          }`}
                        />
                      ))}
                    </div>
                    {currentTestimonial.is_featured && (
                      <span className="px-2.5 py-0.5 bg-[#e8c889]/20 border border-[#e8c889]/40 text-[#e8c889] text-[10px] font-mono uppercase tracking-widest rounded-full">
                        Featured
                      </span>
                    )}
                  </div>

                  {currentTestimonial.project_title && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] font-mono text-[#e8c889]">
                      <Award className="w-3.5 h-3.5 text-[#e8c889]" />
                      <span>{currentTestimonial.project_title}</span>
                    </div>
                  )}
                </div>

                {/* Quote Content */}
                <div className="py-8 sm:py-10">
                  <span className="block font-playfair text-6xl sm:text-7xl leading-none text-[#e8c889]/30 select-none mb-2">
                    “
                  </span>
                  <blockquote className="font-playfair text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed text-[#f7f4ef]">
                    &ldquo;{currentTestimonial.review}&rdquo;
                  </blockquote>
                </div>

                {/* Author Info & Carousel Controls */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-6 border-t border-white/10">
                  <div>
                    <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#e8c889]">
                      {currentTestimonial.client_name}
                    </h3>
                    {(currentTestimonial.position ||
                      currentTestimonial.company) && (
                      <p className="font-inter text-xs sm:text-sm font-medium text-white/60 uppercase tracking-widest mt-1">
                        {[
                          currentTestimonial.position,
                          currentTestimonial.company,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                  </div>

                  {/* Carousel Controls */}
                  {testimonials.length > 1 && (
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-white/50 tracking-widest mr-2">
                        {String(currentIndex + 1).padStart(2, "0")} /{" "}
                        {String(testimonials.length).padStart(2, "0")}
                      </span>
                      <button
                        onClick={handlePrev}
                        aria-label="Previous Testimonial"
                        className="p-2.5 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-[#e8c889] hover:bg-[#e8c889]/10 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNext}
                        aria-label="Next Testimonial"
                        className="p-2.5 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-[#e8c889] hover:bg-[#e8c889]/10 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Dots indicator for multiple testimonials */}
              {testimonials.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Go to testimonial ${idx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentIndex
                          ? "w-8 bg-[#e8c889]"
                          : "w-2 bg-white/30 hover:bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-10 text-xs text-white/60">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#e8c889] shrink-0" />
                  <span>PCATP Registered Firm</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#e8c889] shrink-0" />
                  <span>PDA Peshawar Code Compliant</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#e8c889] shrink-0" />
                  <span>CDA Islamabad Approved</span>
                </span>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Call to Action Home — each piece enters from its own direction and
          converges into place, rather than the whole block sliding up as
          one unit, so the section reads as choreographed on scroll-in. */}
      <section className="bg-[#f7f4ef] px-4 py-20 md:px-margin-desktop md:py-32 text-center">
        <div className="mx-auto max-w-3xl space-y-6 sm:space-y-8">
          <ScrollReveal direction="down">
            <span className="font-inter text-xs font-bold uppercase tracking-[0.3em] text-[#8a6125]">
              Start with a conversation
            </span>
          </ScrollReveal>

          <TextReveal
            as="h2"
            text="Ready to make something lasting?"
            delay={0.1}
            className="font-playfair text-3xl sm:text-5xl md:text-6xl font-normal leading-[1.08] text-[#272522]"
          />

          <ScrollReveal direction="left" delay={0.3}>
            <p className="mx-auto max-w-xl font-inter text-sm sm:text-base font-light leading-7 text-[#77716a] md:text-lg">
              Schedule your 1-on-1 consultation or upload your blueprint for a
              professional architectural audit.
            </p>
          </ScrollReveal>

          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
            <ScrollReveal direction="right" delay={0.4} className="w-full sm:w-auto">
              <Link
                href="/consultation"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#292722] px-6 sm:px-10 py-4 font-inter text-xs font-bold uppercase tracking-widest text-white shadow-xl transition-all duration-300 hover:bg-[#8a6125] active:scale-95 text-center min-h-[48px]"
              >
                <span>Book Consultation (PKR 3,000)</span>
                <PhoneCall className="w-4 h-4" />
              </Link>
            </ScrollReveal>
            <ScrollReveal direction="left" delay={0.5} className="w-full sm:w-auto">
              <Link
                href="/consultation"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-[#c9c0b2] px-6 sm:px-10 py-4 font-inter text-xs font-bold uppercase tracking-widest text-[#5f5951] transition-all hover:border-[#8a6125] hover:text-[#8a6125] active:scale-95 text-center min-h-[48px]"
              >
                Explore All Packages
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};
