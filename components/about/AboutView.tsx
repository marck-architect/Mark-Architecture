"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MapPin, ShieldCheck, ArrowDown } from "lucide-react";

import { leaders, achievements, studioLocations } from "@/data/about";

export const AboutView: React.FC = () => {
  return (
    <div className="relative overflow-x-hidden min-h-screen bg-surface dark:bg-zinc-950">
      {/* Whole-screen Hero Section (Full Initial Page down to View Selected Works) */}
      <header className="relative w-full h-screen min-h-[100dvh] flex items-center overflow-hidden border-b border-outline-variant/30">
        {/* Background Architectural Drafting Grid Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

        {/* Large Subtle Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.03] dark:opacity-[0.05]">
          <span className="font-montserrat text-[24vw] font-black tracking-tighter">
            MARK
          </span>
        </div>

        {/* Center Main Hero Content */}
        <div className="relative z-10 w-full max-w-container-max mx-auto px-4 md:px-margin-desktop pt-16">
          <ScrollReveal>
            <div className="max-w-4xl space-y-6">
              <h1 className="font-playfair text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-on-surface dark:text-zinc-100 font-normal leading-[1.08] tracking-tight">
                Designing spaces with <br />
                <span className="italic font-light text-tertiary">
                  mathematical precision and soul.
                </span>
              </h1>

              <p className="font-inter text-base sm:text-lg md:text-xl text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed max-w-3xl">
                MARK Architects is a collaborative practice of licensed
                architects, structural engineers, and spatial strategists. We
                specialize in bespoke residential estates, commercial hubs, and
                rigorous blueprint audits.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <a
                  href="#leadership"
                  className="bg-primary hover:bg-tertiary text-on-primary px-8 py-4 rounded-xl font-bold tracking-wider transition-all duration-300 shadow-md active:scale-95 text-center inline-flex items-center gap-2 font-inter text-xs uppercase cursor-pointer"
                >
                  <span>Meet Principal Architect</span>
                  <ArrowDown className="w-4 h-4" />
                </a>
                <Link
                  href="/portfolio"
                  className="border border-outline-variant hover:border-tertiary hover:text-tertiary px-8 py-4 rounded-xl font-bold tracking-wider transition-all active:scale-95 text-center font-inter text-xs uppercase"
                >
                  View Selected Works
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </header>

      {/* Metrics Bar */}
      <section
        id="metrics"
        className="border-b border-outline-variant/20 bg-surface-container-low dark:bg-zinc-900/60 py-12 scroll-mt-20"
      >
        <div className="px-4 md:px-margin-desktop max-w-container-max mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
            {achievements.map((item, idx) => (
              <ScrollReveal key={item.label} delay={0.08 * idx}>
                <div className="space-y-1">
                  <span className="font-montserrat text-3xl md:text-5xl font-extrabold text-tertiary">
                    {item.metric}
                  </span>
                  <p className="font-inter text-xs text-on-surface-variant dark:text-zinc-400 font-medium uppercase tracking-wider">
                    {item.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Firm Leadership & Credentials */}
      <section
        id="leadership"
        className="py-24 px-4 md:px-margin-desktop max-w-container-max mx-auto border-b border-outline-variant/20 scroll-mt-20"
      >
        <ScrollReveal>
          <div className="space-y-3 mb-16 text-center max-w-2xl mx-auto">
            <span className="font-inter text-xs md:text-sm font-bold text-tertiary uppercase tracking-widest block">
              PRACTICE LEADERSHIP
            </span>
            <h2 className="font-playfair text-3xl md:text-5xl text-on-surface dark:text-zinc-100 font-normal">
              Principal Architect &amp; Founder.
            </h2>
            <p className="font-inter text-sm md:text-base text-on-surface-variant dark:text-zinc-400 font-light">
              Every project is personally spearheaded by Muhammad Arsalan,
              ensuring structural stability, functional elegance, and strict
              compliance with local municipal codes.
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto">
          {leaders.map((leader) => (
            <ScrollReveal key={leader.name}>
              <div className="bg-surface-container-low dark:bg-zinc-900 border border-outline-variant/30 rounded-3xl p-6 sm:p-10 md:p-12 flex flex-col md:flex-row gap-8 md:gap-12 items-center shadow-lg hover:shadow-2xl transition-all">
                <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:w-80 aspect-[3/4] rounded-2xl overflow-hidden shrink-0 bg-zinc-950 border border-outline-variant/40 shadow-xl">
                  <Image
                    fill
                    src={leader.image}
                    alt={leader.name}
                    sizes="(max-width: 768px) 320px, 320px"
                    className="object-cover object-top"
                    priority
                  />
                </div>

                <div className="space-y-4 flex-grow">
                  <div>
                    <span className="text-[10px] font-inter font-bold text-tertiary uppercase tracking-wider block">
                      {leader.experience}
                    </span>
                    <h3 className="font-playfair text-2xl sm:text-4xl font-bold text-on-surface dark:text-zinc-100 mt-1">
                      {leader.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-tertiary font-inter font-semibold mt-1">
                      {leader.role}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 bg-tertiary/10 text-tertiary text-xs font-inter font-semibold px-3.5 py-2 rounded-xl border border-tertiary/20">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>{leader.credentials}</span>
                  </div>

                  <p className="font-inter text-sm text-on-surface-variant dark:text-zinc-300 font-light leading-relaxed">
                    {leader.bio}
                  </p>

                  <div className="pt-2 border-t border-outline-variant/20 flex flex-wrap gap-4 text-xs text-on-surface-variant dark:text-zinc-400">
                    <div>
                      <span className="font-bold text-on-surface dark:text-zinc-200">
                        Focus:
                      </span>{" "}
                      Residential &amp; Commercial Masterplanning
                    </div>
                    <div>
                      <span className="font-bold text-on-surface dark:text-zinc-200">
                        Council:
                      </span>{" "}
                      PCATP Licensed Architect
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Global & Regional Studios */}
      <section className="bg-surface-container-low dark:bg-zinc-900/40 py-24 px-4 md:px-margin-desktop">
        <div className="max-w-container-max mx-auto space-y-16">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <span className="font-inter text-xs md:text-sm font-bold text-tertiary uppercase tracking-widest block">
                LOCATIONS
              </span>
              <h2 className="font-playfair text-3xl md:text-5xl text-on-surface dark:text-zinc-100 font-normal">
                Studio Presences
              </h2>
              <p className="font-inter text-sm text-on-surface-variant dark:text-zinc-400 font-light">
                Serving local clients across Pakistan alongside international
                commissions.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {studioLocations.map((studio, idx) => (
              <ScrollReveal key={studio.city} delay={0.1 * (idx + 1)}>
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-outline-variant/30 flex flex-col justify-between h-72 shadow-sm">
                  <div>
                    <h3 className="font-playfair text-2xl font-bold dark:text-zinc-200">
                      {studio.city}
                    </h3>
                    <p className="font-inter text-xs text-tertiary font-bold tracking-widest mt-1 uppercase">
                      {studio.role}
                    </p>
                    <p className="font-inter text-sm text-on-surface-variant dark:text-zinc-400 font-light mt-4 leading-relaxed">
                      {studio.address}
                    </p>
                  </div>
                  <div className="flex gap-2 text-xs text-on-surface-variant dark:text-zinc-400 font-light items-center">
                    <MapPin className="w-4 h-4 text-tertiary" />
                    <span>{studio.region}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
