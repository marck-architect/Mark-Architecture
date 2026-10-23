"use client";

import React, { useEffect } from "react";
import { ProductsHero } from "@/components/collection/ProductsHero";
import { ProductCatalog } from "@/components/collection/ProductCatalog";
import { trackPageView, trackEvent } from "@/lib/analytics/gtag";
import type { StoreProduct } from "@/types";

interface CollectionViewProps {
  initialStoreProducts?: StoreProduct[];
}

export const CollectionView: React.FC<CollectionViewProps> = ({
  initialStoreProducts,
}) => {
  useEffect(() => {
    trackPageView("/collection", "Products & Collection | MARK Architects");
    trackEvent("view_products_page", { page_location: "/collection" });
  }, []);

  return (
    <div className="relative overflow-x-hidden min-h-screen bg-surface dark:bg-zinc-950">
      <ProductsHero />
      <ProductCatalog products={initialStoreProducts} />
    </div>
  );
};
