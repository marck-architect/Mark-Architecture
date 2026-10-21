"use client";

import React from "react";
import Image from "next/image";
import { ShoppingBag, Heart } from "lucide-react";
import { categoryIconMap } from "@/components/collection/CategoryIcons";
import { productCategories } from "@/data/productCatalog";
import { useStore } from "@/hooks/useStore";
import type { StoreProduct } from "@/types";

export const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

interface ProductCardProps {
  product: StoreProduct;
  categoryId: string;
  onAdd: (p: StoreProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, categoryId, onAdd }) => {
  const Icon = categoryIconMap[categoryId];
  const { openQuickView } = useStore();
  const categoryTitle = productCategories.find((c) => c.id === categoryId)?.title;

  const handleOpen = () => {
    openQuickView({
      title: product.name,
      price: `Rs. ${fmt(product.price_pkr)}${product.price_unit ? ` / ${product.price_unit}` : ""}`,
      category: product.subcategory || categoryTitle || "",
      image: product.image_url || "/images/Full House Design Package.png",
      description: product.description || "",
    });
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpen();
        }
      }}
      aria-label={`View ${product.name}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-gold/20 bg-[#FFFDF8] transition-colors duration-200 ease-out hover:border-gold-line"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gold/10">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            quality={90}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gold-deep/50">
            {Icon && <Icon className="size-10" />}
          </div>
        )}
        <button
          type="button"
          aria-label={`Save ${product.name} to wishlist`}
          onClick={(e) => e.stopPropagation()}
          className="absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-full bg-[#FFFDF8]/90 text-ink-soft opacity-0 shadow-sm transition-opacity duration-200 ease-out group-hover:opacity-100 hover:text-gold cursor-pointer"
        >
          <Heart size={14} />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3.5 sm:p-4">
        <div className="min-w-0">
          <p className="truncate text-[13.5px] font-medium text-ink">{product.name}</p>
          {product.subcategory && (
            <p className="truncate text-[11.5px] text-[#8A7960]">{product.subcategory}</p>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span className="text-[13px] font-semibold text-gold-deep">
            Rs. {fmt(product.price_pkr)}
            {product.price_unit && <span className="font-normal text-[#8A7960]"> / {product.price_unit}</span>}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAdd(product);
            }}
            className="grid size-8 shrink-0 place-items-center rounded-full bg-gold text-[#FBF7EF] transition-colors hover:bg-gold-deep cursor-pointer"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
