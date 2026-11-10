import { platforms, profile } from "./profile.config";

export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.bio,
    email: `mailto:${profile.email}`,
    telephone: profile.phone,
    url: profile.website,
    image: new URL(profile.images.avatar, profile.website).toString(),
    worksFor: {
      "@type": "Organization",
      name: profile.company,
      url: profile.website,
      address: {
        "@type": "PostalAddress",
        streetAddress: profile.addressParts.street,
        addressLocality: profile.addressParts.city,
        addressCountry: "PK",
      },
    },
    sameAs: platforms
      .filter((p) => p.id === "instagram" || p.id === "facebook")
      .map((p) => p.href),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
