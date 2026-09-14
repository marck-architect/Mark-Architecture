import React from "react";
import type { Metadata } from "next";
import { PortfolioView } from "@/components/portfolio/PortfolioView";

export const metadata: Metadata = {
  title: "Selected Architectural Works & Realized Portfolio | MARK Architects",
  description:
    "Explore our archive of realized architectural works across Pakistan. Iconic luxury residences, 3D front elevations, commercial plazas, and custom floor plans.",
  keywords: [
    "architectural portfolio pakistan",
    "lahore villa architecture",
    "islamabad house designs",
    "peshawar luxury residences",
    "modern front elevations",
    "commercial plaza architect pakistan",
  ],
  openGraph: {
    title: "Selected Works & Realized Projects | MARK Architects",
    description:
      "Curating luxury estates and modern commercial projects where form meets structural precision.",
    url: "https://markarchitects.com/portfolio",
    images: [
      {
        url: "/images/Front Elevation 3D (Exterior Render).png",
        width: 1200,
        height: 630,
        alt: "MARK Architects Portfolio - Architectural Projects",
      },
    ],
  },
};

export default function PortfolioPage() {
  return <PortfolioView />;
}
