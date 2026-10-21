"use client";

import React, { useLayoutEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ShoppingBag } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.2, 0.7, 0.2, 1] as const;

const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.05 + i * 0.13, ease: EASE },
  }),
};

export const ProductsHero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const loop = gsap.to(trackRef.current, { xPercent: -50, duration: 50, ease: "none", repeat: -1 });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const trigger = ScrollTrigger.create({
          trigger: sectionRef.current, start: "top top", end: "bottom top",
          onUpdate: (self) => {
            gsap.to(loop, { timeScale: 1 + Math.abs(self.getVelocity()) / 800, duration: 0.3, overwrite: true });
            gsap.to(loop, { timeScale: 1, duration: 1, delay: 0.3 });
          },
        });
        gsap.to(trackRef.current, {
          yPercent: 20, opacity: 0.4, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
        });
        return () => trigger.kill();
      });
      mm.add("(prefers-reduced-motion: reduce)", () => loop.pause());
    }, sectionRef);
    return () => { ctx.revert(); mm.revert(); };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-svh items-center overflow-hidden bg-cream font-instrument text-ink antialiased"
    >
      {/* Watermark marquee */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none">
        <div
          ref={trackRef}
          className="flex w-max whitespace-nowrap font-newsreader text-[clamp(110px,15vw,260px)] leading-none tracking-[-0.01em] text-ink/[0.07] will-change-transform"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="pr-[0.25em]">PRODUCTS</span>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-[clamp(20px,6vw,96px)] py-[clamp(96px,14vh,160px)]">
        <h1 className="m-0 font-newsreader text-[clamp(36px,6vw,92px)] font-medium leading-[0.98] tracking-[-0.025em]">
          <motion.span className="block" variants={rise} initial="hidden" animate="show" custom={0}>Curated interior</motion.span>
          <motion.span className="mt-[0.04em] block" variants={rise} initial="hidden" animate="show" custom={1}>
            & exterior <span className="text-gold">products.</span>
          </motion.span>
        </h1>

        <motion.p
          variants={rise} initial="hidden" animate="show" custom={2}
          className="mt-[clamp(20px,3vw,32px)] max-w-[660px] text-[clamp(16px,1.35vw,19px)] leading-relaxed text-ink-soft text-pretty"
        >
          Browse lighting, furniture, décor, tiles, and more across every category — hand-picked pieces ready to
          furnish and finish your space.
        </motion.p>

        <motion.div
          variants={rise} initial="hidden" animate="show" custom={3}
          className="mt-[clamp(28px,4vw,44px)]"
        >
          <a
            href="#collection-catalog"
            className="group inline-flex min-h-14 items-center justify-center gap-2.5 rounded border border-ink bg-ink px-7 text-base font-medium text-cream shadow-[0_10px_24px_-12px_rgba(21,25,30,.5)] transition-transform hover:-translate-y-0.5"
          >
            Shop Our Collection
            <span className="relative inline-grid size-4 place-items-center">
              <ArrowDown
                size={16}
                className="absolute inset-0 transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:opacity-0"
              />
              <ShoppingBag
                size={16}
                className="absolute inset-0 translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
              />
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsHero;
