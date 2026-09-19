import React from "react";
import type { Metadata } from "next";
import { AboutView } from "@/components/about/AboutView";
import { JsonLd } from "@/components/seo/JsonLd";
import { generatePersonSchema, siteConfig } from "@/lib/seo/schema";
import { leaders } from "@/data/about";

export const metadata: Metadata = {
  title: "About Our Practice | MARK Architects Atelier",
  description:
    "Learn about MARK Architects, spearheaded by licensed architect Muhammad Arsalan. Discover our 15+ years of experience in luxury estates, structural engineering, and PCATP/PDA/CDA compliance.",
  keywords: [
    "about mark architects",
    "muhammad arsalan architect",
    "pcatp architect pakistan",
    "architectural firm peshawar",
    "islamabad luxury architects",
    "architect credentials pakistan",
  ],
  openGraph: {
    title: "About Our Practice | MARK Architects Atelier",
    description:
      "Spearheaded by Muhammad Arsalan. 15+ years of practice delivering mathematical precision, passive solar design, and turnkey residential masterplanning.",
    url: "https://markarchitects.com/about",
    images: [
      {
        url: "/images/profile.jpeg",
        width: 800,
        height: 1000,
        alt: "Muhammad Arsalan - Principal Architect at MARK Architects",
      },
    ],
  },
};

import { getPublicTeam } from "@/lib/server/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AboutPage() {
  const {
    leaders: dynamicLeaders,
    achievements: dynamicAchievements,
    studioLocations: dynamicLocations,
  } = await getPublicTeam();

  const principal = dynamicLeaders[0] || leaders[0];
  const personSchema = principal
    ? generatePersonSchema({
        name: principal.name,
        jobTitle: principal.role,
        description: principal.bio,
        image: principal.image?.startsWith("http")
          ? principal.image
          : `${siteConfig.url}${principal.image || "/images/profile-removebg-preview.png"}`,
        url: `${siteConfig.url}/about`,
        credentials: principal.credentials,
      })
    : null;

  return (
    <>
      {personSchema && <JsonLd data={personSchema} />}

      <AboutView
        initialLeaders={dynamicLeaders}
        initialAchievements={dynamicAchievements}
        initialStudioLocations={dynamicLocations}
      />
    </>
  );
}
