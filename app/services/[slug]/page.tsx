import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getPublicServices } from "@/lib/server/content";
import type { AdminService, ServiceData } from "@/types";
import { ServiceSlugView } from "./ServiceSlugView";

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

function toServiceData(s: AdminService): ServiceData {
  return {
    id: s.id,
    slug: s.slug,
    title: s.title,
    category: s.category,
    shortDesc: s.short_description || "",
    image: s.image_url,
    pricingType: s.pricing_type,
    popularityRank: s.popularity_rank,
    tiers: s.tiers?.map((t) => ({
      name: t.tier_name,
      deliveryTime: t.delivery_time,
      details: t.description,
      deliverables: t.deliverables,
      pricePKR: t.pricing_rules?.find((r) => r.plot_size === "Any")?.price_pkr,
      priceByPlot: t.pricing_rules?.reduce((acc, r) => {
        if (r.plot_size !== "Any") {
          acc[r.plot_size] = r.price_pkr;
        }
        return acc;
      }, {} as any),
    })),
  };
}

export async function generateStaticParams() {
  const services = await getPublicServices();
  return services.map((service) => ({
    slug: service.slug || service.id,
  }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const services = await getPublicServices();
  const service = services
    .map(toServiceData)
    .find((s) => s.slug === slug || s.id === slug);

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
  const services = await getPublicServices();
  const service = services
    .map(toServiceData)
    .find((s) => s.slug === slug || s.id === slug);

  if (!service) {
    notFound();
  }

  return <ServiceSlugView service={service} />;
}
