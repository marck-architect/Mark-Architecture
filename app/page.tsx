import React from "react";
import type { Metadata } from "next";
import { HomeView } from "@/components/home/HomeView";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateOrganizationSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "MARK Architects | Modern Architecture & Luxury Living Design Atelier",
  description:
    "PCATP-licensed architectural design practice in Pakistan. Specializing in luxury residential estates, passive solar planning, PDA/CDA approvals, 3D elevations, and turnkey blueprints.",
  keywords: [
    "architect in pakistan",
    "lahore architecture firm",
    "peshawar architects",
    "islamabad luxury home design",
    "1 kanal house design pakistan",
    "contemporary house plans",
    "pcatp registered architects",
    "front elevation 3d",
    "house plan review",
  ],
  openGraph: {
    title: "MARK Architects | Modern Architecture & Luxury Living",
    description:
      "PCATP-licensed architectural design practice. Bespoke residential estates, passive solar design, and turnkey engineering blueprints.",
    url: "https://markarchitects.com",
    siteName: "MARK Architects",
    images: [
      {
        url: "/images/Front Elevation 3D (Exterior Render).png",
        width: 1200,
        height: 630,
        alt: "MARK Architects - Modern Luxury House Architecture",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MARK Architects | Modern Architecture & Luxury Living",
    description:
      "PCATP-licensed architectural design practice delivering passive solar efficiency and turnkey engineering drawings.",
    images: ["/images/Front Elevation 3D (Exterior Render).png"],
  },
};

export default function HomePage() {
  const orgSchema = generateOrganizationSchema();

  return (
    <>
      <JsonLd data={orgSchema} />
      <HomeView />
    </>
  );
}
