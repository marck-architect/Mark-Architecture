import React from "react";
import type { Metadata } from "next";
import { PrivacyPolicyContent } from "@/components/legal/PrivacyPolicyContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Privacy Policy & Data Protection | MARK Architects Atelier",
  description:
    "Official privacy policy of MARK Architects. Discover how we protect client personal data, cadastral land records, architectural CAD blueprints, and Safepay payments in compliance with PCATP and SBP standards.",
  keywords: [
    "mark architects privacy policy",
    "architectural data protection pakistan",
    "safepay architectural payments security",
    "pcatp client confidentiality",
    "cad blueprints data storage",
    "luxury villa design privacy pakistan",
  ],
  openGraph: {
    title: "Privacy Policy & Data Protection | MARK Architects Atelier",
    description:
      "Statutory data governance, client survey protection, CAD blueprint archival, and secure Safepay checkout for residential and commercial architectural projects.",
    url: `${siteConfig.url}/privacy`,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy & Data Protection | MARK Architects Atelier",
    description:
      "Statutory data governance, client survey protection, CAD blueprint archival, and secure Safepay checkout.",
  },
  alternates: {
    canonical: `${siteConfig.url}/privacy`,
  },
};

export default function PrivacyPage() {
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
        item: `${siteConfig.url}/privacy`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Privacy Policy",
        item: `${siteConfig.url}/privacy`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <PrivacyPolicyContent />
    </>
  );
}
