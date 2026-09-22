"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { HeroCinematic } from "@/components/home/HeroCinematic";
import { CredentialsRow } from "@/components/home/CredentialsRow";
import {
  MapPin,
  ArrowRight,
  Clock,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";

import { featuredServices, curatedProjects } from "@/data/home";

export const HomeView: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f7f4ef]">
      {/* Hero: interactive orbit viewer that crossfades into a scroll-driven
          balcony push-in on desktop (see HeroCinematic) — one continuous
          pinned section, not a separate section stacked below it. */}
      <HeroCinematic />

      {/* Transparent Service Catalog & Fixed Pricing Section */}
      <section
        id="home-content"
        className="mx-auto max-w-container-max px-4 py-24 md:px-margin-desktop md:py-32"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <ScrollReveal>
            <div className="space-y-3">
              <span className="font-inter text-xs font-bold uppercase tracking-[0.3em] text-[#8a6125] md:text-sm">
                The right brief, clearly priced
              </span>
              <h2 className="max-w-2xl font-playfair text-4xl font-normal leading-[1.05] text-[#272522] md:text-6xl">
                Design that earns its place.
              </h2>
              <p className="max-w-2xl font-inter text-sm font-light leading-7 text-[#77716a] md:text-base">
                Fixed and formula-based architectural services in Pakistani
                Rupees, with every deliverable and milestone made visible from
                the start.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <Link
              href="/consultation"
              className="font-inter text-xs font-bold text-primary dark:text-zinc-300 tracking-widest border-b border-primary dark:border-zinc-300 pb-1.5 hover:text-tertiary hover:border-tertiary transition-colors inline-flex items-center gap-2"
            >
              <span>Explore all services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.map((service, idx) => (
            <ScrollReveal key={service.title} delay={0.07 * idx}>
              <div className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[#ded7cc] bg-white/70 shadow-[0_8px_30px_rgba(58,45,28,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#bca477] hover:shadow-[0_18px_45px_rgba(58,45,28,0.12)]">
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

                  <div className="space-y-3 p-6">
                    <div className="flex items-center justify-between">
                      <span className="font-montserrat text-[10px] font-bold tracking-[0.2em] text-[#a79068]">
                        0{idx + 1}
                      </span>
                      <ArrowRight className="h-4 w-4 text-[#a79068] transition-transform group-hover:translate-x-1" />
                    </div>
                    <h3 className="font-playfair text-xl font-bold text-[#272522]">
                      {service.title}
                    </h3>
                    <p className="font-inter text-xs font-light leading-relaxed text-[#77716a]">
                      {service.desc}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 space-y-4">
                  <div className="pt-4 border-t border-outline-variant/20 flex justify-between items-center">
                    <span className="text-[10px] font-inter font-bold text-zinc-400 uppercase tracking-wider">
                      Price
                    </span>
                    <span className="font-montserrat text-base font-extrabold text-[#8a6125]">
                      {service.price}
                    </span>
                  </div>

                  <Link
                    href={service.href}
                    className="block w-full rounded-xl bg-[#292722] py-3 text-center font-inter text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#8a6125] active:scale-95"
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
      <section className="border-y border-[#e1d9ce] bg-[#eee9e1] px-4 py-24 md:px-margin-desktop md:py-32">
        <div className="max-w-container-max mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <ScrollReveal>
              <div className="space-y-3">
                <span className="font-inter text-xs font-bold uppercase tracking-[0.3em] text-[#8a6125] md:text-sm">
                  A considered portfolio
                </span>
                <h2 className="max-w-2xl font-playfair text-4xl font-normal leading-[1.05] text-[#272522] md:text-6xl">
                  Places with a point of view.
                </h2>
                <p className="max-w-xl font-inter text-sm font-light leading-7 text-[#77716a] md:text-base">
                  Iconic residential developments executed across Peshawar,
                  Islamabad, and Karachi.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <Link
                href="/portfolio"
                className="inline-block border-b border-[#8a6125] pb-1.5 font-inter text-xs font-bold tracking-widest text-[#8a6125] transition-colors hover:border-[#292722] hover:text-[#292722]"
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
                  className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-[#292722] shadow-lg"
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
                      <span className="block font-inter text-[10px] font-bold uppercase tracking-widest text-[#e8c889]">
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

      {/* Pakistani Client Testimonial */}
      <section className="relative overflow-hidden bg-[#292722] px-4 py-24 text-white md:px-margin-desktop md:py-32">
        <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full border border-[#c9a86e]/20" />
        <div className="pointer-events-none absolute -right-8 top-8 h-64 w-64 rounded-full border border-[#c9a86e]/10" />
        <div className="max-w-container-max mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <ScrollReveal>
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl">
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
            <div className="space-y-8 lg:col-span-6 lg:col-start-7">
              <ScrollReveal delay={0.2}>
                <span className="block font-playfair text-7xl leading-none text-[#e8c889]/40">
                  “
                </span>
                <blockquote className="max-w-2xl font-playfair text-xl sm:text-2xl md:text-4xl font-light italic leading-relaxed text-[#f7f4ef]">
                  &ldquo;Working with Muhammad Arsalan and the MARK Architects
                  team in Peshawar was a revelation. They transformed our 1
                  Kanal plot into an open, light-filled sanctuary that naturally
                  stays cool in summer and passed PDA approval without a single
                  revision.&rdquo;
                </blockquote>
                <div className="space-y-1 mt-6">
                  <p className="font-playfair text-2xl font-bold text-[#e8c889]">
                    Engr. Tariq K. Mansoor
                  </p>
                  <p className="font-inter text-xs font-semibold text-white/60 uppercase tracking-widest">
                    Hayatabad Estate Owner, Peshawar
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="flex flex-wrap gap-3 sm:gap-4 pt-4 border-t border-white/10 text-xs text-white/60">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-tertiary shrink-0" />
                    <span>PCATP Registered Firm</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-tertiary shrink-0" />
                    <span>PDA Peshawar Code Compliant</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-tertiary shrink-0" />
                    <span>CDA Islamabad Approved</span>
                  </span>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Home */}
      <section className="bg-[#f7f4ef] px-4 py-20 md:px-margin-desktop md:py-32 text-center">
        <ScrollReveal>
          <div className="mx-auto max-w-3xl space-y-6 sm:space-y-8">
            <span className="font-inter text-xs font-bold uppercase tracking-[0.3em] text-[#8a6125]">
              Start with a conversation
            </span>
            <h2 className="font-playfair text-3xl sm:text-5xl md:text-6xl font-normal leading-[1.08] text-[#272522]">
              Ready to make something lasting?
            </h2>
            <p className="mx-auto max-w-xl font-inter text-sm sm:text-base font-light leading-7 text-[#77716a] md:text-lg">
              Schedule your 1-on-1 consultation or upload your blueprint for a
              professional architectural audit.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
              <Link
                href="/consultation"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#292722] px-6 sm:px-10 py-4 font-inter text-xs font-bold uppercase tracking-widest text-white shadow-xl transition-all duration-300 hover:bg-[#8a6125] active:scale-95 text-center min-h-[48px]"
              >
                <span>Book Consultation (PKR 3,000)</span>
                <PhoneCall className="w-4 h-4" />
              </Link>
              <Link
                href="/consultation"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-[#c9c0b2] px-6 sm:px-10 py-4 font-inter text-xs font-bold uppercase tracking-widest text-[#5f5951] transition-all hover:border-[#8a6125] hover:text-[#8a6125] active:scale-95 text-center min-h-[48px]"
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
