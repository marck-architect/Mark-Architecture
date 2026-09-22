"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3";
}

const EASE = [0.22, 1, 0.36, 1] as const; // matches ScrollReveal's curve site-wide
const WORD_STAGGER = 0.055; // seconds between each word starting

// Masked word-by-word reveal: each word slides up from behind a clipped
// (overflow-hidden) box rather than just fading in, which reads as a much
// more deliberate, "engineered" entrance than a plain opacity tween.
export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className,
  delay = 0,
  as: Tag = "h2",
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const words = text.split(" ");

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden pb-[0.1em] align-bottom"
        >
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={isInView ? { y: "0%" } : { y: "110%" }}
            transition={{
              duration: 0.7,
              delay: delay + i * WORD_STAGGER,
              ease: EASE,
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};

export default TextReveal;
