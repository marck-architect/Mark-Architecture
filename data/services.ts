import * as z from "zod";
import type { ServiceData, CallTierOption } from "@/types";

export const briefFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Your name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z
    .string()
    .min(10, { message: "Please enter a valid contact/WhatsApp number." }),
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
      "30 min Zoom / WhatsApp Video",
      "Immediate layout flaw diagnosis",
      "Material & design directional advice",
    ],
  },
  {
    name: "Premium Call",
    duration: "60 Minutes",
    price: 5000,
    description:
      "In-depth architectural consultation covering spatial planning, material schedules, and realistic budget roadmaps.",
    features: [
      "60 min Comprehensive Session",
      "Deep-dive space & circulation review",
      "Finishing materials & contractor guidance",
      "Realistic budget allocation roadmap",
    ],
  },
];

export const serviceCatalog: ServiceData[] = [
  {
    id: "consultation",
    slug: "online-consultation",
    title: "Online Consultation (Video / Call)",
    category: "Consultation",
    popularityRank: 1,
    shortDesc:
      "Live 1-on-1 strategy sessions with a principal architect via Zoom or WhatsApp.",
    image: "/images/For Call.png",
    pricingType: "flat",
    tiers: [
      {
        name: "Basic Call",
        deliveryTime: "30 Minutes Live",
        details: "Discussion + design guidance + immediate layout solutions.",
        deliverables: [
          "30 min Zoom/WhatsApp Call",
          "Spatial Flow Guidance",
          "Live Q&A with Lead Architect",
        ],
        pricePKR: 3000,
      },
      {
        name: "Premium Call",
        deliveryTime: "60 Minutes Live",
        details:
          "Proper planning roadmap + material selections + budget allocation strategy.",
        deliverables: [
          "60 min In-Depth Session",
          "Comprehensive Layout Roadmap",
          "Material Grade Suggestions",
          "Budget Planning Strategy",
        ],
        pricePKR: 5000,
      },
    ],
  },
  {
    id: "plan-review",
    slug: "house-plan-review",
    title: "House Plan Review by Professional Architect",
    category: "Diagnostic Audit",
    popularityRank: 2,
    shortDesc:
      "Comprehensive blueprint audit identifying structural, ventilation, and circulation bottlenecks.",
    image: "/images/House Plan review.png",
    pricingType: "flat",
    tiers: [
      {
        name: "Basic",
        deliveryTime: "24 Hours",
        details:
          "Voice notes, marked plan (PDF/JPG), and 3–5 critical issue diagnostics.",
        deliverables: [
          "Annotated Marked Plan (PDF/JPG)",
          "Detailed Audio Voice Notes",
          "3–5 Critical Issue Solutions",
        ],
        pricePKR: 5000,
      },
      {
        name: "Standard",
        deliveryTime: "24–48 Hours",
        details:
          "Analytical report with circulation, ventilation, and dimensional sizing optimizations.",
        deliverables: [
          "Formal Analytical Report",
          "Circulation & Ventilation Audit",
          "Room Sizing Corrections",
          "Annotated Master Plan",
        ],
        pricePKR: 9000,
      },
      {
        name: "Premium",
        deliveryTime: "48 Hours",
        details:
          "Full review, improved rough layout sketch, furniture suggestions, and 2 revision rounds.",
        deliverables: [
          "Full Diagnostic Report",
          "Improved Rough Layout Sketch",
          "Optimal Furniture Placement",
          "2 Revision Cycles Included",
        ],
        pricePKR: 24000,
      },
    ],
  },
  {
    id: "plan-correction",
    slug: "house-plan-correction",
    title: "House Plan Correction",
    category: "Architectural Redrafting",
    popularityRank: 3,
    shortDesc:
      "Complete redrafting and spatial optimization of flawed blueprints according to plot scale.",
    image: "/images/House Plan Correction.png",
    pricingType: "size_based",
    tiers: [
      {
        name: "Basic",
        deliveryTime: "2–3 Days",
        details: "1 corrected layout option, 1 revision round.",
        deliverables: [
          "1 Optimized Blueprint Option",
          "1 Revision Cycle",
          "Updated Dimensioning Schedule",
        ],
        priceByPlot: {
          "5 Marla": 10000,
          "10 Marla": 15000,
          "1 Kanal": 26000,
        },
      },
      {
        name: "Standard",
        deliveryTime: "3–5 Days",
        details:
          "2 corrected layout options, scaled furniture layout, and 2 revision rounds.",
        deliverables: [
          "2 Layout Proposals",
          "Bespoke Furniture Plan",
          "Circulation Restructuring",
          "2 Revision Cycles",
        ],
        priceByPlot: {
          "5 Marla": 15000,
          "10 Marla": 22000,
          "1 Kanal": 40000,
        },
      },
      {
        name: "Premium",
        deliveryTime: "5–7 Days",
        details:
          "2 layout options, custom furniture plan, passive ventilation strategy, and 3 revision rounds.",
        deliverables: [
          "2 Complete Redesigns",
          "Custom Furniture Plan",
          "Passive Ventilation Strategy",
          "3 Revision Cycles Included",
        ],
        priceByPlot: {
          "5 Marla": 22000,
          "10 Marla": 38000,
          "1 Kanal": 70000,
        },
      },
    ],
  },
  {
    id: "elevation-3d",
    slug: "front-elevation-3d",
    title: "Front Elevation 3D (Exterior Render)",
    category: "3D Visualization",
    popularityRank: 4,
    shortDesc:
      "Photorealistic architectural facades, daylight & dusk renders, and modern material schedules.",
    image: "/images/Front Elevation 3D (Exterior Render).png",
    pricingType: "size_based",
    tiers: [
      {
        name: "Basic",
        deliveryTime: "2–4 Days",
        details: "1 realistic 3D front view, material suggestions, 1 revision.",
        deliverables: [
          "1 Realistic 3D Facade View",
          "Exterior Material Palette",
          "1 Revision Cycle",
        ],
        priceByPlot: {
          "5 Marla": 15000,
          "10 Marla": 17000,
          "1 Kanal": 23000,
        },
      },
      {
        name: "Standard",
        deliveryTime: "3–5 Days",
        details:
          "2 perspective views (front + angle), material & color options, 2 revisions.",
        deliverables: [
          "2 Views (Front + Dramatic Angle)",
          "Material & Color Specifications",
          "2 Revision Cycles",
        ],
        priceByPlot: {
          "5 Marla": 20000,
          "10 Marla": 25000,
          "1 Kanal": 31900,
        },
      },
      {
        name: "Premium",
        deliveryTime: "5–7 Days",
        details:
          "3 perspective views + night view, detailed material concept, 3 revisions.",
        deliverables: [
          "3 Views + Night Illumination Render",
          "Exhaustive Material Schedule",
          "Exterior Lighting Layout",
          "3 Revision Cycles",
        ],
        priceByPlot: {
          "5 Marla": 25000,
          "10 Marla": 29000,
          "1 Kanal": 36000,
        },
      },
    ],
  },
  {
    id: "interior-makeover",
    slug: "interior-room-makeover",
    title: "Interior Room Makeover",
    category: "Interior Architecture",
    popularityRank: 5,
    shortDesc:
      "Custom room transformations: moodboards, 3D interior renders, and false ceiling details.",
    image: "/images/Interior Room Makeover.png",
    pricingType: "flat",
    tiers: [
      {
        name: "Basic",
        deliveryTime: "2 Days",
        details:
          "Moodboard specifying color schemes, furniture styles, and ambient lighting.",
        deliverables: [
          "Aesthetic Moodboard",
          "Color Palette Schedule",
          "Furniture Sourcing Direction",
        ],
        pricePKR: 7000,
      },
      {
        name: "Standard",
        deliveryTime: "3–4 Days",
        details:
          "Moodboard + 2D scaled furniture layout + false ceiling & lighting design concepts.",
        deliverables: [
          "Concept Moodboard",
          "2D Scaled Furniture Layout",
          "Ceiling Geometry & Lighting Concept",
        ],
        pricePKR: 12000,
      },
      {
        name: "Premium",
        deliveryTime: "5–7 Days",
        details:
          "Moodboard + photorealistic 3D render + furniture layout + ceiling & lighting construction details.",
        deliverables: [
          "Photorealistic 3D Interior Render",
          "Complete Moodboard & Material Specs",
          "Scaled Furniture & Ceiling Plans",
          "2 Revisions",
        ],
        pricePKR: 30000,
      },
    ],
  },
  {
    id: "cost-estimate",
    slug: "construction-cost-estimate",
    title: "Construction Cost Estimate (Grey Structure)",
    category: "Cost Estimation",
    popularityRank: 6,
    shortDesc:
      "Market-verified bill of quantities and accurate material projections for grey structure.",
    image: "/images/Construction Cost Estimate.png",
    pricingType: "size_based",
    tiers: [
      {
        name: "Basic",
        deliveryTime: "2–3 Days",
        details:
          "Approximate grey structure cost breakdown with covered area statement.",
        deliverables: [
          "Grey Structure Cost Breakdown",
          "Covered Area Calculation",
          "Steel & Cement Quantities Summary",
        ],
        priceByPlot: {
          "5 Marla": 5000,
          "10 Marla": 7000,
          "1 Kanal": 9000,
        },
      },
      {
        name: "Detailed",
        deliveryTime: "4–6 Days",
        details:
          "Grey structure + finishing estimate, material grade suggestions, and bill of quantities.",
        deliverables: [
          "Grey Structure + Finishing Projections",
          "Material Grade Suggestions",
          "Itemized Bill of Quantities",
          "Contractor Negotiation Guide",
        ],
        priceByPlot: {
          "5 Marla": 16000,
          "10 Marla": 19000,
          "1 Kanal": 30000,
        },
      },
    ],
  },
  {
    id: "full-package",
    slug: "full-house-design-package",
    title: "Full House Design Package (Rate-Based)",
    category: "Flagship Full Turnkey Package",
    popularityRank: 7,
    shortDesc:
      "Complete architectural, structural, plumbing, electrical, and fire/safety blueprint suite billed by covered area.",
    image: "/images/Full House Design Package.png",
    pricingType: "rate_formula",
  },
];

export function getStartingPriceText(service: ServiceData): string {
  if (service.pricingType === "rate_formula") {
    return "From PKR 280 / sq ft";
  }
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
