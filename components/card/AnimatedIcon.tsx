"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface AnimatedIconProps {
  svg: string;
  className?: string;
}

const START_DELAY_MS = 1500;

let clockStart: number | null = null;
function sharedTimeSeconds(): number {
  const now = performance.now();
  if (clockStart === null) clockStart = now;
  return (now - clockStart) / 1000;
}

export function AnimatedIcon({ svg, className = "" }: AnimatedIconProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const host = ref.current;
    const root = host?.querySelector("svg");
    if (!host || !root) return;

    root.pauseAnimations();
    if (reduce) {
      root.setCurrentTime(0);
      return;
    }

    let visible = false;
    let ready = false;
    const sync = () => {
      if (visible && ready) {
        root.setCurrentTime(sharedTimeSeconds());
        root.unpauseAnimations();
      } else {
        root.pauseAnimations();
      }
    };

    const timer = window.setTimeout(() => {
      ready = true;
      sync();
    }, START_DELAY_MS);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(host);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [reduce, svg]);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`block shrink-0 [&>svg]:block [&>svg]:size-full ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
