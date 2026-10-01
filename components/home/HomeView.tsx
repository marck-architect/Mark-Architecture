"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TextReveal } from "@/components/ui/TextReveal";
import { HeroCinematic } from "@/components/home/HeroCinematic";
import { CredentialsRow } from "@/components/home/CredentialsRow";
import {
  PhoneCall,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import {
  featuredServices as fallbackFeaturedServices,
  curatedProjects as fallbackCuratedProjects,
  fallbackTestimonials,
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

  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>(() => {
    const published = (initialTestimonials || []).filter(
      (t) => t.is_published !== false,
    );
    if (published.length > 0) return published;
    return fallbackTestimonials;
  });

  // Keep state synchronized if initialTestimonials changes
  useEffect(() => {
    if (initialTestimonials && initialTestimonials.length > 0) {
      const published = initialTestimonials.filter(
        (t) => t.is_published !== false,
      );
      if (published.length > 0) {
        setTestimonials(published);
      }
    }
  }, [initialTestimonials]);

  // Fetch live dynamic testimonials from the database
  useEffect(() => {
    let isCancelled = false;
    async function fetchDatabaseTestimonials() {
      try {
        const res = await fetch("/api/testimonials", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (
            json.success &&
            Array.isArray(json.data) &&
            json.data.length > 0
          ) {
            const published = json.data.filter(
              (t: AdminTestimonial) => t.is_published !== false,
            );
            if (published.length > 0 && !isCancelled) {
              setTestimonials(published);
            }
          }
        }
      } catch (err) {
        console.warn("Could not fetch live testimonials:", err);
      }
    }

    fetchDatabaseTestimonials();
    return () => {
      isCancelled = true;
    };
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Auto-advance testimonials every 5 seconds continuously
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length, currentIndex]);

  useEffect(() => {
    if (currentIndex >= testimonials.length && testimonials.length > 0) {
      setCurrentIndex(0);
    }
  }, [testimonials.length, currentIndex]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1,
    );
  };

  const handleSelect = (idx: number) => {
    if (idx === currentIndex) return;
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  const currentTestimonial = testimonials[currentIndex] || testimonials[0];
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f7f4ef]">
      {/* Hero: interactive orbit viewer that crossfades into a scroll-driven
          balcony push-in on desktop (see HeroCinematic) — one continuous
          pinned section, not a separate section stacked below it. */}
      <HeroCinematic />

      {/* Practice Principles Tailored to Pakistan */}
      <section
        id="home-content"
        className="mx-auto max-w-container-max px-4 py-24 md:px-margin-desktop md:py-32"
      >
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

      {/* Testimonials Showcase Section with Architectural Background */}
      {testimonials.length > 0 && currentTestimonial && (
        <section className="relative overflow-hidden w-full bg-[#121212] min-h-[580px] sm:min-h-[620px] lg:min-h-[680px] xl:min-h-[720px] flex items-center">
          {/* Background Photography & Lighting Scrims */}
          <div className="absolute inset-0 z-0 select-none">
            <Image
              src="/images/testimonial-background.png"
              alt="MARK Architects architectural villa showcase"
              fill
              priority={false}
              className="object-cover object-center"
              sizes="100vw"
              quality={90}
            />
            {/* Dark gradient overlay on the left for text contrast, fading across to reveal the lit modern villa on the right */}
            <div className="absolute inset-0 bg-black/60 sm:bg-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 sm:via-black/80 via-45% to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-14 lg:px-20 py-20 sm:py-24 md:py-28 lg:py-32">
            <div className="max-w-xl md:max-w-2xl">
              {/* Eyebrow */}
              <ScrollReveal>
                <span className="font-inter text-xs sm:text-[13px] font-medium tracking-[0.25em] uppercase text-[#c9a86e]">
                  Client Stories
                </span>
              </ScrollReveal>

              {/* Animated Testimonial Content */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                  className="mt-5 sm:mt-7"
                >
                  <blockquote className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-normal leading-[1.22] text-white tracking-tight">
                    {currentTestimonial.review ||
                      (currentTestimonial as Record<string, any>).quote ||
                      ""}
                  </blockquote>

                  {/* Gold Divider Line */}
                  <div className="w-14 sm:w-16 h-[1.5px] bg-[#c9a86e] mt-6 sm:mt-8 mb-5 sm:mb-6" />

                  {/* Author Name & Role */}
                  <div>
                    <h3 className="font-inter font-medium text-base sm:text-lg text-white">
                      {currentTestimonial.client_name}
                    </h3>
                    {(currentTestimonial.position ||
                      (currentTestimonial as Record<string, any>).client_role ||
                      currentTestimonial.company) && (
                      <p className="font-inter text-xs sm:text-sm text-white/60 font-light mt-1">
                        {[
                          currentTestimonial.position ||
                            (currentTestimonial as Record<string, any>)
                              .client_role,
                          currentTestimonial.company,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* CTA Button */}
              <div className="mt-8 sm:mt-10">
                <Link
                  href="/consultation"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-[#c9a86e]/80 text-[#dfc38c] font-inter text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 hover:border-[#dfc38c] hover:bg-[#c9a86e]/15 hover:text-white group"
                >
                  <span>Book a Drawing Review</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Right Carousel Controls */}
          {testimonials.length > 1 && (
            <div className="absolute bottom-8 right-6 sm:bottom-10 sm:right-10 md:bottom-12 md:right-14 lg:bottom-14 lg:right-20 z-20 flex items-center gap-3 sm:gap-4 select-none">
              <button
                onClick={handlePrev}
                aria-label="Previous Testimonial"
                className="w-8 h-8 rounded-full border border-white/25 flex items-center justify-center text-white/80 hover:text-white hover:border-white/60 hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next Testimonial"
                className="w-8 h-8 rounded-full border border-white/25 flex items-center justify-center text-white/80 hover:text-white hover:border-white/60 hover:bg-white/10 transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Gold Progress/Divider Line */}
              <div className="w-12 sm:w-16 h-[1.5px] bg-[#c9a86e]" />

              {/* Counter: e.g. 01 / 02 */}
              <div className="flex items-center gap-1 font-mono text-xs sm:text-sm">
                <span className="text-white font-medium">
                  {String(currentIndex + 1).padStart(2, "0")}
                </span>
                <span className="text-white/40 font-light">
                  / {String(testimonials.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          )}
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
            <ScrollReveal
              direction="right"
              delay={0.4}
              className="w-full sm:w-auto"
            >
              <Link
                href="/consultation"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#292722] px-6 sm:px-10 py-4 font-inter text-xs font-bold uppercase tracking-widest text-white shadow-xl transition-all duration-300 hover:bg-[#8a6125] active:scale-95 text-center min-h-[48px]"
              >
                <span>Book Consultation (PKR 3,000)</span>
                <PhoneCall className="w-4 h-4" />
              </Link>
            </ScrollReveal>
            <ScrollReveal
              direction="left"
              delay={0.5}
              className="w-full sm:w-auto"
            >
              <Link
                href="/services"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-[#c9c0b2] px-6 sm:px-10 py-4 font-inter text-xs font-bold uppercase tracking-widest text-[#5f5951] transition-all hover:border-[#8a6125] hover:text-[#8a6125] active:scale-95 text-center min-h-[48px]"
              >
                Explore All Services
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
};
