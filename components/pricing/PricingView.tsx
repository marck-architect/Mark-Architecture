"use client";

import React from "react";
import { PricingHero } from "@/components/pricing/PricingHero";
import { PaymentPolicy } from "@/components/pricing/PaymentPolicy";
import { PackageMenu } from "@/components/pricing/PackageMenu";
import { pricingMenuCategories, paymentPolicyPoints } from "@/data/pricing";
import { disciplines, plotPresets } from "@/data/calculator";
import type { PricingSettingsContent } from "@/types";

interface PricingViewProps {
  initialPricing?: PricingSettingsContent;
}

export const PricingView: React.FC<PricingViewProps> = ({ initialPricing }) => {
  const categories = initialPricing?.menuCategories || pricingMenuCategories;
  const policyPoints = initialPricing?.policyPoints || paymentPolicyPoints;
  const calculatorSettings = {
    disciplines: initialPricing?.calculator?.disciplines || disciplines,
    advancePercentage: initialPricing?.calculator?.advancePercentage ?? 50,
    plotPresets: initialPricing?.calculator?.plotPresets || plotPresets,
  };

  return (
    <div className="relative overflow-x-hidden min-h-screen bg-surface dark:bg-zinc-950 font-inter">
      <PricingHero />
      <PaymentPolicy policyPoints={policyPoints} />
      <PackageMenu categories={categories} calculatorSettings={calculatorSettings} />
    </div>
  );
};

export default PricingView;
