"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export const RouteProgressBar: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Complete progress bar whenever route successfully settles
  useEffect(() => {
    if (visible) {
      setProgress(100);
      const timer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept click on internal links to provide instant visual feedback (< 16ms)
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;

      const target = anchor.getAttribute("target");
      if (target && target !== "_self") return;

      // Ignore modified clicks (ctrl, cmd, shift, alt) or download links
      if (
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.defaultPrevented
      )
        return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      )
        return;

      try {
        const url = new URL(href, window.location.href);
        // Same origin check
        if (url.origin !== window.location.origin) return;

        // If navigating to a different pathname/search, trigger immediate progress
        if (
          url.pathname !== window.location.pathname ||
          url.search !== window.location.search
        ) {
          setVisible(true);
          setProgress(25);

          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = setInterval(() => {
            setProgress((prev) => {
              if (prev >= 85) {
                if (timerRef.current) clearInterval(timerRef.current);
                return prev;
              }
              return prev + Math.random() * 15;
            });
          }, 120);
        }
      } catch {
        // Ignore invalid URLs
      }
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleDocumentClick, {
        capture: true,
      });
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2.5px] z-[9999] pointer-events-none transition-all duration-300 ease-out"
      style={{
        width: `${progress}%`,
        background:
          "linear-gradient(90deg, #7E5714 0%, #D4AF37 50%, #7E5714 100%)",
        boxShadow: "0 0 10px rgba(212, 175, 55, 0.6)",
        opacity: visible ? 1 : 0,
      }}
    />
  );
};
