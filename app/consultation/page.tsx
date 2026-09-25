import React from "react";
import type { Metadata } from "next";
import { ConsultationView } from "@/components/consultation/ConsultationView";

export const metadata: Metadata = {
  title: "Book Architectural Consultation & Strategy Call | MARK Architects",
  description:
    "Schedule a 1-on-1 strategy call with a licensed principal architect. Video consultation, live layout diagnosis, turnkey design calculators, and secure Safepay checkout.",
  keywords: [
    "book architect consultation",
    "architect video call pakistan",
    "house plan review consultation",
    "online architecture consultation",
    "lahore architect appointment",
    "islamabad architectural consultation",
  ],
  openGraph: {
    title: "Book Architectural Consultation & Strategy Call | MARK Architects",
    description:
      "Schedule a 1-on-1 strategy call with a licensed principal architect. Video consultation, live layout diagnosis, and turnkey design calculators.",
    url: "https://markarchitects.com/consultation",
    images: [
      {
        url: "/images/For Call.png",
        width: 1200,
        height: 630,
        alt: "MARK Architects - Consultation Call",
      },
    ],
  },
};

import { getSiteContent, getPublicServices } from "@/lib/server/content";
import { defaultPricingSettings } from "@/data/pricing";
import type { PricingSettingsContent } from "@/types";

export const revalidate = 60;

export default async function ConsultationPage() {
  const [pricing, services] = await Promise.all([
    getSiteContent<PricingSettingsContent>(
      "pricing_settings",
      defaultPricingSettings,
    ),
    getPublicServices(),
  ]);
  return (
    <ConsultationView initialPricing={pricing} initialServices={services} />
  );
}
