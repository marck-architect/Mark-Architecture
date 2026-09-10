'use client';

import React from 'react';
import { useStore } from '@/hooks/useStore';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
  title: string;
  location: string;
  imageSrc: string;
  year: string;
  description: string;
  category: 'residential' | 'commercial' | 'interior' | 'landscape' | 'renovation';
  price?: string;
}

const projects: Project[] = [
  {
    title: 'The Indus Minimalist Villa',
    location: 'DHA Phase 6, Lahore, Pakistan',
    imageSrc: '/images/projects/dha_lahore_villa.png',
    year: '2025',
    description: 'An ultra-luxury 1-Kanal villa in DHA Lahore Phase 6. Crafted with a minimalist concrete and warm teak wood facade, floor-to-ceiling high-performance structural glass, and bespoke spatial layouts.',
    category: 'residential',
    price: 'Est: PKR 14.5 Crore',
  },
  {
    title: 'Margalla Crest Mansion',
    location: 'DHA Phase 2, Islamabad, Pakistan',
    imageSrc: '/images/projects/dha_islamabad_mansion.png',
    year: '2026',
    description: 'An ultra-luxury modernist 2-Kanal mansion nestled against the backdrop of the Margalla Hills. Features rich travertine stone cladding, a majestic double-height entrance lobby, and expansive structural cantilever decks.',
    category: 'residential',
    price: 'Est: PKR 28.0 Crore',
  },
  {
    title: 'The Clifton Ocean Residence',
    location: 'Clifton Block 4, Karachi, Pakistan',
    imageSrc: '/images/projects/clifton_karachi_villa.png',
    year: '2024',
    description: 'An ultra-premium modern coastal-themed residence in Clifton, Karachi. Features custom filigree brass balconies, weather-resistant structural concrete facades, and a spectacular rooftop infinity pool looking over the Arabian Sea.',
    category: 'residential',
    price: 'Est: PKR 52.0 Crore',
  },
  {
    title: 'The Monolith Residence',
    location: 'Oslo, Norway',
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfUdhs95BD28RZ3lArCumyUe1awaW-4ZEJ5QWRBsGiBRSFq5HhkLC3hgL2YEQKvslTDVy1h2SKuDLWaBOOwamzlRZpPdkjtboyzwWGb9s_2xLgFXRUEZHygo_FTgp7U12IU8xTAjYVHxw1qVHllolhlihxnViftg480N36Z8D7fZNMbffWLOxqBqmbBRMpnFFMkW1Ag2B56ndKz9rlOa8rLxFRTrGNfnsglOFYd9snxUXVh1tPvPITjIrANF_wZmeFRvlOFO_hoZLX',
    year: '2023',
    description: 'A stunning residential estate designed to merge raw volcanic rock textures with polished structural glass.',
    category: 'residential',
  },
  {
    title: 'Nexus Headquarters',
    location: 'Berlin, Germany',
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJArPv4gIcKgt3pzkHD_KMaSgJA48xlFVIx_Yut79_VfJs4TjLs9fWhKHP09npffHCR7dM59jf7Md3nMULcShhRKeLOHiX-UEoPfRC9eE3kPhMAEx-Mes_2uxNhv4-ZEF9tVTRlgPv0pGOr5QL-wSg3qcQQeuxDVgQ6Mkg23mBHvP9U_2cOWRMeTX3UPRDYQeLqTrsK3QNSkLtickOyNOrstTtiLKPkFyjpLRYwwjShGTKUaEjRnGleCQjmr5Y6tjmR5_qy4rrMrTL',
    year: '2022',
    description: 'Corporate office featuring structural concrete trusses and floating glass corridors suspended over a central light atrium.',
    category: 'commercial',
  },
  {
    title: 'Cliffside Sanctuary',
    location: 'Amalfi, Italy',
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlFE570_xbK5UD2KEgI_-oMrbv4EYgDpNZ2MbrLgFaJRRYUByBF3poK5BceDukJdeoy6sRqpV006VG4gWX-9bYg2BMwa5z4Ib_GrQt197t3iRnCfYk6swU0dDNKOSbxgjKbyycRQSIuAwUdOt1lnumEgJ3T881UOxlEVXUATvHalZ4kR2gbvFgpxWLvCePKwtA1uEjli9E14d_5kBDFTKI659Rh6UJZ_Dp46lDJ097-R9_3Ppmx9sK5GOAd2FmFtT-1QBZlUV6qpEV',
    year: '2024',
    description: 'Boutique hotel suites carved directly into coastal stone cliffs, utilizing custom bronze hardware and travertine surfaces.',
    category: 'interior',
  },
  {
    title: 'The Geometric Grove',
    location: 'Kyoto, Japan',
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWAqdR_8SqY3r0hb41DAbkS_s2OITutM3iMujANqkAu2OB8LqvsPBbQcJQ0nH4thCkRbOJpmXSn4sXpjnvUCRoR4___ohS8xUWwza7C7RrFn7x4z936A1NVZ67b0il2Uv4G2tB-qKOTXps8PwGTRFhmI8lwndpNSvPAMAC1WyaTGEQG8Zno5-WJZn1IHwSCGeEGB8ERfFWAgGibgZbDY4ztce8TQ0RRQFOp0S97dAXhUTPjJbv2E8q-5LxCBcbXcxAJ30rBI-TxL-d',
    year: '2023',
    description: 'Sustainable biophilic landscaping utilizing layered linear stone pathways, local black pine, and clean concrete dividers.',
    category: 'landscape',
  },
  {
    title: 'The Heritage Loft',
    location: 'Paris, France',
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgf8GtOSxQbeM6OfNsQf6A5vDjcGX_HNBZmRp-gJWr1rLfgJ9eud7CHkazywznVs21TMQHgrF-8SwG49dkh5uNKI2nKw-RS766mK6MdQoiK1exwAOfhx4MqHAm6g0sXSfFQf-ZRoyC10BXcXTW8qLucZx-jbvzWgZlQ3v5vt3GH2LPB0VG8TCsgzAZzlz9q7Flgln5p_Gb61XVknXS1nCtMGGR4-asO8JOZkD6o92BKXXWS_1UVmt0IZdQqazAHSCcxvvGYfA6DKGL',
    year: '2021',
    description: 'A 19th-century luxury apartment carefully structured with high-diffusion glass panels, maintaining historical moldings.',
    category: 'renovation',
  },
];

const filterCategories = [
  { key: 'all', label: 'All Masterpieces' },
  { key: 'residential', label: 'Residential' },
  { key: 'commercial', label: 'Commercial' },
  { key: 'interior', label: 'Interior' },
  { key: 'landscape', label: 'Landscape' },
  { key: 'renovation', label: 'Renovations' },
];

export default function PortfolioPage() {
  const { portfolioFilter, setPortfolioFilter, openLightbox } = useStore();

  const filteredProjects = projects.filter(
    (project) => portfolioFilter === 'all' || project.category === portfolioFilter
  );

  return (
    <div className="relative overflow-x-hidden min-h-screen pt-20">
      {/* Title Header */}
      <header className="px-4 md:px-margin-desktop max-w-container-max mx-auto py-16 md:py-20 border-b border-outline-variant/30">
        <ScrollReveal>
          <div className="max-w-3xl space-y-4">
            <span className="font-inter text-xs md:text-sm font-bold text-tertiary uppercase tracking-widest block">
              ARCHIVE OF EXCELLENCE
            </span>
            <h1 className="font-playfair text-4xl md:text-6xl text-on-surface dark:text-zinc-100 font-normal leading-tight">
              Curating spaces where <br />
              <span className="italic font-light">form meets soul.</span>
            </h1>
            <p className="font-inter text-base md:text-lg text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
              Our portfolio is a testament to architectural rigor and aesthetic purity. Explore a decade of structural masterpieces designed for the modern visionary.
            </p>
          </div>
        </ScrollReveal>
      </header>

      {/* Tags & Masonry Grid section */}
      <section className="px-4 md:px-margin-desktop max-w-container-max mx-auto py-16">
        {/* Tag Filters */}
        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap gap-3 mb-10 overflow-x-auto pb-4 scrollbar-hide">
            {filterCategories.map((cat) => {
              const isActive = portfolioFilter === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setPortfolioFilter(cat.key)}
                  className={cn(
                    'px-6 py-2 rounded-full border text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer',
                    isActive
                      ? 'border-primary bg-primary text-on-primary dark:border-zinc-300 dark:bg-zinc-300 dark:text-zinc-950'
                      : 'border-outline-variant text-on-surface-variant hover:border-tertiary hover:text-tertiary'
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Animated Masonry Portfolio Layout */}
        <div className="masonry-grid gap-6 min-h-[600px]">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div
                layout
                key={project.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
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
                className="masonry-item group relative overflow-hidden rounded-2xl cursor-pointer shadow-md"
              >
                <div className="relative w-full h-auto">
                  <img
                    src={project.imageSrc}
                    alt={project.title}
                    className="w-full object-cover transition-transform duration-[0.8s] group-hover:scale-105"
                  />
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 glass-panel">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="font-inter text-[10px] font-bold text-tertiary block mb-1 uppercase">
                        {project.category} • {project.year}
                      </span>
                      <h3 className="font-playfair text-xl font-bold mb-1 text-zinc-900">{project.title}</h3>
                      <p className="font-inter text-xs text-on-surface-variant flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-tertiary" /> {project.location}
                      </p>
                    </div>
                    <span className="font-inter text-[10px] font-bold border-b border-on-surface pb-0.5 group-hover:text-tertiary group-hover:border-tertiary transition-colors tracking-widest">
                      DETAILS
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
