'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import {
  Compass,
  Armchair,
  Home,
  Monitor,
  Database,
  TreePine,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface ServiceItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const servicesList: ServiceItem[] = [
  {
    icon: <Compass className="w-10 h-10 text-tertiary" />,
    title: 'Architectural Design',
    description: 'Conceptualizing structural blueprints that redefine modern living through mathematical precision and aesthetic purity.'
  },
  {
    icon: <Armchair className="w-10 h-10 text-tertiary" />,
    title: 'Interior Design',
    description: 'Curating internal environments with bespoke materials, custom lighting, and an editorial eye for luxury comfort.'
  },
  {
    icon: <Home className="w-10 h-10 text-tertiary" />,
    title: 'Exterior Design',
    description: 'Crafting the visual identity of structures through innovative cladding, glazing, and facade engineering.'
  },
  {
    icon: <Monitor className="w-10 h-10 text-tertiary" />,
    title: '3D Visualization',
    description: 'Hyper-realistic renders that bring your future spaces to life before the first stone is laid.'
  },
  {
    icon: <Database className="w-10 h-10 text-tertiary" />,
    title: '3D Modeling',
    description: 'Advanced BIM and technical modeling for precise construction and engineering coordination.'
  },
  {
    icon: <TreePine className="w-10 h-10 text-tertiary" />,
    title: 'Landscape Design',
    description: 'Integrating nature with architecture through geometric gardens and sustainable ecosystems.'
  }
];

export default function ServicesPage() {
  return (
    <div className="relative overflow-x-hidden min-h-screen pt-20">
      {/* Title Header */}
      <header className="px-4 md:px-margin-desktop max-w-container-max mx-auto py-16 md:py-20 border-b border-outline-variant/30">
        <ScrollReveal>
          <div className="max-w-3xl space-y-4">
            <span className="font-inter text-xs md:text-sm font-bold text-tertiary uppercase tracking-widest block">
              COMPREHENSIVE EXPERTISE
            </span>
            <h1 className="font-playfair text-4xl md:text-6xl text-on-surface dark:text-zinc-100 font-normal leading-tight">
              Our Specialized <br />
              <span className="italic font-light">Services.</span>
            </h1>
            <p className="font-inter text-base md:text-lg text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
              We offer bespoke spatial planning, drafting, facade building, modeling, and interior layout management. Explore how we balance structural design with detailed execution.
            </p>
          </div>
        </ScrollReveal>
      </header>

      {/* Services Grid Section */}
      <section className="bg-surface-container-low dark:bg-zinc-900/40 py-24 scroll-mt-24">
        <div className="px-4 md:px-margin-desktop max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesList.map((service, index) => (
              <ScrollReveal key={service.title} delay={0.1 * index}>
                <div className="bg-white dark:bg-zinc-900 p-10 flex flex-col items-start transition-all duration-500 hover:shadow-[0px_30px_60px_rgba(126,87,20,0.08)] border-b-2 border-transparent hover:border-tertiary rounded-2xl h-full justify-between">
                  <div>
                    <div className="mb-6">{service.icon}</div>
                    <h3 className="font-playfair text-2xl font-bold mb-3 hover:text-tertiary transition-colors dark:text-zinc-200">
                      {service.title}
                    </h3>
                    <p className="font-inter text-sm text-on-surface-variant dark:text-zinc-400 font-light mb-6 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                  <Link
                    href="/consultation"
                    className="font-inter text-xs font-bold tracking-widest text-secondary dark:text-zinc-300 hover:text-tertiary dark:hover:text-tertiary flex items-center gap-1.5 transition-colors uppercase mt-4"
                  >
                    LEARN MORE <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services CTA Banner */}
      <section className="relative h-[450px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            fill
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSXQznOjl4RS4vIf-celNab_NynCzfMD6IBikEJVViJozzVcIO2cBSFw_xaD_4dc1gd3nMwyz1X7y2oddrZToKOZ4en2T7bhQu87BEFZ3yYiHDZDnvuBJwpET4sx2R_xndEI9bUyWH1udefshCxupeA8dA0sHtnyaS1-tiNLfOcG2IVNb9CgtYSC-iZvQz-kqs6F8oR5BzRKyzqHfrZlLygxNd6UQIqNBFhP2Z8Cj5zlyEOGtuTCCUX_-sIC9U2GfHvIhI_Qhqswfr"
            alt="Villa pool dusk background"
            sizes="100vw"
            className="object-cover grayscale opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background dark:from-zinc-950 via-transparent to-background/60 dark:to-zinc-950/60" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto space-y-8">
          <ScrollReveal>
            <h2 className="font-playfair text-3xl md:text-5xl text-on-surface dark:text-zinc-100 font-normal leading-tight">
              Ready to build your masterpiece?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <Link
              href="/consultation"
              className="btn-slide-hover bg-primary text-on-primary px-10 py-4.5 rounded-full font-inter text-xs font-bold tracking-[0.25em] transition-all hover:pr-12 flex items-center gap-3 mx-auto shadow-2xl active:scale-95 uppercase inline-flex align-middle"
            >
              START YOUR PROJECT
              <Sparkles className="w-4 h-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
