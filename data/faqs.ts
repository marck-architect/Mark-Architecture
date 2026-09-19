export interface FaqItem {
  id: string;
  category:
    | "pricing"
    | "consultation"
    | "approvals"
    | "drawings"
    | "passive-solar";
  question: string;
  shortAnswer: string;
  fullAnswer: string[];
  keywords: string[];
}

export interface FaqCategory {
  key:
    | "all"
    | "pricing"
    | "consultation"
    | "approvals"
    | "drawings"
    | "passive-solar";
  label: string;
  description: string;
}

export const faqCategories: FaqCategory[] = [
  {
    key: "all",
    label: "All Questions",
    description:
      "Browse our complete architectural knowledge base and client guidelines.",
  },
  {
    key: "pricing",
    label: "Pricing & Payments",
    description:
      "Transparent fixed fees, per square foot formula rates, and Safepay milestones.",
  },
  {
    key: "consultation",
    label: "Consultation & Booking",
    description:
      "Online 1-on-1 video sessions with principal architects via Live HD Video.",
  },
  {
    key: "approvals",
    label: "PDA & CDA Approvals",
    description:
      "Municipal building bylaws, seismic codes, and submission drawing requirements in Pakistan.",
  },
  {
    key: "drawings",
    label: "Drawings & Deliverables",
    description:
      "Turnkey architectural blueprints, 3D photorealistic elevations, and engineering sets.",
  },
  {
    key: "passive-solar",
    label: "Passive Solar Architecture",
    description:
      "Energy-efficient spatial planning designed for Pakistan's extreme summer and winter climates.",
  },
];

export const faqsData: FaqItem[] = [];

export const aeoQuickFacts = [
  { label: "Turnkey Design Rate", value: "PKR 57 / sq. ft." },
  { label: "Consultation Fee", value: "PKR 3,000 / 30 min" },
  { label: "Licensing Credentials", value: "PCATP Registered" },
  { label: "Bylaw Approvals", value: "100% PDA, CDA & DHA" },
  { label: "Headquarters", value: "Peshawar, PK" },
  { label: "Seismic Design", value: "Zone 2B & Zone 3 (BCP)" },
];
