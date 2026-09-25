import React from "react";
import type { Metadata } from "next";
import { TermsOfServiceContent } from "@/components/legal/TermsOfServiceContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Terms of Service & Architectural Engagement | MARK Architects",
  description:
    "Official Terms of Service for MARK Architects. Read our contractual terms governing architectural blueprints, PKR 57/sq.ft formula pricing, 50% advance policy, Safepay payments, and PCATP/PEC compliance.",
  keywords: [
    "mark architects terms of service",
    "architectural contract pakistan",
    "pcatp architect agreement terms",
    "pkr 57 formula architectural terms",
    "safepay architectural payments terms",
    "single site construction license blueprints",
    "pda cda architectural approvals disclaimer",
  ],
  openGraph: {
    title: "Terms of Service & Architectural Engagement | MARK Architects",
    description:
      "Statutory contract terms, 50% mobilization advance, CAD blueprint intellectual property, single-site license, and Safepay checkout governance.",
    url: `${siteConfig.url}/terms`,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service & Engagement | MARK Architects",
    description:
      "Statutory contract terms, 50% mobilization advance, CAD blueprint intellectual property, single-site license, and Safepay checkout governance.",
  },
  alternates: {
    canonical: `${siteConfig.url}/terms`,
  },
};

export default function TermsPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Atelier Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Legal Governance",
        item: `${siteConfig.url}/terms`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Terms of Service",
        item: `${siteConfig.url}/terms`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <TermsOfServiceContent />
    </>
  );
}
