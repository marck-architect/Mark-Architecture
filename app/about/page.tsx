'use client';

import React from 'react';
import Image from 'next/image';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="relative overflow-x-hidden min-h-screen pt-20">
      {/* Header section */}
      <header className="px-4 md:px-margin-desktop max-w-container-max mx-auto py-16 md:py-20 border-b border-outline-variant/30">
        <ScrollReveal>
          <div className="max-w-3xl space-y-4">
            <span className="font-inter text-xs md:text-sm font-bold text-tertiary uppercase tracking-widest block">
              OUR ATELIER
            </span>
            <h1 className="font-playfair text-4xl md:text-6xl text-on-surface dark:text-zinc-100 font-normal leading-tight">
              Designing spaces with <br />
              <span className="italic font-light">mathematical precision and soul.</span>
            </h1>
            <p className="font-inter text-base md:text-lg text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
              MARK Architects is a design-forward collaborative atelier of structural artists, engineers, and curators. Since 2011, we have crafted legacy estates and iconic commercial structures worldwide.
            </p>
          </div>
        </ScrollReveal>
      </header>

      {/* Legacy and Founder Story */}
      <section className="py-24 px-4 md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-8">
            <ScrollReveal>
              <span className="font-inter text-xs md:text-sm font-bold text-tertiary uppercase tracking-widest block">
                THE FOUNDATION
              </span>
              <h2 className="font-playfair text-3xl md:text-4xl text-on-surface dark:text-zinc-100 font-normal leading-tight">
                Our Architectural Journey
              </h2>
              <p className="font-inter text-sm md:text-base text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                Founded by lead architects Marcus Vance and Ayla Sterling, our practice was born out of a desire to reconcile the boundary between mathematical form and human emotion. We believe in design that is quiet yet powerful. Our structures do not shout for attention; they command it through proportion, shadow, and materiality.
              </p>
              <p className="font-inter text-sm md:text-base text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                Headquartered in Zurich, Switzerland, with creative ateliers in London and Tokyo, our team consists of 50+ experts in structural engineering, biophilic systems, facadism, and interior architecture.
              </p>
            </ScrollReveal>

            {/* Core Values grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-outline-variant/20">
              <ScrollReveal delay={0.1}>
                <div className="space-y-2">
                  <h3 className="font-playfair text-lg font-bold dark:text-zinc-200">11+ Years</h3>
                  <p className="font-inter text-xs text-on-surface-variant dark:text-zinc-400 font-light">
                    Carving spatial legacies across 6 continents.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <div className="space-y-2">
                  <h3 className="font-playfair text-lg font-bold dark:text-zinc-200">Aesthetics</h3>
                  <p className="font-inter text-xs text-on-surface-variant dark:text-zinc-400 font-light">
                    Sleek, minimal lines balanced with raw organic elements.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.3}>
                <div className="space-y-2">
                  <h3 className="font-playfair text-lg font-bold dark:text-zinc-200">Rigorous</h3>
                  <p className="font-inter text-xs text-on-surface-variant dark:text-zinc-400 font-light">
                    Engineered to withstand generations and changing climates.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <ScrollReveal delay={0.2}>
              <div className="relative rounded-[32px] overflow-hidden aspect-[4/5] shadow-2xl">
                <Image
                  fill
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5LKzKTNt76hIVq8W4CVjuYxPo9-N9-ia9m5Cr4IjpxFryo7elYhAS5gg1Fc95_yYf6zSOjY1jKQjkNpR0MgSw2uFCTS2mtsEaY3L678LUzZSo-NxYeV9LFtldOCDdnVw2U61RdeKmeOYOD-mE95joNEY9AkY2Cxy1VQhzTwOHSVFF1tVEGKWstgPGknbkb7FUYE6TdGFFPv_3VVjS1Azg5p8a_vWpxFKy09hMu06EiT6D-0h1JV_3zZCis96XNGtq1cYv6XSe7TI5"
                  alt="Ayla Sterling and Marcus Vance"
                  className="object-cover grayscale"
                  sizes="(max-width: 1024px) 100vw, 450px"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Global Locations Map list */}
      <section className="bg-surface-container-low dark:bg-zinc-900/40 py-24 px-4 md:px-margin-desktop">
        <div className="max-w-container-max mx-auto space-y-16">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="font-inter text-xs md:text-sm font-bold text-tertiary uppercase tracking-widest block">
                LOCATIONS
              </span>
              <h2 className="font-playfair text-3xl md:text-5xl text-on-surface dark:text-zinc-100 font-normal">
                Our Physical Ateliers
              </h2>
              <p className="font-inter text-sm text-on-surface-variant dark:text-zinc-400 font-light">
                We design locally and construct globally. Visit us at any of our primary office spaces.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal delay={0.1}>
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-outline-variant/30 flex flex-col justify-between h-72">
                <div>
                  <h3 className="font-playfair text-2xl font-bold dark:text-zinc-200">Zurich</h3>
                  <p className="font-inter text-xs text-tertiary font-bold tracking-widest mt-1 uppercase">Headquarters</p>
                  <p className="font-inter text-sm text-on-surface-variant dark:text-zinc-400 font-light mt-4 leading-relaxed">
                    Limmatquai 18, 8001 Zürich, Switzerland
                  </p>
                </div>
                <div className="flex gap-2 text-xs text-on-surface-variant dark:text-zinc-400 font-light items-center">
                  <MapPin className="w-4 h-4 text-tertiary" />
                  <span>Switzerland</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-outline-variant/30 flex flex-col justify-between h-72">
                <div>
                  <h3 className="font-playfair text-2xl font-bold dark:text-zinc-200">London</h3>
                  <p className="font-inter text-xs text-tertiary font-bold tracking-widest mt-1 uppercase">UK Studio</p>
                  <p className="font-inter text-sm text-on-surface-variant dark:text-zinc-400 font-light mt-4 leading-relaxed">
                    35 Bruton Place, Mayfair, London W1J 6NS, UK
                  </p>
                </div>
                <div className="flex gap-2 text-xs text-on-surface-variant dark:text-zinc-400 font-light items-center">
                  <MapPin className="w-4 h-4 text-tertiary" />
                  <span>United Kingdom</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-outline-variant/30 flex flex-col justify-between h-72">
                <div>
                  <h3 className="font-playfair text-2xl font-bold dark:text-zinc-200">Tokyo</h3>
                  <p className="font-inter text-xs text-tertiary font-bold tracking-widest mt-1 uppercase">Asia-Pacific Studio</p>
                  <p className="font-inter text-sm text-on-surface-variant dark:text-zinc-400 font-light mt-4 leading-relaxed">
                    Minami-Aoyama 5-Chome, Minato-ku, Tokyo 107-0062, Japan
                  </p>
                </div>
                <div className="flex gap-2 text-xs text-on-surface-variant dark:text-zinc-400 font-light items-center">
                  <MapPin className="w-4 h-4 text-tertiary" />
                  <span>Japan</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
