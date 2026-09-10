"use client";

import React from "react";
import Image from "next/image";
import { useStore } from "@/hooks/useStore";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  title: string;
  location: string;
  imageSrc: string;
  year: string;
  description: string;
  category:
    | "residential"
    | "commercial"
    | "interior"
    | "landscape"
    | "renovation";
  price?: string;
  aspectClass?: string;
}

const projects: Project[] = [
  {
    title: "The Hayatabad Minimalist Estate",
    location: "Ring Road, Hayatabad, Peshawar, Pakistan",
    imageSrc: "/images/dha_lahore_villa.png",
    year: "2025",
    description:
      "An ultra-luxury 1-Kanal residence in Hayatabad, Peshawar. Designed with passive solar layout, exposed structural concrete, floor-to-ceiling thermal double-glazing, and private interior courtyard.",
    category: "residential",
    price: "1 Kanal • 6,200 sq. ft.",
    aspectClass: "aspect-[4/5]",
  },
  {
    title: "Margalla Crest Contemporary Mansion",
    location: "DHA Phase 2, Islamabad, Pakistan",
    imageSrc: "/images/dha_islamabad_mansion.png",
    year: "2026",
    description:
      "A modernist 2-Kanal hillside mansion facing the Margalla ridges. Features seismic reinforcement calculations, double-height entrance atrium, travertine stone cladding, and wide cantilevered balconies.",
    category: "residential",
    price: "2 Kanal • 9,500 sq. ft.",
    aspectClass: "aspect-[4/5]",
  },
  {
    title: "The Clifton Coastal Residence",
    location: "Clifton Block 4, Karachi, Pakistan",
    imageSrc: "/images/clifton_karachi_villa.png",
    year: "2024",
    description:
      "An ultra-premium modern coastal residence in Clifton, Karachi. Features marine-grade corrosion-resistant concrete facades, geometric brise-soleil shading louvers, and a rooftop viewing pavilion over the Arabian Sea.",
    category: "residential",
    price: "10 Marla • 3,850 sq. ft.",
    aspectClass: "aspect-[4/5]",
  },
  {
    title: "AL Haj Sher Commercial Center",
    location: "Ring Road, Near Hayatabad, Peshawar",
    imageSrc: "/images/Full House Design Package.png",
    year: "2025",
    description:
      "A multi-storey corporate hub and mixed-use commercial center. Features full MEP schematics, life safety egress plans, high-efficiency mechanical circulation, and PDA municipal submission drawings.",
    category: "commercial",
    price: "Multi-Storey Corporate Hub",
    aspectClass: "aspect-[16/10]",
  },
  {
    title: "Modern Facade Redesign & Elevation",
    location: "Hayatabad Phase 5, Peshawar, Pakistan",
    imageSrc: "/images/Front Elevation 3D (Exterior Render).png",
    year: "2025",
    description:
      "Contemporary 3D facade transformation for a 1-Kanal residence. Replaced traditional brickwork with sleek composite stone panels, dramatic vertical illumination, and modern aluminum louvers.",
    category: "renovation",
    price: "1 Kanal Facade • 3D Elevation",
    aspectClass: "aspect-[16/9]",
  },
  {
    title: "Executive Penthouse Suite & Lounge",
    location: "Blue Area, Islamabad, Pakistan",
    imageSrc: "/images/Interior Room Makeover.png",
    year: "2025",
    description:
      "Luxury interior room makeover featuring bespoke Swat walnut wood millwork, acoustic ceiling geometry, architectural ambient cove lighting, and curated imported marble surfaces.",
    category: "interior",
    price: "Master Suite & Lounge",
    aspectClass: "aspect-[16/10]",
  },
  {
    title: "Comprehensive Layout Optimization",
    location: "DHA Phase 6, Karachi, Pakistan",
    imageSrc: "/images/House Plan Correction.png",
    year: "2025",
    description:
      "Complete architectural redrafting for a 10 Marla corner plot with circulation bottlenecks. Restructured the layout to introduce natural light shafts, cross-ventilation, and dedicated family zones.",
    category: "renovation",
    price: "10 Marla • Corrected Blueprint",
    aspectClass: "aspect-[16/10]",
  },
  {
    title: "Biophilic Courtyard & Landscape Garden",
    location: "DHA Phase 2, Islamabad, Pakistan",
    imageSrc: "/images/House Plan review.png",
    year: "2024",
    description:
      "Internal biophilic courtyard integrating indigenous flora, geometric stone water rills, and shaded outdoor seating designed for thermal microclimate regulation in peak summer months.",
    category: "landscape",
    price: "Estate Garden & Circulation Audit",
    aspectClass: "aspect-[16/10]",
  },
];

const filterCategories = [
  { key: "all", label: "All Masterpieces" },
  { key: "residential", label: "Residential" },
  { key: "commercial", label: "Commercial" },
  { key: "interior", label: "Interior" },
  { key: "landscape", label: "Landscape" },
  { key: "renovation", label: "Renovations" },
];

export default function PortfolioPage() {
  const { portfolioFilter, setPortfolioFilter, openLightbox } = useStore();

  const filteredProjects = projects.filter(
    (project) =>
      portfolioFilter === "all" || project.category === portfolioFilter,
  );

  return (
    <div className="relative overflow-x-hidden min-h-screen pt-20 bg-surface dark:bg-zinc-950">
      {/* Title Header */}
      <header className="px-4 md:px-margin-desktop max-w-container-max mx-auto py-16 md:py-20 border-b border-outline-variant/30">
        <ScrollReveal>
          <div className="max-w-3xl space-y-4">
            <span className="font-inter text-xs md:text-sm font-bold text-tertiary uppercase tracking-widest block">
              ARCHIVE OF REALIZED WORKS
            </span>
            <h1 className="font-playfair text-4xl md:text-6xl text-on-surface dark:text-zinc-100 font-normal leading-tight">
              Curating spaces where <br />
              <span className="italic font-light">form meets precision.</span>
            </h1>
            <p className="font-inter text-base md:text-lg text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
              Our real portfolio spans iconic luxury residences, corporate hubs,
              and spatial redrafts across Peshawar, Islamabad, and Karachi.
            </p>
          </div>
        </ScrollReveal>
      </header>

      {/* Tags & Masonry Grid section */}
      <section className="px-4 md:px-margin-desktop max-w-container-max mx-auto py-16">
        {/* Tag Filters */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap gap-3 mb-12 overflow-x-auto pb-2 scrollbar-hide">
            {filterCategories.map((cat) => {
              const isActive = portfolioFilter === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setPortfolioFilter(cat.key)}
                  className={cn(
                    "px-6 py-2.5 rounded-full border text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer",
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
}
