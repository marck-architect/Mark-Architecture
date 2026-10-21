"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface RollTextProps {
  text: string;
  topClassName?: string;
  bottomClassName?: string;
}

/**
 * Per-letter "roll up" hover reveal: each character sits in a clipped
 * 2-row column (the visible label on top, a colored duplicate directly
 * below). The parent Link's `group-hover` slides the column up by exactly
 * one row, so the original letter rolls out of view as its colored twin
 * rolls into place — staggered left to right via a per-letter transition
 * delay. Must be rendered inside an element with the `group` class.
 */
export const RollText: React.FC<RollTextProps> = ({ text, topClassName, bottomClassName }) => {
  return (
    <span className="inline-flex">
      {text.split("").map((ch, i) => {
        const glyph = ch === " " ? " " : ch;
        return (
          <span key={i} className="relative inline-block h-[1.2em] overflow-hidden align-bottom">
            <span
              className="flex -translate-y-0 flex-col transition-transform duration-300 ease-out will-change-transform group-hover:-translate-y-1/2"
              style={{ transitionDelay: `${i * 16}ms` }}
            >
              <span className={cn("block h-[1.2em] leading-[1.2em]", topClassName)}>{glyph}</span>
              <span className={cn("block h-[1.2em] leading-[1.2em]", bottomClassName)}>{glyph}</span>
            </span>
          </span>
        );
      })}
    </span>
  );
};

export default RollText;
