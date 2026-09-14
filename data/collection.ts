import type {
  ArchitecturalPackage,
  Product,
  Product3D,
  ProductType,
} from "@/types";

export const architecturalPackages: ArchitecturalPackage[] = [
  {
    id: "hpr-standard",
    title: "House Plan Review (Standard)",
    tier: "Standard Package",
    pricePKR: 9000,
    deliveryTime: "24–48 Hours",
    image: "/images/House Plan review.png",
    inclusions: [
      "Comprehensive Diagnostic Report",
      "Circulation & Ventilation Optimization",
      "Room Sizing & Furniture Feasibility",
      "Annotated Architectural PDF Plan",
    ],
    description:
      "Detailed audit of your architectural blueprints by a licensed architect to eliminate structural flaws before construction.",
  },
  {
    id: "hpc-standard",
    title: "House Plan Correction (10 Marla)",
    tier: "Standard Package",
    pricePKR: 22000,
    deliveryTime: "3–5 Days",
    image: "/images/House Plan Correction.png",
    plotSize: "10 Marla",
    inclusions: [
      "2 Corrected Layout Alternatives",
      "Scaled Furniture Arrangement Plan",
      "Natural Ventilation & Sunlight Routing",
      "2 Design Revision Rounds",
    ],
    description:
      "Turn flawed drawings into an optimized, harmonious 10 Marla home layout with complete furniture and flow planning.",
  },
  {
    id: "fe-standard",
    title: "Front Elevation 3D Render (10 Marla)",
    tier: "Standard Package",
    pricePKR: 25000,
    deliveryTime: "3–5 Days",
    image: "/images/Front Elevation 3D (Exterior Render).png",
    plotSize: "10 Marla",
    inclusions: [
      "2 High-Res 3D Views (Front & Angle)",
      "Exterior Material & Paint Color Specs",
      "Modern Facade Cladding Concepts",
      "2 Revision Rounds Included",
    ],
    description:
      "Ultra-realistic 3D exterior visualization showcasing daytime lighting, premium materials, and exterior finishes.",
  },
  {
    id: "irm-premium",
    title: "Interior Room Makeover (Premium)",
    tier: "Premium Package",
    pricePKR: 30000,
    deliveryTime: "5–7 Days",
    image: "/images/Interior Room Makeover.png",
    inclusions: [
      "Photorealistic 3D Interior Render",
      "Complete Aesthetic Moodboard",
      "Scaled 2D Furniture & Ceiling Plan",
      "Custom Ambient Lighting Scheme",
    ],
    description:
      "Complete luxury transformation for master bedroom suites, formal drawing rooms, or designer open-plan kitchens.",
  },
  {
    id: "cce-detailed",
    title: "Grey Structure Cost Estimate (10 Marla)",
    tier: "Detailed Package",
    pricePKR: 19000,
    deliveryTime: "4–6 Days",
    image: "/images/Construction Cost Estimate.png",
    plotSize: "10 Marla",
    inclusions: [
      "Complete Grey Structure Bill of Quantities",
      "Finishing Material Budget Projections",
      "Steel, Cement & Brick Quantity Schedules",
      "Contractor Cost Benchmark Sheet",
    ],
    description:
      "Protect your investment with exact material calculations and construction rate verification based on market data.",
  },
];

export const physicalProducts: Product[] = [
  {
    title: "Swat Valley Walnut Lounger",
    price: 380000,
    currency: "PKR",
    category: "FURNITURE",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBdv45ZiAB-0kcsC7QWcWUYrvqGWOf63PZTgdMoX6CDz8RQuR3IP5kBOZFYn_fYfaZl59P8VTYlL5pXaiaapTdMb0oc8CGnpGAOR7rFgkKi-FAoCLawT7tFuMxDmhS4Ec3tn2of0SdhoNIkL9RAW2QKc9TShvEmO-ob1tGIUlCu1vGjQ6iw3X5INGkJN1NVdwYn8BRqre0VQCmMnCDk0t11Ta60nsbBekThEtDJcwrObL4IK4_z4nlX146QuGXDctGXG_2YzE9E-odI",
    description:
      "Hand-finished lounge chair carved from local premium Swat walnut wood, showcasing subtle organic curves and traditional architectural joint work.",
    isFeatured: true,
  },
  {
    title: "Balochistan Travertine Plinth",
    price: 185000,
    currency: "PKR",
    category: "DECOR",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDsCdl0mgaz1yLFj4bsGPi5W8iU8WbI7R_gea2l7KxNuKx0wtEfTJ2EwCEBjYQ_DVbPFh_jS7sbaWv3zWwZvAb6PyQwPCC7DM1w6jn1hYefm9q8VA9zZU2Ih4v9dCjyk8Zfs4VjOdUvRPGTRi1A6fdH6k1jd7bXVxNSAxtwBmPyJK7S1j6jMmkrVGsU-JnDCyM0sMDD6j_mvC3Ms9qbJ3STmeR5Wo2lzxVmB8SncnQcanqUqS1KEEW-DgwFzLNk1M8TTnKm7PwKkJGQ",
    description:
      "Sculptural display plinth columns crafted from rich multi-hued travertine onyx sourced from Balochistan quarries.",
  },
  {
    title: "Khewra Monolith Salt Lamp",
    price: 45000,
    currency: "PKR",
    category: "ACCESSORIES",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDzw15IVOU0vCHXegPxlsynbwYb-FdILW0NQM8FCesfing6wS-h2MVd4tA0iDcrrZF1078h6-7UrY-qmjIrHWvcMArHRx6wbJjfNQ7U1c6Zpk2jvhJ5bYh0BjErwyCaHiKQhkgQSQ1WPBMEhoeoXa9AKW2Wr3VNzijXaKcGupPMRq1QwB0cVN2UnqJTKDDDCf5LtGMSTNLH6TycDasA9qNEQIwMyICnm9ol9IWRQumhrHhPsqJjt06xlSiNMGZe4vxyJG_DHsfzWR1E",
    description:
      "A single, raw salt crystal block from the historic Khewra mines, fitted with precision internal low-emission illumination.",
  },
];

export const products3D: Record<ProductType, Product3D> = {
  lounger: {
    title: "Ethereal Lounger",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBdv45ZiAB-0kcsC7QWcWUYrvqGWOf63PZTgdMoX6CDz8RQuR3IP5kBOZFYn_fYfaZl59P8VTYlL5pXaiaapTdMb0oc8CGnpGAOR7rFgkKi-FAoCLawT7tFuMxDmhS4Ec3tn2of0SdhoNIkL9RAW2QKc9TShvEmO-ob1tGIUlCu1vGjQ6iw3X5INGkJN1NVdwYn8BRqre0VQCmMnCDk0t11Ta60nsbBekThEtDJcwrObL4IK4_z4nlX146QuGXDctGXG_2YzE9E-odI",
    widthClass: "w-[75%] md:w-[65%]",
    specs: [
      { name: "Finish", value: "Walnut / Ivory" },
      { name: "Frames", value: "Brushed Titanium" },
      { name: "Dimensions", value: "180x82x72 cm" },
    ],
  },
  vase: {
    title: "Obsidian Vase",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDsCdl0mgaz1yLFj4bsGPi5W8iU8WbI7R_gea2l7KxNuKx0wtEfTJ2EwCEBjYQ_DVbPFh_jS7sbaWv3zWwZvAb6PyQwPCC7DM1w6jn1hYefm9q8VA9zZU2Ih4v9dCjyk8Zfs4VjOdUvRPGTRi1A6fdH6k1jd7bXVxNSAxtwBmPyJK7S1j6jMmkrVGsU-JnDCyM0sMDD6j_mvC3Ms9qbJ3STmeR5Wo2lzxVmB8SncnQcanqUqS1KEEW-DgwFzLNk1M8TTnKm7PwKkJGQ",
    widthClass: "w-[45%] md:w-[35%]",
    specs: [
      { name: "Material", value: "Obsidian Crystal" },
      { name: "Base", value: "Travertine Stone" },
      { name: "Weight", value: "14.2 kg" },
    ],
  },
};
