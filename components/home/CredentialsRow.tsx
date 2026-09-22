"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Animation timing (tune here) ---------------------------------------
const VIEWPORT_AMOUNT = 0.2; // fire once the row is ~20% into view
const ITEM_DURATION = 0.55; // seconds
const ITEM_Y_OFFSET = 16; // px, translateY start position for the entrance
const STAGGER_DELAY = 0.12; // seconds between each item's entrance
const DIVIDER_DELAY_OFFSET = 0.15; // divider starts this long after its item
const DIVIDER_DURATION = 0.5; // seconds
const HOVER_DURATION_MS = 200; // ms, all hover transitions

// Permanent per-item vertical stagger (desktop row layout only), via
// margin-top on each item's wrapper. Not applied on the stacked mobile
// layout. Each value should read as visibly distinct from its neighbors.
//
// This array drives the divider height measurement below, but Tailwind
// only generates CSS for arbitrary-value classes it can see as literal
// strings in source — a template-literal class built from this array
// would silently produce no styles. So the actual `lg:mt-[Npx]` classes on
// each item are hardcoded separately further down and MUST be kept in sync
// with these numbers by hand if you change them.
const ITEM_OFFSETS_PX = [0, 32, 8, 40];
// Extra breathing room added below the taller of two neighboring items when
// sizing the divider between them.
const DIVIDER_BOTTOM_PAD = 8;

// Split from the user-provided public/images/svgs-home.png sprite via
// scripts/split-svgs-home-sprite.mjs — already transparent, no background
// removal needed.
interface CredentialItem {
  icon: string;
  title: string;
  body: string;
}

const items: CredentialItem[] = [
  {
    icon: "/images/credentials/passive-solar.png",
    title: "Passive Solar & Climate Control",
    body: "Strategic orientation to capture southern sun in winter and cross-ventilation in peak summer heat.",
  },
  {
    icon: "/images/credentials/bylaw-approved.png",
    title: "PDA, CDA & KDA Bylaw Mastery",
    body: "Full submission drawings ensuring frictionless municipal approvals across Hayatabad, Islamabad, and Karachi.",
  },
  {
    icon: "/images/credentials/seismic-structural.png",
    title: "Seismic & Structural Safety",
    body: "Complete structural engineering framing calculated for Building Code of Pakistan seismic zones.",
  },
  {
    icon: "/images/credentials/milestone-terms.png",
    title: "50% Advance Milestone Terms",
    body: "Transparent stage payments processed securely via Safepay with complete client review checkpoints.",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER_DELAY },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: ITEM_Y_OFFSET },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: ITEM_DURATION, ease: "easeOut" },
  },
};

// Divider draws top-to-bottom slightly after its adjacent item, so it reads
// as trailing the item's arrival rather than appearing in lockstep with it.
const dividerVariants: Variants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: {
      duration: DIVIDER_DURATION,
      ease: "easeOut",
      delay: DIVIDER_DELAY_OFFSET,
    },
  },
};

interface DividerRect {
  top: number;
  height: number;
}

export const CredentialsRow: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: VIEWPORT_AMOUNT });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [dividerRects, setDividerRects] = useState<DividerRect[]>(
    items.slice(0, -1).map(() => ({ top: 0, height: 0 })),
  );

  // Each divider between item i and i+1 must span from the top of whichever
  // of the two sits higher to the bottom of whichever extends lower — since
  // the items are offset by different amounts via margin-top, that's not a
  // fixed value and has to come from measuring the actual rendered items.
  useLayoutEffect(() => {
    const measure = () => {
      const spans = itemRefs.current.map((el, i) => {
        const top = ITEM_OFFSETS_PX[i];
        const height = el?.offsetHeight ?? 0;
        return { top, bottom: top + height };
      });
      const rects = spans.slice(0, -1).map((span, i) => {
        const next = spans[i + 1];
        const top = Math.min(span.top, next.top);
        const bottom = Math.max(span.bottom, next.bottom);
        return { top, height: bottom - top + DIVIDER_BOTTOM_PAD };
      });
      setDividerRects(rects);
    };

    measure();

    const ro = new ResizeObserver(measure);
    itemRefs.current.forEach((el) => el && ro.observe(el));
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="flex flex-col lg:flex-row lg:items-start"
    >
      {items.map((item, idx) => {
        const isHovered = hoveredIndex === idx;

        return (
          <React.Fragment key={item.title}>
            <motion.div
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              variants={itemVariants}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                "flex-1 py-8 lg:py-0 lg:px-10 first:lg:pl-0 last:lg:pr-0",
                idx === 0 && "lg:mt-0",
                idx === 1 && "lg:mt-[32px]",
                idx === 2 && "lg:mt-[8px]",
                idx === 3 && "lg:mt-[40px]",
              )}
            >
              <div
                className="relative h-[108px] w-[108px] origin-top-left transition-transform ease-out"
                style={{
                  transitionDuration: `${HOVER_DURATION_MS}ms`,
                  transform: isHovered ? "scale(1.05)" : "scale(1)",
                }}
              >
                <Image
                  src={item.icon}
                  alt=""
                  fill
                  sizes="108px"
                  className="object-contain object-left"
                  style={{
                    // These raster icons have no vector stroke to widen, so
                    // a tight double drop-shadow halo simulates a bolder
                    // stroke without the pixelation a raster dilate causes
                    // at this source resolution.
                    filter:
                      "drop-shadow(0 0 0.4px #8a6125) drop-shadow(0 0 0.4px #8a6125)",
                  }}
                />
              </div>
              <span
                className={cn(
                  "mt-8 block font-inter text-sm font-bold uppercase tracking-[0.2em]",
                  "transition-colors ease-out underline-offset-4",
                  isHovered
                    ? "text-[#8a6125] underline"
                    : "text-[#8a6125]/60 no-underline",
                )}
                style={{ transitionDuration: `${HOVER_DURATION_MS}ms` }}
              >
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-playfair text-2xl font-bold text-[#272522]">
                {item.title}
              </h3>
              <p className="mt-3 font-inter text-base font-light leading-relaxed text-[#77716a]">
                {item.body}
              </p>
            </motion.div>

            {idx < items.length - 1 && (
              <div className="relative hidden lg:block shrink-0 self-stretch w-2">
                {/* Blueprint-style dimension line: a vertical rule with a
                    small horizontal tick capping each end. Positioned and
                    sized to span from the top of whichever neighboring item
                    sits higher to the bottom of whichever extends lower —
                    computed above via ResizeObserver, not a fixed height —
                    so it never looks disconnected from an offset item. */}
                <motion.div
                  variants={dividerVariants}
                  className="absolute left-0 w-2"
                  style={{
                    top: dividerRects[idx].top,
                    height: dividerRects[idx].height,
                    transformOrigin: "top",
                  }}
                >
                  <div
                    className={cn(
                      "absolute inset-y-0 left-1/2 -translate-x-1/2 transition-all ease-out",
                      hoveredIndex === idx
                        ? "w-[2px] bg-[#8a6125] shadow-[0_0_10px_rgba(138,97,37,0.45)]"
                        : "w-px bg-[#bca477] shadow-none",
                    )}
                    style={{ transitionDuration: `${HOVER_DURATION_MS}ms` }}
                  />
                  <div
                    className={cn(
                      "absolute top-0 left-0 h-px w-2 transition-colors ease-out",
                      hoveredIndex === idx ? "bg-[#8a6125]" : "bg-[#bca477]",
                    )}
                    style={{ transitionDuration: `${HOVER_DURATION_MS}ms` }}
                  />
                  <div
                    className={cn(
                      "absolute bottom-0 left-0 h-px w-2 transition-colors ease-out",
                      hoveredIndex === idx ? "bg-[#8a6125]" : "bg-[#bca477]",
                    )}
                    style={{ transitionDuration: `${HOVER_DURATION_MS}ms` }}
                  />
                </motion.div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </motion.div>
  );
};

export default CredentialsRow;
