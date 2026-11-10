"use client";

import { useState, type MouseEvent } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import type { Platform } from "./profile.config";
import { BRAND_EFFECTS } from "./brand-effects";
import { AnimatedIcon } from "./AnimatedIcon";

interface Burst {
  id: number;
  x: number;
  y: number;
}

const ANGLES = [0, 60, 120, 180, 240, 300] as const;
const PRESS_HOLD_MS = 700;

interface PlatformTileProps {
  platform: Platform;
  iconSvg: string;
}

export function PlatformTile({ platform, iconSvg }: PlatformTileProps) {
  const reduce = useReducedMotion() ?? false;
  const effect = BRAND_EFFECTS[platform.id];
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);
  const engaged = hovered || focused || pressed;

  const releasePress = () => {
    window.setTimeout(() => setPressed(false), PRESS_HOLD_MS);
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX ? e.clientX - rect.left : 28;
    const y = e.clientY ? e.clientY - rect.top : rect.height / 2;
    const id = performance.now();
    setBursts((prev) => [...prev, { id, x, y }]);
    window.setTimeout(
      () => setBursts((prev) => prev.filter((b) => b.id !== id)),
      700,
    );
  };

  const tile: Variants = {
    rest: {
      borderColor: "rgb(21 25 30 / 0.15)",
      backgroundColor: "#ffffff",
    },
    hover: { borderColor: effect.color, backgroundColor: "#ffffff" },
    tap: { borderColor: effect.color, backgroundColor: "#ffffff" },
  };

  const jump: Variants = reduce
    ? { rest: {}, hover: {}, tap: {} }
    : {
        rest: { y: 0, rotate: 0, scale: 1 },
        hover: {
          y: [0, -7, 0, -2, 0],
          rotate: [...effect.tilt],
          scale: [...effect.pop],
          transition: { duration: 0.65, ease: "easeOut" },
        },
        tap: {
          scale: [1, 0.86, 1.18, 1],
          transition: { duration: 0.4, ease: "easeOut" },
        },
      };

  return (
    <motion.a
      href={platform.href}
      {...(platform.external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      initial="rest"
      animate={engaged ? "hover" : "rest"}
      whileTap="tap"
      variants={tile}
      transition={{ duration: 0.25 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onFocus={(e) => setFocused(e.currentTarget.matches(":focus-visible"))}
      onBlur={() => setFocused(false)}
      onTapStart={() => setPressed(true)}
      onTap={releasePress}
      onTapCancel={releasePress}
      onClick={handleClick}
      className="relative flex items-center gap-3 overflow-hidden lg:gap-2 rounded-lg border p-2 shadow-card"
    >
      <motion.span
        variants={jump}
        className="block shrink-0"
        style={{ transformOrigin: "50% 100%" }}
      >
        <AnimatedIcon svg={iconSvg} className="size-[38px] lg:size-8" />
      </motion.span>
      <span className="truncate text-xs">{platform.label}</span>

      <AnimatePresence>
        {bursts.map((b) => (
          <span
            key={b.id}
            aria-hidden="true"
            className="pointer-events-none absolute"
            style={{ left: b.x, top: b.y }}
          >
            <motion.span
              className="absolute -left-4 -top-4 block size-8 rounded-full"
              style={{ backgroundColor: effect.color }}
              initial={{ scale: 0, opacity: 0.35 }}
              animate={{ scale: 3.5, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            {ANGLES.map((deg, i) => (
              <motion.span
                key={deg}
                className="absolute -left-1 -top-1 block size-2 rounded-full"
                style={{ backgroundColor: effect.particles[i] }}
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{
                  x: Math.cos((deg * Math.PI) / 180) * 26,
                  y: Math.sin((deg * Math.PI) / 180) * 26,
                  scale: 0,
                  opacity: 0,
                }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              />
            ))}
          </span>
        ))}
      </AnimatePresence>
    </motion.a>
  );
}
