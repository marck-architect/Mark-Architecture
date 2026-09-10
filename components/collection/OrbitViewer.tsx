"use client";

import React, { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Rotate3d, Move } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type ProductType = "lounger" | "vase";

const products3D = {
  lounger: {
    title: "Ethereal Lounger",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBdv45ZiAB-0kcsC7QWcWUYrvqGWOf63PZTgdMoX6CDz8RQuR3IP5kBOZFYn_fYfaZl59P8VTYlL5pXaiaapTdMb0oc8CGnpGAOR7rFgkKi-FAoCLawT7tFuMxDmhS4Ec3tn2of0SdhoNIkL9RAW2QKc9TShvEmO-ob1tGIUlCu1vGjQ6iw3X5INGkJN1NVdwYn8BRqre0VQCmMnCDk0t11Ta60nsbBekThEtDJcwrObL4IK4_z4nlX146QuGXDctGXG_2YzE9E-odI",
    widthClass: "w-[75%] md:w-[65%]",
    specs: [
      { name: "Finish", value: "Walnut / Ivory" },
      { name: "Frames", value: "Brushed Titanium" },
      { name: "Dimensions", value: "180x82x72 cm" },
    ],
  },
  vase: {
    title: "Obsidian Vase",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDsCdl0mgaz1yLFj4bsGPi5W8iU8WbI7R_gea2l7KxNuKx0wtEfTJ2EwCEBjYQ_DVbPFh_jS7sbaWv3zWwZvAb6PyQwPCC7DM1w6jn1hYefm9q8VA9zZU2Ih4v9dCjyk8Zfs4VjOdUvRPGTRi1A6fdH6k1jd7bXVxNSAxtwBmPyJK7S1j6jMmkrVGsU-JnDCyM0sMDD6j_mvC3Ms9qbJ3STmeR5Wo2lzxVmB8SncnQcanqUqS1KEEW-DgwFzLNk1M8TTnKm7PwKkJGQ",
    widthClass: "w-[45%] md:w-[35%]",
    specs: [
      { name: "Material", value: "Obsidian Crystal" },
      { name: "Base", value: "Travertine Stone" },
      { name: "Weight", value: "14.2 kg" },
    ],
  },
};

export const OrbitViewer: React.FC = () => {
  const [selectedProduct, setSelectedProduct] =
    useState<ProductType>("lounger");
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });

  const activeProduct = products3D[selectedProduct];

  // Mouse move handler for hover parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Limited tilting
    const targetY = (x / (rect.width / 2)) * 30; // Max 30 deg Y-rotation
    const targetX = -(y / (rect.height / 2)) * 20; // Max 20 deg X-rotation

    setRotation({ x: targetX, y: targetY });
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStart.current.x;
      const deltaY = e.clientY - dragStart.current.y;

      setRotation((prev) => {
        let newX = prev.x - deltaY * 0.5;
        const newY = prev.y + deltaX * 0.5;

        // Clamp vertical axis
        newX = Math.max(-45, Math.min(45, newX));

        return { x: newX, y: newY };
      });

      dragStart.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleGlobalMouseMove);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [isDragging]);

  const handleMouseLeave = () => {
    if (isDragging) return;
    // Smooth reset
    setRotation({ x: 0, y: 0 });
  };

  const handleZoom = (factor: number) => {
    setScale((prev) => Math.max(0.6, Math.min(1.4, prev * factor)));
  };

  const handleReset = () => {
    setScale(1);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <section className="bg-surface-container-low dark:bg-zinc-900/40 py-20 border-y border-outline-variant/30">
      <div className="px-4 md:px-margin-desktop max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-12">
        {/* Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <span className="font-inter text-xs md:text-sm font-bold text-tertiary block uppercase tracking-widest">
            IMMERSIVE EXPLORATION
          </span>
          <h2 className="font-playfair text-3xl md:text-5xl text-on-surface dark:text-zinc-100 leading-tight font-normal">
            Interact with the blueprint.
          </h2>
          <p className="font-inter text-base text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
            Experience our signature product line in dynamic interactive 3D
            space. Drag, tilt, and explore the exquisite craftsmanship before it
            enters your home.
          </p>

          <div className="space-y-4">
            {/* Toggle Model Selection */}
            <div className="flex gap-2 p-1 bg-surface-container dark:bg-zinc-800 rounded-xl max-w-sm">
              <button
                onClick={() => {
                  setSelectedProduct("lounger");
                  handleReset();
                }}
                className={cn(
                  "flex-1 font-inter font-semibold py-2 px-3 text-xs rounded-lg transition-all focus:outline-none cursor-pointer",
                  selectedProduct === "lounger"
                    ? "bg-white dark:bg-zinc-700 text-secondary dark:text-white shadow-sm"
                    : "text-on-surface-variant hover:text-secondary",
                )}
              >
                Lounger
              </button>
              <button
                onClick={() => {
                  setSelectedProduct("vase");
                  handleReset();
                }}
                className={cn(
                  "flex-1 font-inter font-semibold py-2 px-3 text-xs rounded-lg transition-all focus:outline-none cursor-pointer",
                  selectedProduct === "vase"
                    ? "bg-white dark:bg-zinc-700 text-secondary dark:text-white shadow-sm"
                    : "text-on-surface-variant hover:text-secondary",
                )}
              >
                Obsidian Vase
              </button>
            </div>

            <div className="glass-panel p-5 rounded-2xl border-l-4 border-tertiary flex gap-4 items-center bg-white/40 dark:bg-zinc-900/40">
              <Rotate3d className="text-tertiary text-2xl w-6 h-6 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm dark:text-zinc-200">
                  3D Motion Capture
                </h4>
                <p className="text-xs text-on-surface-variant dark:text-zinc-400 font-light mt-0.5">
                  Move your cursor over the panel or drag to orbit the object.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orbit Canvas Panel */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          className="lg:col-span-7 h-[500px] md:h-[550px] relative rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-outline-variant/40 shadow-inner flex flex-col justify-center items-center group cursor-grab active:cursor-grabbing select-none"
        >
          {/* Instructions Overlay */}
          <div className="absolute top-6 left-6 z-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-0 flex items-center gap-2 bg-secondary/80 text-white px-4 py-2 rounded-full text-xs font-bold shadow-md">
            <Move className="w-3.5 h-3.5 animate-pulse" />
            <span>HOVER OR DRAG TO ROTATE</span>
          </div>

          {/* 3D Shadow Backdrop */}
          <div
            className="absolute bottom-16 w-3/5 h-8 bg-black/10 dark:bg-black/40 rounded-full blur-xl z-0 transition-transform duration-300 group-hover:scale-95"
            style={{
              transform: `scale(${scale})`,
            }}
          />

          {/* The 3D-Effect Object Model Container */}
          <div className="product-3d-canvas w-full h-full flex items-center justify-center z-10 relative">
            <div
              className="product-3d-model transition-transform duration-100 ease-out relative"
              style={{
                transform: `perspective(1000px) rotateY(${rotation.y}deg) rotateX(${rotation.x}deg) scale(${scale})`,
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className={cn(
                  "relative aspect-square min-w-[280px] md:min-w-[380px]",
                )}
              >
                <Image
                  fill
                  src={activeProduct.image}
                  alt={activeProduct.title}
                  sizes="(max-width: 1024px) 100vw, 450px"
                  draggable={false}
                  className="object-contain drop-shadow-[0px_35px_30px_rgba(0,0,0,0.18)]"
                />
              </div>
            </div>
          </div>

          {/* Active Product Info Plates */}
          <div className="absolute top-6 right-6 glass-panel p-4 rounded-xl text-[10px] space-y-1.5 max-w-[180px] z-20 bg-white/70 dark:bg-zinc-900/70 border border-white/20">
            <p className="font-bold border-b border-outline/25 pb-1 font-montserrat uppercase tracking-wider dark:text-zinc-200">
              Specifications
            </p>
            {activeProduct.specs.map((spec) => (
              <div
                key={spec.name}
                className="flex justify-between gap-4 dark:text-zinc-300"
              >
                <span>{spec.name}:</span>
                <span className="font-semibold text-right">{spec.value}</span>
              </div>
            ))}
          </div>

          {/* Interaction Utility Panel */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 glass-panel px-6 py-2.5 rounded-full z-20 shadow-lg bg-white/70 dark:bg-zinc-800/70 border border-white/20">
            <button
              onClick={() => handleZoom(1.1)}
              className="p-1 hover:text-tertiary transition-colors dark:text-zinc-300 dark:hover:text-tertiary cursor-pointer"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom(0.9)}
              className="p-1 hover:text-tertiary transition-colors dark:text-zinc-300 dark:hover:text-tertiary cursor-pointer"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="w-[1.5px] h-5 bg-outline/20 self-center" />
            <button
              onClick={handleReset}
              className="p-1 hover:text-tertiary transition-colors dark:text-zinc-300 dark:hover:text-tertiary cursor-pointer"
              aria-label="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default OrbitViewer;
