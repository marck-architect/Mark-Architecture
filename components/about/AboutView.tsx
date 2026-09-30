"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AboutHero } from "@/components/about/AboutHero";
import { MapPin, ShieldCheck } from "lucide-react";

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
      <AboutHero />

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
        className="relative overflow-hidden bg-[#292722] text-white py-24 border-b border-white/10 scroll-mt-20"
      >
        {/* Subtle architectural background geometry matching Testimonials Carousel */}
        <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full border border-[#c9a86e]/15" />
        <div className="pointer-events-none absolute -right-8 top-8 h-80 w-80 rounded-full border border-[#c9a86e]/10" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full border border-[#c9a86e]/10" />

        <div className="relative z-10 px-4 md:px-margin-desktop max-w-container-max mx-auto">
          <ScrollReveal>
            <div className="space-y-3 mb-16 max-w-2xl">
              <span className="font-inter text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-[#c9a86e] block">
                PRACTICE LEADERSHIP
              </span>
              <h2 className="font-playfair text-3xl md:text-5xl text-white font-normal">
                Principal Architect and Founder.
              </h2>
              <p className="font-inter text-sm md:text-base text-zinc-300 font-light leading-relaxed">
                Every project is personally spearheaded by Muhammad Arsalan,
                ensuring structural stability, functional elegance, and strict
                compliance with local municipal codes.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Full-bleed profile band */}
        {leaders.length === 0 ? (
          <div className="relative z-10 max-w-container-max mx-auto px-4 md:px-margin-desktop py-16 text-center border border-dashed border-white/20 rounded-3xl bg-white/[0.03]">
            <p className="font-playfair text-2xl text-white">
              No team profiles published yet
            </p>
            <p className="font-inter text-sm text-zinc-400 mt-2 max-w-md mx-auto">
              Architect and team leadership profiles will appear here once
              published from the admin dashboard.
            </p>
          </div>
        ) : (
          leaders.map((leader) => (
            <div
              key={leader.name}
              className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-[2fr_3fr] bg-white/[0.03] border-y border-white/10 overflow-hidden"
            >
              {/* Left: contained circular portrait sliding in from the left */}
              <div className="flex items-center justify-start px-6 md:px-margin-desktop lg:px-16 py-14 lg:py-16">
                <motion.div
                  initial={{ opacity: 0, x: -70, scale: 0.96 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-[280px] sm:w-[360px] lg:w-[450px] aspect-square shrink-0"
                >
                  {/* Photo circle */}
                  <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl bg-zinc-950 border border-white/10">
                    <Image
                      fill
                      src={leader.image}
                      alt={`${leader.name}, ${leader.role} at MARK Architects`}
                      sizes="(max-width: 640px) 280px, (max-width: 1024px) 360px, 450px"
                      className="object-cover object-top"
                      priority
                    />
                  </div>

                  {/* Circular border framing the photo */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none z-10 -rotate-90 overflow-visible"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="49"
                      fill="none"
                      stroke="#c9a86e"
                      strokeWidth="1.2"
                      strokeOpacity="0.4"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="49"
                      fill="none"
                      stroke="#e8c889"
                      strokeWidth="1.5"
                      pathLength={1}
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true, amount: 0.25 }}
                      transition={{
                        pathLength: {
                          duration: 1.0,
                          delay: 0.35,
                          ease: "easeInOut",
                        },
                        opacity: { duration: 0.4, delay: 0.3 },
                      }}
                    />
                  </svg>
                </motion.div>
              </div>

              {/* Right: qualifications sliding in from the right */}
              <motion.div
                initial={{ opacity: 0, x: 70 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.85,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.15,
                }}
                className="flex flex-col justify-center px-4 md:px-margin-desktop py-14 lg:py-20"
              >
                <div className="max-w-xl space-y-5 w-full">
                  <div>
                    <div className="h-px w-12 bg-[#c9a86e] mb-4" />
                    <h3 className="font-playfair text-4xl sm:text-5xl font-bold text-white">
                      {leader.name}
                    </h3>
                    <p className="text-sm sm:text-base text-[#e8c889] font-inter font-semibold mt-1.5">
                      {leader.role}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {leader.credentials.split(" • ").map((cred) => (
                      <span
                        key={cred}
                        className="inline-flex items-center gap-1.5 bg-white/10 text-white text-xs sm:text-sm font-inter font-medium px-3.5 py-2 rounded-lg border border-white/15 shadow-xs backdrop-blur-xs"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#e8c889] shrink-0" />
                        {cred}
                      </span>
                    ))}
                  </div>

                  <p className="font-inter text-base text-zinc-300 font-light leading-relaxed">
                    {leader.bio}
                  </p>

                  <div className="pt-3 border-t border-white/10 flex flex-wrap gap-5 text-sm text-zinc-400">
                    <div>
                      <span className="font-bold text-white">Experience:</span>{" "}
                      {leader.experience.split(" ").slice(0, 2).join(" ")}
                    </div>
                    <div>
                      <span className="font-bold text-white">Focus:</span>{" "}
                      Residential &amp; Commercial Masterplanning
                    </div>
                    <div>
                      <span className="font-bold text-white">Council:</span>{" "}
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
