"use client";

import React from "react";
import { ProductsHero } from "@/components/collection/ProductsHero";
import { ProductCatalog } from "@/components/collection/ProductCatalog";
import type { ArchitecturalPackage } from "@/types";
import { architecturalPackages as fallbackPackages } from "@/data/collection";

interface CollectionViewProps {
  initialPackages?: ArchitecturalPackage[];
}

export const CollectionView: React.FC<CollectionViewProps> = ({
  initialPackages,
}) => {
  const packages =
    initialPackages && initialPackages.length > 0
      ? initialPackages
      : fallbackPackages;

  return (
    <div className="relative overflow-x-hidden min-h-screen bg-surface dark:bg-zinc-950">
      <ProductsHero packages={packages} />
      <ProductCatalog />
    </div>
  );
};
