export interface ProductCategory {
  id: string;
  title: string;
  subtitle: string;
  subcategories: string[];
}

// Exact taxonomy supplied by the client — 8 top-level categories, each with
// its real subcategory list. No product-level data (price/photo/SKU) yet:
// there's no real inventory to show, so this stays structural until the
// client supplies actual products.
export const productCategories: ProductCategory[] = [
  {
    id: "lighting",
    title: "Lighting",
    subtitle: "Indoor & outdoor fixtures",
    subcategories: [
      "Pendant lights",
      "Chandeliers",
      "Wall lights and sconces",
      "Table lamps",
      "Floor lamps",
      "Ceiling lights",
      "Track lights and spotlights",
      "Outdoor lights",
      "Garden lights",
      "Smart lighting",
    ],
  },
  {
    id: "furniture",
    title: "Furniture",
    subtitle: "Living, bedroom & dining",
    subcategories: [
      "Sofas and lounge seating",
      "Beds and bedside tables",
      "Dining tables and chairs",
      "Coffee tables and side tables",
      "Accent chairs and stools",
      "Desks and office furniture",
      "Shelving and TV units",
      "Outdoor furniture",
    ],
  },
  {
    id: "home-decor",
    title: "Home Décor",
    subtitle: "Vases, mirrors & wall art",
    subcategories: [
      "Vases and decorative bowls",
      "Sculptures and ornaments",
      "Mirrors",
      "Wall art and frames",
      "Clocks",
      "Rugs and cushions",
      "Decorative trays and accessories",
      "Artificial plants and indoor planters",
    ],
  },
  {
    id: "tiles-finishes",
    title: "Tiles & Finishes",
    subtitle: "Tiles & wall panels",
    subcategories: [
      "Floor tiles",
      "Wall tiles",
      "Bathroom and kitchen tiles",
      "Outdoor and anti-slip tiles",
      "Mosaic and decorative tiles",
      "Wall panels",
      "Wallpaper",
      "Stone cladding",
      "Decorative mouldings",
      "Fluted and feature-wall finishes",
    ],
  },
  {
    id: "kitchen-bath",
    title: "Kitchen & Bath",
    subtitle: "Sanitary, faucets & accessories",
    subcategories: [
      "Wash basins and vanity units",
      "Faucets and mixers",
      "Showers and shower sets",
      "Bathroom accessories",
      "LED and bathroom mirrors",
      "Kitchen sinks",
      "Kitchen faucets",
      "Cabinet handles",
      "Drawer systems and storage accessories",
    ],
  },
  {
    id: "exterior",
    title: "Exterior Products",
    subtitle: "Lighting, hardware & cladding",
    subcategories: [
      "Exterior wall lights",
      "House numbers and address plaques",
      "Door handles and hardware",
      "Main doors and gates",
      "Exterior cladding",
      "Decorative screens",
      "Outdoor tiles",
      "Exterior planters",
    ],
  },
  {
    id: "garden-landscape",
    title: "Garden & Landscape",
    subtitle: "Planters, plants & outdoor living",
    subcategories: [
      "Planters and pots",
      "Indoor and outdoor plants",
      "Garden lighting",
      "Garden benches and swings",
      "Outdoor décor",
      "Fountains and water features",
      "Pergolas and trellises",
      "Artificial grass",
      "Garden edging",
      "Outdoor umbrellas",
    ],
  },
  {
    id: "shop-the-look",
    title: "Shop the Look",
    subtitle: "Complete, styled spaces",
    subcategories: [
      "Living room collections",
      "Bedroom collections",
      "Dining room collections",
      "Kitchen collections",
      "Bathroom collections",
      "House elevation collections",
      "Balcony and terrace collections",
      "Garden and landscape collections",
    ],
  },
];
