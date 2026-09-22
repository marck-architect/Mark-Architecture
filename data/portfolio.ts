import type { Project, FilterCategory } from "@/types";

export const filterCategories: FilterCategory[] = [
  { key: "all", label: "All Masterpieces" },
  { key: "residential", label: "Residential" },
  { key: "commercial", label: "Commercial" },
  { key: "interior", label: "Interior" },
  { key: "landscape", label: "Landscape" },
  { key: "renovation", label: "Renovations" },
];

export const projects: Project[] = [];
