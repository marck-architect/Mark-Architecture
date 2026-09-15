import React from "react";
import type { Metadata } from "next";
import { FaqView } from "@/components/faqs/FaqView";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateFaqSchema } from "@/lib/seo/schema";
import { faqsData } from "@/data/faqs";

export const metadata: Metadata = {
  title: "Frequently Asked Architectural Questions & Guide | MARK Architects",
  description:
    "Authoritative guide to architectural design fees in Pakistan, PDA & CDA approvals, PKR 57/sq.ft turnkey blueprints, and Safepay payments. Led by PCATP licensed architects.",
  keywords: [
    "architectural faq pakistan",
    "how much does an architect charge in pakistan",
    "cost of 1 kanal house design",
    "pda peshawar code approval architect",
    "cda islamabad building plan approval",
    "safepay architectural payments",
    "turnkey house drawings deliverables",
    "passive solar architecture pakistan",
  ],
  openGraph: {
    title: "Architectural FAQs & Answer Guide | MARK Architects",
    description:
      "Direct answers on architectural fees, municipal PDA & CDA building permits, turnkey drafting deliverables, and Safepay checkout in Pakistan.",
    url: "https://markarchitects.com/faqs",
    siteName: "MARK Architects",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Architectural FAQs & Answer Guide | MARK Architects",
    description:
      "Direct answers on architectural fees, municipal PDA & CDA building permits, turnkey drafting deliverables, and Safepay checkout in Pakistan.",
  },
  alternates: {
    canonical: "https://markarchitects.com/faqs",
  },
};

export default function FaqsPage() {
  const faqSchema = generateFaqSchema(faqsData);

  return (
    <>
      <JsonLd data={faqSchema} />
      <FaqView />
    </>
  );
}
