import React from "react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center py-24 px-4 bg-surface text-on-surface">
      {/* Architectural Geometric Blueprint Skeleton */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Pulsing Outer Wireframe Diamond */}
        <div className="w-16 h-16 border border-tertiary/30 rotate-45 animate-spin [animation-duration:6s] rounded-xs" />

        {/* Inner Solid Emblem */}
        <div className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-gradient-to-tr from-tertiary-fixed to-primary/20 animate-pulse flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-tertiary" />
        </div>
      </div>

      {/* Atelier Loading Copy */}
      <div className="mt-8 text-center space-y-2">
        <p className="font-montserrat text-[11px] tracking-[0.25em] uppercase text-tertiary font-bold animate-pulse">
          MARK ARCHITECTS
        </p>
        <p className="font-inter text-xs text-on-surface-variant/60 tracking-wider">
          Rendering spatial coordinates...
        </p>
      </div>
    </div>
  );
}
