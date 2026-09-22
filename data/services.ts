import * as z from "zod";
import type { ServiceData, CallTierOption } from "@/types";

export const briefFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Your name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z
    .string()
    .min(10, { message: "Please enter a valid contact phone number." }),
  projectType: z
    .string()
    .min(1, { message: "Please select your property category." }),
  message: z.string().min(10, {
    message:
      "Please outline your questions or design requirements (min 10 chars).",
  }),
});

export const consultationMonths: string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const consultationTimeSlots: string[] = [
  "11:00 AM",
  "02:30 PM",
  "05:00 PM",
  "08:00 PM",
];

export const callTiers: CallTierOption[] = [
  {
    name: "Basic Call",
    duration: "30 Minutes",
    price: 3000,
    description:
      "Focused video session for immediate layout review, structural feedback, and quick solutions.",
    features: [
      "30 min Live Video Session",
      "Spatial Flow Guidance",
      "Live Q&A with Lead Architect",
    ],
  },
  {
    name: "Premium Call",
    duration: "60 Minutes",
    price: 5000,
    description:
      "In-depth architectural consultation covering spatial planning, material schedules, and realistic budget roadmaps.",
    features: [
      "60 min In-Depth Session",
      "Comprehensive Layout Roadmap",
      "Material Grade Suggestions",
      "Budget Planning Strategy",
    ],
  },
];

export const serviceCatalog: ServiceData[] = [];

export function getStartingPriceText(service: ServiceData): string {
  if (
    service.pricingType === "flat" &&
    service.tiers &&
    service.tiers.length > 0
  ) {
    const lowest = Math.min(
      ...service.tiers.map((t) => t.pricePKR || 0).filter((p) => p > 0),
    );
    return `From PKR ${lowest.toLocaleString()}`;
  }
  if (
    service.pricingType === "size_based" &&
    service.tiers &&
    service.tiers.length > 0
  ) {
    const lowest = Math.min(
      ...service.tiers
        .map((t) => (t.priceByPlot ? t.priceByPlot["5 Marla"] : 0))
        .filter((p) => p > 0),
    );
    return `From PKR ${lowest.toLocaleString()}`;
  }
  return "Custom Quote";
}

export const popupScales: string[] = [
  "Small (< 1,500 sq ft)",
  "Medium (1,500 - 5,000 sq ft)",
  "Large (5,000 - 10,000 sq ft)",
  "Estate (> 10,000 sq ft)",
];

export const popupStyles: string[] = [
  "Minimalist Modern",
  "Classic Luxury",
  "Biophilic Organic",
  "Industrial High-Tech",
];

export const popupSectors = [
  { value: "residential", label: "Luxury Residential Estate" },
  { value: "commercial", label: "Premium Commercial Hub" },
  { value: "interior", label: "Bespoke Interior Design" },
  { value: "landscape", label: "Landscape & Biophilic Design" },
  { value: "renovation", label: "Legacy Renovations" },
];

export const popupTimelines: string[] = [
  "1-3 Months",
  "3-6 Months",
  "6-12+ Months",
];
