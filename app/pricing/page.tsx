import React from "react";
import type { Metadata } from "next";
import { PricingView } from "@/components/pricing/PricingView";

export const metadata: Metadata = {
  title: "Pricing & Architectural Packages Menu | MARK Architects",
  description:
    "Explore transparent pricing and standardized packages for House Plan Reviews (from PKR 2,000), 3D Front Elevations, Interior Makeovers, Online Consultation Calls, and Turnkey Blueprints in Pakistan with secure Safepay payment gateway checkout.",
  keywords: [
    "architectural design pricing pakistan",
    "house plan review cost lahore islamabad",
    "3d front elevation price pakistan",
    "architect consultation fee",
    "house plan correction packages",
    "grey structure cost estimate lahore",
    "full house design blueprint charges pakistan",
    "safepay architectural payments",
  ],
  openGraph: {
    title: "Pricing & Architectural Packages Menu | MARK Architects",
    description:
      "Complete package menu, fixed deliverables, upfront milestone pricing, 50% advance policy, and instant online booking via Safepay payment gateway.",
    url: "https://markarchitects.com/pricing",
    images: [
      {
        url: "/images/Full House Design Package.png",
        width: 1200,
        height: 630,
        alt: "MARK Architects Complete Package Pricing Menu",
      },
    ],
  },
};

export default function PricingPage() {
  return <PricingView />;
}
