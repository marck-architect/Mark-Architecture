"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { ScrollRevealProps } from "@/types";

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  direction = "up",
  duration = 0.8,
}) => {
  const ref = useRef(null);
  // Trigger reveal when element is 10% inside the viewport
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const getVariants = () => {
    const hidden = {
      opacity: 0,
      y: direction === "up" ? 30 : direction === "down" ? -30 : 0,
      x: direction === "left" ? 30 : direction === "right" ? -30 : 0,
    };
    const visible = {
      opacity: 1,
      y: 0,
      x: 0,
    };
    return { hidden, visible };
  };

  return (
    <motion.div
      ref={ref}
      variants={getVariants()}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
};
export default ScrollReveal;
