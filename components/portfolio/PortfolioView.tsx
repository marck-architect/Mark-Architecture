"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/hooks/useStore";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MapPin, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { projects, filterCategories } from "@/data/portfolio";

export const PortfolioView: React.FC = () => {
  const { portfolioFilter, setPortfolioFilter, openLightbox } = useStore();

  const filteredProjects = projects.filter(
    (project) =>
      portfolioFilter === "all" || project.category === portfolioFilter,
  );

  return (
    <div className="relative overflow-x-hidden min-h-screen bg-surface dark:bg-zinc-950">
      {/* Whole-screen Hero Section (Full Initial Page) */}
      <header className="relative w-full min-h-[100dvh] flex items-center overflow-hidden border-b border-outline-variant/30">
        {/* Background Architectural Drafting Grid Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

        {/* Large Subtle Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.03] dark:opacity-[0.05]">
          <span className="font-montserrat text-[22vw] font-black tracking-tighter">
            ARCHIVE
          </span>
        </div>

        {/* Center Main Hero Content */}
        <div className="relative z-10 w-full max-w-container-max mx-auto px-4 md:px-margin-desktop pt-16">
          <ScrollReveal>
            <div className="max-w-4xl space-y-6">
              <h1 className="font-playfair text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-on-surface dark:text-zinc-100 font-normal leading-[1.08] tracking-tight">
                Curating spaces where <br />
                <span className="italic font-light text-tertiary">
                  form meets precision.
                </span>
              </h1>

              <p className="font-inter text-sm sm:text-base md:text-lg lg:text-xl text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed max-w-3xl">
                Our realized portfolio spans iconic luxury residences, corporate
                hubs, and spatial redrafts across Peshawar, Islamabad, and
                Karachi.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-stretch sm:items-center">
                <a
                  href="#portfolio-grid"
                  className="w-full sm:w-auto bg-primary hover:bg-tertiary text-on-primary px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold tracking-wider transition-all duration-300 shadow-md active:scale-95 text-center inline-flex items-center justify-center gap-2 font-inter text-xs uppercase cursor-pointer min-h-[48px]"
                >
                  <span>Explore Masterpieces</span>
                  <ArrowDown className="w-4 h-4" />
                </a>
                <Link
                  href="/consultation"
                  className="w-full sm:w-auto border border-outline-variant hover:border-tertiary hover:text-tertiary px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold tracking-wider transition-all active:scale-95 text-center font-inter text-xs uppercase min-h-[48px] inline-flex items-center justify-center"
                >
                  Book Consultation
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </header>

      {/* Tags & Masonry Grid section */}
      <section
        id="portfolio-grid"
        className="px-4 md:px-margin-desktop max-w-container-max mx-auto py-16 scroll-mt-20"
      >
        {/* Tag Filters */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-12 overflow-x-auto pb-2 scrollbar-hide">
            {filterCategories.map((cat) => {
              const isActive = portfolioFilter === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setPortfolioFilter(cat.key)}
                  className={cn(
                    "px-4 sm:px-6 py-2 sm:py-2.5 rounded-full border text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer min-h-[40px] flex items-center justify-center shrink-0",
                    isActive
                      ? "border-primary bg-primary text-on-primary dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-950 shadow-md"
                      : "border-outline-variant text-on-surface-variant hover:border-tertiary hover:text-tertiary",
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[600px]">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                onClick={() =>
                  openLightbox({
                    title: project.title,
                    location: project.location,
                    imageSrc: project.imageSrc,
                    year: project.year,
                    description: project.description,
                    category: project.category.toUpperCase(),
                    price: project.price,
                  })
                }
                className="group relative overflow-hidden rounded-3xl cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 border border-outline-variant/30 bg-surface-container-low dark:bg-zinc-900 flex flex-col justify-between"
              >
                {/* Image Container with Next.js Image */}
                <div
                  className={cn(
                    "relative w-full overflow-hidden bg-zinc-950",
                    project.aspectClass || "aspect-[4/3]",
                  )}
                >
                  <Image
                    fill
                    src={project.imageSrc}
                    alt={project.title}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[0.9s] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                  <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-tertiary text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-tertiary/30">
                    {project.category} • {project.year}
                  </span>

                  {project.price && (
                    <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                      {project.price}
                    </span>
                  )}
                </div>

                {/* Content Overlay / Card Footer */}
                <div className="p-6 space-y-2 bg-surface-container-low dark:bg-zinc-900 border-t border-outline-variant/20">
                  <h3 className="font-playfair text-xl font-bold text-on-surface dark:text-zinc-100 group-hover:text-tertiary transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-on-surface-variant dark:text-zinc-400">
                    <MapPin className="w-3.5 h-3.5 text-tertiary shrink-0" />
                    <span>{project.location}</span>
                  </div>
                  <p className="font-inter text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 pt-1 font-light leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};
