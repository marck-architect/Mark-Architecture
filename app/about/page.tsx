"use client";

import React from "react";
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MapPin, ShieldCheck } from "lucide-react";

interface Leader {
  name: string;
  role: string;
  credentials: string;
  bio: string;
  experience: string;
  image: string;
}

const leaders: Leader[] = [
  {
    name: "Muhammad Rafiq",
    role: "Principal Architect & Founder",
    credentials: "PCATP Registered • B.Arch • Lead Structural Designer",
    experience: "14+ Years Experience",
    bio: "Pioneering mathematical precision in residential and commercial architecture across Pakistan. Specialist in passive solar layouts, municipal submission codes, and structural efficiency.",
    image: "/images/profile.jpeg",
  },
];

const achievements = [
  { metric: "15+", label: "Years of Architectural Practice" },
  { metric: "250+", label: "Residential & Commercial Masterpieces" },
  { metric: "1.8M+", label: "Sq. Ft. Designed & Built" },
  { metric: "100%", label: "Statutory Approval & Code Compliance" },
];

export default function AboutPage() {
  return (
    <div className="relative overflow-x-hidden min-h-screen pt-20 bg-surface dark:bg-zinc-950">
      {/* Header section */}
      <header className="px-4 md:px-margin-desktop max-w-container-max mx-auto py-16 md:py-24 border-b border-outline-variant/30">
        <ScrollReveal>
          <div className="max-w-4xl space-y-4">
            <span className="font-inter text-xs md:text-sm font-bold text-tertiary uppercase tracking-widest block">
              ATELIER IDENTITY &amp; CREDENTIALS
            </span>
            <h1 className="font-playfair text-4xl md:text-6xl text-on-surface dark:text-zinc-100 font-normal leading-tight">
              Designing spaces with <br />
              <span className="italic font-light">
                mathematical precision and soul.
              </span>
            </h1>
            <p className="font-inter text-base md:text-lg text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed max-w-3xl">
              MARK Architects is a collaborative practice of licensed
              architects, structural engineers, and spatial strategists. We
              specialize in bespoke residential estates, commercial hubs, and
              rigorous blueprint audits.
            </p>
          </div>
        </ScrollReveal>
      </header>

      {/* Metrics Bar */}
      <section className="border-b border-outline-variant/20 bg-surface-container-low dark:bg-zinc-900/60 py-12">
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
      <section className="py-24 px-4 md:px-margin-desktop max-w-container-max mx-auto border-b border-outline-variant/20">
        <ScrollReveal>
          <div className="space-y-3 mb-16 text-center max-w-2xl mx-auto">
            <span className="font-inter text-xs md:text-sm font-bold text-tertiary uppercase tracking-widest block">
              PRACTICE LEADERSHIP
            </span>
            <h2 className="font-playfair text-3xl md:text-5xl text-on-surface dark:text-zinc-100 font-normal">
              Principal Architect &amp; Founder.
            </h2>
            <p className="font-inter text-sm md:text-base text-on-surface-variant dark:text-zinc-400 font-light">
              Every project is personally spearheaded by Muhammad Rafiq,
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
            <ScrollReveal delay={0.1}>
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-outline-variant/30 flex flex-col justify-between h-72 shadow-sm">
                <div>
                  <h3 className="font-playfair text-2xl font-bold dark:text-zinc-200">
                    Peshawar
                  </h3>
                  <p className="font-inter text-xs text-tertiary font-bold tracking-widest mt-1 uppercase">
                    Headquarters (Atelier)
                  </p>
                  <p className="font-inter text-sm text-on-surface-variant dark:text-zinc-400 font-light mt-4 leading-relaxed">
                    4A, AL Haj Sher Tower, Ring Rd, Near Hayatabad, Peshawar
                  </p>
                </div>
                <div className="flex gap-2 text-xs text-on-surface-variant dark:text-zinc-400 font-light items-center">
                  <MapPin className="w-4 h-4 text-tertiary" />
                  <span>KPK, Pakistan</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-outline-variant/30 flex flex-col justify-between h-72 shadow-sm">
                <div>
                  <h3 className="font-playfair text-2xl font-bold dark:text-zinc-200">
                    Islamabad
                  </h3>
                  <p className="font-inter text-xs text-tertiary font-bold tracking-widest mt-1 uppercase">
                    Capital Studio
                  </p>
                  <p className="font-inter text-sm text-on-surface-variant dark:text-zinc-400 font-light mt-4 leading-relaxed">
                    Blue Area &amp; DHA Phase 2, Islamabad, Pakistan
                  </p>
                </div>
                <div className="flex gap-2 text-xs text-on-surface-variant dark:text-zinc-400 font-light items-center">
                  <MapPin className="w-4 h-4 text-tertiary" />
                  <span>ICT, Pakistan</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-outline-variant/30 flex flex-col justify-between h-72 shadow-sm">
                <div>
                  <h3 className="font-playfair text-2xl font-bold dark:text-zinc-200">
                    Karachi
                  </h3>
                  <p className="font-inter text-xs text-tertiary font-bold tracking-widest mt-1 uppercase">
                    Coastal Studio
                  </p>
                  <p className="font-inter text-sm text-on-surface-variant dark:text-zinc-400 font-light mt-4 leading-relaxed">
                    Clifton Block 4 &amp; DHA Phase 6, Karachi, Pakistan
                  </p>
                </div>
                <div className="flex gap-2 text-xs text-on-surface-variant dark:text-zinc-400 font-light items-center">
                  <MapPin className="w-4 h-4 text-tertiary" />
                  <span>Sindh, Pakistan</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
