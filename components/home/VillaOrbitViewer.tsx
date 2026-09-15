"use client";

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Move, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import heroAtlasManifest from "@/data/heroAtlasManifest.json";
import heroAtlasManifest2 from "@/data/heroAtlasManifest2.json";

type TierKey = "lg" | "sm";
export type SourceKey = "1" | "2";
const SOURCES: Record<SourceKey, typeof heroAtlasManifest> = {
  "1": heroAtlasManifest,
  "2": heroAtlasManifest2,
};

// 1x is a hard floor, not just a default: the atlas has no field-of-view
// beyond the native captured frame, and this viewer's zoom-pan-layer uses
// transform:scale() inside a fixed, overflow:hidden viewport — going below
// 1x would shrink the element's own painted footprint, leaving empty gaps
// at the edges that nothing drawn inside it could compensate for. That's
// not a per-source framing choice to make with CSS; it would need either
// real extra footage or a deliberate letterbox/blur-fill treatment.
const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const PX_PER_FRAME = 6; // drag px per sprite frame step — tune by feel
const OVERSHOOT_MAX_FRAMES = 6; // how far the rubber-band can stretch past an edge
const BOUNCE_EASE = 0.22; // per-frame convergence rate of the release spring

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  startFrameFloat: number;
  startPan: { x: number; y: number };
  mode: "rotate" | "pan";
};

type Fit = { containerW: number; containerH: number; cellW: number; cellH: number };

type VillaOrbitViewerProps = {
  /** Full-bleed background mode: fills its positioned parent edge-to-edge
   * instead of rendering as a bounded, rounded panel. Wheel-zoom then
   * requires Ctrl/Cmd so an ordinary scroll over the hero isn't trapped. */
  fill?: boolean;
  /** Dev comparison tool: shows a small 1/2 switch to live-swap between
   * heroAtlasManifest(.json) and heroAtlasManifest2.json. Remove the prop
   * (and manifest 2 / its assets) once a source is chosen for real. */
  compareSources?: boolean;
  /** Notified on mount and whenever the compared source changes — lets a
   * parent (HeroCinematic) condition source-specific behavior, like the
   * balcony scroll push-in only being a valid continuation of source "1". */
  onSourceChange?: (source: SourceKey) => void;
};

export const VillaOrbitViewer: React.FC<VillaOrbitViewerProps> = ({ fill = false, compareSources = false, onSourceChange }) => {
  const [source, setSource] = useState<SourceKey>("1");
  const { frameCount, cols, rows, tiers } = SOURCES[source];
  const tierData = tiers as Record<TierKey, { cellW: number; cellH: number; sheetW: number; sheetH: number; src: string }>;

  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStartDistRef = useRef<number | null>(null);
  const pinchStartScaleRef = useRef(1);
  const bounceRAF = useRef<number | null>(null);

  const [tier, setTier] = useState<TierKey>("lg");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [frameFloat, setFrameFloat] = useState(0);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const src = tierData[tier].src;

  // Report the source on mount and on every change — onSourceChange is a
  // stable-enough callback (an inline setState setter from the parent) that
  // this is safe to run every render without a ref-guard; if that stops
  // being true, guard it.
  useEffect(() => {
    onSourceChange?.(source);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  // Switching the compared source resets frame/zoom/pan so it doesn't carry
  // state from the other clip over — done at the point of the actual user
  // action (the button click below) rather than as an effect.
  const selectSource = (key: SourceKey) => {
    setSource(key);
    setFrameFloat(0);
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  useLayoutEffect(() => {
    const sizeMq = window.matchMedia("(min-width: 768px)");
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const applySize = () => setTier(sizeMq.matches ? "lg" : "sm");
    const applyMotion = () => setReducedMotion(motionMq.matches);
    applySize();
    applyMotion();

    sizeMq.addEventListener("change", applySize);
    motionMq.addEventListener("change", applyMotion);
    return () => {
      sizeMq.removeEventListener("change", applySize);
      motionMq.removeEventListener("change", applyMotion);
    };
  }, []);

  // Warm the cache for the active tier as early as possible.
  useEffect(() => {
    const img = new window.Image();
    img.src = src;
  }, [src]);

  const displayFrame = useMemo(
    () => Math.min(Math.max(Math.round(frameFloat), 0), frameCount - 1),
    [frameFloat, frameCount],
  );
  const col = displayFrame % cols;
  const row = Math.floor(displayFrame / cols);

  // Cover-fit sizing, measured against the viewport's actual rendered box.
  // In panel mode the box's own aspect is locked to the cell aspect (see
  // className below), so this degenerates to an exact 1:1, zero-offset
  // mapping — the same math now also handles the full-bleed case, where the
  // hero's aspect ratio varies per viewport and the sheet must be
  // center-cropped like a normal `object-cover` background.
  const [fit, setFit] = useState<Fit | null>(null);
  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const cellAspect = tierData[tier].cellW / tierData[tier].cellH;
    const compute = () => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const containerAspect = rect.width / rect.height;
      const cellW = containerAspect > cellAspect ? rect.width : rect.height * cellAspect;
      const cellH = containerAspect > cellAspect ? rect.width / cellAspect : rect.height;
      setFit({ containerW: rect.width, containerH: rect.height, cellW, cellH });
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [tier, tierData]);

  const bgStyle = useMemo<React.CSSProperties | undefined>(() => {
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

  const cancelBounce = () => {
    if (bounceRAF.current !== null) {
      cancelAnimationFrame(bounceRAF.current);
      bounceRAF.current = null;
    }
  };

  const settleFrame = useCallback(() => {
    cancelBounce();
    if (reducedMotion) {
      setFrameFloat((prev) => Math.min(Math.max(Math.round(prev), 0), frameCount - 1));
      return;
    }
    const step = () => {
      setFrameFloat((prev) => {
        const target = Math.min(Math.max(Math.round(prev), 0), frameCount - 1);
        const diff = target - prev;
        if (Math.abs(diff) < 0.02) {
          bounceRAF.current = null;
          return target;
        }
        bounceRAF.current = requestAnimationFrame(step);
        return prev + diff * BOUNCE_EASE;
      });
    };
    bounceRAF.current = requestAnimationFrame(step);
  }, [frameCount, reducedMotion]);

  const clampPan = useCallback((next: { x: number; y: number }, nextScale: number) => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return next;
    // Below 1x the content is smaller than the viewport, so there's nothing
    // to pan — clamp to 0 rather than letting a negative bound lock pan at
    // a fixed nonzero offset (Math.min/max below would otherwise force it).
    const maxX = Math.max(0, ((nextScale - 1) * rect.width) / 2);
    const maxY = Math.max(0, ((nextScale - 1) * rect.height) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, next.x)),
      y: Math.min(maxY, Math.max(-maxY, next.y)),
    };
  }, []);

  const applyScale = useCallback(
    (nextScale: number) => {
      const clamped = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, nextScale));
      setScale(clamped);
      setPan((p) => clampPan(p, clamped));
    },
    [clampPan],
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Don't hijack clicks on the overlay controls (zoom/reset/source toggle):
    // capturing the pointer here would redirect their pointerup away from
    // the button before its click can fire.
    if ((e.target as HTMLElement).closest("button")) return;

    // Desktop mouse at 1x: rotation is hover-driven (see handlePointerMove's
    // absolute cursor-X mapping), so a click-drag here would fight that —
    // ending a drag would instantly snap the frame to wherever the cursor
    // is once hover resumes. No-op instead; mouse-drag still works normally
    // once zoomed in, where it's panning, not rotation.
    if (e.pointerType === "mouse" && scale <= 1.01) return;

    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size === 2) {
      dragRef.current = null;
      const pts = Array.from(pointersRef.current.values());
      pinchStartDistRef.current = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      pinchStartScaleRef.current = scale;
      return;
    }

    cancelBounce();
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startFrameFloat: frameFloat,
      startPan: pan,
      mode: scale > 1.01 ? "pan" : "rotate",
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    // Desktop hover-rotate: an unpressed mouse tracks cursor X directly and
    // continuously — no click needed. Scoped to pointerType "mouse" only, so
    // touch/pen keep plain drag-to-rotate untouched (hover has no meaning on
    // touch). Only applies at 1x — zoomed in, drag is for panning instead,
    // and hover driving rotation underneath a pan wouldn't make sense.
    if (e.pointerType === "mouse" && e.buttons === 0 && scale <= 1.01 && !dragRef.current) {
      const rect = viewportRef.current?.getBoundingClientRect();
      if (rect && rect.width > 0) {
        const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
        cancelBounce();
        setFrameFloat(ratio * (frameCount - 1));
      }
      return;
    }

    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size === 2 && pinchStartDistRef.current) {
      const pts = Array.from(pointersRef.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      applyScale(pinchStartScaleRef.current * (dist / pinchStartDistRef.current));
      return;
    }

    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;

    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    if (drag.mode === "rotate") {
      const raw = drag.startFrameFloat - dx / PX_PER_FRAME;
      const overshootCap = frameCount - 1 + OVERSHOOT_MAX_FRAMES;
      setFrameFloat(Math.min(overshootCap, Math.max(-OVERSHOOT_MAX_FRAMES, raw)));
    } else {
      setPan(clampPan({ x: drag.startPan.x + dx, y: drag.startPan.y + dy }, scale));
    }
  };

  const endPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) {
      pinchStartDistRef.current = null;
    }
    if (dragRef.current?.pointerId === e.pointerId) {
      const wasRotating = dragRef.current.mode === "rotate";
      dragRef.current = null;
      setIsDragging(false);
      if (wasRotating) settleFrame();
    }
  };

  // Native (non-passive) wheel listener: React's synthetic onWheel is
  // attached passively, so preventDefault() there is silently ignored.
  const scaleRef = useRef(scale);
  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheelNative = (e: WheelEvent) => {
      // Full-bleed background: an untouched scroll must keep scrolling the
      // page, not get trapped as zoom. Require Ctrl/Cmd, like Google Maps
      // embeds do. The contained panel has no such conflict, so plain wheel
      // zooms there.
      if (fill && !(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      applyScale(scaleRef.current - e.deltaY * 0.0015);
    };
    el.addEventListener("wheel", onWheelNative, { passive: false });
    return () => el.removeEventListener("wheel", onWheelNative);
  }, [applyScale, fill]);

  const resetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      cancelBounce();
      setFrameFloat((f) => Math.min(Math.max(Math.round(f) - 1, 0), frameCount - 1));
    } else if (e.key === "ArrowRight") {
      cancelBounce();
      setFrameFloat((f) => Math.min(Math.max(Math.round(f) + 1, 0), frameCount - 1));
    } else if (e.key === "+" || e.key === "=") {
      applyScale(scale * 1.15);
    } else if (e.key === "-" || e.key === "_") {
      applyScale(scale * 0.87);
    } else {
      return;
    }
    e.preventDefault();
  };

  return (
    <div
      ref={viewportRef}
      role="img"
      aria-label="Interactive 360-degree exterior view of the villa. Drag to rotate, scroll or pinch to zoom."
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative overflow-hidden select-none touch-none cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-tertiary",
        fill
          ? "absolute inset-0 w-full h-full"
          : "w-full max-w-[800px] aspect-[16/9] rounded-3xl border border-white/15 bg-zinc-900 shadow-2xl",
      )}
    >
      {/* Dev-only comparison switch — remove along with `compareSources`,
          manifest 2, and its assets once a source is picked for real. */}
      {compareSources && (
        <div
          className={cn(
            "absolute z-30 flex items-center gap-1 bg-black/70 backdrop-blur-md rounded-full p-1 shadow-lg border border-white/10",
            fill ? "top-20 right-4 md:right-6" : "top-4 right-4",
          )}
        >
          {(["1", "2"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => selectSource(key)}
              className={cn(
                "pointer-events-auto w-7 h-7 rounded-full text-[11px] font-inter font-bold transition-colors cursor-pointer",
                source === key ? "bg-tertiary text-on-tertiary" : "text-white/70 hover:text-white",
              )}
            >
              {key}
            </button>
          ))}
        </div>
      )}

      {/* Instructions overlay — panel mode only; fill mode folds this into
          the persistent control bar below instead (see the bar's own note). */}
      {!fill && (
        <div className="absolute z-20 pointer-events-none flex items-center gap-2 bg-black/60 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-[10px] font-inter font-bold uppercase tracking-wider top-4 left-4">
          <Move className="w-3.5 h-3.5 animate-pulse" />
          {/* Rotation is hover-driven on mouse/trackpad, drag-driven on
              touch — (hover: hover) picks the copy that matches, no JS. */}
          <span className="hidden [@media(hover:hover)]:inline">Move to Rotate</span>
          <span className="[@media(hover:hover)]:hidden">Drag to Rotate</span>
        </div>
      )}

      {/* Zoom/pan layer — independent of rotation, per the atlas architecture */}
      <div
        className="w-full h-full will-change-transform"
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})`,
          transition: isDragging ? "none" : "transform 0.15s ease-out",
        }}
      >
        {/* Rotation window — background-position selects the current frame */}
        <div
          className={cn("w-full h-full", fill && "brightness-[0.6] contrast-[1.05]")}
          style={bgStyle}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

      {/* Control bar: zoom controls, plus (fill mode only) a persistent
          drag-to-rotate cue folded in here rather than a separate badge —
          one floating bar has nowhere left to collide with on small screens,
          and it never fades, so the interactivity stays visible at rest. */}
      <div
        className={cn(
          "absolute flex items-center gap-4 bg-black/60 backdrop-blur-md px-5 py-2 rounded-full z-20 shadow-lg border border-white/10",
          fill ? "bottom-6 right-6" : "bottom-4 left-1/2 -translate-x-1/2",
        )}
      >
        {fill && (
          <>
            <span className="flex items-center gap-1.5 text-white/90 text-[10px] font-inter font-bold uppercase tracking-wider">
              <Move className="w-3.5 h-3.5 animate-pulse" />
              {/* Rotation is hover-driven on mouse/trackpad, drag-driven on
                  touch — each span's own media query picks the matching
                  copy; both stay hidden below sm where there's no room. */}
              <span className="hidden [@media(hover:hover)_and_(min-width:640px)]:inline">
                Move to Rotate
              </span>
              <span className="hidden [@media(hover:none)_and_(min-width:640px)]:inline">
                Drag to Rotate
              </span>
            </span>
            <div className="w-[1.5px] h-5 bg-white/20 self-center" />
          </>
        )}
        <button
          type="button"
          onClick={() => applyScale(scale * 1.2)}
          className="p-1 text-white/80 hover:text-tertiary transition-colors cursor-pointer"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => applyScale(scale * 0.8)}
          className="p-1 text-white/80 hover:text-tertiary transition-colors cursor-pointer"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-[1.5px] h-5 bg-white/20 self-center" />
        <button
          type="button"
          onClick={resetView}
          className="p-1 text-white/80 hover:text-tertiary transition-colors cursor-pointer"
          aria-label="Reset view"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default VillaOrbitViewer;
