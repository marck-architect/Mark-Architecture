"use client";

import React, { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ShieldCheck, Video } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.05 + i * 0.13, ease: [0.2, 0.7, 0.2, 1] },
  }),
};

export const PricingHero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Seamless infinite loop: track holds 2 identical halves, move by -50%.
        const loop = gsap.to(trackRef.current, {
          xPercent: -50,
          duration: 40,
          ease: "none",
          repeat: -1,
        });
        // Scroll speeds the marquee up and fades it slightly.
        const trigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          onUpdate: (self) => {
            gsap.to(loop, { timeScale: 1 + self.getVelocity() / 600, duration: 0.3, overwrite: true });
            gsap.to(loop, { timeScale: 1, duration: 1, delay: 0.3 });
          },
        });
        gsap.to(trackRef.current, {
          yPercent: 20,
          opacity: 0.4,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
        });
        return () => trigger.kill();
      });
      return () => mm.revert();
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const words = Array.from({ length: 6 });

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-svh items-center overflow-hidden bg-cream font-instrument text-ink"
    >
      {/* Watermark marquee */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none">
        <div
          ref={trackRef}
          className="flex w-max whitespace-nowrap font-newsreader text-[clamp(110px,15vw,260px)] leading-none tracking-[-0.01em] text-ink/[0.07] will-change-transform"
        >
          {words.map((_, i) => (
            <span key={i} className="pr-[0.25em]">PRICING</span>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-[clamp(20px,6vw,96px)] py-[clamp(96px,14vh,160px)]">
        <h1 className="m-0 font-newsreader text-[clamp(36px,6vw,92px)] font-medium leading-[0.98] tracking-[-0.025em]">
          <motion.span className="block text-ink" variants={rise} initial="hidden" animate="show" custom={0}>
            Transparent
          </motion.span>
          <motion.span className="mt-[0.06em] block text-gold" variants={rise} initial="hidden" animate="show" custom={1}>
            pricing and packages.
          </motion.span>
        </h1>

        <motion.p
          variants={rise} initial="hidden" animate="show" custom={2}
          className="mt-[clamp(20px,3vw,32px)] max-w-[640px] text-[clamp(16px,1.35vw,19px)] leading-relaxed text-ink-soft text-pretty"
        >
          Explore our full menu of architectural services. Every package has fixed deliverables, a clear price, and
          secure checkout through Safepay.
        </motion.p>

        <motion.div
          variants={rise} initial="hidden" animate="show" custom={3}
          className="mt-[clamp(28px,4vw,44px)] flex flex-wrap gap-x-5 gap-y-3.5"
        >
          <a
            href="#packages"
            className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded border border-gold bg-ink px-7 text-base font-medium text-cream shadow-[0_10px_24px_-12px_rgba(21,25,30,.5)] transition-transform hover:-translate-y-0.5"
          >
            Browse Package Menu <ArrowDown size={16} />
          </a>
          <a
            href="#payment-policy"
            className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded border border-gold-line px-6 text-base text-gold-deep transition-colors hover:bg-gold/10"
          >
            <ShieldCheck size={18} strokeWidth={1.6} /> Payment Policy (50% Advance)
          </a>
          <Link
            href="/consultation"
            className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded border border-gold-line px-6 text-base text-gold-deep transition-colors hover:bg-gold/10"
          >
            <Video size={18} strokeWidth={1.6} /> Book Consultation Call
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingHero;
