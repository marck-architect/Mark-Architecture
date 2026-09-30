export interface PricingTier {
  id: string;
  name: string;
  pricePKR: number | string;
  priceFormatted: string;
  /** Set only on tiers under a `sized` category — one price per PLOT_SIZES entry. */
  pricesBySize?: [number, number, number];
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
  icon?: string;
  /** Wide client-provided photo shown as a banner above the category detail. */
  image?: string;
  badge?: string;
  description: string;
  /** Short elaboration points shown under the description to fill the column beside the banner image. */
  detailPoints?: string[];
  clientRequirementNote?: string;
  /** Tiers are priced per plot size (5 Marla / 10 Marla / 1 Kanal); show the size switcher. */
  sized?: boolean;
  /** Render the live per-sq-ft FullHouseCalculator instead of tier cards. */
  isCalculator?: boolean;
  tiers: PricingTier[];
}

export const PLOT_SIZES = ["5 Marla", "10 Marla", "1 Kanal"] as const;

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
    icon: "/images/pricing/consult.png",
    image: "/images/For Call.png",
    badge: "Direct Advisory",
    description:
      "Connect directly with a licensed architect via Zoom video session for instant layout diagnosis, structural feasibility, and budget strategy.",
    detailPoints: [
      "Speak directly with a licensed principal architect, not a sales representative",
      "Get honest layout, structural, and budget feedback in real time",
      "Walk away with a clear, actionable next step for your project",
      "A practical starting point before committing to a full design package",
    ],
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
    icon: "/images/pricing/review.png",
    image: "/images/House Plan review.png",
    badge: "High Demand • Fast 24–48h",
    description:
      "Catch circulation bottlenecks, missing sunlight shafts, structural clashes, and municipal compliance errors before you break ground.",
    detailPoints: [
      "An independent second opinion before you approve any drawing",
      "Flags circulation, ventilation, and code-compliance issues early",
      "Delivered as a clearly marked-up, easy-to-follow PDF report",
      "Saves costly on-site corrections once construction has started",
    ],
    tiers: [
      {
        id: "review-basic",
        name: "Basic Plan Review",
        pricePKR: 5000,
        priceFormatted: "PKR 5,000",
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
        pricePKR: 9000,
        priceFormatted: "PKR 9,000",
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
        pricePKR: 24000,
        priceFormatted: "PKR 24,000",
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
    icon: "/images/pricing/correction.png",
    image: "/images/House Plan Correction.png",
    badge: "Top Seller",
    description:
      "Transform cramped, inefficient, or unapproved architectural drawings into an optimized layout tailored to Pakistani society regulations and modern lifestyles.",
    detailPoints: [
      "Reworks flawed contractor drawings into an efficient, modern layout",
      "Multiple design options to compare before you commit to one",
      "Full furniture layout and daylight/ventilation strategy included",
      "Priced by plot size, from 5 Marla up to 1 Kanal",
    ],
    sized: true,
    tiers: [
      {
        id: "redesign-basic",
        name: "Basic Layout Correction",
        pricePKR: 15000,
        priceFormatted: "PKR 15,000",
        pricesBySize: [10000, 15000, 26000],
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
        pricePKR: 22000,
        priceFormatted: "PKR 22,000",
        pricesBySize: [15000, 22000, 40000],
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
        pricePKR: 38000,
        priceFormatted: "PKR 38,000",
        pricesBySize: [22000, 38000, 70000],
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
    icon: "/images/pricing/elevation.png",
    image: "/images/Front Elevation 3D (Exterior Render).png",
    badge: "Exterior 3D",
    description:
      "Visualize your home's exterior with photorealistic 3D elevations featuring modern grooved textures, fluted tiles, warm evening lighting, and louvers.",
    detailPoints: [
      "Photorealistic renders so you see the facade before construction begins",
      "Material, color, and lighting choices finalized upfront",
      "Day and cinematic night views available on higher tiers",
      "Priced by plot size, from 5 Marla up to 1 Kanal",
    ],
    sized: true,
    tiers: [
      {
        id: "elevation-basic",
        name: "Basic Elevation",
        pricePKR: 17000,
        priceFormatted: "PKR 17,000",
        pricesBySize: [15000, 17000, 23000],
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
        pricePKR: 25000,
        priceFormatted: "PKR 25,000",
        pricesBySize: [20000, 25000, 31900],
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
        pricePKR: 29000,
        priceFormatted: "PKR 29,000",
        pricesBySize: [25000, 29000, 36000],
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
    icon: "/images/pricing/interior.png",
    image: "/images/Interior Room Makeover.png",
    badge: "Fast Selling",
    description:
      "Reimagine your master bedroom, living lounge, dining area, or drawing room with tailored color tones, custom ceiling patterns, and ambient lighting design.",
    detailPoints: [
      "Tailored to one room at a time — bedroom, lounge, or dining area",
      "Moodboard, furniture layout, and ceiling/lighting design included",
      "Photorealistic 3D render available on the premium tier",
      "Practical, shoppable recommendations, not just concept art",
    ],
    tiers: [
      {
        id: "interior-basic",
        name: "Basic Moodboard",
        pricePKR: 7000,
        priceFormatted: "PKR 7,000",
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
        pricePKR: 12000,
        priceFormatted: "PKR 12,000",
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
        pricePKR: 30000,
        priceFormatted: "PKR 30,000",
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
    icon: "/images/pricing/estimate.png",
    image: "/images/Construction Cost Estimate.png",
    badge: "Financial Control",
    description:
      "Avoid cost overruns and builder inflation. Receive an honest, detailed quantity assessment based on prevailing material and labor rates in Pakistan.",
    detailPoints: [
      "An independent check against builder and contractor quotes",
      "Covers grey structure, and finishing on the detailed tier",
      "Based on current material and labor rates across Pakistan",
      "Priced by plot size, from 5 Marla up to 1 Kanal",
    ],
    sized: true,
    tiers: [
      {
        id: "estimate-basic",
        name: "Basic Estimate",
        pricePKR: 7000,
        priceFormatted: "PKR 7,000",
        pricesBySize: [5000, 7000, 9000],
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
        pricePKR: 19000,
        priceFormatted: "PKR 19,000",
        pricesBySize: [16000, 19000, 30000],
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
    icon: "/images/pricing/full-design.png",
    image: "/images/Full House Design Package.png",
    badge: "High Ticket • Turnkey Blueprint",
    description:
      "From bare plot to complete construction-ready blueprint set, priced per sq. ft. of covered area across five engineering disciplines. Engineered to pass municipal authority approvals (CDA, LDA, DHA, Bahria, RDA, KDA, PDA).",
    detailPoints: [
      "End-to-end blueprint set from bare plot to construction-ready",
      "Priced transparently per sq. ft. across five engineering disciplines",
      "Engineered to pass municipal authority approvals",
      "50% advance to start, balance due on delivery",
    ],
    isCalculator: true,
    tiers: [],
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
