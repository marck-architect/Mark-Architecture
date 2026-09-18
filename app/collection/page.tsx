import React from "react";
import type { Metadata } from "next";
import { CollectionView } from "@/components/collection/CollectionView";

export const metadata: Metadata = {
  title: "Standardized Architectural Design Packages | MARK Architects",
  description:
    "Explore standardized fixed-price architectural design packages with 1-click checkout. Turnkey 5 Marla, 10 Marla, and 1 Kanal blueprints.",
  keywords: [
    "architectural design packages",
    "house plans online buy pakistan",
    "5 marla house design package",
    "10 marla turnkey design package",
    "1 kanal architectural drawings",
    "direct checkout blueprints",
  ],
  openGraph: {
    title: "Standardized Architectural Design Packages | MARK Architects",
    description:
      "Standardized fixed-price architectural blueprints and design packages with direct checkout.",
    url: "https://markarchitects.com/collection",
    images: [
      {
        url: "/images/Full House Design Package.png",
        width: 1200,
        height: 630,
        alt: "Full House Design Package - MARK Architects",
      },
    ],
  },
};

import { getPublicCollection } from "@/lib/server/content";

export const revalidate = 60;

export default async function CollectionPage() {
  const packages = await getPublicCollection();
  return <CollectionView initialPackages={packages} />;
}
