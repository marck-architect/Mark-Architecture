import React from "react";
import type { Metadata } from "next";
import { ServicesView } from "@/components/services/ServicesView";

export const metadata: Metadata = {
  title: "Architectural Services & Design Packages | MARK Architects",
  description:
    "Comprehensive architectural design services: House Plan Reviews, 3D Front Elevations, Interior Makeovers, Full House Design Packages, and Construction Cost Estimation with transparent pricing in PKR.",
  keywords: [
    "architectural services pakistan",
    "house plan review architect",
    "3d front elevation design",
    "interior design packages",
    "construction cost estimate pakistan",
    "full house design package",
  ],
  openGraph: {
    title: "Architectural Services & Design Packages | MARK Architects",
    description:
      "Explore 7 approved architectural services with transparent fixed & formula-based PKR pricing and secure Safepay checkout.",
    url: "https://markarchitects.com/services",
    images: [
      {
        url: "/images/Full House Design Package.png",
        width: 1200,
        height: 630,
        alt: "MARK Architects - Architectural Services",
      },
    ],
  },
};

import { getPublicServices } from "@/lib/server/content";

export const revalidate = 60;

export default async function ServicesPage() {
  const services = await getPublicServices();
  return <ServicesView initialServices={services} />;
}
