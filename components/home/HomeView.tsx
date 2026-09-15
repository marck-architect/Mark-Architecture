"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { HeroCinematic } from "@/components/home/HeroCinematic";
import {
  MapPin,
  Lightbulb,
  ShieldCheck,
  Building,
  ArrowRight,
  Clock,
  Sparkles,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";

import {
  featuredServices,
  curatedProjects,
  homeStudioLocations as studioLocations,
} from "@/data/home";

export const HomeView: React.FC = () => {
  return (
    <div className="relative overflow-x-hidden min-h-screen bg-surface dark:bg-zinc-950">
      {/* Hero: interactive orbit viewer that crossfades into a scroll-driven
          balcony push-in on desktop (see HeroCinematic) — one continuous
          pinned section, not a separate section stacked below it. */}
      <HeroCinematic />

      {/* Stats bar — its own section, not overlaid on the villa */}
      <section className="bg-zinc-950 border-t border-white/10 py-10 px-4 md:px-margin-desktop">
        <div className="max-w-container-max mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 md:p-6 rounded-2xl border border-white/10">
            <p className="text-tertiary-fixed font-montserrat text-3xl md:text-4xl font-extrabold mb-1">
              15+
            </p>
            <p className="font-inter text-[10px] md:text-xs font-semibold tracking-wider text-white/70 uppercase">
              Years in Practice
            </p>
          </div>
          <div className="glass-panel p-5 md:p-6 rounded-2xl border border-white/10">
            <p className="text-tertiary-fixed font-montserrat text-3xl md:text-4xl font-extrabold mb-1">
              250+
            </p>
            <p className="font-inter text-[10px] md:text-xs font-semibold tracking-wider text-white/70 uppercase">
              Projects Completed
            </p>
          </div>
          <div className="glass-panel p-5 md:p-6 rounded-2xl border border-white/10">
            <p className="text-tertiary-fixed font-montserrat text-3xl md:text-4xl font-extrabold mb-1">
              100%
            </p>
            <p className="font-inter text-[10px] md:text-xs font-semibold tracking-wider text-white/70 uppercase">
              PDA &amp; CDA Code Approval
            </p>
          </div>
          <div className="glass-panel p-5 md:p-6 rounded-2xl border border-white/10">
            <p className="text-tertiary-fixed font-montserrat text-3xl md:text-4xl font-extrabold mb-1">
              PKR 57
            </p>
            <p className="font-inter text-[10px] md:text-xs font-semibold tracking-wider text-white/70 uppercase">
              Per Sq. Ft. Full Turnkey
            </p>
          </div>
        </div>
      </section>

      {/* Transparent Service Catalog & Fixed Pricing Section */}
      <section className="py-24 px-4 md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <ScrollReveal>
            <div className="space-y-3">
              <span className="font-inter text-xs md:text-sm font-bold text-tertiary uppercase tracking-[0.3em] block">
                Transparent Pricing
              </span>
              <h2 className="font-playfair text-3xl md:text-5xl text-on-surface dark:text-zinc-100 font-normal">
                Popular Design Packages.
              </h2>
              <p className="font-inter text-sm md:text-base text-on-surface-variant dark:text-zinc-400 font-light max-w-2xl">
                Fixed and formula-based pricing in Pakistani Rupees (PKR) with
                secure Safepay checkout. No hidden drafting fees.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <Link
              href="/consultation"
              className="font-inter text-xs font-bold text-primary dark:text-zinc-300 tracking-widest border-b border-primary dark:border-zinc-300 pb-1.5 hover:text-tertiary hover:border-tertiary transition-colors inline-flex items-center gap-2"
            >
              <span>VIEW FULL 7-SERVICE CATALOG</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.map((service, idx) => (
            <ScrollReveal key={service.title} delay={0.07 * idx}>
              <div className="bg-surface-container-low dark:bg-zinc-900/60 border border-outline-variant/30 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full group">
                <div>
                  <div className="relative aspect-[16/10] bg-zinc-950 overflow-hidden">
                    <Image
                      fill
                      src={service.image}
                      alt={service.title}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-tertiary text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-tertiary/30">
                      {service.badge}
                    </span>
                    <span className="absolute bottom-3 right-3 text-white text-[11px] font-inter font-light flex items-center gap-1">
                      <Clock className="w-3 h-3 text-tertiary" />
                      <span>{service.duration}</span>
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-playfair text-xl font-bold text-on-surface dark:text-zinc-100">
                      {service.title}
                    </h3>
                    <p className="font-inter text-xs text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 space-y-4">
                  <div className="pt-4 border-t border-outline-variant/20 flex justify-between items-center">
                    <span className="text-[10px] font-inter font-bold text-zinc-400 uppercase tracking-wider">
                      Price
                    </span>
                    <span className="font-montserrat text-base font-extrabold text-secondary dark:text-zinc-100">
                      {service.price}
                    </span>
                  </div>

                  <Link
                    href={service.href}
                    className="w-full bg-primary hover:bg-tertiary text-on-primary py-3 rounded-xl font-inter font-bold text-xs uppercase tracking-wider transition-all text-center block shadow-sm active:scale-95"
                  >
                    View Scope &amp; Book
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Selected Works (Curated Pakistan Projects) */}
      <section className="bg-surface-container-low dark:bg-zinc-900/40 py-24 px-4 md:px-margin-desktop">
        <div className="max-w-container-max mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <ScrollReveal>
              <div className="space-y-3">
                <span className="font-inter text-xs md:text-sm font-bold text-tertiary uppercase tracking-[0.3em] block">
                  Curation
                </span>
                <h2 className="font-playfair text-3xl md:text-5xl text-on-surface dark:text-zinc-100 font-normal">
                  Selected Masterpieces in Pakistan.
                </h2>
                <p className="font-inter text-sm md:text-base text-on-surface-variant dark:text-zinc-400 font-light">
                  Iconic residential developments executed across Peshawar,
                  Islamabad, and Karachi.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <Link
                href="/portfolio"
                className="font-inter text-xs font-bold text-primary dark:text-zinc-300 tracking-widest border-b border-primary dark:border-zinc-300 pb-1.5 hover:text-tertiary hover:border-tertiary transition-colors inline-block"
              >
                VIEW FULL PORTFOLIO
              </Link>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {curatedProjects.map((project, idx) => (
              <ScrollReveal key={project.title} delay={0.1 * idx}>
                <Link
                  href="/portfolio"
                  className="relative group rounded-3xl overflow-hidden aspect-[4/5] shadow-lg block"
                >
                  <Image
                    fill
                    alt={project.title}
                    className="object-cover transition-transform duration-[0.9s] group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 384px"
                    src={project.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500 flex flex-col justify-end p-8">
                    <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500 space-y-1.5">
                      <span className="font-inter text-[10px] font-bold text-tertiary-fixed uppercase tracking-widest block">
                        {project.category}
                      </span>
                      <h3 className="font-playfair text-2xl text-white font-normal">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-white/75 text-xs pt-1">
                        <MapPin className="w-3.5 h-3.5 text-tertiary" />
                        <span>{project.location}</span>
                      </div>
                      <p className="font-inter text-[11px] text-white/50">
                        {project.scale}
                      </p>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Practice Principles Tailored to Pakistan */}
      <section className="py-24 px-4 md:px-margin-desktop max-w-container-max mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <ScrollReveal>
            <span className="font-inter text-xs md:text-sm font-bold text-tertiary uppercase tracking-[0.3em] block">
              Why MARK Architects
            </span>
            <h2 className="font-playfair text-3xl md:text-5xl text-on-surface dark:text-zinc-100 font-normal">
              Built for Pakistan&apos;s Landscape &amp; Climate.
            </h2>
            <p className="font-inter text-base text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
              We engineer luxury spaces with mathematical precision, resolving
              local soil conditions, earthquake resistance, and passive cooling.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ScrollReveal delay={0.1}>
            <div className="bg-surface dark:bg-zinc-900/50 p-8 rounded-3xl border border-outline-variant/40 hover:border-tertiary/40 transition-all duration-500 group h-full space-y-4">
              <Lightbulb className="w-9 h-9 text-tertiary group-hover:scale-110 transition-transform" />
              <h3 className="font-playfair text-xl font-bold dark:text-zinc-200">
                Passive Solar &amp; Climate Control
              </h3>
              <p className="font-inter text-xs text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                Strategic orientation to capture southern sun in winter and
                cross-ventilation in peak summer heat.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="bg-surface dark:bg-zinc-900/50 p-8 rounded-3xl border border-outline-variant/40 hover:border-tertiary/40 transition-all duration-500 group h-full space-y-4">
              <Building className="w-9 h-9 text-tertiary group-hover:scale-110 transition-transform" />
              <h3 className="font-playfair text-xl font-bold dark:text-zinc-200">
                PDA, CDA &amp; KDA Bylaw Mastery
              </h3>
              <p className="font-inter text-xs text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                Full submission drawings ensuring frictionless municipal
                approvals across Hayatabad, Islamabad, and Karachi.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="bg-surface dark:bg-zinc-900/50 p-8 rounded-3xl border border-outline-variant/40 hover:border-tertiary/40 transition-all duration-500 group h-full space-y-4">
              <ShieldCheck className="w-9 h-9 text-tertiary group-hover:scale-110 transition-transform" />
              <h3 className="font-playfair text-xl font-bold dark:text-zinc-200">
                Seismic &amp; Structural Safety
              </h3>
              <p className="font-inter text-xs text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                Complete structural engineering framing calculated for Building
                Code of Pakistan seismic zones.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div className="bg-surface dark:bg-zinc-900/50 p-8 rounded-3xl border border-outline-variant/40 hover:border-tertiary/40 transition-all duration-500 group h-full space-y-4">
              <Sparkles className="w-9 h-9 text-tertiary group-hover:scale-110 transition-transform" />
              <h3 className="font-playfair text-xl font-bold dark:text-zinc-200">
                50% Advance Milestone Terms
              </h3>
              <p className="font-inter text-xs text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                Transparent stage payments processed securely via Safepay with
                complete client review checkpoints.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Physical Studios Location Section (Matching Footer) */}
      <section className="bg-surface-container-low dark:bg-zinc-900/40 py-20 px-4 md:px-margin-desktop border-y border-outline-variant/20">
        <div className="max-w-container-max mx-auto space-y-12">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="font-inter text-xs md:text-sm font-bold text-tertiary uppercase tracking-widest block">
                Physical Locations
              </span>
              <h2 className="font-playfair text-3xl md:text-4xl text-on-surface dark:text-zinc-100 font-normal">
                Visit Our Design Studios.
              </h2>
              <p className="font-inter text-xs md:text-sm text-on-surface-variant dark:text-zinc-400 font-light">
                Consult with our lead architects in person or book a virtual
                session.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {studioLocations.map((studio, sIdx) => (
              <ScrollReveal key={studio.city} delay={0.08 * sIdx}>
                <div
                  className={`bg-white dark:bg-zinc-900 p-8 rounded-3xl border flex flex-col justify-between h-64 shadow-sm transition-all ${
                    studio.isHQ
                      ? "border-tertiary/70 shadow-md ring-1 ring-tertiary/20"
                      : "border-outline-variant/30 hover:border-tertiary/40"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-inter text-[10px] font-bold text-tertiary uppercase tracking-widest">
                        {studio.isHQ ? "★ HEADQUARTERS" : "REGIONAL ATELIER"}
                      </span>
                      <MapPin className="w-4 h-4 text-tertiary" />
                    </div>
                    <h3 className="font-playfair text-2xl font-bold text-on-surface dark:text-zinc-100">
                      {studio.city}
                    </h3>
                    <p className="font-inter text-xs text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                      {studio.address}
                    </p>
                  </div>
                  <span className="text-[11px] font-inter text-zinc-500 dark:text-zinc-400 font-medium">
                    {studio.role}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pakistani Client Testimonial */}
      <section className="bg-inverse-surface dark:bg-zinc-950 py-24 px-4 md:px-margin-desktop overflow-hidden text-white">
        <div className="max-w-container-max mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <ScrollReveal>
                <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl bg-zinc-900 border border-white/10">
                  <Image
                    fill
                    alt="Peshawar Residence Architecture"
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 450px"
                    src="/images/dha_lahore_villa.png"
                  />
                </div>
              </ScrollReveal>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 space-y-8">
              <ScrollReveal delay={0.2}>
                <span className="font-playfair text-6xl text-tertiary-fixed opacity-40 block">
                  “
                </span>
                <blockquote className="font-playfair text-2xl md:text-3xl italic leading-relaxed text-surface-container-lowest font-light">
                  &ldquo;Working with Muhammad Rafiq and the MARK Architects
                  team in Peshawar was a revelation. They transformed our 1
                  Kanal plot into an open, light-filled sanctuary that naturally
                  stays cool in summer and passed PDA approval without a single
                  revision.&rdquo;
                </blockquote>
                <div className="space-y-1 mt-6">
                  <p className="font-playfair text-2xl text-tertiary-fixed font-bold">
                    Engr. Tariq K. Mansoor
                  </p>
                  <p className="font-inter text-xs font-semibold text-white/60 uppercase tracking-widest">
                    Hayatabad Estate Owner, Peshawar
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10 text-xs text-white/60">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-tertiary" />
                    PCATP Registered Firm
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-tertiary" />
                    PDA Peshawar Code Compliant
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-tertiary" />
                    CDA Islamabad Approved
                  </span>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Home */}
      <section className="py-24 px-4 md:px-margin-desktop bg-surface dark:bg-zinc-900 text-center">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="font-playfair text-3xl md:text-5xl text-on-surface dark:text-zinc-100 font-normal">
              Ready to Design Your Masterpiece?
            </h2>
            <p className="font-inter text-base md:text-lg text-on-surface-variant dark:text-zinc-400 font-light max-w-xl mx-auto">
              Schedule your 1-on-1 consultation or upload your blueprint for a
              professional architectural audit.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/consultation"
                className="bg-primary text-on-primary hover:bg-tertiary px-10 py-4.5 rounded-xl font-inter text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-xl active:scale-95 inline-flex items-center gap-2"
              >
                <span>Book Consultation (PKR 3,000)</span>
                <PhoneCall className="w-4 h-4" />
              </Link>
              <Link
                href="/consultation"
                className="border border-outline-variant hover:border-tertiary hover:text-tertiary px-10 py-4.5 rounded-xl font-inter text-xs font-bold tracking-widest uppercase transition-all active:scale-95 inline-block"
              >
                Explore All Packages
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};
