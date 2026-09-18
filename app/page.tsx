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

import { getPublicProjects, getPublicServices } from "@/lib/server/content";

export const revalidate = 60;

export default async function HomePage() {
  const orgSchema = generateOrganizationSchema();
  const [projectsData, servicesData] = await Promise.all([
    getPublicProjects(),
    getPublicServices(),
  ]);

  const curatedProjects = projectsData.slice(0, 3).map((p) => ({
    title: p.title,
    category: (p.category || "RESIDENTIAL").toUpperCase(),
    location: p.location || "Pakistan",
    image: p.cover_image || "/images/dha_lahore_villa.png",
    scale: p.year ? `Completed • ${p.year}` : "Luxury Residence",
  }));

  const featuredServices = servicesData.slice(0, 4).map((s) => {
    const firstTier = s.tiers?.[0];
    const firstPrice = firstTier?.pricing_rules?.[0]?.price_pkr;
    const priceStr = firstPrice
      ? `From PKR ${Number(firstPrice).toLocaleString()}`
      : "Custom Quote";
    const durationStr = firstTier?.delivery_time || "Prompt Delivery";

    return {
      title: s.title,
      badge: s.category || "Studio Service",
      price: priceStr,
      duration: durationStr,
      desc: s.short_description || "",
      image: s.image_url || "/images/For Call.png",
      href: "/services",
    };
  });

  return (
    <>
      <JsonLd data={orgSchema} />
      <link
        rel="preload"
        as="image"
        href="/hero-atlas/villa-lg.webp"
        media="(min-width: 768px)"
      />
      <link
        rel="preload"
        as="image"
        href="/hero-atlas/villa-sm.webp"
        media="(max-width: 767px)"
      />
      <HomeView
        initialFeaturedServices={featuredServices}
        initialCuratedProjects={curatedProjects}
      />
    </>
  );
}
