export const siteConfig = {
  name: "MARK Architects",
  legalName: "MARK Architects & Design Atelier",
  description:
    "Premier architectural design atelier specializing in bespoke residential estates, commercial elevations, luxury interiors, and structural consultations across Pakistan and worldwide.",
  url: "https://markarchitects.com",
  ogImage: "https://markarchitects.com/og-image.jpg",
  telephone: "+92 300 0000000",
  address: {
    streetAddress: "DHA Phase 6",
    addressLocality: "Lahore",
    addressRegion: "Punjab",
    postalCode: "54000",
    addressCountry: "PK",
  },
};

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ArchitecturalFirm",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    telephone: siteConfig.telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.streetAddress,
      addressLocality: siteConfig.address.addressLocality,
      addressRegion: siteConfig.address.addressRegion,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.addressCountry,
    },
  };
}

export function generatePersonSchema(person: {
  name: string;
  jobTitle: string;
  description: string;
  image: string;
  url?: string;
  credentials?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.jobTitle,
    description: person.description,
    image: person.image,
    ...(person.url && { url: person.url }),
    worksFor: {
      "@type": "ArchitecturalFirm",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    ...(person.credentials && {
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "license",
        name: person.credentials,
      },
    }),
  };
}

export function generateFaqSchema(
  faqs: { question: string; shortAnswer: string; fullAnswer?: string[] }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: "MARK Architects | Frequently Asked Architectural Questions (AEO Guide)",
    description:
      "Authoritative answers to architectural design fees, PDA & CDA municipal approvals, turnkey blueprint packages, and Safepay payments across Pakistan.",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text:
          faq.fullAnswer && faq.fullAnswer.length > 0
            ? `${faq.shortAnswer} ${faq.fullAnswer.join(" ")}`
            : faq.shortAnswer,
      },
    })),
  };
}
