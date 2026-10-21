export interface ProductCategory {
  id: string;
  title: string;
  subtitle: string;
  /** Used for the small category tile on the Products page. */
  image: string;
  /** Used for the wide hero banner on the category's own page; falls back to `image` when unset. */
  heroImage?: string;
  /** Sampled dominant tone of the hero photo, used as the hero band's fill color so the photo blends in. */
  bandColor: string;
  subcategories: string[];
}

// Exact taxonomy supplied by the client — 8 top-level categories, each with
// its real subcategory list and a representative category photo.
export const productCategories: ProductCategory[] = [
  {
    id: "lighting",
    title: "Lighting",
    subtitle: "Indoor & outdoor fixtures",
    image: "/images/shop/categories/lighting.jpg",
    bandColor: "#4e3b28",
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
    image: "/images/shop/categories/furniture.jpg",
    bandColor: "#37362b",
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
    image: "/images/shop/categories/home-decor.jpg",
    bandColor: "#4d3e30",
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
    title: "Tiles & Wall Finishes",
    subtitle: "Tiles & wall panels",
    image: "/images/shop/categories/tiles-finishes.jpg",
    bandColor: "#5f5144",
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
    image: "/images/shop/categories/kitchen-bath.jpg",
    bandColor: "#b5aea5",
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
    image: "/images/shop/categories/exterior-products.jpg",
    bandColor: "#4a4036",
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
    image: "/images/shop/categories/garden-landscape.jpg",
    bandColor: "#534726",
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
    image: "/images/shop/categories/shop-the-look.jpg",
    heroImage: "/images/shop/categories/shop-the-look-hero.jpg",
    bandColor: "#332d1d",
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

export interface StyledLook {
  slug: string;
  name: string;
  image: string;
}

// "Shop the Look" room photography — real rooms supplied by the client.
export const styledLooks: StyledLook[] = [
  { slug: "living-room", name: "Living Room", image: "/images/shop/looks/living-room.jpg" },
  { slug: "bedroom", name: "Bedroom", image: "/images/shop/looks/bedroom.jpg" },
  { slug: "kitchen", name: "Kitchen", image: "/images/shop/looks/kitchen.jpg" },
  { slug: "bathroom", name: "Bathroom", image: "/images/shop/looks/bathroom.jpg" },
  { slug: "house-exterior", name: "House Exterior", image: "/images/shop/looks/house-exterior.jpg" },
  { slug: "garden-outdoor", name: "Garden & Outdoor", image: "/images/shop/looks/garden-outdoor.jpg" },
];
