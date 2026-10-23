"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Truck, ShieldCheck, Headset, CreditCard } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import type { ProductCategory } from "@/data/productCatalog";
import { categoryIconMap } from "@/components/collection/CategoryIcons";
import { lightingSubcategoryIconMap, LightingIconStyles } from "@/components/collection/LightingSubcategoryIcons";
import {
  furnitureSubcategoryIconMap,
  FurnitureIconStyles,
} from "@/components/collection/FurnitureSubcategoryIcons";
import {
  homeDecorSubcategoryIconMap,
  HomeDecorIconStyles,
} from "@/components/collection/HomeDecorSubcategoryIcons";
import {
  tilesFinishesSubcategoryIconMap,
  TilesFinishesIconStyles,
} from "@/components/collection/TilesFinishesSubcategoryIcons";
import {
  kitchenBathSubcategoryIconMap,
  KitchenBathIconStyles,
} from "@/components/collection/KitchenBathSubcategoryIcons";
import {
  exteriorSubcategoryIconMap,
  ExteriorIconStyles,
} from "@/components/collection/ExteriorSubcategoryIcons";
import {
  shopTheLookSubcategoryIconMap,
  ShopTheLookIconStyles,
} from "@/components/collection/ShopTheLookSubcategoryIcons";
import {
  gardenLandscapeSubcategoryIconMap,
  GardenLandscapeIconStyles,
} from "@/components/collection/GardenLandscapeSubcategoryIcons";
import { ProductCard } from "@/components/collection/ProductCard";
import { trackPageView, trackEvent } from "@/lib/analytics/gtag";
import type { StoreProduct } from "@/types";

// Per-category subcategory icon sets, built out one category at a time.
const subcategoryIconMaps: Record<string, Record<string, React.FC<React.SVGProps<SVGSVGElement>>>> = {
  lighting: lightingSubcategoryIconMap,
  furniture: furnitureSubcategoryIconMap,
  "home-decor": homeDecorSubcategoryIconMap,
  "tiles-finishes": tilesFinishesSubcategoryIconMap,
  "kitchen-bath": kitchenBathSubcategoryIconMap,
  exterior: exteriorSubcategoryIconMap,
  "shop-the-look": shopTheLookSubcategoryIconMap,
  "garden-landscape": gardenLandscapeSubcategoryIconMap,
};

// Matching shared <style> block per icon set — rendered once alongside the grid.
const subcategoryIconStyles: Record<string, React.FC> = {
  lighting: LightingIconStyles,
  furniture: FurnitureIconStyles,
  "home-decor": HomeDecorIconStyles,
  "tiles-finishes": TilesFinishesIconStyles,
  "kitchen-bath": KitchenBathIconStyles,
  exterior: ExteriorIconStyles,
  "shop-the-look": ShopTheLookIconStyles,
  "garden-landscape": GardenLandscapeIconStyles,
};

/** True when a hex color is light enough that it needs dark (not white) text on top. */
function isLightColor(hex: string): boolean {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55;
}

interface CategoryDetailViewProps {
  category: ProductCategory;
  products: StoreProduct[];
}

const trustPoints = [
  { icon: Truck, title: "Nationwide Delivery", desc: "Safe & reliable shipping" },
  { icon: ShieldCheck, title: "Quality Products", desc: "Curated and trusted suppliers" },
  { icon: Headset, title: "Expert Support", desc: "Advice from our team" },
  { icon: CreditCard, title: "Secure Payments", desc: "Multiple payment options" },
];

export const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({ category, products }) => {
  const { addToCart, setCartDrawerOpen, showToast } = useStore();
  const Icon = categoryIconMap[category.id];
  const subcatIcons = subcategoryIconMaps[category.id];
  const SubcatStyles = subcategoryIconStyles[category.id];
  const lightBand = isLightColor(category.bandColor);
  const [activeSubcategory, setActiveSubcategory] = React.useState<string | null>(null);

  React.useEffect(() => {
    trackPageView(`/collection/${category.id}`, `${category.title} | MARK Architects`);
    trackEvent("view_item_list", {
      item_list_id: category.id,
      item_list_name: category.title,
    });
  }, [category.id, category.title]);

  const handleSubcategoryClick = (sub: string) => {
    setActiveSubcategory((current) => (current === sub ? null : sub));
    trackEvent("select_subcategory", {
      category_id: category.id,
      subcategory: sub,
    });
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const visibleProducts = activeSubcategory
    ? products.filter((p) => p.subcategory === activeSubcategory)
    : products;
  const titleColor = lightBand ? "text-ink" : "text-[#FBF7EF]";
  const subtitleColor = lightBand ? "text-ink-soft" : "text-[#FBF7EF]/80";
  const badgeClasses = lightBand
    ? "border-ink/15 bg-ink/5 text-ink"
    : "border-[#FBF7EF]/35 bg-[#FBF7EF]/10 text-[#FBF7EF]";

  const handleAddToCart = (p: StoreProduct) => {
    addToCart({
      title: p.name,
      price: p.price_pkr,
      image: p.image_url || "/images/Full House Design Package.png",
      currency: "PKR",
      tier: category.title,
    });
    trackEvent("add_to_cart", {
      currency: "PKR",
      value: p.price_pkr,
      items: [
        {
          item_id: p.id,
          item_name: p.name,
          item_category: category.title,
          price: p.price_pkr,
          quantity: 1,
        },
      ],
    });
    setCartDrawerOpen(true);
    showToast(`Added "${p.name}" to your cart!`, "success");
  };

  return (
    <div className="bg-cream pt-[4.5rem]">
      <div className="mx-auto max-w-[1280px] px-4 pt-5 sm:px-6 md:px-10">
        <Link
          href="/collection#categories"
          className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-gold-deep hover:text-gold"
        >
          <ArrowLeft size={14} /> All categories
        </Link>
      </div>

      {/* Full-bleed hero band — photo left (edge-to-edge), fill color sampled from
          the photo so there's no visible seam, title/subtitle right. */}
      <section className="relative mt-4 overflow-hidden" style={{ backgroundColor: category.bandColor }}>
        <div className="grid min-h-[280px] grid-cols-1 lg:grid-cols-2 lg:items-stretch">
          <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-auto lg:min-h-[320px]">
            <Image
              src={category.heroImage || category.image}
              alt={category.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={90}
              className="object-cover object-left"
              priority
            />
          </div>
          <div className="flex flex-col justify-center gap-3 px-6 py-10 sm:px-10 md:px-14 lg:py-0">
            <span
              className={`grid size-11 place-items-center rounded-full border backdrop-blur-sm sm:size-12 ${badgeClasses}`}
            >
              {Icon && <Icon className="size-5 sm:size-6" />}
            </span>
            <h1
              className={`font-newsreader text-[clamp(32px,5vw,56px)] font-medium leading-[1.02] tracking-[-.01em] ${titleColor}`}
            >
              {category.title}
            </h1>
            <p className={`text-[15px] sm:text-[17px] ${subtitleColor}`}>{category.subtitle}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-4 pb-16 sm:px-6 md:px-10 md:pb-20">
        <div className="mt-12 md:mt-16">
          {subcatIcons ? (
            <>
              <div className="mb-6 text-center sm:mb-8">
                <span className="text-[11px] font-semibold uppercase tracking-[.14em] text-gold-deep">
                  Shop by Category
                </span>
                <h2 className="mt-1 font-newsreader text-[clamp(20px,2.4vw,28px)] font-medium text-ink">
                  Browse {category.title}
                </h2>
              </div>
              {SubcatStyles && <SubcatStyles />}
              <div
                className={`grid grid-cols-4 gap-x-1.5 gap-y-5 sm:grid-cols-4 sm:gap-x-4 sm:gap-y-8 ${
                  category.subcategories.length % 4 === 0 ? "lg:grid-cols-4" : "lg:grid-cols-5"
                }`}
              >
                {category.subcategories.map((sub) => {
                  const SubIcon = subcatIcons[sub];
                  const isActive = activeSubcategory === sub;
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => handleSubcategoryClick(sub)}
                      aria-pressed={isActive}
                      className="group flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl p-1 text-center transition-transform duration-200 ease-out sm:gap-3 sm:p-2 hover:-translate-y-1 active:translate-y-0"
                    >
                      <span
                        className={`grid size-12 place-items-center rounded-full text-gold-deep transition-colors duration-200 sm:size-20 lg:size-24 ${
                          isActive ? "bg-gold/15 ring-2 ring-gold" : "group-hover:bg-gold/10"
                        }`}
                      >
                        {SubIcon && <SubIcon className="size-9 sm:size-16 lg:size-20" />}
                      </span>
                      <span
                        className={`text-[10px] font-medium leading-tight transition-colors sm:text-[13px] lg:text-[14px] ${
                          isActive ? "text-gold-deep" : "text-ink"
                        }`}
                      >
                        {sub}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSubcategory(null);
                    document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="inline-flex cursor-pointer items-center rounded-full bg-gold px-7 py-3 text-[13.5px] font-semibold text-[#FBF7EF] transition-colors hover:bg-gold-deep"
                >
                  Shop All {category.title}
                </button>
              </div>
            </>
          ) : (
            <div>
              <div className="mb-5 text-center sm:mb-6">
                <span className="text-[11px] font-semibold uppercase tracking-[.14em] text-gold-deep">
                  Shop by Category
                </span>
                <h2 className="mt-1 font-newsreader text-[clamp(20px,2.4vw,28px)] font-medium text-ink">
                  Browse {category.title}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {category.subcategories.map((sub) => (
                  <span
                    key={sub}
                    className="rounded-full border border-gold-line/50 bg-[#FFFDF8] px-4 py-2.5 text-[13px] text-ink-soft sm:text-[13.5px]"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div id="products" className="mt-14 scroll-mt-24 md:mt-16">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-gold/20 pb-4">
            <h2 className="font-newsreader text-[clamp(18px,2vw,22px)] font-medium text-ink">
              {activeSubcategory ? activeSubcategory : "Products"}
            </h2>
            {activeSubcategory && (
              <button
                type="button"
                onClick={() => setActiveSubcategory(null)}
                className="cursor-pointer text-[12.5px] font-semibold text-gold-deep hover:text-gold"
              >
                Show all {category.title} →
              </button>
            )}
          </div>
          {visibleProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
              {visibleProducts.map((p) => (
                <ProductCard key={p.id} product={p} categoryId={category.id} onAdd={handleAddToCart} />
              ))}
            </div>
          ) : (
            <p className="text-[13px] italic text-[#8A7960]">
              Full product listings for {category.title.toLowerCase()} are being added — check back soon, or get in
              touch for current availability.
            </p>
          )}
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 border-t border-gold/20 pt-8 sm:grid-cols-4">
          {trustPoints.map(({ icon: TIcon, title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold/10 text-gold-deep">
                <TIcon size={18} />
              </span>
              <span className="flex flex-col">
                <span className="text-[12.5px] font-medium text-ink">{title}</span>
                <span className="text-[11px] text-[#8A7960]">{desc}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailView;
