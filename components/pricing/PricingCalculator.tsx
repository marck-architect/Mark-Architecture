"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Clock } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { disciplines as defaultDisciplines, plotPresets } from "@/data/calculator";
import type { Discipline } from "@/types";

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] as const } },
};

interface PricingCalculatorProps {
  disciplinesList?: Discipline[];
  advancePercentage?: number;
  delivery?: string;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({
  disciplinesList,
  advancePercentage = 50,
  delivery = "2–6 weeks",
}) => {
  const services = disciplinesList && disciplinesList.length > 0 ? disciplinesList : defaultDisciplines;
  const { addToCart, setCartDrawerOpen, showToast } = useStore();

  const [area, setArea] = useState(plotPresets[1]?.sqft ?? 3800);
  const [on, setOn] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    services.slice(0, 2).forEach((s) => (initial[s.id] = true));
    return initial;
  });

  const active = services.filter((s) => on[s.id]);
  const rate = active.reduce((a, s) => a + s.rate, 0);
  const total = rate * area;
  const advance = total * (advancePercentage / 100);

  const handleBook = () => {
    if (total <= 0) return;
    addToCart({
      title: `Full House Design Package (${advancePercentage}% Advance)`,
      price: Math.round(advance),
      image: "/images/Full House Design Package.png",
      currency: "PKR",
      tier: `${rate} PKR/sq.ft. (${active.length} disciplines)`,
      plotSize: `${area.toLocaleString()} sq. ft.`,
    });
    setCartDrawerOpen(true);
    showToast("Added Full House Design Package to your cart!", "success");
  };

  return (
    <div className="mt-[clamp(22px,3vw,36px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start gap-[clamp(16px,2vw,28px)]">
      <div className="flex flex-col gap-3">
        {services.map((s) => (
          <motion.button
            variants={item}
            key={s.id}
            type="button"
            aria-pressed={!!on[s.id]}
            onClick={() => setOn((o) => ({ ...o, [s.id]: !o[s.id] }))}
            className={`flex items-start gap-4 rounded-2xl border bg-[#FFFDF8] px-5 py-[18px] text-left transition-colors cursor-pointer ${on[s.id] ? "border-gold" : "border-gold/25"}`}
          >
            <span className={`mt-0.5 grid size-[22px] flex-none place-items-center rounded-md border-[1.5px] border-gold text-[#FBF7EF] ${on[s.id] ? "bg-gold" : ""}`}>
              <Check size={14} strokeWidth={3} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className="flex flex-wrap justify-between gap-3 text-[17px] font-medium">
                {s.name}
                <span className="whitespace-nowrap font-semibold text-gold-deep">Rs. {s.rate} / sq ft</span>
              </span>
              <span className="text-[15px] leading-normal text-[#4A4236]">{s.description}</span>
            </span>
          </motion.button>
        ))}
      </div>

      <motion.aside variants={item} className="sticky top-6 flex flex-col gap-[18px] rounded-[20px] bg-ink p-[clamp(22px,2.4vw,32px)] text-cream">
        <span className="inline-flex items-center gap-2 self-start rounded-full bg-cream/10 px-3 py-1.5 text-sm">
          <Clock size={15} />
          Delivery: {delivery}
        </span>
        <label className="flex flex-col gap-2.5">
          <span className="text-sm uppercase tracking-[.1em] text-[#D8C29A]">Covered area (sq ft)</span>
          <input
            type="number"
            min={500}
            max={20000}
            step={50}
            value={area}
            onChange={(e) => setArea(Math.max(0, +e.target.value || 0))}
            className="h-14 rounded-xl border border-[#D8C29A]/40 bg-cream/5 px-[18px] text-[22px] outline-none"
          />
          <input
            type="range"
            min={500}
            max={15000}
            step={50}
            value={area}
            onChange={(e) => setArea(+e.target.value)}
            className="accent-[#C6A46B]"
          />
        </label>
        <div className="flex flex-col gap-2 border-t border-[#D8C29A]/25 pt-4">
          {active.map((s) => (
            <div key={s.id} className="flex justify-between gap-3 text-[15px] text-[#D9D2C4]">
              <span>{s.name}</span>
              <span className="whitespace-nowrap">PKR {fmt(s.rate * area)}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1 border-t border-[#D8C29A]/25 pt-4">
          <span className="text-sm text-[#D8C29A]">Estimated total · Rs. {rate} / sq ft</span>
          <span className="font-newsreader text-[clamp(40px,4vw,54px)] leading-tight text-[#E3C48E]">PKR {fmt(total)}</span>
          <span className="text-[15px] text-[#D9D2C4]">{advancePercentage}% advance: PKR {fmt(advance)}</span>
        </div>
        <button
          type="button"
          disabled={total <= 0}
          onClick={handleBook}
          className="min-h-[52px] rounded-full bg-[#C6A46B] font-semibold text-ink hover:bg-[#D6B67F] disabled:opacity-50 cursor-pointer"
        >
          Book Full Package (50% Advance)
        </button>
      </motion.aside>
    </div>
  );
};

export default PricingCalculator;
