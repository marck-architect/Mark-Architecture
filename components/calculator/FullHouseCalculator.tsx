"use client";

import React, { useState } from "react";
import {
  Calculator,
  Check,
  ShieldCheck,
  Sparkles,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { SafepayService } from "@/lib/safepay";

import { disciplines, plotPresets } from "@/data/calculator";

export const FullHouseCalculator: React.FC = () => {
  const [coveredArea, setCoveredArea] = useState<number>(3800);
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([
    "arch",
    "struct",
    "plumb",
    "elec",
    "fire",
  ]);

  const { addToCart, setCartDrawerOpen } = useStore();

  const toggleDiscipline = (id: string) => {
    if (selectedDisciplines.includes(id)) {
      if (selectedDisciplines.length === 1) return; // keep at least 1
      setSelectedDisciplines(selectedDisciplines.filter((item) => item !== id));
    } else {
      setSelectedDisciplines([...selectedDisciplines, id]);
    }
  };

  const ratePerSqFt = disciplines
    .filter((d) => selectedDisciplines.includes(d.id))
    .reduce((acc, d) => acc + d.rate, 0);

  const totalAmount = Math.max(0, Math.round(coveredArea * ratePerSqFt));
  const { advanceAmount, remainingBalance } =
    SafepayService.calculateAdvanceDeposit(totalAmount);

  const handleBookPackage = () => {
    addToCart({
      title: "Full House Design Package (50% Advance)",
      price: advanceAmount,
      image: "/images/Full House Design Package.png",
      currency: "PKR",
      tier: `${ratePerSqFt} PKR/sq.ft. (${selectedDisciplines.length} disciplines)`,
      plotSize: `${coveredArea.toLocaleString()} sq. ft.`,
    });
    setCartDrawerOpen(true);
  };

  return (
    <div className="bg-surface dark:bg-zinc-900 border border-outline-variant/30 rounded-3xl p-4 sm:p-6 md:p-10 shadow-xl space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/20 pb-6">
        <div>
          <div className="flex items-center gap-2 text-tertiary mb-1">
            <Calculator className="w-5 h-5" />
            <span className="font-inter text-xs font-bold uppercase tracking-widest">
              Live Architectural Quote Calculator
            </span>
          </div>
          <h3 className="font-playfair text-xl sm:text-2xl md:text-3xl font-bold text-on-surface dark:text-zinc-100">
            Full House Design Package
          </h3>
          <p className="font-inter text-xs md:text-sm text-on-surface-variant dark:text-zinc-400 font-light mt-1">
            Dynamic per-square-foot calculation across engineering disciplines
            with 50% advance terms.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-tertiary/10 text-tertiary px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold shrink-0 self-start md:self-auto">
          <Clock className="w-4 h-4" />
          <span>Timeline: 2–6 Weeks</span>
        </div>
      </div>

      {/* Preset Buttons & Area Input */}
      <div className="space-y-4">
        <label className="font-inter text-xs font-bold text-on-surface dark:text-zinc-300 uppercase tracking-wider block">
          Step 1: Enter Covered Area (Sq. Ft.) or Choose a Standard Preset
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {plotPresets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setCoveredArea(preset.sqft)}
              className={`p-3 sm:p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                coveredArea === preset.sqft
                  ? "border-tertiary bg-tertiary/10 text-tertiary font-bold shadow-sm"
                  : "border-outline-variant/40 bg-surface-container-low dark:bg-zinc-800/40 text-on-surface dark:text-zinc-300 hover:border-tertiary/60"
              }`}
            >
              <div className="font-semibold text-xs">{preset.label}</div>
              <div className="text-[11px] opacity-75 font-light">
                {preset.desc}
              </div>
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <div className="relative max-w-sm pt-2">
          <input
            type="number"
            min={500}
            max={50000}
            step={50}
            value={coveredArea || ""}
            onChange={(e) => setCoveredArea(Number(e.target.value) || 0)}
            className="w-full bg-white dark:bg-zinc-950 border border-outline-variant/50 rounded-xl px-4 py-3 text-sm font-semibold text-on-surface dark:text-white focus:outline-none focus:border-tertiary transition-colors"
            placeholder="e.g. 4500"
          />
          <span className="absolute right-4 top-5 text-xs text-on-surface-variant font-inter">
            SQ. FT.
          </span>
        </div>
      </div>

      {/* Disciplines Selection */}
      <div className="space-y-4 pt-2">
        <label className="font-inter text-xs font-bold text-on-surface dark:text-zinc-300 uppercase tracking-wider block">
          Step 2: Included Engineering &amp; Architectural Disciplines
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {disciplines.map((d) => {
            const isSelected = selectedDisciplines.includes(d.id);
            return (
              <div
                key={d.id}
                onClick={() => toggleDiscipline(d.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? "border-tertiary/60 bg-tertiary/5 dark:bg-tertiary/10"
                    : "border-outline-variant/30 bg-surface-container-low dark:bg-zinc-800/20 opacity-60 hover:opacity-100"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isSelected
                      ? "bg-tertiary text-white"
                      : "border border-outline-variant"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-xs font-bold text-on-surface dark:text-zinc-200">
                      {d.name}
                    </span>
                    <span className="font-montserrat text-xs font-bold text-tertiary">
                      PKR {d.rate}/sqft
                    </span>
                  </div>
                  <p className="font-inter text-[11px] text-on-surface-variant dark:text-zinc-400 font-light mt-0.5 leading-relaxed">
                    {d.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Quote Breakdown & 50% Advance Display */}
      <div className="bg-surface-container-low dark:bg-zinc-950 p-4 sm:p-6 md:p-8 rounded-2xl border border-outline-variant/30 space-y-5 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-b border-outline-variant/20 pb-6 text-center sm:text-left">
          <div>
            <span className="text-[11px] font-inter font-bold text-on-surface-variant uppercase tracking-wider block">
              Cumulative Rate
            </span>
            <span className="font-montserrat text-lg sm:text-xl font-bold text-on-surface dark:text-zinc-200">
              PKR {ratePerSqFt}{" "}
              <span className="text-xs font-normal">/ sq. ft.</span>
            </span>
          </div>

          <div>
            <span className="text-[11px] font-inter font-bold text-on-surface-variant uppercase tracking-wider block">
              Full Package Value
            </span>
            <span className="font-montserrat text-lg sm:text-xl font-bold text-on-surface dark:text-zinc-200">
              {SafepayService.formatPKR(totalAmount)}
            </span>
          </div>

          <div className="bg-tertiary/10 p-3 rounded-xl border border-tertiary/30">
            <span className="text-[11px] font-inter font-bold text-tertiary uppercase tracking-wider block">
              50% Advance Required to Start
            </span>
            <span className="font-montserrat text-xl sm:text-2xl font-extrabold text-tertiary">
              {SafepayService.formatPKR(advanceAmount)}
            </span>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block mt-0.5">
              Balance ({SafepayService.formatPKR(remainingBalance)}) on final
              delivery
            </span>
          </div>
        </div>

        {/* Disclaimer & Policy Notice */}
        <div className="flex items-start gap-2.5 text-[11px] text-zinc-500 dark:text-zinc-400 bg-surface dark:bg-zinc-900 p-3 sm:p-3.5 rounded-xl border border-outline-variant/20">
          <AlertCircle className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Terms &amp; Liability Note:</strong> Work commences strictly
            upon receipt of 50% advance via Safepay. Estimated quote is based on
            standard covered area rates; final scope and structural complexities
            are verified before contract execution. Extra revisions beyond tier
            limits are billed separately.
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Safepay Escrow Protection • 100% Licensed Architects</span>
          </div>

          <button
            type="button"
            onClick={handleBookPackage}
            className="w-full sm:w-auto bg-primary hover:bg-tertiary text-on-primary px-5 sm:px-8 py-3.5 sm:py-4 rounded-xl font-inter font-bold text-[11px] sm:text-xs tracking-wider sm:tracking-widest uppercase transition-all duration-300 shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-2 min-h-[48px]"
          >
            <span>BOOK FULL PACKAGE (50% ADVANCE)</span>
            <Sparkles className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
