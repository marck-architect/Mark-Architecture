"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Truck, ShieldCheck, Headset, CreditCard } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { productCategories, styledLooks } from "@/data/productCatalog";
import { categoryIconMap } from "@/components/collection/CategoryIcons";
import { ProductCard } from "@/components/collection/ProductCard";
import { defaultStoreProducts } from "@/data/storeProducts";
import type { StoreProduct } from "@/types";

interface ProductCatalogProps {
  products?: StoreProduct[];
}

const trustPoints = [
  { icon: Truck, title: "Nationwide Delivery", desc: "Safe & reliable shipping" },
  { icon: ShieldCheck, title: "Quality Products", desc: "Curated and trusted suppliers" },
  { icon: Headset, title: "Expert Support", desc: "Advice from our team" },
  { icon: CreditCard, title: "Secure Payments", desc: "Multiple payment options" },
];

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ products }) => {
  const list = products && products.length > 0 ? products : defaultStoreProducts;
  const { addToCart, setCartDrawerOpen, showToast } = useStore();

  const popularProducts = [...list]
    .filter((p) => p.is_published && p.image_url)
    .sort((a, b) => a.display_order - b.display_order)
    .slice(0, 6);

  const handleAddToCart = (p: StoreProduct) => {
    const cat = productCategories.find((c) => c.id === p.category_id);
    addToCart({
      title: p.name,
      price: p.price_pkr,
      image: p.image_url || "/images/Full House Design Package.png",
      currency: "PKR",
      tier: cat?.title,
    });
    setCartDrawerOpen(true);
    showToast(`Added "${p.name}" to your cart!`, "success");
  };

  return (
    <section id="collection-catalog" className="scroll-mt-20 bg-cream py-16 md:py-20">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-10">
        <div className="mb-8 md:mb-10 flex flex-col gap-2 sm:gap-3">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[.14em] text-gold-deep">
            Complete Catalog
          </span>
          <h2 className="font-newsreader text-[clamp(28px,4.2vw,48px)] font-medium leading-[1.05] tracking-[-.02em] text-ink text-balance">
            Browse by category
          </h2>
        </div>

        {/* Category strip — compact thumbnails, 4 cols mobile up to 8 on desktop */}
        <div id="categories" className="grid scroll-mt-24 grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5 sm:gap-3">
          {productCategories.map((cat) => {
            const Icon = categoryIconMap[cat.id];
            return (
              <Link
                key={cat.id}
                href={`/collection/${cat.id}`}
                className="group flex flex-col overflow-hidden rounded-lg border border-gold/20 bg-[#FFFDF8] transition-colors duration-200 ease-out hover:border-gold-line sm:rounded-xl"
              >
                <span className="relative block aspect-square w-full overflow-hidden">
                  <Image
                    src={cat.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 25vw, (max-width: 1024px) 16vw, 12vw"
                    quality={90}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </span>
                <span className="flex flex-col items-center gap-1 px-1 py-1.5 text-center sm:gap-1.5 sm:px-2 sm:py-3">
                  <span className="grid size-4 shrink-0 place-items-center text-ink-soft sm:size-7">
                    {Icon && <Icon className="size-full" />}
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[9.5px] font-medium leading-tight text-ink sm:text-[12.5px]">
                      {cat.title}
                    </span>
                    <span className="hidden text-[10px] leading-snug text-[#6B5A40] sm:block">{cat.subtitle}</span>
                  </span>
                </span>
              </Link>
            );
          })}
        </div>

        {/* Popular Products — flat grid across all categories, always visible */}
        {popularProducts.length > 0 && (
          <div className="mt-12 md:mt-16">
            <div className="mb-5 flex items-end justify-between gap-3 border-b border-gold/20 pb-4">
              <h3 className="font-newsreader text-[clamp(22px,2.8vw,32px)] font-medium text-ink">
                Popular Products
              </h3>
              <a
                href="#categories"
                className="shrink-0 text-[12px] font-semibold text-gold-deep hover:text-gold"
              >
                View All →
              </a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {popularProducts.map((p) => (
                <ProductCard key={p.id} product={p} categoryId={p.category_id} onAdd={handleAddToCart} />
              ))}
            </div>
          </div>
        )}

        {/* Shop the Look — real room photography */}
        <div className="mt-12 md:mt-16">
          <div className="mb-5 flex items-end justify-between gap-3 border-b border-gold/20 pb-4">
            <h3 className="font-newsreader text-[clamp(22px,2.8vw,32px)] font-medium text-ink">Shop the Look</h3>
            <Link
              href="/collection/shop-the-look"
              className="shrink-0 text-[12px] font-semibold text-gold-deep hover:text-gold"
            >
              View All Rooms →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {styledLooks.map((room) => (
              <div
                key={room.slug}
                className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl border border-gold/20 p-4 text-left transition-colors duration-200 ease-out hover:border-gold-line"
              >
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  quality={90}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent" />
                <div className="relative">
                  <p className="text-[13.5px] font-medium text-[#FBF7EF]">{room.name}</p>
                  <span className="text-[11.5px] text-[#FBF7EF]/80">Shop the Look →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust strip */}
        <div className="mt-14 grid grid-cols-2 gap-4 border-t border-gold/20 pt-8 sm:grid-cols-4 md:mt-16">
          {trustPoints.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold/10 text-gold-deep">
                <Icon size={18} />
              </span>
              <span className="flex flex-col">
                <span className="text-[12.5px] font-medium text-ink">{title}</span>
                <span className="text-[11px] text-[#8A7960]">{desc}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCatalog;
