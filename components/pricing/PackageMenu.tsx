"use client";

import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Clock, Paperclip, Search } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { PricingCalculator } from "@/components/pricing/PricingCalculator";
import { PLOT_SIZES, type PricingCategory, type PricingTier } from "@/data/pricing";
import type { Discipline, PlotPreset } from "@/types";

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.2, 0.7, 0.2, 1] as const;
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

function matches(c: PricingCategory, q: string) {
  if (!q) return true;
  const hay = [c.title, c.subtitle, c.description, ...c.tiers.flatMap((t) => [t.name, ...t.inclusions])];
  return hay.join(" ").toLowerCase().includes(q);
}

interface Selection {
  key: string;
  categoryId: string;
  categoryTitle: string;
  name: string;
  price: number;
  plotSize?: string;
}

interface PackageMenuProps {
  categories: PricingCategory[];
  calculatorSettings: {
    disciplines: Discipline[];
    advancePercentage: number;
    plotPresets?: PlotPreset[];
  };
}

export const PackageMenu: React.FC<PackageMenuProps> = ({ categories, calculatorSettings }) => {
  const router = useRouter();
  const root = useRef<HTMLElement>(null);
  const ghost = useRef<HTMLDivElement>(null);
  const detail = useRef<HTMLDivElement>(null);

  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? "");
  const [sizeIndex, setSizeIndex] = useState(1);
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState<Selection | null>(null);

  const q = query.trim().toLowerCase();
  const tiles = useMemo(() => categories.filter((c) => matches(c, q)), [categories, q]);
  const cat = categories.find((c) => c.id === activeCategory) ?? categories[0];

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-reveal='up']").forEach((el) =>
          gsap.fromTo(el, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 68%", scrub: 0.6 } }));
        gsap.fromTo("[data-reveal='line']", { scaleX: 0 }, { scaleX: 1, ease: "none", transformOrigin: "left center",
          scrollTrigger: { trigger: "[data-reveal='line']", start: "top bottom", end: "top 60%", scrub: 0.6 } });
        gsap.utils.toArray<HTMLElement>("[data-tile]").forEach((el, i) =>
          gsap.fromTo(el, { clipPath: "inset(0 100% 0 0)", y: 24, opacity: 0.3 }, {
            clipPath: "inset(0 0% 0 0)", y: 0, opacity: 1, ease: "power2.out",
            // Offset increases monotonically with DOM order (row-major, matching the
            // grid's left-to-right/top-to-bottom layout) instead of a fixed column
            // modulo, so cards always reveal in visual order top-to-bottom, and
            // reverse in that same order when scrolling back up.
            scrollTrigger: { trigger: el, start: `top+=${Math.min(i * 30, 240)} bottom`, end: "top 65%", scrub: 0.6 },
          }));
        gsap.fromTo(ghost.current, { y: 110 }, {
          y: -110, ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    }, root);
    return () => { ctx.revert(); mm.revert(); };
  }, []);

  const pick = (id: string) => {
    setActiveCategory(id);
    const d = detail.current;
    if (d && d.getBoundingClientRect().top > innerHeight * 0.7)
      window.scrollTo({ top: scrollY + d.getBoundingClientRect().top - 24, behavior: "smooth" });
  };

  const handleSelect = (category: PricingCategory, tier: PricingTier) => {
    if (tier.actionType === "consultation") {
      router.push("/consultation");
      return;
    }
    const price = category.sized && tier.pricesBySize ? tier.pricesBySize[sizeIndex] : Number(tier.pricePKR) || 0;
    const key = category.id + tier.id + (category.sized ? sizeIndex : "");
    setSelection((cur) =>
      cur?.key === key
        ? null
        : {
            key,
            categoryId: category.letter,
            categoryTitle: category.title,
            name: tier.name + (category.sized ? ` (${PLOT_SIZES[sizeIndex]})` : ""),
            price,
            plotSize: category.sized ? PLOT_SIZES[sizeIndex] : undefined,
          },
    );
  };

  return (
    <section id="packages" ref={root} className="relative overflow-hidden bg-cream pt-[clamp(40px,5vw,72px)] pb-[clamp(64px,8vw,104px)] font-instrument text-ink">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(154,118,64,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(154,118,64,.07)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000_20%,transparent_75%)]" />
      <div ref={ghost} aria-hidden className="pointer-events-none absolute right-[-2vw] top-[38%] select-none font-newsreader text-[clamp(320px,52vw,820px)] leading-[.8] text-transparent [-webkit-text-stroke:1px_rgba(154,118,64,.16)] will-change-transform">
        <AnimatePresence mode="wait">
          <motion.span key={cat?.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            {cat?.letter}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="relative mx-auto max-w-[1280px] px-[clamp(20px,5vw,72px)]">
        <div data-reveal="up" className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div className="flex min-w-0 flex-col gap-[18px]">
            <span className="self-start rounded-full bg-gold/15 px-3.5 py-[7px] text-sm font-medium text-[#7A5B2C]">Complete Package Menu</span>
            <h2 className="font-newsreader text-[clamp(38px,5.6vw,76px)] font-medium leading-none tracking-[-.025em] text-balance">Select your design package</h2>
          </div>
          <label className="relative flex max-w-[420px] flex-[1_1_280px] items-center">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search packages or features…"
              className="h-[54px] w-full rounded-full border border-gold-line bg-[#FFFDF8]/70 pl-[22px] pr-[52px] text-base outline-none focus:border-gold focus:ring-4 focus:ring-gold/15"
            />
            <Search className="pointer-events-none absolute right-5 text-gold" size={20} strokeWidth={1.8} />
          </label>
        </div>

        <div data-reveal="line" className="mb-[clamp(18px,2.4vw,26px)] mt-[clamp(20px,3vw,32px)] flex items-center gap-3 text-xs uppercase tracking-[.14em] text-gold-deep">
          <span className="h-3 w-px bg-gold-line" /><span className="h-px flex-1 bg-gold-line" />
          <span className="whitespace-nowrap">{categories[0]?.letter} — {categories[categories.length - 1]?.letter} · {categories.length} service lines</span>
          <span className="h-px flex-1 bg-gold-line" /><span className="h-3 w-px bg-gold-line" />
        </div>

        <div data-tiles className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-[clamp(12px,1.4vw,20px)]">
          {tiles.map((c) => {
            const on = c.id === cat?.id;
            return (
              <div key={c.id} data-tile className="grid">
                <button
                  type="button"
                  onClick={() => pick(c.id)}
                  className={`relative flex min-h-[88px] items-center gap-4 rounded-2xl border p-2.5 pr-11 text-left transition-[transform,box-shadow,background] duration-300 hover:-translate-y-[3px] cursor-pointer ${on ? "border-gold bg-gold text-[#FBF7EF] shadow-[0_18px_40px_-18px_rgba(122,91,44,.7)]" : "border-gold/30 bg-[#FFFDF8]"}`}
                >
                  {c.icon && (
                    <span className="grid size-[72px] flex-none place-items-center overflow-hidden rounded-xl bg-[#FBF7EF]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.icon} alt="" width={578} height={432} loading="lazy" decoding="async" className="w-[132%] max-w-none" />
                    </span>
                  )}
                  <span className="flex min-w-0 flex-col gap-[3px]">
                    <span className="text-[17px] font-medium leading-tight">{c.title}</span>
                    <span className="text-[13px] leading-snug opacity-75">{c.subtitle}</span>
                  </span>
                  <span className={`absolute right-3 top-3 grid size-7 place-items-center rounded-lg text-sm font-semibold text-[#7A5B2C] ${on ? "bg-[#FBF7EF]" : "bg-gold/15"}`}>{c.letter}</span>
                </button>
              </div>
            );
          })}
        </div>
        {q && tiles.length === 0 && (
          <p className="mt-6 text-[#6B5A40]">No packages match &ldquo;{query}&rdquo;. <button type="button" className="text-gold underline cursor-pointer" onClick={() => setQuery("")}>Clear search</button></p>
        )}

        <div ref={detail} className="mt-[clamp(40px,5vw,64px)]">
          {cat && (
            <CategoryDetail
              cat={cat}
              sizeIndex={sizeIndex}
              setSizeIndex={setSizeIndex}
              selection={selection}
              onSelect={handleSelect}
              calculatorSettings={calculatorSettings}
            />
          )}
        </div>
      </div>

      <SelectionBar selection={selection} clear={() => setSelection(null)} />
    </section>
  );
};

interface CategoryDetailProps {
  cat: PricingCategory;
  sizeIndex: number;
  setSizeIndex: (i: number) => void;
  selection: Selection | null;
  onSelect: (category: PricingCategory, tier: PricingTier) => void;
  calculatorSettings: {
    disciplines: Discipline[];
    advancePercentage: number;
    plotPresets?: PlotPreset[];
  };
}

function CategoryDetail({ cat, sizeIndex, setSizeIndex, selection, onSelect, calculatorSettings }: CategoryDetailProps) {
  return (
    <>
      <div className={cat.image ? "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start" : undefined}>
        <div className="flex flex-col gap-3.5">
          <div className="flex flex-wrap items-center gap-4">
            <AnimatePresence mode="wait">
              <motion.h3
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="font-newsreader text-[clamp(30px,3.8vw,50px)] font-medium leading-[1.05] tracking-[-.02em]"
              >
                {cat.title}
              </motion.h3>
            </AnimatePresence>
          </div>
          <p className="text-[clamp(16px,1.3vw,18px)] leading-relaxed text-[#4A4236] text-pretty">{cat.description}</p>

          {cat.detailPoints && cat.detailPoints.length > 0 && (
            <ul className="flex flex-col gap-3 border-t border-gold/20 pt-5">
              {cat.detailPoints.map((point) => (
                <li key={point} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink-soft">
                  <span className="mt-[9px] size-1.5 flex-none rounded-full bg-gold-line" />
                  {point}
                </li>
              ))}
            </ul>
          )}

          {cat.sized && (
            <div role="tablist" aria-label="House size" className="flex self-start rounded-full border border-gold-line bg-[#FFFDF8]/70 p-1">
              {PLOT_SIZES.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  role="tab"
                  aria-selected={i === sizeIndex}
                  onClick={() => setSizeIndex(i)}
                  className={`relative min-h-11 rounded-full px-[18px] text-[15px] font-medium transition-colors cursor-pointer ${i === sizeIndex ? "text-[#FBF7EF]" : "text-[#7A5B2C]"}`}
                >
                  {i === sizeIndex && <motion.span layoutId="size-pill" className="absolute inset-0 rounded-full bg-gold" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                  <span className="relative">{s}</span>
                </button>
              ))}
            </div>
          )}

          {cat.clientRequirementNote && (
            <p className="flex items-start gap-2.5 rounded-xl bg-gold/10 px-[18px] py-3.5 text-[15px] leading-normal text-[#5E4722]">
              <Paperclip size={18} className="mt-0.5 flex-none" />{cat.clientRequirementNote}
            </p>
          )}
        </div>

        {cat.image && (
          <AnimatePresence mode="wait">
            <motion.div
              key={cat.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-[#FFFDF8] lg:order-last"
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority={false}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={cat.id}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        >
          {cat.isCalculator ? (
            <PricingCalculator
              disciplinesList={calculatorSettings.disciplines}
              advancePercentage={calculatorSettings.advancePercentage}
            />
          ) : (
            <TierGrid cat={cat} sizeIndex={sizeIndex} selection={selection} onSelect={onSelect} />
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } };

function TierGrid({
  cat,
  sizeIndex,
  selection,
  onSelect,
}: {
  cat: PricingCategory;
  sizeIndex: number;
  selection: Selection | null;
  onSelect: (category: PricingCategory, tier: PricingTier) => void;
}) {
  return (
    <div className="mt-[clamp(22px,3vw,36px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-stretch gap-[clamp(16px,2vw,28px)]">
      {cat.tiers.map((t, i) => {
        const price = cat.sized && t.pricesBySize ? t.pricesBySize[sizeIndex] : Number(t.pricePKR) || 0;
        const key = cat.id + t.id + (cat.sized ? sizeIndex : "");
        const chosen = selection?.key === key;
        const featured = !!t.popular;
        return (
          <motion.article
            key={t.id}
            variants={item}
            className={`relative flex flex-col overflow-hidden rounded-[20px] border bg-[#FFFDF8] p-[clamp(22px,2.4vw,32px)] ${featured ? "border-gold-line shadow-[0_30px_60px_-30px_rgba(122,91,44,.55)]" : "border-gold/25"}`}
          >
            {featured && <span className="absolute right-[-44px] top-[22px] w-[170px] rotate-45 bg-gold py-1.5 text-center text-xs font-semibold uppercase tracking-[.08em] text-[#FBF7EF]">{t.tag || "Recommended"}</span>}
            {t.deliveryTime && (
              <span className="inline-flex items-center gap-2 self-start rounded-full bg-gold/12 px-3 py-1.5 text-sm text-[#5E4722]"><Clock size={15} />{t.deliveryTime}</span>
            )}
            <span className="mt-5 text-[13px] uppercase tracking-[.12em] text-gold-deep">Tier {i + 1}</span>
            <h4 className="mt-1.5 text-xl font-medium leading-snug">{t.name}</h4>
            <div className="mt-3.5 flex flex-wrap items-baseline gap-2">
              <span className="text-[15px] font-semibold text-gold-deep">PKR</span>
              <motion.span key={price} initial={{ opacity: 0.3, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-newsreader text-[clamp(40px,4vw,54px)] leading-none tracking-[-.02em] text-gold">{fmt(price)}</motion.span>
            </div>
            <span className="mt-1.5 text-sm text-[#6B5A40]">{cat.sized ? `${PLOT_SIZES[sizeIndex]} house` : "Fixed price"}</span>
            <ul className="mb-7 mt-[22px] flex flex-1 flex-col gap-3 border-t border-gold/20 pt-[22px]">
              {t.inclusions.map((f) => <li key={f} className="flex gap-3 leading-snug text-ink-soft"><span className="mt-2 size-1.5 flex-none rounded-full bg-gold-line" />{f}</li>)}
            </ul>
            <button
              type="button"
              onClick={() => onSelect(cat, t)}
              className={`flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-gold font-medium text-[#FBF7EF] transition hover:-translate-y-0.5 cursor-pointer ${chosen ? "bg-ink" : "bg-gold"}`}
            >
              {t.actionType === "consultation" ? "Schedule call" : chosen ? <>Selected <Check size={16} /></> : "Select package"}
            </button>
          </motion.article>
        );
      })}
    </div>
  );
}

function SelectionBar({ selection, clear }: { selection: Selection | null; clear: () => void }) {
  const { addToCart, setCartDrawerOpen, showToast } = useStore();

  const checkout = () => {
    if (!selection) return;
    addToCart({
      title: `${selection.categoryTitle} – ${selection.name}`,
      price: selection.price,
      image: "/images/Full House Design Package.png",
      currency: "PKR",
      tier: selection.name,
      ...(selection.plotSize ? { plotSize: selection.plotSize } : {}),
    });
    setCartDrawerOpen(true);
    showToast(`Added "${selection.name}" to your cart!`, "success");
    clear();
  };

  return (
    <AnimatePresence>
      {selection && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="fixed bottom-[clamp(12px,2vw,24px)] left-1/2 z-50 flex w-[min(760px,calc(100%-24px))] -translate-x-1/2 flex-wrap items-center justify-between gap-x-5 gap-y-3 rounded-[18px] bg-ink py-3.5 pl-[22px] pr-3.5 text-cream shadow-[0_20px_50px_-20px_rgba(21,25,30,.6)]"
        >
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-[13px] text-[#D8C29A]">{selection.categoryId} · {selection.categoryTitle}</span>
            <span className="font-medium">{selection.name} · PKR {fmt(selection.price)}</span>
            <span className="text-[13px] text-[#B8B0A2]">50% advance due: PKR {fmt(selection.price / 2)}</span>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={clear} className="min-h-12 rounded-full border border-[#D8C29A]/40 px-4 text-[15px] cursor-pointer">Remove</button>
            <button type="button" onClick={checkout} className="flex min-h-12 items-center rounded-full bg-[#C6A46B] px-[22px] text-[15px] font-semibold text-ink hover:bg-[#D6B67F] cursor-pointer">Continue to checkout</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PackageMenu;
