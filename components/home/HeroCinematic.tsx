"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import {
  VillaOrbitViewer,
  type SourceKey,
} from "@/components/home/VillaOrbitViewer";
import balconyZoomManifest from "@/data/balconyZoomManifest.json";

type TierKey = "lg" | "sm";
type Fit = {
  containerW: number;
  containerH: number;
  cellW: number;
  cellH: number;
};

// Extra scroll distance (desktop only) that drives the push-in past the
// initial view, as a fraction of viewport height. Below md, no ScrollTrigger
// instance is created at all — the mobile/tablet hero stays exactly as it
// was, with its own separately-tuned layout, untouched by any of this.
const ZOOM_RUNWAY_VH_FRACTION = 1.4;

export const HeroCinematic: React.FC = () => {
  const { frameCount, cols, rows, tiers } = balconyZoomManifest;
  const tierData = tiers as Record<
    TierKey,
    {
      cellW: number;
      cellH: number;
      sheetW: number;
      sheetH: number;
      src: string;
    }
  >;

  const heroRef = useRef<HTMLElement>(null);

  const [tier, setTier] = useState<TierKey>("lg");
  const [zoomProgress, setZoomProgress] = useState(0);
  // The balcony footage is a continuation of source "1"'s specific villa —
  // showing it while source "2" (a different building) is selected would be
  // an obvious mismatch, so the scroll push-in only exists for source "1".
  const [activeSource, setActiveSource] = useState<SourceKey>("1");
  const src = tierData[tier].src;

  // Reset zoomProgress at the point of the actual source-change event
  // (rather than as an effect reacting to it) so the balcony overlay can't
  // stay stuck visible from a prior scroll state when switching away from
  // source "1".
  const handleSourceChange = (next: SourceKey) => {
    setActiveSource(next);
    if (next !== "1") setZoomProgress(0);
  };

  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setTier(mq.matches ? "lg" : "sm");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Preload only when the balcony sequence can actually play: `tier` is
  // "sm" below the same 768px breakpoint the GSAP effect below is gated on,
  // and the sequence is source-"1"-only. Preloading it unconditionally was
  // wasting real mobile bandwidth (a full atlas sheet) on a viewer that
  // never runs the scroll effect that would show it.
  useEffect(() => {
    if (tier !== "lg" || activeSource !== "1") return;
    const img = new window.Image();
    img.src = src;
  }, [src, tier, activeSource]);

  // Pin the hero and scrub `zoomProgress` 0->1 across an extra scroll
  // runway, desktop only. ScrollTrigger owns the pin/spacer sizing itself
  // (it inserts a correctly-measured spacer and swaps the element to
  // position:fixed for the pin duration) — this is what a hand-rolled
  // `position: sticky` + manually-computed `vh` wrapper kept getting wrong
  // (competing sm:/md: height classes produced a stale spacer height and a
  // dead black gap once the pin released). matchMedia handles create/revert
  // itself when crossing the breakpoint, so no manual cleanup juggling.
  useEffect(() => {
    // Balcony push-in only exists for source "1" — see activeSource's own
    // comment. Switching away kills any existing trigger (React runs the
    // previous effect's cleanup first); zoomProgress is reset at the
    // handler above, not here.
    if (activeSource !== "1") return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const trigger = ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * ZOOM_RUNWAY_VH_FRACTION}`,
        pin: true,
        // true, not a number: a numeric scrub value eases the playhead
        // toward the scroll position over that many seconds, which on
        // reversal shows a lagging blend of frames instead of jumping
        // straight to the exact frame for the current scroll position.
        // `true` ties zoomProgress to the scrollbar with zero lag either
        // direction.
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => setZoomProgress(self.progress),
      });
      return () => trigger.kill();
    });
    return () => mm.revert();
  }, [activeSource]);

  // Hard swap, not a crossfade: blending opacity between the orbit viewer
  // and the balcony sequence means showing two unrelated photos at once at
  // every mid-opacity point — a literal double-exposure ghost, not a
  // cinematic effect. A small dead zone at the very top lets the orbit
  // viewer still read as interactive before scroll takes over, then it's an
  // instant, clean toggle straight into the balcony sequence.
  const SWAP_AT = 0.04;
  const overlayVisible = zoomProgress > SWAP_AT;
  const balconyProgress = Math.max(
    0,
    Math.min(1, (zoomProgress - SWAP_AT) / (1 - SWAP_AT)),
  );

  const frameIndex = Math.round(balconyProgress * (frameCount - 1));
  const col = frameIndex % cols;
  const row = Math.floor(frameIndex / cols);

  const [fit, setFit] = useState<Fit | null>(null);
  useLayoutEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const cellAspect = tierData[tier].cellW / tierData[tier].cellH;
    const compute = () => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const containerAspect = rect.width / rect.height;
      const cellW =
        containerAspect > cellAspect ? rect.width : rect.height * cellAspect;
      const cellH =
        containerAspect > cellAspect ? rect.width / cellAspect : rect.height;
      setFit({ containerW: rect.width, containerH: rect.height, cellW, cellH });
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [tier, tierData]);

  const balconyBgStyle = useMemo<React.CSSProperties | undefined>(() => {
    if (!fit) return undefined;
    const offsetX = (fit.containerW - fit.cellW) / 2;
    const offsetY = (fit.containerH - fit.cellH) / 2;
    return {
      backgroundImage: `url(${src})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: `${fit.cellW * cols}px ${fit.cellH * rows}px`,
      backgroundPosition: `${offsetX - col * fit.cellW}px ${offsetY - row * fit.cellH}px`,
    };
  }, [fit, col, row, cols, rows, src]);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[100dvh] flex items-center overflow-hidden bg-zinc-950"
    >
      {/* Poster image fallback so the hero never renders as a black screen while the atlas loads */}
      <div
        className="absolute inset-0 bg-cover bg-top pointer-events-none brightness-[0.55] contrast-[1.05]"
        style={{
          backgroundImage:
            "url('/images/Front Elevation 3D (Exterior Render).png')",
        }}
      />

      {/* Layer 0: interactive orbit viewer — the resting hero visual */}
      <VillaOrbitViewer
        fill
        compareSources
        onSourceChange={handleSourceChange}
      />

      {/* Layer 1 (desktop only): balcony push-in. Hard-toggled visible once
          scroll passes the small dead zone — never partially transparent,
          so the orbit viewer never shows through underneath it. Mounted
          only while visible so it isn't sitting there invisible-but-present. */}
      {overlayVisible && (
        <div className="absolute inset-0 z-30 pointer-events-none hidden md:block">
          <div
            className={cn(
              "absolute inset-0",
              balconyBgStyle && "brightness-[0.85]",
            )}
            style={balconyBgStyle}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/40" />
        </div>
      )}

      {/* Massive Background Typography — sits under the balcony layer on
            purpose, so it's covered once the push-in takes over (it's a
            background flourish tied to the resting hero, not persistent
            branding like the headline below). */}
      <div className="absolute inset-0 flex items-center justify-center z-10 select-none pointer-events-none overflow-hidden">
        <span className="hero-text-outline font-montserrat text-[22vw] font-extrabold opacity-[0.07] tracking-tighter">
          MARK
        </span>
      </div>

      {/* Scrim scoped to the text column (left-to-right) for headline readability */}
      <div className="absolute inset-0 z-[32] bg-gradient-to-r from-zinc-950/90 from-10% via-zinc-950/40 via-45% to-transparent to-70% pointer-events-none" />

      {/* Content sits above the drag surface but doesn't block it — only
            the actual links opt back into pointer events. Capped to ~60%
            width on large screens so the villa's right side stays clear.
            Stays visible throughout the scroll (z-40, above the balcony
            layer's z-30) rather than fading out — the scrim above keeps it
            legible against either image. */}
      <div className="relative z-40 w-full max-w-container-max mx-auto px-4 md:px-margin-desktop text-white pt-24 sm:pt-28 pointer-events-none">
        <div className="max-w-xl lg:max-w-[55%] space-y-5 sm:space-y-6">
          <h1 className="font-playfair text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.1] md:leading-[1.15]">
            Designing Spaces That <br />
            <span className="italic font-light">Inspire Generations.</span>
          </h1>

          <p className="font-inter text-sm sm:text-base md:text-lg text-white/85 max-w-lg font-light leading-relaxed">
            Where mathematical precision meets climate-responsive luxury. We
            craft bespoke residential estates and visionary spaces engineered to
            capture light, elevate living, and endure across generations.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2">
            <Link
              href="/consultation"
              className="pointer-events-auto w-full sm:w-auto bg-tertiary text-on-tertiary px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold tracking-wide hover:bg-tertiary-fixed transition-all duration-300 shadow-xl active:scale-95 text-center flex items-center justify-center gap-2 font-inter text-xs uppercase min-h-[48px]"
            >
              <span>Explore Services &amp; Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/portfolio"
              className="pointer-events-auto w-full sm:w-auto border border-white/60 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold tracking-wide hover:bg-white hover:text-black transition-all duration-300 active:scale-95 text-center font-inter text-xs uppercase min-h-[48px] flex items-center justify-center"
            >
              View Selected Works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCinematic;
