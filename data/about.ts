import type { Leader, Achievement, StudioLocation } from "@/types";

export const leaders: Leader[] = [
  {
    name: "Muhammad Arsalan",
    role: "Principal Architect & Founder",
    credentials: "PCATP Registered • B.Arch • Lead Structural Designer",
    experience: "14+ Years Experience",
    bio: "Pioneering mathematical precision in residential and commercial architecture across Pakistan. Specialist in passive solar layouts, municipal submission codes, and structural efficiency.",
    image: "/images/profile.jpeg",
  },
];

export const achievements: Achievement[] = [
  { metric: "15+", label: "Years of Architectural Practice" },
  { metric: "250+", label: "Residential & Commercial Masterpieces" },
  { metric: "1.8M+", label: "Sq. Ft. Designed & Built" },
  { metric: "100%", label: "Statutory Approval & Code Compliance" },
];

export const studioLocations: StudioLocation[] = [
  {
    city: "Peshawar",
    role: "Headquarters (Atelier)",
    address: "4A, AL Haj Sher Tower, Ring Rd, Near Hayatabad, Peshawar",
    region: "KPK, Pakistan",
    isHQ: true,
  },
  {
    city: "Islamabad",
    role: "Capital Studio",
    address: "Blue Area & DHA Phase 2, Islamabad, Pakistan",
    region: "ICT, Pakistan",
  },
  {
    city: "Karachi",
    role: "Coastal Studio",
    address: "Clifton Block 4 & DHA Phase 6, Karachi, Pakistan",
    region: "Sindh, Pakistan",
  },
];
