"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { productCategories } from "@/data/productCatalog";
import { categoryIconMap } from "@/components/collection/CategoryIcons";

const EASE = [0.2, 0.7, 0.2, 1] as const;

export const ProductCatalog: React.FC = () => {
  const [activeId, setActiveId] = useState(productCategories[0]?.id ?? "");
  const detailRef = useRef<HTMLDivElement>(null);

  const active = productCategories.find((c) => c.id === activeId) ?? productCategories[0];

  const pick = (id: string) => {
    setActiveId(id);
    const el = detailRef.current;
    if (el && el.getBoundingClientRect().top > window.innerHeight * 0.75) {
      window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 24, behavior: "smooth" });
    }
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

        {/* Category tile grid — 2 cols mobile, 3 tablet, 4 desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {productCategories.map((cat) => {
            const Icon = categoryIconMap[cat.id];
            const on = cat.id === active?.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => pick(cat.id)}
                aria-pressed={on}
                className={`group flex flex-col items-start gap-3 rounded-2xl border p-4 sm:p-5 text-left transition-colors duration-200 ease-out cursor-pointer ${
                  on
                    ? "border-gold bg-gold/10"
                    : "border-gold/20 bg-[#FFFDF8] hover:border-gold-line hover:bg-gold/5"
                }`}
              >
                <span
                  className={`grid size-11 sm:size-12 shrink-0 place-items-center rounded-full border transition-colors duration-200 ease-out ${
                    on
                      ? "border-gold bg-gold text-[#FBF7EF]"
                      : "border-gold-line/60 bg-gold/10 text-gold-deep group-hover:border-gold group-hover:bg-gold group-hover:text-[#FBF7EF]"
                  }`}
                >
                  {Icon && <Icon className="size-5 sm:size-[22px]" />}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-[14px] sm:text-[15px] font-medium leading-tight text-ink">{cat.title}</span>
                  <span className="text-[11px] sm:text-[12px] leading-snug text-[#6B5A40]">{cat.subtitle}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Active category detail: subcategory chips */}
        <div ref={detailRef} className="mt-10 md:mt-14">
          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <div className="flex flex-wrap items-center gap-3 border-b border-gold/20 pb-4 mb-5">
                  <span className="grid size-9 place-items-center rounded-full bg-gold text-[#FBF7EF]">
                    {(() => {
                      const Icon = categoryIconMap[active.id];
                      return Icon ? <Icon className="size-4" /> : null;
                    })()}
                  </span>
                  <h3 className="font-newsreader text-[clamp(20px,2.4vw,28px)] font-medium text-ink">
                    {active.title}
                  </h3>
                  <span className="text-[12px] text-[#6B5A40]">{active.subcategories.length} subcategories</span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {active.subcategories.map((sub) => (
                    <span
                      key={sub}
                      className="rounded-full border border-gold-line/50 bg-[#FFFDF8] px-4 py-2.5 text-[13px] sm:text-[13.5px] text-ink-soft transition-colors duration-200 ease-out hover:border-gold hover:bg-gold/10 hover:text-ink cursor-default"
                    >
                      {sub}
                    </span>
                  ))}
                </div>

                <p className="mt-6 text-[13px] text-[#8A7960] italic">
                  Full product listings for {active.title.toLowerCase()} are being added — check back soon, or get in
                  touch for current availability.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ProductCatalog;
