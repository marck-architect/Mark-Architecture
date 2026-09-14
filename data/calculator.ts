import type { Discipline, PlotPreset } from "@/types";

export const disciplines: Discipline[] = [
  {
    id: "arch",
    name: "Architectural Detailed Services",
    rate: 40.0,
    description:
      "Floor plans, elevations, sections, municipal submission drawings, schedules, and 3D visual preview.",
  },
  {
    id: "struct",
    name: "Structural Drawings",
    rate: 8.0,
    description:
      "Foundation framing, column/beam schedules, reinforcement slabs, and structural engineering calculation.",
  },
  {
    id: "plumb",
    name: "Plumbing Drawings",
    rate: 3.5,
    description:
      "Water supply loops, sanitary drainage layout, vent pipes, and storm water harvest routing.",
  },
  {
    id: "elec",
    name: "Electrical Layout Design",
    rate: 4.5,
    description:
      "Power distribution schematics, lighting fixtures, conduit routing, and low-voltage networks.",
  },
  {
    id: "fire",
    name: "Fire & Safety Layout",
    rate: 1.0,
    description:
      "Emergency egress routes, fire detection layout, extinguisher stations, and life safety compliance.",
  },
];

export const plotPresets: PlotPreset[] = [
  {
    label: "5 Marla (Standard)",
    sqft: 2250,
    desc: "Double-storey ~2,250 sq. ft.",
  },
  {
    label: "10 Marla (Standard)",
    sqft: 3800,
    desc: "Double-storey ~3,800 sq. ft.",
  },
  {
    label: "1 Kanal (Standard)",
    sqft: 6000,
    desc: "Double/Triple-storey ~6,000 sq. ft.",
  },
];
