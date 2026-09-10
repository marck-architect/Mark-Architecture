"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useStore } from "@/hooks/useStore";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import {
  Eye,
  ShoppingBag,
  Zap,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { OrbitViewer } from "@/components/collection/OrbitViewer";
import { SafepayService } from "@/lib/safepay";

interface ArchitecturalPackage {
  id: string;
  title: string;
  tier: string;
  pricePKR: number;
  deliveryTime: string;
  image: string;
  plotSize?: string;
  inclusions: string[];
  description: string;
}

const architecturalPackages: ArchitecturalPackage[] = [
  {
    id: "hpr-standard",
    title: "House Plan Review (Standard)",
    tier: "Standard Package",
    pricePKR: 9000,
    deliveryTime: "24–48 Hours",
    image: "/images/House Plan review.png",
    inclusions: [
      "Comprehensive Diagnostic Report",
      "Circulation & Ventilation Optimization",
      "Room Sizing & Furniture Feasibility",
      "Annotated Architectural PDF Plan",
    ],
    description:
      "Detailed audit of your architectural blueprints by a licensed architect to eliminate structural flaws before construction.",
  },
  {
    id: "hpc-standard",
    title: "House Plan Correction (10 Marla)",
    tier: "Standard Package",
    pricePKR: 22000,
    deliveryTime: "3–5 Days",
    image: "/images/House Plan Correction.png",
    plotSize: "10 Marla",
    inclusions: [
      "2 Corrected Layout Alternatives",
      "Scaled Furniture Arrangement Plan",
      "Natural Ventilation & Sunlight Routing",
      "2 Design Revision Rounds",
    ],
    description:
      "Turn flawed drawings into an optimized, harmonious 10 Marla home layout with complete furniture and flow planning.",
  },
  {
    id: "fe-standard",
    title: "Front Elevation 3D Render (10 Marla)",
    tier: "Standard Package",
    pricePKR: 25000,
    deliveryTime: "3–5 Days",
    image: "/images/Front Elevation 3D (Exterior Render).png",
    plotSize: "10 Marla",
    inclusions: [
      "2 High-Res 3D Views (Front & Angle)",
      "Exterior Material & Paint Color Specs",
      "Modern Facade Cladding Concepts",
      "2 Revision Rounds Included",
    ],
    description:
      "Ultra-realistic 3D exterior visualization showcasing daytime lighting, premium materials, and exterior finishes.",
  },
  {
    id: "irm-premium",
    title: "Interior Room Makeover (Premium)",
    tier: "Premium Package",
    pricePKR: 30000,
    deliveryTime: "5–7 Days",
    image: "/images/Interior Room Makeover.png",
    inclusions: [
      "Photorealistic 3D Interior Render",
      "Complete Aesthetic Moodboard",
      "Scaled 2D Furniture & Ceiling Plan",
      "Custom Ambient Lighting Scheme",
    ],
    description:
      "Complete luxury transformation for master bedroom suites, formal drawing rooms, or designer open-plan kitchens.",
  },
  {
    id: "cce-detailed",
    title: "Grey Structure Cost Estimate (10 Marla)",
    tier: "Detailed Package",
    pricePKR: 19000,
    deliveryTime: "4–6 Days",
    image: "/images/Construction Cost Estimate.png",
    plotSize: "10 Marla",
    inclusions: [
      "Complete Grey Structure Bill of Quantities",
      "Finishing Material Budget Projections",
      "Steel, Cement & Brick Quantity Schedules",
      "Contractor Cost Benchmark Sheet",
    ],
    description:
      "Protect your investment with exact material calculations and construction rate verification based on market data.",
  },
];

interface Product {
  title: string;
  price: number;
  currency: "PKR";
  category: string;
  image: string;
  description: string;
  isFeatured?: boolean;
}

const physicalProducts: Product[] = [
  {
    title: "Swat Valley Walnut Lounger",
    price: 380000,
    currency: "PKR",
    category: "FURNITURE",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBdv45ZiAB-0kcsC7QWcWUYrvqGWOf63PZTgdMoX6CDz8RQuR3IP5kBOZFYn_fYfaZl59P8VTYlL5pXaiaapTdMb0oc8CGnpGAOR7rFgkKi-FAoCLawT7tFuMxDmhS4Ec3tn2of0SdhoNIkL9RAW2QKc9TShvEmO-ob1tGIUlCu1vGjQ6iw3X5INGkJN1NVdwYn8BRqre0VQCmMnCDk0t11Ta60nsbBekThEtDJcwrObL4IK4_z4nlX146QuGXDctGXG_2YzE9E-odI",
    description:
      "Hand-finished lounge chair carved from local premium Swat walnut wood, showcasing subtle organic curves and traditional architectural joint work.",
    isFeatured: true,
  },
  {
    title: "Balochistan Travertine Plinth",
    price: 185000,
    currency: "PKR",
    category: "DECOR",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDsCdl0mgaz1yLFj4bsGPi5W8iU8WbI7R_gea2l7KxNuKx0wtEfTJ2EwCEBjYQ_DVbPFh_jS7sbaWv3zWwZvAb6PyQwPCC7DM1w6jn1hYefm9q8VA9zZU2Ih4v9dCjyk8Zfs4VjOdUvRPGTRi1A6fdH6k1jd7bXVxNSAxtwBmPyJK7S1j6jMmkrVGsU-JnDCyM0sMDD6j_mvC3Ms9qbJ3STmeR5Wo2lzxVmB8SncnQcanqUqS1KEEW-DgwFzLNk1M8TTnKm7PwKkJGQ",
    description:
      "Sculptural display plinth columns crafted from rich multi-hued travertine onyx sourced from Balochistan quarries.",
  },
  {
    title: "Khewra Monolith Salt Lamp",
    price: 45000,
    currency: "PKR",
    category: "ACCESSORIES",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDzw15IVOU0vCHXegPxlsynbwYb-FdILW0NQM8FCesfing6wS-h2MVd4tA0iDcrrZF1078h6-7UrY-qmjIrHWvcMArHRx6wbJjfNQ7U1c6Zpk2jvhJ5bYh0BjErwyCaHiKQhkgQSQ1WPBMEhoeoXa9AKW2Wr3VNzijXaKcGupPMRq1QwB0cVN2UnqJTKDDDCf5LtGMSTNLH6TycDasA9qNEQIwMyICnm9ol9IWRQumhrHhPsqJjt06xlSiNMGZe4vxyJG_DHsfzWR1E",
    description:
      "A single, raw salt crystal block from the historic Khewra mines, fitted with precision internal low-emission illumination.",
  },
];

export default function CollectionPage() {
  const { addToCart, openQuickView, openSuccessModal } = useStore();
  const [activeTab, setActiveTab] = useState<"packages" | "artifacts">(
    "packages",
  );

  const handleDirectCheckout = (pkg: ArchitecturalPackage) => {
    openSuccessModal(
      "Direct Safepay Checkout",
      `You are checking out "${pkg.title}" for ${SafepayService.formatPKR(
        pkg.pricePKR,
      )}. Secured via Safepay Pakistan. An intake form and secure upload link have been sent to your email.`,
    );
  };

  return (
    <div className="relative overflow-x-hidden min-h-screen pt-20 bg-surface dark:bg-zinc-950">
      {/* Header */}
      <header className="px-4 md:px-margin-desktop max-w-container-max mx-auto py-16 md:py-24 border-b border-outline-variant/30">
        <ScrollReveal>
          <div className="max-w-4xl space-y-4">
            <span className="font-inter text-xs md:text-sm font-bold text-tertiary uppercase tracking-widest block">
              Curated Architectural Atelier
            </span>
            <h1 className="font-playfair text-4xl md:text-6xl text-on-surface dark:text-zinc-100 font-normal leading-tight">
              Design Packages &amp; <br />
              <span className="italic font-light">Atelier Artifacts.</span>
            </h1>
            <p className="font-inter text-base md:text-lg text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed max-w-3xl">
              Explore standardized fixed-price architectural design packages
              with direct one-click checkout, alongside handcrafted bespoke
              furniture and stone artifacts.
            </p>

            {/* Switch Tabs */}
            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={() => setActiveTab("packages")}
                className={`px-6 py-3 rounded-xl font-inter text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "packages"
                    ? "bg-primary text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-md"
                    : "bg-surface-container-low dark:bg-zinc-900 text-on-surface-variant border border-outline-variant/40"
                }`}
              >
                Standardized Packages (Direct Checkout)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("artifacts")}
                className={`px-6 py-3 rounded-xl font-inter text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "artifacts"
                    ? "bg-primary text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-md"
                    : "bg-surface-container-low dark:bg-zinc-900 text-on-surface-variant border border-outline-variant/40"
                }`}
              >
                Curated Physical Artifacts
              </button>
            </div>
          </div>
        </ScrollReveal>
      </header>

      {/* Content based on Tab */}
      {activeTab === "packages" ? (
        <section className="px-4 md:px-margin-desktop max-w-container-max mx-auto py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {architecturalPackages.map((pkg, idx) => (
              <ScrollReveal key={pkg.id} delay={0.06 * idx}>
                <div className="bg-surface-container-low dark:bg-zinc-900 border border-outline-variant/30 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full group">
                  <div>
                    {/* Image Header */}
                    <div className="relative aspect-[16/10] bg-zinc-950 overflow-hidden">
                      <Image
                        fill
                        src={pkg.image}
                        alt={pkg.title}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-black/60 backdrop-blur-md text-tertiary text-[10px] font-bold uppercase px-3 py-1 rounded-full border border-tertiary/30">
                          {pkg.tier}
                        </span>
                        {pkg.plotSize && (
                          <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-semibold uppercase px-3 py-1 rounded-full">
                            {pkg.plotSize}
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-3 right-4 flex items-center gap-1.5 text-white text-xs font-inter font-light">
                        <Clock className="w-3.5 h-3.5 text-tertiary" />
                        <span>{pkg.deliveryTime}</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-6 space-y-4">
                      <h3 className="font-playfair text-xl font-bold text-on-surface dark:text-zinc-100">
                        {pkg.title}
                      </h3>
                      <p className="font-inter text-xs text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                        {pkg.description}
                      </p>

                      {/* Inclusions List */}
                      <div className="space-y-2 pt-2 border-t border-outline-variant/20">
                        <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider block">
                          Included Deliverables
                        </span>
                        {pkg.inclusions.map((item, iIdx) => (
                          <div
                            key={iIdx}
                            className="flex items-center gap-2 text-xs text-on-surface dark:text-zinc-300"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="p-6 pt-0 space-y-4">
                    <div className="flex justify-between items-center border-t border-outline-variant/20 pt-4">
                      <span className="text-[11px] font-inter font-bold text-zinc-500 uppercase tracking-wider">
                        Package Total
                      </span>
                      <span className="font-montserrat text-xl font-extrabold text-secondary dark:text-zinc-100">
                        {SafepayService.formatPKR(pkg.pricePKR)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          addToCart({
                            title: pkg.title,
                            price: pkg.pricePKR,
                            image: pkg.image,
                            currency: "PKR",
                            tier: pkg.tier,
                            plotSize: pkg.plotSize,
                          })
                        }
                        className="border border-outline-variant hover:border-tertiary hover:text-tertiary py-3 rounded-xl font-inter font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDirectCheckout(pkg)}
                        className="bg-primary hover:bg-tertiary text-on-primary py-3 rounded-xl font-inter font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Buy Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>
      ) : (
        <section className="px-4 md:px-margin-desktop max-w-container-max mx-auto py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Featured Physical Product */}
            {physicalProducts
              .filter((p) => p.isFeatured)
              .map((p) => (
                <div
                  key={p.title}
                  className="md:col-span-8 group relative aspect-[16/10] overflow-hidden rounded-3xl shadow-lg border border-outline-variant/20"
                >
                  <div className="absolute inset-0 z-0">
                    <Image
                      fill
                      src={p.image}
                      alt={p.title}
                      sizes="(max-width: 1024px) 100vw, 896px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors z-1" />
                  <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex justify-between items-end glass-panel z-10">
                    <div>
                      <span className="font-inter text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">
                        {p.category}
                      </span>
                      <h3 className="font-playfair text-xl md:text-2xl font-bold mt-1 text-on-surface">
                        {p.title}
                      </h3>
                      <p className="text-tertiary font-montserrat font-bold mt-1.5">
                        {SafepayService.formatPKR(p.price)}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          openQuickView({
                            title: p.title,
                            price: SafepayService.formatPKR(p.price),
                            category: p.category,
                            image: p.image,
                            description: p.description,
                          })
                        }
                        className="w-12 h-12 rounded-full border border-outline/50 flex items-center justify-center hover:bg-tertiary hover:text-white hover:border-tertiary transition-all cursor-pointer bg-white/80"
                        aria-label="Quick View"
                      >
                        <Eye className="w-5 h-5 text-secondary hover:text-white" />
                      </button>
                      <button
                        onClick={() =>
                          addToCart({
                            title: p.title,
                            price: p.price,
                            image: p.image,
                            currency: "PKR",
                          })
                        }
                        className="bg-secondary hover:bg-tertiary text-on-primary px-6 py-3 rounded-xl flex items-center gap-2 transition-all font-inter font-bold text-xs tracking-wider uppercase active:scale-95 cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            {/* Small Physical Products */}
            {physicalProducts
              .filter((p) => !p.isFeatured)
              .map((p) => (
                <div
                  key={p.title}
                  className="md:col-span-4 group relative aspect-square overflow-hidden rounded-3xl shadow-lg border border-outline-variant/20"
                >
                  <div className="absolute inset-0 z-0">
                    <Image
                      fill
                      src={p.image}
                      alt={p.title}
                      sizes="(max-width: 768px) 100vw, 384px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors z-1" />
                  <div className="absolute bottom-0 left-0 w-full p-6 glass-panel translate-y-[70%] group-hover:translate-y-0 transition-transform duration-500 flex flex-col justify-between h-44 z-10">
                    <div>
                      <span className="font-inter text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">
                        {p.category}
                      </span>
                      <h3 className="font-playfair text-lg font-bold mt-1 text-on-surface">
                        {p.title}
                      </h3>
                      <p className="text-tertiary font-montserrat font-bold mt-1">
                        {SafepayService.formatPKR(p.price)}
                      </p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() =>
                          openQuickView({
                            title: p.title,
                            price: SafepayService.formatPKR(p.price),
                            category: p.category,
                            image: p.image,
                            description: p.description,
                          })
                        }
                        className="border border-outline/50 hover:bg-secondary hover:text-white px-4 py-2 text-xs font-bold font-inter tracking-wider transition-all flex-grow rounded-lg text-center cursor-pointer bg-white/80"
                      >
                        QUICK VIEW
                      </button>
                      <button
                        onClick={() =>
                          addToCart({
                            title: p.title,
                            price: p.price,
                            image: p.image,
                            currency: "PKR",
                          })
                        }
                        className="bg-primary text-white hover:bg-tertiary px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                        aria-label="Add to cart"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-16">
            <OrbitViewer />
          </div>
        </section>
      )}
    </div>
  );
}
