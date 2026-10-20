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

import {
  getPublicProjects,
  getPublicServices,
  getPublicTestimonials,
} from "@/lib/server/content";

export const revalidate = 60;

export default async function HomePage() {
  const orgSchema = generateOrganizationSchema();
  const [projectsData, servicesData, testimonialsData] = await Promise.all([
    getPublicProjects(),
    getPublicServices(),
    getPublicTestimonials(),
  ]);

  const curatedProjects = projectsData.slice(0, 6).map((p) => ({
    title: p.title,
    category: (p.category || "RESIDENTIAL").toUpperCase(),
    location: p.location || "Pakistan",
    image: p.cover_image || "/images/dha_lahore_villa.png",
    scale: p.price || (p.year ? `Completed • ${p.year}` : "Luxury Residence"),
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
      href: "/pricing",
    };
  });

  return (
    <>
      <JsonLd data={orgSchema} />
      {/* No <link rel="preload"> for the hero-atlas sprite sheets (2-9MB
          each): forcing those to the front of the queue at browser-highest
          priority meant they competed directly with the page's own JS/font
          requests for bandwidth, which is what made the whole page feel
          stuck loading. HeroCinematic already paints a fast, lightweight
          poster image immediately; VillaOrbitViewer/HeroCinematic's own
          background `new Image()` prefetch still fetches the real atlas
          right after mount, just at normal priority instead of jumping the
          queue in front of everything else. */}
      <HomeView
        initialFeaturedServices={featuredServices}
        initialCuratedProjects={curatedProjects}
        initialTestimonials={testimonialsData}
      />
    </>
  );
}
