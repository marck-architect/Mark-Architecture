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
