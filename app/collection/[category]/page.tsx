import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { productCategories } from "@/data/productCatalog";
import { defaultStoreProducts } from "@/data/storeProducts";
import { getSiteContent } from "@/lib/server/content";
import { CategoryDetailView } from "@/components/collection/CategoryDetailView";
import type { StoreProduct } from "@/types";

export const revalidate = 60;

export function generateStaticParams() {
  return productCategories.map((cat) => ({ category: cat.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = productCategories.find((c) => c.id === slug);
  if (!category) return {};
  return {
    title: `${category.title} | MARK Architects Products`,
    description: category.subtitle,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = productCategories.find((c) => c.id === slug);
  if (!category) notFound();

  const storeProducts = await getSiteContent<StoreProduct[]>("store_products", defaultStoreProducts);
  const products = storeProducts
    .filter((p) => p.category_id === category.id && p.is_published)
    .sort((a, b) => a.display_order - b.display_order);

  return <CategoryDetailView category={category} products={products} />;
}
