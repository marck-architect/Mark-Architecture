"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MapPin, ShieldCheck, ArrowDown } from "lucide-react";

import { leaders, achievements, studioLocations } from "@/data/about";

const Metric: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-tertiary font-semibold">{children}</span>
);

export const AboutView: React.FC = () => {
  return (
    <div className="relative overflow-x-hidden min-h-screen bg-surface dark:bg-zinc-950">
      {/* Whole-screen Hero Section (Full Initial Page down to View Selected Works) */}
      <header className="relative w-full min-h-[100dvh] flex items-center overflow-hidden border-b border-outline-variant/30">
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
            <div className="max-w-4xl space-y-5">
              <h1
                className="font-playfair text-on-surface dark:text-zinc-100 font-normal leading-[1.08] tracking-tight"
                style={{ fontSize: "clamp(2.25rem, 1.5rem + 3vw, 4rem)" }}
              >
                Designing spaces with <br />
                <span className="font-light text-tertiary">
                  mathematical precision and soul.
                </span>
              </h1>

              <p
                className="font-inter text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed max-w-3xl"
                style={{
                  fontSize: "clamp(0.9375rem, 0.85rem + 0.3vw, 1.125rem)",
                }}
              >
                MARK Architects is a collaborative practice of licensed
                architects, structural engineers, and spatial strategists. We
                specialize in bespoke residential estates, commercial hubs, and
                rigorous blueprint audits.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-stretch sm:items-center">
                <a
                  href="#leadership"
                  className="w-full sm:w-auto bg-primary hover:bg-tertiary text-on-primary px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold tracking-wider transition-all duration-300 shadow-md active:scale-95 text-center inline-flex items-center justify-center gap-2 font-inter text-xs uppercase cursor-pointer min-h-[48px]"
                >
                  <span>Meet Principal Architect</span>
                  <ArrowDown className="w-4 h-4" />
                </a>
                <Link
                  href="/portfolio"
                  className="w-full sm:w-auto border border-outline-variant hover:border-tertiary hover:text-tertiary px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold tracking-wider transition-all active:scale-95 text-center font-inter text-xs uppercase min-h-[48px] inline-flex items-center justify-center"
                >
                  View Selected Works
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </header>

      {/* Metrics, woven into a single editorial statement rather than a stat-card grid */}
      <section
        id="metrics"
        className="border-b border-outline-variant/20 bg-surface-container-low dark:bg-zinc-900/60 py-16 sm:py-20 scroll-mt-20"
      >
        <div className="px-4 md:px-margin-desktop max-w-4xl mx-auto">
          <ScrollReveal>
            <span className="font-inter text-xs md:text-sm font-bold text-tertiary uppercase tracking-widest block mb-6">
              In Numbers
            </span>
            <p
              className="font-playfair text-on-surface dark:text-zinc-100 font-normal leading-[1.35]"
              style={{ fontSize: "clamp(1.5rem, 1.05rem + 2vw, 2.5rem)" }}
            >
              In <Metric>{achievements[0].metric}</Metric> years of practice, we
              have designed <Metric>{achievements[1].metric}</Metric>{" "}
              residential and commercial projects spanning{" "}
              <Metric>{achievements[2].metric}</Metric> square feet, with a{" "}
              <Metric>{achievements[3].metric}</Metric> record of statutory
              approval and code compliance.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Firm Leadership & Credentials */}
      <section
        id="leadership"
        className="py-24 border-b border-outline-variant/20 scroll-mt-20"
      >
        <div className="px-4 md:px-margin-desktop max-w-container-max mx-auto">
          <ScrollReveal>
            <div className="space-y-3 mb-16 max-w-2xl">
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
        </div>

        {/* Full-bleed profile band: qualifications on the left, portrait
            filling the entire right half edge to edge, spanning the whole
            page width rather than sitting inside a small contained card. */}
        {leaders.map((leader) => (
          <ScrollReveal key={leader.name}>
            <div className="w-full grid grid-cols-1 lg:grid-cols-[2fr_3fr] lg:min-h-[480px] items-stretch bg-surface-container-low dark:bg-zinc-900 border-y border-outline-variant/20">
              {/* Left: portrait in circular frame */}
              <div className="relative min-h-[320px] lg:min-h-0 flex items-center justify-center py-10 lg:py-12 px-6">
                <div className="group relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[340px] lg:h-[340px] xl:w-[380px] xl:h-[380px] aspect-square rounded-full overflow-hidden border-4 border-white dark:border-zinc-800 shadow-2xl ring-2 ring-tertiary/25 dark:ring-tertiary/30 hover:ring-tertiary/60 dark:hover:ring-tertiary/60 transition-all duration-500 bg-gradient-to-b from-stone-100 via-stone-200/90 to-stone-300/80 dark:from-zinc-800 dark:via-zinc-850 dark:to-zinc-900">
                  <Image
                    fill
                    src={leader.image}
                    alt={`${leader.name}, ${leader.role} at MARK Architects`}
                    sizes="(max-width: 640px) 256px, (max-width: 768px) 288px, (max-width: 1024px) 320px, 380px"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108 will-change-transform"
                    priority
                  />
                </div>
              </div>

              {/* Right: qualifications — given more width and larger type
                  than the portrait so the credentials read as the lead
                  element. Uses the same px-4/md:px-margin-desktop gutter as
                  the rest of the page so its text lines up with the heading
                  above instead of floating at a custom offset. */}
              <div className="flex flex-col justify-center px-4 md:px-margin-desktop py-14 lg:py-0">
                <div className="max-w-xl space-y-5 w-full">
                  <div>
                    <div className="h-px w-12 bg-tertiary/50 mb-4" />
                    <h3 className="font-playfair text-4xl sm:text-5xl font-bold text-on-surface dark:text-zinc-100">
                      {leader.name}
                    </h3>
                    <p className="text-sm sm:text-base text-tertiary font-inter font-semibold mt-1.5">
                      {leader.role}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {leader.credentials.split(" • ").map((cred) => (
                      <span
                        key={cred}
                        className="inline-flex items-center gap-1.5 bg-white dark:bg-zinc-900 text-on-surface dark:text-zinc-200 text-xs sm:text-sm font-inter font-semibold px-3.5 py-2 rounded-lg border border-outline-variant/40 shadow-xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        {cred}
                      </span>
                    ))}
                  </div>

                  <p className="font-inter text-base text-on-surface-variant dark:text-zinc-300 font-light leading-relaxed">
                    {leader.bio}
                  </p>

                  <div className="pt-3 border-t border-outline-variant/20 flex flex-wrap gap-5 text-sm text-on-surface-variant dark:text-zinc-400">
                    <div>
                      <span className="font-bold text-on-surface dark:text-zinc-200">
                        Experience:
                      </span>{" "}
                      {leader.experience.split(" ").slice(0, 2).join(" ")}
                    </div>
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
            </div>
          </ScrollReveal>
        ))}
      </section>

      {/* Global & Regional Studios */}
      <section className="bg-surface-container-low dark:bg-zinc-900/40 py-24 px-4 md:px-margin-desktop">
        <div className="max-w-container-max mx-auto space-y-16">
          <ScrollReveal>
            <div className="max-w-2xl space-y-4">
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
                <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl border border-outline-variant/30 flex flex-col justify-between min-h-[18rem] h-auto shadow-sm">
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
