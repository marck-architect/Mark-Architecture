import type { FeaturedService, CuratedProject } from "@/types";

export const featuredServices: FeaturedService[] = [
  {
    title: "Online Video Consultation",
    badge: "Immediate Guidance",
    price: "PKR 3,000 / 5,000",
    duration: "30–60 Min Live",
    desc: "1-on-1 Zoom or WhatsApp session with lead architect Muhammad Rafiq. Mandatory drawing upload required.",
    image: "/images/For Call.png",
    href: "/consultation",
  },
  {
    title: "House Plan Review",
    badge: "Audit & Diagnostic",
    price: "From PKR 5,000",
    duration: "24–48 Hours",
    desc: "Voice notes, marked PDF plans, and circulation/ventilation flaw corrections before construction.",
    image: "/images/House Plan review.png",
    href: "/consultation",
  },
  {
    title: "Front Elevation 3D Render",
    badge: "Exterior Visualization",
    price: "From PKR 15,000",
    duration: "2–5 Days",
    desc: "Hyper-realistic facade visualizers (5M, 10M, 1 Kanal) with material and night illumination concepts.",
    image: "/images/Front Elevation 3D (Exterior Render).png",
    href: "/consultation",
  },
  {
    title: "Full House Design Package",
    badge: "Flagship Turnkey Suite",
    price: "PKR 57 / sq. ft.",
    duration: "2–6 Weeks",
    desc: "Complete architectural, structural, MEP, and safety layout suite. 50% advance terms via Safepay.",
    image: "/images/Full House Design Package.png",
    href: "/consultation",
  },
];

export const curatedProjects: CuratedProject[] = [
  {
    title: "The Hayatabad Contemporary Estate",
    category: "RESIDENTIAL VILLA",
    location: "Ring Road, Hayatabad, Peshawar",
    image: "/images/dha_lahore_villa.png",
    scale: "1 Kanal • 6,200 sq. ft.",
  },
  {
    title: "Margalla Hillside Modern Residence",
    category: "LUXURY RESIDENTIAL",
    location: "DHA Phase 2, Islamabad",
    image: "/images/dha_islamabad_mansion.png",
    scale: "2 Kanal • 9,500 sq. ft.",
  },
  {
    title: "The Clifton Coastal Residence",
    category: "CONTEMPORARY MASTERPIECE",
    location: "Clifton Block 4, Karachi",
    image: "/images/clifton_karachi_villa.png",
    scale: "10 Marla • 3,850 sq. ft.",
  },
];

export const homeStudioLocations = [
  {
    city: "Peshawar (Principal HQ)",
    address: "4A, AL Haj Sher Tower, Ring Rd, Near Hayatabad, Peshawar",
    role: "Principal Architectural Atelier & Design Studio",
    isHQ: true,
  },
  {
    city: "Islamabad Studio",
    address: "Blue Area & DHA Phase 2, Islamabad, Pakistan",
    role: "Capital Region Liaison & Municipal Approvals",
  },
  {
    city: "Karachi Studio",
    address: "Clifton Block 4 & DHA Phase 6, Karachi, Pakistan",
    role: "Southern Coastal Architecture & Interior Atelier",
  },
];
