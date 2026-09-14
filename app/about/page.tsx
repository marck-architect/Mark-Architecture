import React from "react";
import type { Metadata } from "next";
import { AboutView } from "@/components/about/AboutView";

export const metadata: Metadata = {
  title: "About Our Practice | MARK Architects Atelier",
  description:
    "Learn about MARK Architects, spearheaded by licensed architect Muhammad Rafiq. Discover our 15+ years of experience in luxury estates, structural engineering, and PCATP/PDA/CDA compliance.",
  keywords: [
    "about mark architects",
    "muhammad rafiq architect",
    "pcatp architect pakistan",
    "architectural firm peshawar",
    "islamabad luxury architects",
    "architect credentials pakistan",
  ],
  openGraph: {
    title: "About Our Practice | MARK Architects Atelier",
    description:
      "Spearheaded by Muhammad Rafiq. 15+ years of practice delivering mathematical precision, passive solar design, and turnkey residential masterplanning.",
    url: "https://markarchitects.com/about",
    images: [
      {
        url: "/images/muhammad-rafiq.jpg",
        width: 800,
        height: 1000,
        alt: "Muhammad Rafiq - Principal Architect at MARK Architects",
      },
    ],
  },
};

export default function AboutPage() {
  return <AboutView />;
}
