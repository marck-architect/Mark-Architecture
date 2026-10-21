"use client";

import React from "react";
import { ProductsHero } from "@/components/collection/ProductsHero";
import { ProductCatalog } from "@/components/collection/ProductCatalog";
import type { StoreProduct } from "@/types";

interface CollectionViewProps {
  initialStoreProducts?: StoreProduct[];
}

export const CollectionView: React.FC<CollectionViewProps> = ({
  initialStoreProducts,
}) => {
  return (
    <div className="relative overflow-x-hidden min-h-screen bg-surface dark:bg-zinc-950">
      <ProductsHero />
      <ProductCatalog products={initialStoreProducts} />
    </div>
  );
};
