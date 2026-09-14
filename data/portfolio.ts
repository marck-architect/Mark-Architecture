import type { Project, FilterCategory } from "@/types";

export const filterCategories: FilterCategory[] = [
  { key: "all", label: "All Masterpieces" },
  { key: "residential", label: "Residential" },
  { key: "commercial", label: "Commercial" },
  { key: "interior", label: "Interior" },
  { key: "landscape", label: "Landscape" },
  { key: "renovation", label: "Renovations" },
];

export const projects: Project[] = [
  {
    title: "The Hayatabad Minimalist Estate",
    location: "Ring Road, Hayatabad, Peshawar, Pakistan",
    imageSrc: "/images/dha_lahore_villa.png",
    year: "2025",
    description:
      "An ultra-luxury 1-Kanal residence in Hayatabad, Peshawar. Designed with passive solar layout, exposed structural concrete, floor-to-ceiling thermal double-glazing, and private interior courtyard.",
    category: "residential",
    price: "1 Kanal • 6,200 sq. ft.",
    aspectClass: "aspect-[4/5]",
  },
  {
    title: "Margalla Crest Contemporary Mansion",
    location: "DHA Phase 2, Islamabad, Pakistan",
    imageSrc: "/images/dha_islamabad_mansion.png",
    year: "2026",
    description:
      "A modernist 2-Kanal hillside mansion facing the Margalla ridges. Features seismic reinforcement calculations, double-height entrance atrium, travertine stone cladding, and wide cantilevered balconies.",
    category: "residential",
    price: "2 Kanal • 9,500 sq. ft.",
    aspectClass: "aspect-[4/5]",
  },
  {
    title: "The Clifton Coastal Residence",
    location: "Clifton Block 4, Karachi, Pakistan",
    imageSrc: "/images/clifton_karachi_villa.png",
    year: "2024",
    description:
      "An ultra-premium modern coastal residence in Clifton, Karachi. Features marine-grade corrosion-resistant concrete facades, geometric brise-soleil shading louvers, and a rooftop viewing pavilion over the Arabian Sea.",
    category: "residential",
    price: "10 Marla • 3,850 sq. ft.",
    aspectClass: "aspect-[4/5]",
  },
  {
    title: "AL Haj Sher Commercial Center",
    location: "Ring Road, Near Hayatabad, Peshawar",
    imageSrc: "/images/Full House Design Package.png",
    year: "2025",
    description:
      "A multi-storey corporate hub and mixed-use commercial center. Features full MEP schematics, life safety egress plans, high-efficiency mechanical circulation, and PDA municipal submission drawings.",
    category: "commercial",
    price: "Multi-Storey Corporate Hub",
    aspectClass: "aspect-[16/10]",
  },
  {
    title: "Modern Facade Redesign & Elevation",
    location: "Hayatabad Phase 5, Peshawar, Pakistan",
    imageSrc: "/images/Front Elevation 3D (Exterior Render).png",
    year: "2025",
    description:
      "Contemporary 3D facade transformation for a 1-Kanal residence. Replaced traditional brickwork with sleek composite stone panels, dramatic vertical illumination, and modern aluminum louvers.",
    category: "renovation",
    price: "1 Kanal Facade • 3D Elevation",
    aspectClass: "aspect-[16/9]",
  },
  {
    title: "Executive Penthouse Suite & Lounge",
    location: "Blue Area, Islamabad, Pakistan",
    imageSrc: "/images/Interior Room Makeover.png",
    year: "2025",
    description:
      "Luxury interior room makeover featuring bespoke Swat walnut wood millwork, acoustic ceiling geometry, architectural ambient cove lighting, and curated imported marble surfaces.",
    category: "interior",
    price: "Master Suite & Lounge",
    aspectClass: "aspect-[16/10]",
  },
  {
    title: "Comprehensive Layout Optimization",
    location: "DHA Phase 6, Karachi, Pakistan",
    imageSrc: "/images/House Plan Correction.png",
    year: "2025",
    description:
      "Complete architectural redrafting for a 10 Marla corner plot with circulation bottlenecks. Restructured the layout to introduce natural light shafts, cross-ventilation, and dedicated family zones.",
    category: "renovation",
    price: "10 Marla • Corrected Blueprint",
    aspectClass: "aspect-[16/10]",
  },
  {
    title: "Biophilic Courtyard & Landscape Garden",
    location: "DHA Phase 2, Islamabad, Pakistan",
    imageSrc: "/images/House Plan review.png",
    year: "2024",
    description:
      "Internal biophilic courtyard integrating indigenous flora, geometric stone water rills, and shaded outdoor seating designed for thermal microclimate regulation in peak summer months.",
    category: "landscape",
    price: "Estate Garden & Circulation Audit",
    aspectClass: "aspect-[16/10]",
  },
];
