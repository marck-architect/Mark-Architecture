"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Banknote,
  Calculator,
  Video,
  Layers,
  ShieldCheck,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Edit3,
  Sliders,
  DollarSign,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import type {
  PricingSettingsContent,
  Discipline,
  PricingCategoryData,
  PricingTierData,
  PricingPolicyPoint,
} from "@/types";
import { defaultPricingSettings } from "@/data/pricing";

export const PricingManager: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    "turnkey" | "consultation" | "packages" | "policies"
  >("turnkey");

  const [pricingData, setPricingData] = useState<PricingSettingsContent>(
    defaultPricingSettings,
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Live sandbox tester state
  const [testSqFt, setTestSqFt] = useState<number | "">(3800);
  const [selectedDisciplineIds, setSelectedDisciplineIds] = useState<string[]>(
    [],
  );

  // Load current pricing from server API
  const fetchPricing = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pricing");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const raw = json.data;
          const merged: PricingSettingsContent = {
            ...defaultPricingSettings,
            ...raw,
            calculator: {
              ...defaultPricingSettings.calculator,
              ...(raw.calculator || {}),
              disciplines:
                Array.isArray(raw.calculator?.disciplines) &&
                raw.calculator.disciplines.length > 0
                  ? raw.calculator.disciplines
                  : defaultPricingSettings.calculator.disciplines,
              plotPresets:
                Array.isArray(raw.calculator?.plotPresets) &&
                raw.calculator.plotPresets.length > 0
                  ? raw.calculator.plotPresets
                  : defaultPricingSettings.calculator.plotPresets,
            },
            consultationCalls: {
              ...defaultPricingSettings.consultationCalls,
              ...(raw.consultationCalls || {}),
            },
            menuCategories:
              Array.isArray(raw.menuCategories) && raw.menuCategories.length > 0
                ? raw.menuCategories
                : defaultPricingSettings.menuCategories,
            policyPoints:
              Array.isArray(raw.policyPoints) && raw.policyPoints.length > 0
                ? raw.policyPoints
                : defaultPricingSettings.policyPoints,
          };
          setPricingData(merged);
          // Initialize sandbox disciplines
          if (merged.calculator?.disciplines) {
            setSelectedDisciplineIds(
              merged.calculator.disciplines.map((d: Discipline) => d.id),
            );
          }
        }
      }
    } catch (err) {
      console.warn("Notice: Fetching pricing fallback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Save all modifications to Supabase
  const handleSaveAll = async () => {
    setSaving(true);
    const normalizedData: PricingSettingsContent = {
      ...pricingData,
      calculator: {
        ...pricingData.calculator,
        advancePercentage:
          Number(pricingData.calculator?.advancePercentage) || 50,
        disciplines: (pricingData.calculator?.disciplines || []).map((d) => ({
          ...d,
          rate: Number(d.rate) || 0,
        })),
      },
      consultationCalls: {
        basicCallPrice:
          Number(pricingData.consultationCalls?.basicCallPrice) || 3000,
        premiumCallPrice:
          Number(pricingData.consultationCalls?.premiumCallPrice) || 5000,
        basicCallDuration:
          Number(pricingData.consultationCalls?.basicCallDuration) || 30,
        premiumCallDuration:
          Number(pricingData.consultationCalls?.premiumCallDuration) || 60,
      },
    };
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pricing: normalizedData }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast(
          json.message || "Studio pricing & formula updated successfully!",
          "success",
        );
        setPricingData(json.data);
      } else {
        showToast(json.error || "Failed to update pricing.", "error");
      }
    } catch (err) {
      showToast("Network error while saving pricing configuration.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Reset to default studio rates
  const handleResetDefaults = () => {
    if (
      window.confirm(
        "Are you sure you want to revert all rates and packages to studio defaults? Unsaved changes will be discarded.",
      )
    ) {
      setPricingData(defaultPricingSettings);
      setSelectedDisciplineIds(
        defaultPricingSettings.calculator.disciplines.map((d) => d.id),
      );
      showToast(
        "Reverted to studio default rates. Click 'Save All Changes' to persist.",
        "success",
      );
    }
  };

  // Turnkey Rate Calculations
  const totalTurnkeyRate = useMemo(() => {
    if (!pricingData.calculator?.disciplines) return 0;
    return pricingData.calculator.disciplines.reduce(
      (sum, d) => sum + (Number(d.rate) || 0),
      0,
    );
  }, [pricingData.calculator]);

  // Sandbox calculations
  const sandboxRate = useMemo(() => {
    if (!pricingData.calculator?.disciplines) return 0;
    return pricingData.calculator.disciplines
      .filter((d) => selectedDisciplineIds.includes(d.id))
      .reduce((sum, d) => sum + (Number(d.rate) || 0), 0);
  }, [pricingData.calculator, selectedDisciplineIds]);

  const sandboxTotal = Math.round((Number(testSqFt) || 0) * sandboxRate);
  const sandboxAdvance = Math.round(
    sandboxTotal * ((pricingData.calculator?.advancePercentage || 50) / 100),
  );
  const sandboxRemaining = sandboxTotal - sandboxAdvance;

  // Discipline modifications
  const handleDisciplineChange = (
    index: number,
    field: keyof Discipline,
    value: any,
  ) => {
    setPricingData((prev) => {
      const currentDisciplines = Array.isArray(prev.calculator?.disciplines)
        ? prev.calculator.disciplines
        : defaultPricingSettings.calculator.disciplines;
      const nextDisciplines = [...currentDisciplines];
      const parsedVal =
        field === "rate"
          ? value === ""
            ? ""
            : typeof value === "number"
              ? value
              : parseFloat(value) || 0
          : value;
      nextDisciplines[index] = {
        ...nextDisciplines[index],
        [field]: parsedVal,
      };
      return {
        ...prev,
        calculator: {
          ...(prev.calculator || defaultPricingSettings.calculator),
          disciplines: nextDisciplines as any,
        },
      };
    });
  };

  const handleAddDiscipline = () => {
    const newId = `disc_${Date.now()}`;
    const newDiscipline: Discipline = {
      id: newId,
      name: "New Architectural Discipline",
      rate: 5.0,
      description:
        "Comprehensive drawings, drafting specifications, and municipal compliance details.",
    };
    setPricingData((prev) => {
      const currentDisciplines = Array.isArray(prev.calculator?.disciplines)
        ? prev.calculator.disciplines
        : defaultPricingSettings.calculator.disciplines;
      return {
        ...prev,
        calculator: {
          ...(prev.calculator || defaultPricingSettings.calculator),
          disciplines: [...currentDisciplines, newDiscipline],
        },
      };
    });
    setSelectedDisciplineIds((prev) => [...prev, newId]);
  };

  const handleDeleteDiscipline = (index: number) => {
    const disciplines = pricingData.calculator?.disciplines || [];
    const d = disciplines[index];
    if (disciplines.length <= 1) {
      alert("At least one engineering discipline is required in the formula.");
      return;
    }
    setPricingData((prev) => {
      const currentDisciplines = Array.isArray(prev.calculator?.disciplines)
        ? prev.calculator.disciplines
        : defaultPricingSettings.calculator.disciplines;
      return {
        ...prev,
        calculator: {
          ...(prev.calculator || defaultPricingSettings.calculator),
          disciplines: currentDisciplines.filter((_, i) => i !== index),
        },
      };
    });
    if (d?.id) {
      setSelectedDisciplineIds((prev) => prev.filter((id) => id !== d.id));
    }
  };

  // Consultation modifications
  const handleConsultationChange = (
    field: keyof typeof pricingData.consultationCalls,
    value: any,
  ) => {
    const rawVal =
      value === "" ? "" : typeof value === "number" ? value : parseFloat(value);
    const numericVal =
      typeof rawVal === "number" && !isNaN(rawVal)
        ? rawVal
        : rawVal === ""
          ? ""
          : 0;

    setPricingData((prev) => {
      const nextConsultation = {
        ...(prev.consultationCalls || defaultPricingSettings.consultationCalls),
        [field]: numericVal,
      };

      // Two-way sync to Category A ("consultation") in menuCategories
      const currentCategories =
        Array.isArray(prev.menuCategories) && prev.menuCategories.length > 0
          ? prev.menuCategories
          : defaultPricingSettings.menuCategories;
      const nextCategories = [...currentCategories];
      const consultCatIdx = nextCategories.findIndex(
        (c) => c.id === "consultation" || c.letter === "A",
      );

      if (consultCatIdx !== -1) {
        const consultCat = { ...nextCategories[consultCatIdx] };
        const nextTiers = Array.isArray(consultCat.tiers)
          ? [...consultCat.tiers]
          : [];

        if (field === "basicCallPrice" || field === "basicCallDuration") {
          const bIdx = nextTiers.findIndex(
            (t) =>
              t.id === "consult-basic" ||
              t.name.toLowerCase().includes("basic"),
          );
          if (bIdx !== -1) {
            const price =
              field === "basicCallPrice"
                ? typeof numericVal === "number"
                  ? numericVal
                  : 0
                : Number(nextConsultation.basicCallPrice) || 0;
            const duration =
              field === "basicCallDuration"
                ? typeof numericVal === "number"
                  ? numericVal
                  : 30
                : Number(nextConsultation.basicCallDuration) || 30;
            nextTiers[bIdx] = {
              ...nextTiers[bIdx],
              pricePKR: price,
              priceFormatted: `PKR ${price.toLocaleString()}`,
              deliveryTime: `Scheduled (${duration} mins)`,
            };
          }
        }

        if (field === "premiumCallPrice" || field === "premiumCallDuration") {
          const pIdx = nextTiers.findIndex(
            (t) =>
              t.id === "consult-premium" ||
              t.name.toLowerCase().includes("premium"),
          );
          if (pIdx !== -1) {
            const price =
              field === "premiumCallPrice"
                ? typeof numericVal === "number"
                  ? numericVal
                  : 0
                : Number(nextConsultation.premiumCallPrice) || 0;
            const duration =
              field === "premiumCallDuration"
                ? typeof numericVal === "number"
                  ? numericVal
                  : 60
                : Number(nextConsultation.premiumCallDuration) || 60;
            nextTiers[pIdx] = {
              ...nextTiers[pIdx],
              pricePKR: price,
              priceFormatted: `PKR ${price.toLocaleString()}`,
              deliveryTime: `Scheduled (${duration} mins)`,
            };
          }
        }

        consultCat.tiers = nextTiers;
        nextCategories[consultCatIdx] = consultCat;
      }

      return {
        ...prev,
        consultationCalls: nextConsultation as any,
        menuCategories: nextCategories,
      };
    });
  };

  // Package Tier modifications
  const handleCategoryFieldChange = (
    catIdx: number,
    field: keyof PricingCategoryData,
    value: any,
  ) => {
    setPricingData((prev) => {
      const currentCategories =
        Array.isArray(prev.menuCategories) && prev.menuCategories.length > 0
          ? prev.menuCategories
          : defaultPricingSettings.menuCategories;
      const nextCats = [...currentCategories];
      if (nextCats[catIdx]) {
        nextCats[catIdx] = { ...nextCats[catIdx], [field]: value };
      }
      return { ...prev, menuCategories: nextCats };
    });
  };

  const handleTierFieldChange = (
    catIdx: number,
    tierIdx: number,
    field: keyof PricingTierData,
    value: any,
  ) => {
    setPricingData((prev) => {
      const currentCategories =
        Array.isArray(prev.menuCategories) && prev.menuCategories.length > 0
          ? prev.menuCategories
          : defaultPricingSettings.menuCategories;
      const nextCats = [...currentCategories];
      if (!nextCats[catIdx]) return prev;
      const nextTiers = Array.isArray(nextCats[catIdx].tiers)
        ? [...nextCats[catIdx].tiers]
        : [];
      if (!nextTiers[tierIdx]) return prev;

      const currentTier = { ...nextTiers[tierIdx], [field]: value };

      if (field === "pricePKR") {
        const numeric =
          typeof value === "string"
            ? parseFloat(value.replace(/[^0-9.]/g, ""))
            : value;
        if (!isNaN(numeric) && numeric > 0) {
          currentTier.pricePKR = numeric;
          currentTier.priceFormatted = `PKR ${numeric.toLocaleString()}`;
        }
      } else if (field === "priceFormatted") {
        currentTier.priceFormatted = value;
        const numeric = parseFloat(String(value).replace(/[^0-9.]/g, ""));
        if (!isNaN(numeric) && numeric > 0) {
          currentTier.pricePKR = numeric;
        }
      }

      nextTiers[tierIdx] = currentTier;
      nextCats[catIdx] = { ...nextCats[catIdx], tiers: nextTiers };
      return { ...prev, menuCategories: nextCats };
    });
  };

  const handleAddTierInclusion = (catIdx: number, tierIdx: number) => {
    const item = prompt("Enter new deliverable / inclusion for this tier:");
    if (!item?.trim()) return;
    setPricingData((prev) => {
      const currentCategories =
        Array.isArray(prev.menuCategories) && prev.menuCategories.length > 0
          ? prev.menuCategories
          : defaultPricingSettings.menuCategories;
      const nextCats = [...currentCategories];
      if (!nextCats[catIdx]) return prev;
      const nextTiers = Array.isArray(nextCats[catIdx].tiers)
        ? [...nextCats[catIdx].tiers]
        : [];
      if (!nextTiers[tierIdx]) return prev;

      const currentInclusions = Array.isArray(nextTiers[tierIdx].inclusions)
        ? nextTiers[tierIdx].inclusions
        : [];
      nextTiers[tierIdx] = {
        ...nextTiers[tierIdx],
        inclusions: [...currentInclusions, item.trim()],
      };
      nextCats[catIdx] = { ...nextCats[catIdx], tiers: nextTiers };
      return { ...prev, menuCategories: nextCats };
    });
  };

  const handleRemoveTierInclusion = (
    catIdx: number,
    tierIdx: number,
    incIdx: number,
  ) => {
    setPricingData((prev) => {
      const currentCategories =
        Array.isArray(prev.menuCategories) && prev.menuCategories.length > 0
          ? prev.menuCategories
          : defaultPricingSettings.menuCategories;
      const nextCats = [...currentCategories];
      if (!nextCats[catIdx]?.tiers?.[tierIdx]?.inclusions) return prev;
      const nextTiers = [...nextCats[catIdx].tiers];
      nextTiers[tierIdx] = {
        ...nextTiers[tierIdx],
        inclusions: nextTiers[tierIdx].inclusions.filter(
          (_, i) => i !== incIdx,
        ),
      };
      nextCats[catIdx] = { ...nextCats[catIdx], tiers: nextTiers };
      return { ...prev, menuCategories: nextCats };
    });
  };

  const handleAddTier = (catIdx: number) => {
    const newTier: PricingTierData = {
      id: `tier_${Date.now()}`,
      name: "New Architectural Tier",
      pricePKR: 15000,
      priceFormatted: "PKR 15,000",
      deliveryTime: "3–5 Working Days",
      popular: false,
      tag: "Special Service",
      inclusions: [
        "Architectural drawings package",
        "Detailed annotations & measurements",
        "Direct PDF download & review cycle",
      ],
      notes: "Custom design package deliverables.",
      actionType: "cart",
    };

    setPricingData((prev) => {
      const currentCategories =
        Array.isArray(prev.menuCategories) && prev.menuCategories.length > 0
          ? prev.menuCategories
          : defaultPricingSettings.menuCategories;
      const nextCats = [...currentCategories];
      if (!nextCats[catIdx]) return prev;
      const currentTiers = Array.isArray(nextCats[catIdx].tiers)
        ? nextCats[catIdx].tiers
        : [];
      nextCats[catIdx] = {
        ...nextCats[catIdx],
        tiers: [...currentTiers, newTier],
      };
      return { ...prev, menuCategories: nextCats };
    });
  };

  const handleDeleteTier = (catIdx: number, tierIdx: number) => {
    if (!confirm("Are you sure you want to remove this package tier?")) return;
    setPricingData((prev) => {
      const currentCategories =
        Array.isArray(prev.menuCategories) && prev.menuCategories.length > 0
          ? prev.menuCategories
          : defaultPricingSettings.menuCategories;
      const nextCats = [...currentCategories];
      if (!nextCats[catIdx]?.tiers) return prev;
      nextCats[catIdx] = {
        ...nextCats[catIdx],
        tiers: nextCats[catIdx].tiers.filter((_, i) => i !== tierIdx),
      };
      return { ...prev, menuCategories: nextCats };
    });
  };

  // Policy point modifications
  const handlePolicyChange = (
    index: number,
    field: keyof PricingPolicyPoint,
    value: string,
  ) => {
    setPricingData((prev) => {
      const currentPolicies =
        Array.isArray(prev.policyPoints) && prev.policyPoints.length > 0
          ? prev.policyPoints
          : defaultPricingSettings.policyPoints;
      const nextPolicies = [...currentPolicies];
      if (nextPolicies[index]) {
        nextPolicies[index] = { ...nextPolicies[index], [field]: value };
      }
      return { ...prev, policyPoints: nextPolicies };
    });
  };

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${
            toastMessage.type === "success"
              ? "bg-stone-900 text-stone-100 border-amber-500/40"
              : "bg-red-950 text-red-100 border-red-500/40"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 text-stone-100 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Banknote className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold tracking-widest text-amber-400 uppercase font-mono">
                Studio Commercial Systems
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-playfair font-bold tracking-tight text-stone-100">
              Pricing & Rate Formulation
            </h1>
            <p className="text-sm text-stone-400 max-w-2xl font-light">
              Control the per-square-foot turnkey architectural calculator
              formula, 1-on-1 consultation session fees, and public catalog
              tiers on the /pricing portal.
            </p>
          </div>

          {/* Master Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleResetDefaults}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-700 bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-stone-100 text-xs sm:text-sm font-medium transition-all"
              title="Revert to official studio defaults"
            >
              <RotateCcw className="w-4 h-4 text-stone-400" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save All Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-stone-800/80 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveSubTab("turnkey")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
              activeSubTab === "turnkey"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Turnkey Formula & Calculator</span>
            <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-stone-800 text-amber-400 font-mono">
              PKR {totalTurnkeyRate.toFixed(1)}/sqft
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab("consultation")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
              activeSubTab === "consultation"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Consultation Call Rates</span>
          </button>

          <button
            onClick={() => setActiveSubTab("packages")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
              activeSubTab === "packages"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>
              Package Catalog ({pricingData.menuCategories?.length || 7})
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab("policies")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 ${
              activeSubTab === "policies"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Commercial Terms & Policies</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: TURNKEY FORMULA & CALCULATOR */}
      {activeSubTab === "turnkey" && (
        <div className="space-y-6">
          {/* Formula KPI Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                Total Formula Rate
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-playfair font-bold text-stone-900 dark:text-stone-100">
                  PKR {totalTurnkeyRate.toFixed(2)}
                </span>
                <span className="text-xs text-stone-500 font-mono">
                  / sq. ft.
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 font-light">
                Sum of all {pricingData.calculator?.disciplines?.length || 5}{" "}
                active discipline rates
              </p>
            </div>

            <div className="bg-surface dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                Advance Deposit Required
              </span>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  min={10}
                  max={100}
                  value={pricingData.calculator?.advancePercentage ?? ""}
                  onChange={(e) =>
                    setPricingData((prev) => ({
                      ...prev,
                      calculator: {
                        ...prev.calculator,
                        advancePercentage:
                          e.target.value === ""
                            ? ("" as any)
                            : parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                  placeholder="50"
                  className="w-20 px-3 py-1 text-2xl font-bold font-playfair bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                />
                <span className="text-xl font-bold text-stone-500">%</span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 font-light">
                Upfront commitment before drafting starts
              </p>
            </div>

            <div className="bg-surface dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                Standard 10 Marla (3,800 sqft)
              </span>
              <div className="mt-2">
                <span className="text-2xl font-playfair font-bold text-stone-900 dark:text-stone-100">
                  PKR {Math.round(3800 * totalTurnkeyRate).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 font-mono">
                Advance: PKR{" "}
                {Math.round(
                  3800 *
                    totalTurnkeyRate *
                    ((pricingData.calculator?.advancePercentage || 50) / 100),
                ).toLocaleString()}
              </p>
            </div>

            <div className="bg-surface dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs">
              <span className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                Standard 1 Kanal (6,000 sqft)
              </span>
              <div className="mt-2">
                <span className="text-2xl font-playfair font-bold text-stone-900 dark:text-stone-100">
                  PKR {Math.round(6000 * totalTurnkeyRate).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 font-mono">
                Advance: PKR{" "}
                {Math.round(
                  6000 *
                    totalTurnkeyRate *
                    ((pricingData.calculator?.advancePercentage || 50) / 100),
                ).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Discipline Rate Editor */}
          <div className="bg-surface dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-playfair">
                  Engineering Disciplines & Rate Schedule
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Rates are specified in PKR per covered square foot. The client
                  calculator accumulates selected disciplines.
                </p>
              </div>

              <button
                onClick={handleAddDiscipline}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-medium transition-all"
              >
                <Plus className="w-4 h-4 text-amber-500" />
                <span>Add Discipline</span>
              </button>
            </div>

            <div className="divide-y divide-stone-200 dark:divide-stone-800">
              {pricingData.calculator?.disciplines?.map((d, index) => (
                <div
                  key={d.id}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-start justify-between gap-4"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-500 uppercase">
                        {d.id}
                      </span>
                      <input
                        type="text"
                        value={d.name}
                        onChange={(e) =>
                          handleDisciplineChange(index, "name", e.target.value)
                        }
                        placeholder="Discipline Name"
                        className="flex-1 font-semibold text-stone-900 dark:text-stone-100 bg-transparent border-b border-dashed border-stone-300 dark:border-stone-700 hover:border-amber-500 focus:border-amber-500 focus:outline-hidden text-sm py-1"
                      />
                    </div>

                    <textarea
                      rows={2}
                      value={d.description}
                      onChange={(e) =>
                        handleDisciplineChange(
                          index,
                          "description",
                          e.target.value,
                        )
                      }
                      placeholder="Discipline scope, deliverables, and municipal submission details..."
                      className="w-full text-xs text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-lg p-2.5 focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>

                  {/* Rate Input & Actions */}
                  <div className="flex items-center gap-4 shrink-0 self-end md:self-start md:mt-1">
                    <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700">
                      <span className="text-xs font-mono text-stone-500">
                        PKR
                      </span>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={d.rate ?? ""}
                        onChange={(e) =>
                          handleDisciplineChange(index, "rate", e.target.value)
                        }
                        placeholder="0"
                        className="w-20 font-bold font-mono text-right text-stone-900 dark:text-stone-100 bg-transparent focus:outline-hidden"
                      />
                      <span className="text-xs font-mono text-stone-500">
                        /sq.ft.
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteDiscipline(index)}
                      className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                      title="Delete discipline"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Quote Sandbox Tester */}
          <div className="bg-stone-950 border border-amber-500/20 rounded-2xl p-6 text-stone-100 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div className="flex items-center gap-2.5">
                <Sliders className="w-5 h-5 text-amber-400" />
                <h3 className="font-playfair font-bold text-lg text-stone-100">
                  Live Calculator Formula Sandbox
                </h3>
              </div>
              <span className="text-xs font-mono text-amber-400/80 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                Interactive Validation
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Controls */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-2">
                    Covered Area (Sq. Ft.)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={testSqFt}
                      onChange={(e) =>
                        setTestSqFt(
                          e.target.value === ""
                            ? ""
                            : parseInt(e.target.value) || 0,
                        )
                      }
                      placeholder="3800"
                      className="w-40 px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl font-mono text-stone-100 focus:border-amber-500 focus:outline-hidden"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setTestSqFt(2250)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${testSqFt === 2250 ? "bg-amber-500 text-stone-950 font-bold" : "bg-stone-800 text-stone-300"}`}
                      >
                        5 Marla (2,250)
                      </button>
                      <button
                        onClick={() => setTestSqFt(3800)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${testSqFt === 3800 ? "bg-amber-500 text-stone-950 font-bold" : "bg-stone-800 text-stone-300"}`}
                      >
                        10 Marla (3,800)
                      </button>
                      <button
                        onClick={() => setTestSqFt(6000)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors ${testSqFt === 6000 ? "bg-amber-500 text-stone-950 font-bold" : "bg-stone-800 text-stone-300"}`}
                      >
                        1 Kanal (6,000)
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-2">
                    Included Disciplines ({selectedDisciplineIds.length})
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {pricingData.calculator?.disciplines?.map((d) => {
                      const isChecked = selectedDisciplineIds.includes(d.id);
                      return (
                        <label
                          key={d.id}
                          onClick={() => {
                            if (isChecked) {
                              if (selectedDisciplineIds.length > 1) {
                                setSelectedDisciplineIds(
                                  selectedDisciplineIds.filter(
                                    (id) => id !== d.id,
                                  ),
                                );
                              }
                            } else {
                              setSelectedDisciplineIds([
                                ...selectedDisciplineIds,
                                d.id,
                              ]);
                            }
                          }}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                            isChecked
                              ? "bg-amber-500/10 border-amber-500/40 text-amber-200"
                              : "bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="accent-amber-500"
                            />
                            <span className="truncate">{d.name}</span>
                          </div>
                          <span className="font-mono text-stone-400 shrink-0">
                            +{d.rate}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sandbox Output Preview */}
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs text-stone-400 border-b border-stone-800 pb-3">
                    <span>Effective Rate</span>
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      PKR {sandboxRate.toFixed(2)} / sq.ft.
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-stone-400 border-b border-stone-800 pb-3">
                    <span>Estimated Total Project Blueprints</span>
                    <span className="font-mono font-bold text-stone-100 text-base">
                      PKR {sandboxTotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-stone-400 border-b border-stone-800 pb-3">
                    <span>
                      Required Upfront Deposit (
                      {pricingData.calculator?.advancePercentage || 50}%)
                    </span>
                    <span className="font-mono font-bold text-amber-400 text-lg">
                      PKR {sandboxAdvance.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-stone-400">
                    <span>Milestone Balance Upon Completion</span>
                    <span className="font-mono text-stone-300">
                      PKR {sandboxRemaining.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-800/80 text-[11px] text-stone-500 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    Matches the exact live Safepay checkout calculation used on
                    /services.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CONSULTATION CALL RATES */}
      {activeSubTab === "consultation" && (
        <div className="space-y-6">
          <div className="bg-surface dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-4 mb-6">
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-playfair">
                1-on-1 Strategy Call Fees & Timing
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                These fees determine the pricing charged when clients book
                30-minute or 60-minute Zoom sessions on /consultation and
                /pricing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Call */}
              <div className="border border-stone-200 dark:border-stone-800 rounded-2xl p-6 bg-stone-50/50 dark:bg-stone-950/40 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-md bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold">
                    Basic Consultation
                  </span>
                  <span className="text-xs text-stone-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    30 Mins
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                    Price (PKR)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-stone-400">
                      PKR
                    </span>
                    <input
                      type="number"
                      step="500"
                      value={
                        pricingData.consultationCalls?.basicCallPrice ?? ""
                      }
                      onChange={(e) =>
                        handleConsultationChange(
                          "basicCallPrice",
                          e.target.value,
                        )
                      }
                      placeholder="3000"
                      className="w-full text-2xl font-bold font-playfair bg-surface dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-1.5 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    step="5"
                    value={
                      pricingData.consultationCalls?.basicCallDuration ?? ""
                    }
                    onChange={(e) =>
                      handleConsultationChange(
                        "basicCallDuration",
                        e.target.value,
                      )
                    }
                    placeholder="30"
                    className="w-full text-sm font-mono bg-surface dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div className="pt-3 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-500 space-y-1 font-light">
                  <p>• 1-on-1 Zoom video session</p>
                  <p>• Layout review & spatial problem-solving</p>
                  <p>• Direct answers to design dilemmas</p>
                </div>
              </div>

              {/* Premium Call */}
              <div className="border-2 border-amber-500/40 rounded-2xl p-6 bg-amber-500/5 dark:bg-stone-950/60 space-y-5 relative">
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded-full bg-amber-500 text-stone-950">
                    Most Popular
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-500 dark:text-amber-400 font-semibold">
                    Premium Consultation
                  </span>
                  <span className="text-xs text-stone-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    60 Mins
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                    Price (PKR)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-stone-400">
                      PKR
                    </span>
                    <input
                      type="number"
                      step="500"
                      value={
                        pricingData.consultationCalls?.premiumCallPrice ?? ""
                      }
                      onChange={(e) =>
                        handleConsultationChange(
                          "premiumCallPrice",
                          e.target.value,
                        )
                      }
                      placeholder="5000"
                      className="w-full text-2xl font-bold font-playfair bg-surface dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-1.5 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    step="5"
                    value={
                      pricingData.consultationCalls?.premiumCallDuration ?? ""
                    }
                    onChange={(e) =>
                      handleConsultationChange(
                        "premiumCallDuration",
                        e.target.value,
                      )
                    }
                    placeholder="60"
                    className="w-full text-sm font-mono bg-surface dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div className="pt-3 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-500 space-y-1 font-light">
                  <p>• 60 mins deep-dive architectural session</p>
                  <p>• Proper spatial planning & room flow audit</p>
                  <p>• Material selection, finish & budget guidance</p>
                  <p>• Annotated screenshot debrief after call</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PACKAGE CATALOG */}
      {activeSubTab === "packages" && (
        <div className="space-y-8">
          <div className="flex items-center justify-between bg-surface dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5">
            <div>
              <h3 className="font-playfair font-bold text-lg text-stone-900 dark:text-stone-100">
                Architectural Packages (
                {pricingData.menuCategories?.length || 0} Categories)
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                All fixed-deliverable services and tiers displayed on the
                /pricing page.
              </p>
            </div>
            <span className="text-xs font-mono text-stone-500">
              Synced with Safepay checkout
            </span>
          </div>

          {/* Categories Loop */}
          {pricingData.menuCategories?.map((category, catIdx) => (
            <div
              key={category.id}
              className="bg-surface dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-6"
            >
              {/* Category Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 font-bold font-mono text-sm flex items-center justify-center border border-amber-500/20">
                    {category.letter}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={category.title}
                      onChange={(e) =>
                        handleCategoryFieldChange(
                          catIdx,
                          "title",
                          e.target.value,
                        )
                      }
                      placeholder="Category Title"
                      className="font-playfair font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100 bg-transparent border-b border-dashed border-stone-300 dark:border-stone-700 hover:border-amber-500 focus:border-amber-500 focus:outline-hidden py-0.5"
                    />
                    <input
                      type="text"
                      value={category.subtitle}
                      onChange={(e) =>
                        handleCategoryFieldChange(
                          catIdx,
                          "subtitle",
                          e.target.value,
                        )
                      }
                      placeholder="Category Subtitle"
                      className="block text-xs text-stone-500 dark:text-stone-400 bg-transparent border-b border-dashed border-stone-300 dark:border-stone-700 hover:border-amber-500 focus:border-amber-500 focus:outline-hidden py-0.5 mt-1 w-full"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleAddTier(catIdx)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-medium transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-500" />
                    <span>Add Tier</span>
                  </button>
                </div>
              </div>

              {/* Category Description & Client Requirement Note */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                    Public Description
                  </label>
                  <textarea
                    rows={2}
                    value={category.description}
                    onChange={(e) =>
                      handleCategoryFieldChange(
                        catIdx,
                        "description",
                        e.target.value,
                      )
                    }
                    className="w-full text-xs text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-lg p-2.5 focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                    Client Pre-Requirement Note
                  </label>
                  <textarea
                    rows={2}
                    value={category.clientRequirementNote || ""}
                    onChange={(e) =>
                      handleCategoryFieldChange(
                        catIdx,
                        "clientRequirementNote",
                        e.target.value,
                      )
                    }
                    placeholder="e.g. Client must share existing CAD drawings or site dimensions..."
                    className="w-full text-xs text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-lg p-2.5 focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Tiers List */}
              <div className="space-y-4 pt-2">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                  Package Tiers ({category.tiers.length})
                </span>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {category.tiers.map((tier, tierIdx) => (
                    <div
                      key={tier.id}
                      className={`border rounded-2xl p-5 space-y-4 relative transition-all ${
                        tier.popular
                          ? "border-amber-500/40 bg-amber-500/5 dark:bg-stone-950/60"
                          : "border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/30"
                      }`}
                    >
                      {/* Tier Header Controls */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            value={tier.name}
                            onChange={(e) =>
                              handleTierFieldChange(
                                catIdx,
                                tierIdx,
                                "name",
                                e.target.value,
                              )
                            }
                            placeholder="Tier Name"
                            className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 bg-transparent border-b border-dashed border-stone-300 dark:border-stone-700 hover:border-amber-500 focus:border-amber-500 focus:outline-hidden w-full"
                          />
                          <input
                            type="text"
                            value={tier.tag || ""}
                            onChange={(e) =>
                              handleTierFieldChange(
                                catIdx,
                                tierIdx,
                                "tag",
                                e.target.value,
                              )
                            }
                            placeholder="Tag (e.g. Most Popular)"
                            className="text-xs text-amber-600 dark:text-amber-400 font-mono bg-transparent border-b border-dashed border-stone-300 dark:border-stone-700 hover:border-amber-500 focus:border-amber-500 focus:outline-hidden"
                          />
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <label className="flex items-center gap-1.5 text-xs text-stone-500 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!tier.popular}
                              onChange={(e) =>
                                handleTierFieldChange(
                                  catIdx,
                                  tierIdx,
                                  "popular",
                                  e.target.checked,
                                )
                              }
                              className="accent-amber-500"
                            />
                            <span>Featured</span>
                          </label>

                          <button
                            onClick={() => handleDeleteTier(catIdx, tierIdx)}
                            className="p-1.5 text-stone-400 hover:text-red-500 rounded-md transition-colors"
                            title="Delete tier"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Pricing & Delivery */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="text-[10px] font-semibold text-stone-500 uppercase block mb-1">
                            Price Display
                          </label>
                          <input
                            type="text"
                            value={tier.priceFormatted}
                            onChange={(e) =>
                              handleTierFieldChange(
                                catIdx,
                                tierIdx,
                                "priceFormatted",
                                e.target.value,
                              )
                            }
                            placeholder="e.g. PKR 15,000"
                            className="w-full font-mono text-xs font-bold text-stone-900 dark:text-stone-100 bg-surface dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg p-2 focus:border-amber-500 focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-semibold text-stone-500 uppercase block mb-1">
                            Turnaround / Delivery
                          </label>
                          <input
                            type="text"
                            value={tier.deliveryTime || ""}
                            onChange={(e) =>
                              handleTierFieldChange(
                                catIdx,
                                tierIdx,
                                "deliveryTime",
                                e.target.value,
                              )
                            }
                            placeholder="e.g. 3–5 Working Days"
                            className="w-full text-xs text-stone-900 dark:text-stone-100 bg-surface dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg p-2 focus:border-amber-500 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      {/* Deliverables / Inclusions Checklist */}
                      <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-stone-500 uppercase">
                            Deliverables Checklist (
                            {tier.inclusions?.length || 0})
                          </span>
                          <button
                            onClick={() =>
                              handleAddTierInclusion(catIdx, tierIdx)
                            }
                            className="text-[11px] text-amber-500 hover:text-amber-400 font-medium flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        </div>

                        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                          {tier.inclusions?.map((inc, incIdx) => (
                            <div
                              key={incIdx}
                              className="flex items-center justify-between gap-2 text-xs bg-surface dark:bg-stone-900 p-1.5 rounded-md border border-stone-200 dark:border-stone-800"
                            >
                              <span className="text-stone-700 dark:text-stone-300 truncate">
                                • {inc}
                              </span>
                              <button
                                onClick={() =>
                                  handleRemoveTierInclusion(
                                    catIdx,
                                    tierIdx,
                                    incIdx,
                                  )
                                }
                                className="text-stone-400 hover:text-red-500 p-0.5 shrink-0"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 4: COMMERCIAL TERMS & POLICIES */}
      {activeSubTab === "policies" && (
        <div className="space-y-6">
          <div className="bg-surface dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs">
            <div className="border-b border-stone-200 dark:border-stone-800 pb-4 mb-6">
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-playfair">
                Studio Payment & Revision Policies
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                These four pillars are displayed at the top of the /pricing page
                to inform clients about commitment terms and revision limits.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pricingData.policyPoints?.map((policy, idx) => (
                <div
                  key={idx}
                  className="border border-stone-200 dark:border-stone-800 rounded-2xl p-5 bg-stone-50/50 dark:bg-stone-950/40 space-y-3"
                >
                  <div>
                    <label className="text-[10px] font-semibold text-stone-500 uppercase block mb-1">
                      Policy Title
                    </label>
                    <input
                      type="text"
                      value={policy.title}
                      onChange={(e) =>
                        handlePolicyChange(idx, "title", e.target.value)
                      }
                      className="w-full font-semibold text-stone-900 dark:text-stone-100 bg-surface dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-1.5 text-sm focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-stone-500 uppercase block mb-1">
                      Policy Description
                    </label>
                    <textarea
                      rows={3}
                      value={policy.description}
                      onChange={(e) =>
                        handlePolicyChange(idx, "description", e.target.value)
                      }
                      className="w-full text-xs text-stone-700 dark:text-stone-300 bg-surface dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg p-2.5 focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
