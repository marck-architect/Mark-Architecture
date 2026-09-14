import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { serviceCatalog } from "@/data/services";
import { ServiceSlugView } from "./ServiceSlugView";

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return serviceCatalog.map((service) => ({
    slug: service.slug || service.id,
  }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceCatalog.find((s) => s.slug === slug || s.id === slug);

  if (!service) {
    return {
      title: "Service Not Found | MARK Architects",
    };
  }

  return {
    title: `${service.title} | MARK Architects Atelier`,
    description: service.shortDesc,
    openGraph: {
      title: `${service.title} | MARK Architects`,
      description: service.shortDesc,
      images: service.image ? [{ url: service.image }] : undefined,
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = serviceCatalog.find((s) => s.slug === slug || s.id === slug);

  if (!service) {
    notFound();
  }

  return <ServiceSlugView service={service} />;
}
