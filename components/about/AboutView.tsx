"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MapPin, ShieldCheck, ArrowDown } from "lucide-react";

import {
  leaders as fallbackLeaders,
  achievements as fallbackAchievements,
  studioLocations as fallbackStudioLocations,
} from "@/data/about";
import type { Leader, Achievement, StudioLocation } from "@/types";

const Metric: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-tertiary font-semibold">{children}</span>
);

interface AboutViewProps {
  initialLeaders?: Leader[];
  initialAchievements?: Achievement[];
  initialStudioLocations?: StudioLocation[];
}

export const AboutView: React.FC<AboutViewProps> = ({
  initialLeaders,
  initialAchievements,
  initialStudioLocations,
}) => {
  const leaders =
    initialLeaders && initialLeaders.length > 0
      ? initialLeaders
      : fallbackLeaders;
  const achievements =
    initialAchievements && initialAchievements.length > 0
      ? initialAchievements
      : fallbackAchievements;
  const studioLocations =
    initialStudioLocations && initialStudioLocations.length > 0
      ? initialStudioLocations
      : fallbackStudioLocations;
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
            {achievements && achievements.length >= 4 ? (
              <p
                className="font-playfair text-on-surface dark:text-zinc-100 font-normal leading-[1.35]"
                style={{ fontSize: "clamp(1.5rem, 1.05rem + 2vw, 2.5rem)" }}
              >
                In <Metric>{achievements[0]?.metric}</Metric> years of practice,
                we have designed <Metric>{achievements[1]?.metric}</Metric>{" "}
                residential and commercial projects spanning{" "}
                <Metric>{achievements[2]?.metric}</Metric> square feet, with a{" "}
                <Metric>{achievements[3]?.metric}</Metric> record of statutory
                approval and code compliance.
              </p>
            ) : (
              <p className="font-playfair text-on-surface-variant dark:text-zinc-400 font-normal text-xl leading-relaxed">
                Spearheading architectural excellence, seismic safety, and
                mathematical precision across Pakistan.
              </p>
            )}
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
                Principal Architect and Founder.
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
        {leaders.length === 0 ? (
          <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-16 text-center border border-dashed border-outline-variant/30 rounded-3xl bg-surface-container-low/40 dark:bg-zinc-900/30">
            <p className="font-playfair text-2xl text-on-surface dark:text-zinc-200">
              No team profiles published yet
            </p>
            <p className="font-inter text-sm text-zinc-500 mt-2 max-w-md mx-auto">
              Architect and team leadership profiles will appear here once
              published from the admin dashboard.
            </p>
          </div>
        ) : (
          leaders.map((leader) => (
            <div
              key={leader.name}
              className="w-full grid grid-cols-1 lg:grid-cols-[2fr_3fr] bg-surface-container-low dark:bg-zinc-900 border-y border-outline-variant/20"
            >
              {/* Left: contained circular portrait — left-aligned in its
                  column, vertically centered against the text. A defined
                  circular boundary (with the offset gold ring as the
                  deliberate edge) rather than a full-bleed rectangle means
                  there's no seam to fight regardless of the source photo's
                  own backdrop color. */}
              <div className="flex items-center justify-start px-6 md:px-margin-desktop lg:px-16 py-14 lg:py-16">
                <div className="relative w-[280px] sm:w-[360px] lg:w-[450px] aspect-square shrink-0">
                  {/* Offset gold ring, sitting a few px behind/right of the
                      photo for depth — traces in like a drawn circle
                      slightly after the photo scales/fades into place. */}
                  <svg
                    className="absolute -right-3 -bottom-3 w-full h-full pointer-events-none overflow-visible"
                    viewBox="0 0 100 100"
                  >
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="49.5"
                      fill="none"
                      stroke="#8a6125"
                      strokeWidth="0.6"
                      pathLength={1}
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{
                        pathLength: { duration: 0.7, delay: 0.35, ease: "easeOut" },
                        opacity: { duration: 0.2, delay: 0.35 },
                      }}
                    />
                  </svg>

                  {/* Photo circle */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85, x: 40 }}
                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative w-full h-full rounded-full overflow-hidden shadow-xl ring-1 ring-black/5"
                  >
                    <Image
                      fill
                      src={leader.image}
                      alt={`${leader.name}, ${leader.role} at MARK Architects`}
                      sizes="(max-width: 640px) 280px, (max-width: 1024px) 360px, 450px"
                      className="object-cover object-top"
                      priority
                    />
                  </motion.div>
                </div>
              </div>

              {/* Right: qualifications — vertically centered, same left
                  gutter as the rest of the page. Slides up slightly after
                  the photo starts, rather than sliding sideways too, so the
                  two don't compete with identical motion. */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
                className="flex flex-col justify-center px-4 md:px-margin-desktop py-14 lg:py-20"
              >
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
              </motion.div>
            </div>
          ))
        )}
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

          {studioLocations.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-outline-variant/30 rounded-3xl p-8 bg-surface-container-low/40 dark:bg-zinc-900/30">
              <p className="font-playfair text-2xl text-on-surface dark:text-zinc-200">
                No studio locations published yet
              </p>
              <p className="font-inter text-sm text-zinc-500 mt-2 max-w-md mx-auto">
                Studio locations and regional liaison addresses will appear here
                once published from the admin dashboard.
              </p>
            </div>
          ) : (
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
          )}
        </div>
      </section>
    </div>
  );
};
