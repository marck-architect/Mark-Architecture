"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  VillaOrbitViewer,
  type SourceKey,
} from "@/components/home/VillaOrbitViewer";
import balconyZoomManifest from "@/data/balconyZoomManifest.json";

type TierKey = "lg" | "sm";

// Extra scroll distance (desktop only) that drives the push-in past the
// initial view, as a fraction of viewport height. Below md, no ScrollTrigger
// instance is created at all — the mobile/tablet hero stays exactly as it
// was, with its own separately-tuned layout, untouched by any of this.
const ZOOM_RUNWAY_VH_FRACTION = 0.8;

// The atlas is a single 8000x5400 sprite sheet (120 frames @ 800x450 each).
// Animating it via CSS background-position/background-size forces the
// browser to repaint that whole multi-megapixel region on every scroll
// tick — visibly laggy regardless of how cheaply the frame index itself is
// computed. Canvas + drawImage (GSAP's own documented pattern for
// scroll-scrubbed image sequences: gsap.com/docs/v3/HelperFunctions/
// helpers/imageSequenceScrub) blits only the current frame's native-res
// cell straight into the compositor, which is what actually fixes it.
function drawBalconyFrame(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  col: number,
  row: number,
  nativeCellW: number,
  nativeCellH: number,
) {
  if (!img.complete || img.naturalWidth === 0) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Cap DPR at 2: canvas pixel area (and therefore draw cost) scales with
  // the square of this, and the source cells are already well below 3x
  // display size on typical screens, so anything past 2x buys no visible
  // sharpness for real per-frame cost.
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cssW = canvas.clientWidth;
  const cssH = canvas.clientHeight;
  if (!cssW || !cssH) return;
  const pixelW = Math.round(cssW * dpr);
  const pixelH = Math.round(cssH * dpr);
  if (canvas.width !== pixelW || canvas.height !== pixelH) {
    canvas.width = pixelW;
    canvas.height = pixelH;
  }

  // "cover" crop: the sub-rect of this one native-resolution cell that
  // matches the canvas's aspect ratio, centered — same framing the old
  // background-position offsetX/offsetY math produced.
  const cellAspect = nativeCellW / nativeCellH;
  const canvasAspect = pixelW / pixelH;
  const srcW = canvasAspect > cellAspect ? nativeCellW : nativeCellH * canvasAspect;
  const srcH = canvasAspect > cellAspect ? nativeCellW / canvasAspect : nativeCellH;
  const srcX = col * nativeCellW + (nativeCellW - srcW) / 2;
  const srcY = row * nativeCellH + (nativeCellH - srcH) / 2;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.clearRect(0, 0, pixelW, pixelH);
  ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, pixelW, pixelH);
}

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
  const balconyCanvasRef = useRef<HTMLCanvasElement>(null);
  const balconyImgRef = useRef<HTMLImageElement | null>(null);
  // Last frame actually drawn, so a pure resize (no scroll) can redraw at
  // the new canvas size without waiting for the next ScrollTrigger tick.
  const lastFrameRef = useRef({ col: 0, row: 0 });

  const [tier, setTier] = useState<TierKey>("lg");
  // The balcony footage is a continuation of source "1"'s specific villa —
  // showing it while source "2" (a different building) is selected would be
  // an obvious mismatch, so the scroll push-in only exists for source "1".
  const [activeSource, setActiveSource] = useState<SourceKey>("1");
  const src = tierData[tier].src;

  // Reset the overlay at the point of the actual source-change event
  // (rather than as an effect reacting to it) so the balcony overlay can't
  // stay stuck visible from a prior scroll state when switching away from
  // source "1".
  const [overlayVisible, setOverlayVisible] = useState(false);
  const overlayVisibleRef = useRef(false);
  const handleSourceChange = (next: SourceKey) => {
    setActiveSource(next);
    if (next !== "1") {
      overlayVisibleRef.current = false;
      setOverlayVisible(false);
    }
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
  // never runs the scroll effect that would show it. The loaded element
  // itself is kept (not just fired-and-forgotten) since it's the drawImage
  // source for every canvas draw below.
  useEffect(() => {
    if (tier !== "lg" || activeSource !== "1") return;
    const img = new window.Image();
    img.onload = () => {
      balconyImgRef.current = img;
      const canvas = balconyCanvasRef.current;
      if (canvas) {
        const { col, row } = lastFrameRef.current;
        drawBalconyFrame(canvas, img, col, row, tierData[tier].cellW, tierData[tier].cellH);
      }
    };
    img.src = src;
  }, [src, tier, activeSource, tierData]);

  // Redraws the last known frame when the hero resizes without a scroll
  // event happening (e.g. rotating a tablet, or a window resize) — the
  // canvas's pixel buffer is sized off clientWidth/clientHeight at draw
  // time, so it goes stale otherwise.
  useEffect(() => {
    const canvas = balconyCanvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      const img = balconyImgRef.current;
      if (!img) return;
      const { col, row } = lastFrameRef.current;
      drawBalconyFrame(canvas, img, col, row, tierData[tier].cellW, tierData[tier].cellH);
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [tier, tierData]);

  // Pin the hero and scrub `zoomProgress` 0->1 across an extra scroll
  // runway, desktop only. ScrollTrigger owns the pin/spacer sizing itself
  // (it inserts a correctly-measured spacer and swaps the element to
  // position:fixed for the pin duration) — this is what a hand-rolled
  // `position: sticky` + manually-computed `vh` wrapper kept getting wrong
  // (competing sm:/md: height classes produced a stale spacer height and a
  // dead black gap once the pin released). matchMedia handles create/revert
  // itself when crossing the breakpoint, so no manual cleanup juggling.
  // Hard swap, not a crossfade: blending opacity between the orbit viewer
  // and the balcony sequence means showing two unrelated photos at once at
  // every mid-opacity point — a literal double-exposure ghost, not a
  // cinematic effect. A small dead zone at the very top lets the orbit
  // viewer still read as interactive before scroll takes over, then it's an
  // instant, clean toggle straight into the balcony sequence.
  const SWAP_AT = 0.04;

  useEffect(() => {
    // Balcony push-in only exists for source "1" — see activeSource's own
    // comment. Switching away kills any existing trigger (the overlay is
    // reset at the handler above, not here).
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
        // `true` ties progress to the scrollbar with zero lag either
        // direction.
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // Writes the sprite frame straight to the DOM via refs instead of
        // React state — calling setState here would force a full component
        // re-render on every scroll tick (~60/sec during the scrub), which
        // is what was causing the stutter. `overlayVisible` is still real
        // React state, but it's only committed on the rare tick where it
        // actually flips, not continuously.
        onUpdate: (self) => {
          const progress = self.progress;
          const visible = progress > SWAP_AT;
          if (visible !== overlayVisibleRef.current) {
            overlayVisibleRef.current = visible;
            setOverlayVisible(visible);
          }
          const canvas = balconyCanvasRef.current;
          const img = balconyImgRef.current;
          if (visible && canvas && img) {
            const balconyProgress = Math.max(
              0,
              Math.min(1, (progress - SWAP_AT) / (1 - SWAP_AT)),
            );
            const frameIndex = Math.round(balconyProgress * (frameCount - 1));
            const col = frameIndex % cols;
            const row = Math.floor(frameIndex / cols);
            lastFrameRef.current = { col, row };
            drawBalconyFrame(canvas, img, col, row, tierData[tier].cellW, tierData[tier].cellH);
          }
        },
      });
      return () => trigger.kill();
    });
    return () => mm.revert();
    // cols/frameCount/rows come from the static balconyZoomManifest import —
    // stable across the component's lifetime. tier/tierData are included
    // because onUpdate reads tierData[tier] directly (a real, if rare,
    // dependency — tier can change on a breakpoint cross independently of
    // activeSource).
  }, [activeSource, cols, frameCount, rows, tier, tierData]);

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
          <canvas
            ref={balconyCanvasRef}
            className="absolute inset-0 h-full w-full brightness-[0.85]"
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
      <div className="relative z-40 w-full max-w-container-max mx-auto px-4 md:px-margin-desktop text-white pt-16 pointer-events-none">
        <div className="max-w-xl lg:max-w-[55%] space-y-4 sm:space-y-5">
          <h1
            className="font-playfair font-normal leading-[1.1] md:leading-[1.15]"
            style={{ fontSize: "clamp(2rem, 1.25rem + 3vw, 4rem)" }}
          >
            Designing Spaces That <br />
            <span className="font-light">Inspire Generations.</span>
          </h1>

          <p
            className="font-inter text-white/85 max-w-lg font-light leading-relaxed"
            style={{ fontSize: "clamp(0.9375rem, 0.85rem + 0.3vw, 1.125rem)" }}
          >
            Mathematical precision meets climate-responsive luxury, crafted into
            bespoke residential and commercial spaces built to endure.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-1">
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
