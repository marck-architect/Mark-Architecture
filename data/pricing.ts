export interface PricingTier {
  id: string;
  name: string;
  pricePKR: number | string;
  priceFormatted: string;
  deliveryTime?: string;
  popular?: boolean;
  tag?: string;
  inclusions: string[];
  notes?: string;
  actionType: "consultation" | "cart";
}

export interface PricingCategory {
  id: string;
  letter: string;
  title: string;
  subtitle: string;
  badge?: string;
  description: string;
  clientRequirementNote?: string;
  tiers: PricingTier[];
}

export const paymentPolicyPoints = [
  {
    title: "50% Advance Required",
    description:
      "All design orders require a 50% upfront commitment to initiate architectural drafting.",
    icon: "ShieldCheck",
  },
  {
    title: "Work Starts Immediately",
    description:
      "Drafting, diagnostic modeling, and reviews begin promptly once payment confirmation is verified via Safepay.",
    icon: "Clock",
  },
  {
    title: "Transparent Revision Limits",
    description:
      "Each package includes a clearly specified number of design review and revision cycles.",
    icon: "CheckCircle2",
  },
  {
    title: "Extra Revisions Available",
    description:
      "Additional iterations outside scope can be booked separately at nominal standard studio rates.",
    icon: "Sparkles",
  },
];

export const pricingMenuCategories: PricingCategory[] = [
  {
    id: "consultation",
    letter: "A",
    title: "Online Consultation (Video/Call)",
    subtitle: "Direct 1-on-1 Strategy Call with Principal Architect",
    badge: "Direct Advisory",
    description:
      "Connect directly with a licensed architect via Zoom video session for instant layout diagnosis, structural feasibility, and budget strategy.",
    clientRequirementNote:
      "Client must share layout plan, plot size, or site photos before the call for pre-session diagnosis.",
    tiers: [
      {
        id: "consult-basic",
        name: "Basic Call",
        pricePKR: 3000,
        priceFormatted: "PKR 3,000",
        deliveryTime: "Scheduled (30 mins)",
        tag: "Quick Guidance",
        inclusions: [
          "30 minutes Zoom video call",
          "One-on-one discussion with architect",
          "Layout guidance & practical solutions",
          "Direct answers to design dilemmas",
        ],
        notes:
          "Ideal for quick spatial checks or second opinions on layout drawings.",
        actionType: "consultation",
      },
      {
        id: "consult-premium",
        name: "Premium Call",
        pricePKR: 5000,
        priceFormatted: "PKR 5,000",
        deliveryTime: "Scheduled (60 mins)",
        popular: true,
        tag: "Most Comprehensive",
        inclusions: [
          "60 minutes deep-dive Zoom video call",
          "Proper spatial planning & room flow audit",
          "Material selection & specification advice",
          "Realistic construction budget guidance",
          "Annotated screenshot debrief after call",
        ],
        notes:
          "Full architectural strategy session before finalizing structural drawings.",
        actionType: "consultation",
      },
    ],
  },
  {
    id: "plan-review",
    letter: "B",
    title: "House Plan Review",
    subtitle: "Fast Architectural Audit to Spot Flaws Before Construction",
    badge: "High Demand • Fast 24–48h",
    description:
      "Catch circulation bottlenecks, missing sunlight shafts, structural clashes, and municipal compliance errors before you break ground.",
    tiers: [
      {
        id: "review-basic",
        name: "Basic Plan Review",
        pricePKR: 2000,
        priceFormatted: "PKR 2,000",
        deliveryTime: "24 Hours Delivery",
        tag: "Speed Audit",
        inclusions: [
          "Audio voice memo explanation by architect",
          "Marked plan corrections (PDF / High-res JPG)",
          "3–5 critical layout issues pinpointed",
          "Quick redline notes on doors & circulation",
        ],
        actionType: "cart",
      },
      {
        id: "review-standard",
        name: "Standard Plan Review",
        pricePKR: 4000,
        priceFormatted: "PKR 4,000",
        deliveryTime: "24–48 Hours",
        popular: true,
        tag: "Most Popular",
        inclusions: [
          "Comprehensive written diagnostic review report",
          "Proper suggestions on circulation & corridors",
          "Natural ventilation & sunlight routing audit",
          "Room sizing & furniture clearance analysis",
          "Marked architectural PDF with bullet points",
        ],
        actionType: "cart",
      },
      {
        id: "review-premium",
        name: "Premium Plan Review",
        pricePKR: 6000,
        priceFormatted: "PKR 6,000",
        deliveryTime: "48 Hours Delivery",
        tag: "Includes Rough Sketch",
        inclusions: [
          "Full in-depth layout review & structural report",
          "Improved rough layout sketch by lead architect",
          "Optimal furniture layout arrangement suggestion",
          "2 revision / clarification rounds included",
          "Audio voice memo summary and Q&A support",
        ],
        actionType: "cart",
      },
    ],
  },
  {
    id: "plan-redesign",
    letter: "C",
    title: "Plan Redesign / Correction",
    subtitle: "Turn Flawed Contractor Drawings into an Elegant Modern Home",
    badge: "Top Seller",
    description:
      "Transform cramped, inefficient, or unapproved architectural drawings into an optimized layout tailored to Pakistani society regulations and modern lifestyles.",
    tiers: [
      {
        id: "redesign-basic",
        name: "Basic Layout Correction",
        pricePKR: 12000,
        priceFormatted: "PKR 12,000",
        deliveryTime: "2–3 Days",
        tag: "Single Option",
        inclusions: [
          "1 professionally corrected layout plan option",
          "Elimination of awkward dead zones & odd angles",
          "Clean door & window alignment",
          "1 revision round included",
          "Scaled PDF format ready for draftsman",
        ],
        actionType: "cart",
      },
      {
        id: "redesign-standard",
        name: "Standard Layout Redesign",
        pricePKR: 20000,
        priceFormatted: "PKR 20,000",
        deliveryTime: "3–5 Days",
        popular: true,
        tag: "Best Value",
        inclusions: [
          "2 distinct plan design options to choose from",
          "Detailed furniture layout & room flow mapping",
          "Cross-ventilation and natural daylight routing",
          "2 design revision rounds included",
          "High-resolution vector drawings (PDF & JPG)",
        ],
        actionType: "cart",
      },
      {
        id: "redesign-premium",
        name: "Premium Layout Redesign",
        pricePKR: 35000,
        priceFormatted: "PKR 35,000",
        deliveryTime: "5–7 Days",
        tag: "Complete Strategy",
        inclusions: [
          "2–3 tailored architectural plan variations",
          "Comprehensive furniture & spatial organization",
          "Bespoke daylight & ventilation optimization",
          "3 comprehensive revision rounds included",
          "Full electrical switch & plumbing point guide",
        ],
        actionType: "cart",
      },
    ],
  },
  {
    id: "elevation-3d",
    letter: "D",
    title: "Front Elevation 3D (Exterior Render)",
    subtitle: "Photorealistic 3D Facade Concepts & Material Specs",
    badge: "Exterior 3D",
    description:
      "Visualize your home's exterior with photorealistic 3D elevations featuring modern grooved textures, fluted tiles, warm evening lighting, and louvers.",
    tiers: [
      {
        id: "elevation-basic",
        name: "Basic Elevation",
        pricePKR: 12000,
        priceFormatted: "PKR 12,000",
        deliveryTime: "2–4 Days",
        tag: "Single View",
        inclusions: [
          "1 photorealistic 3D front elevation view",
          "Daytime sunlight lighting render",
          "Curated exterior material & paint color palette",
          "1 revision round included",
          "High-resolution 4K render file",
        ],
        actionType: "cart",
      },
      {
        id: "elevation-standard",
        name: "Standard Elevation",
        pricePKR: 18000,
        priceFormatted: "PKR 18,000",
        deliveryTime: "3–5 Days",
        popular: true,
        tag: "Most Requested",
        inclusions: [
          "2 comprehensive 3D views (Front View + Corner Angle)",
          "Realistic material & color finish options (rockwall, porcelain, wood)",
          "Parapet wall, balcony railing, and main gate details",
          "2 revision rounds included",
          "Print-ready high-resolution rendering sheets",
        ],
        actionType: "cart",
      },
      {
        id: "elevation-premium",
        name: "Premium Elevation",
        pricePKR: 28000,
        priceFormatted: "PKR 28,000",
        deliveryTime: "5–7 Days",
        tag: "Day + Night Views",
        inclusions: [
          "3 distinct views including cinematic Night View with cove lighting",
          "Detailed material moodboard & brand recommendations",
          "Boundary wall, gate, and landscape integration",
          "3 revision rounds included",
          "Commercial 4K ultra-sharp presentation renders",
        ],
        actionType: "cart",
      },
    ],
  },
  {
    id: "interior-makeover",
    letter: "E",
    title: "Interior Room Makeover",
    subtitle: "Bespoke Room Styling, Moodboards & 3D Visualizations",
    badge: "Fast Selling",
    description:
      "Reimagine your master bedroom, living lounge, dining area, or drawing room with tailored color tones, custom ceiling patterns, and ambient lighting design.",
    tiers: [
      {
        id: "interior-basic",
        name: "Basic Moodboard",
        pricePKR: 5000,
        priceFormatted: "PKR 5,000",
        deliveryTime: "2 Days Delivery",
        tag: "Quick Refresh",
        inclusions: [
          "Curated room color palette & paint code guide",
          "Furniture styles & dimensions shopping recommendations",
          "Ambient & task lighting moodboard suggestions",
          "Curated decor accent items reference list",
        ],
        actionType: "cart",
      },
      {
        id: "interior-standard",
        name: "Standard Interior Concept",
        pricePKR: 10000,
        priceFormatted: "PKR 10,000",
        deliveryTime: "3–4 Days",
        popular: true,
        tag: "2D Layout + Ceiling",
        inclusions: [
          "Complete interior moodboard with texture palette",
          "Scaled 2D furniture layout plan with clearance specs",
          "False ceiling design with LED profile lighting concept",
          "Curtain, wall paneling, and rug sizing guide",
          "1 revision round included",
        ],
        actionType: "cart",
      },
      {
        id: "interior-premium",
        name: "Premium Interior Design",
        pricePKR: 18000,
        priceFormatted: "PKR 18,000",
        deliveryTime: "5–7 Days",
        tag: "Full 3D Render",
        inclusions: [
          "Photorealistic 3D interior render of the room",
          "Detailed moodboard + color & textile palette",
          "2D furniture placement layout with exact measurements",
          "Gypsum false ceiling & recessed spotlight plan",
          "2 revision rounds included",
        ],
        actionType: "cart",
      },
    ],
  },
  {
    id: "cost-estimate",
    letter: "F",
    title: "Construction Cost Estimate",
    subtitle: "Grey Structure & Finishing Bill of Quantities (BOQ)",
    badge: "Financial Control",
    description:
      "Avoid cost overruns and builder inflation. Receive an honest, detailed quantity assessment based on prevailing material and labor rates in Pakistan.",
    tiers: [
      {
        id: "estimate-basic",
        name: "Basic Estimate",
        pricePKR: 7000,
        priceFormatted: "PKR 7,000",
        deliveryTime: "2–3 Days",
        tag: "Grey Structure",
        inclusions: [
          "Approximate grey structure construction cost calculation",
          "Complete covered area statement (ground + first + mumty)",
          "Estimated cement, steel, bricks, and sand requirements",
          "Labor rate guidelines for your target city",
        ],
        actionType: "cart",
      },
      {
        id: "estimate-detailed",
        name: "Detailed Estimate",
        pricePKR: 15000,
        priceFormatted: "PKR 15,000",
        deliveryTime: "4–6 Days",
        popular: true,
        tag: "Grey + Finishing",
        inclusions: [
          "Comprehensive Grey Structure + Finishing estimate",
          "Breakdown for tiles, sanitary, electrical wiring, and woodwork",
          "Itemized material quality grade suggestions (A / B+ grade)",
          "Milestone payment schedule guide for contractor negotiation",
          "Consultation call to review the cost report",
        ],
        actionType: "cart",
      },
    ],
  },
  {
    id: "full-house",
    letter: "G",
    title: "Full House Design Package",
    subtitle: "End-to-End Architectural Blueprint & Submission Drawings",
    badge: "High Ticket • Turnkey Blueprint",
    description:
      "From bare plot to complete construction-ready blueprint set. Engineered to pass municipal authority approvals (CDA, LDA, DHA, Bahria, RDA, KDA, PDA).",
    tiers: [
      {
        id: "fullhouse-standard",
        name: "Standard Full Design",
        pricePKR: "80,000 – 250,000",
        priceFormatted: "PKR 80,000 – 250,000",
        deliveryTime: "2–4 Weeks",
        popular: true,
        tag: "Complete Blueprints",
        inclusions: [
          "Complete architectural floor plans (all levels)",
          "Front & side elevation design concepts",
          "High-res 3D exterior visualization views",
          "Cross-sections, staircase details & roof plan",
          "Door, window & ventilator schedule",
          "Electrical, plumbing & HVAC schematic routing",
          "Authority submission drawing sheets",
          "Direct revisions & coordination with project architect",
        ],
        notes:
          "Pricing scales strictly with covered area & plot size (5 Marla: ~PKR 80k–110k, 10 Marla: ~PKR 140k–180k, 1 Kanal: ~PKR 220k–250k+).",
        actionType: "cart",
      },
    ],
  },
];

import { disciplines, plotPresets } from "@/data/calculator";
import type { PricingSettingsContent } from "@/types";

export const defaultPricingSettings: PricingSettingsContent = {
  calculator: {
    disciplines,
    advancePercentage: 50,
    plotPresets,
  },
  consultationCalls: {
    basicCallPrice: 3000,
    premiumCallPrice: 5000,
    basicCallDuration: 30,
    premiumCallDuration: 60,
  },
  menuCategories: pricingMenuCategories,
  policyPoints: paymentPolicyPoints,
};
