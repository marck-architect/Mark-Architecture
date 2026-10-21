import type { StoreProduct } from "@/types";

// Seed catalog for the Products page. Every subcategory across all 8
// categories has at least one entry so every "Shop All" / subcategory click
// shows real products, never an empty state. A handful have real photography
// and pricing supplied by the client (image_url set); the rest render via
// their category icon until a real image_url is set from the admin panel
// (see ProductCatalog.tsx / ImageUploadField there) — no unrelated photo is
// ever faked onto a product it doesn't belong to.
export const defaultStoreProducts: StoreProduct[] = [
  // lighting
  { id: "sp-light-1", category_id: "lighting", subcategory: "Pendant lights", name: "Modern Pendant Light", price_pkr: 18500, image_url: "/images/shop/products/modern-pendant-light.jpg", is_published: true, display_order: 1 },
  { id: "sp-light-2", category_id: "lighting", subcategory: "Chandeliers", name: "Crystal Chandelier", price_pkr: 95000, image_url: "", is_published: true, display_order: 2 },
  { id: "sp-light-2", category_id: "lighting", subcategory: "Wall lights and sconces", name: "Wall Sconce", price_pkr: 7800, image_url: "", is_published: true, display_order: 3 },
  { id: "sp-light-4", category_id: "lighting", subcategory: "Table lamps", name: "Ceramic Table Lamp", price_pkr: 9200, image_url: "", is_published: true, display_order: 4 },
  { id: "sp-light-5", category_id: "lighting", subcategory: "Floor lamps", name: "Arc Floor Lamp", price_pkr: 24500, image_url: "", is_published: true, display_order: 5 },
  { id: "sp-light-6", category_id: "lighting", subcategory: "Ceiling lights", name: "Flush Mount Ceiling Light", price_pkr: 11800, image_url: "", is_published: true, display_order: 6 },
  { id: "sp-light-7", category_id: "lighting", subcategory: "Track lights and spotlights", name: "Track Spotlight Set", price_pkr: 15600, image_url: "", is_published: true, display_order: 7 },
  { id: "sp-light-8", category_id: "lighting", subcategory: "Outdoor lights", name: "Outdoor Wall Lantern", price_pkr: 8900, image_url: "", is_published: true, display_order: 8 },
  { id: "sp-light-9", category_id: "lighting", subcategory: "Garden lights", name: "Solar Garden Light", price_pkr: 3400, image_url: "", is_published: true, display_order: 9 },
  { id: "sp-light-10", category_id: "lighting", subcategory: "Smart lighting", name: "Smart LED Bulb Kit", price_pkr: 6500, image_url: "", is_published: true, display_order: 10 },

  // furniture
  { id: "sp-furn-1", category_id: "furniture", subcategory: "Sofas and lounge seating", name: "Three-Seater Sofa", price_pkr: 165000, image_url: "", is_published: true, display_order: 1 },
  { id: "sp-furn-2", category_id: "furniture", subcategory: "Beds and bedside tables", name: "Upholstered Bed Frame", price_pkr: 145000, image_url: "", is_published: true, display_order: 2 },
  { id: "sp-furn-3", category_id: "furniture", subcategory: "Dining tables and chairs", name: "6-Seater Dining Set", price_pkr: 210000, image_url: "", is_published: true, display_order: 3 },
  { id: "sp-furn-2", category_id: "furniture", subcategory: "Coffee tables and side tables", name: "Marble Coffee Table", price_pkr: 68000, image_url: "/images/shop/products/marble-coffee-table.jpg", is_published: true, display_order: 4 },
  { id: "sp-furn-1", category_id: "furniture", subcategory: "Accent chairs and stools", name: "Accent Chair", price_pkr: 42000, image_url: "/images/shop/products/accent-chair.jpg", is_published: true, display_order: 5 },
  { id: "sp-furn-6", category_id: "furniture", subcategory: "Desks and office furniture", name: "Writing Desk", price_pkr: 58000, image_url: "", is_published: true, display_order: 6 },
  { id: "sp-furn-7", category_id: "furniture", subcategory: "Shelving and TV units", name: "Floating TV Unit", price_pkr: 49000, image_url: "", is_published: true, display_order: 7 },
  { id: "sp-furn-8", category_id: "furniture", subcategory: "Outdoor furniture", name: "Rattan Patio Set", price_pkr: 125000, image_url: "", is_published: true, display_order: 8 },

  // home-decor
  { id: "sp-decor-1", category_id: "home-decor", subcategory: "Vases and decorative bowls", name: "Ceramic Vase", price_pkr: 6200, image_url: "", is_published: true, display_order: 1 },
  { id: "sp-decor-2", category_id: "home-decor", subcategory: "Sculptures and ornaments", name: "Decorative Sculpture", price_pkr: 14500, image_url: "", is_published: true, display_order: 2 },
  { id: "sp-decor-2", category_id: "home-decor", subcategory: "Mirrors", name: "Wall Mirror", price_pkr: 15500, image_url: "", is_published: true, display_order: 3 },
  { id: "sp-decor-4", category_id: "home-decor", subcategory: "Wall art and frames", name: "Framed Wall Art", price_pkr: 11200, image_url: "", is_published: true, display_order: 4 },
  { id: "sp-decor-5", category_id: "home-decor", subcategory: "Clocks", name: "Wall Clock", price_pkr: 5800, image_url: "", is_published: true, display_order: 5 },
  { id: "sp-decor-6", category_id: "home-decor", subcategory: "Rugs and cushions", name: "Area Rug", price_pkr: 28500, image_url: "", is_published: true, display_order: 6 },
  { id: "sp-decor-7", category_id: "home-decor", subcategory: "Decorative trays and accessories", name: "Decorative Tray Set", price_pkr: 4600, image_url: "", is_published: true, display_order: 7 },
  { id: "sp-decor-1", category_id: "home-decor", subcategory: "Artificial plants and indoor planters", name: "Indoor Planter", price_pkr: 9500, image_url: "/images/shop/products/indoor-planter.jpg", is_published: true, display_order: 8 },

  // tiles-finishes
  { id: "sp-tiles-1", category_id: "tiles-finishes", subcategory: "Floor tiles", name: "Porcelain Floor Tile", price_pkr: 3200, price_unit: "sq.ft", image_url: "/images/shop/products/porcelain-floor-tile.jpg", is_published: true, display_order: 1 },
  { id: "sp-tiles-2", category_id: "tiles-finishes", subcategory: "Wall tiles", name: "Ceramic Wall Tile", price_pkr: 2400, price_unit: "sq.ft", image_url: "", is_published: true, display_order: 2 },
  { id: "sp-tiles-3", category_id: "tiles-finishes", subcategory: "Bathroom and kitchen tiles", name: "Glazed Bathroom Tile", price_pkr: 2900, price_unit: "sq.ft", image_url: "", is_published: true, display_order: 3 },
  { id: "sp-tiles-4", category_id: "tiles-finishes", subcategory: "Outdoor and anti-slip tiles", name: "Anti-Slip Outdoor Tile", price_pkr: 3600, price_unit: "sq.ft", image_url: "", is_published: true, display_order: 4 },
  { id: "sp-tiles-5", category_id: "tiles-finishes", subcategory: "Mosaic and decorative tiles", name: "Mosaic Tile Sheet", price_pkr: 5400, image_url: "", is_published: true, display_order: 5 },
  { id: "sp-tiles-6", category_id: "tiles-finishes", subcategory: "Wall panels", name: "Wood-Look Wall Panel", price_pkr: 6200, image_url: "", is_published: true, display_order: 6 },
  { id: "sp-tiles-7", category_id: "tiles-finishes", subcategory: "Wallpaper", name: "Textured Wallpaper Roll", price_pkr: 7800, image_url: "", is_published: true, display_order: 7 },
  { id: "sp-tiles-2", category_id: "tiles-finishes", subcategory: "Stone cladding", name: "Stone Cladding Panel", price_pkr: 4800, image_url: "", is_published: true, display_order: 8 },
  { id: "sp-tiles-9", category_id: "tiles-finishes", subcategory: "Decorative mouldings", name: "Crown Moulding", price_pkr: 1800, price_unit: "ft", image_url: "", is_published: true, display_order: 9 },
  { id: "sp-tiles-10", category_id: "tiles-finishes", subcategory: "Fluted and feature-wall finishes", name: "Fluted Panel Set", price_pkr: 9500, image_url: "", is_published: true, display_order: 10 },

  // kitchen-bath
  { id: "sp-kb-2", category_id: "kitchen-bath", subcategory: "Wash basins and vanity units", name: "Countertop Wash Basin", price_pkr: 22000, image_url: "", is_published: true, display_order: 1 },
  { id: "sp-kb-1", category_id: "kitchen-bath", subcategory: "Faucets and mixers", name: "Basin Mixer Faucet", price_pkr: 12500, image_url: "", is_published: true, display_order: 2 },
  { id: "sp-kb-3", category_id: "kitchen-bath", subcategory: "Showers and shower sets", name: "Rain Shower Set", price_pkr: 32500, image_url: "", is_published: true, display_order: 3 },
  { id: "sp-kb-4", category_id: "kitchen-bath", subcategory: "Bathroom accessories", name: "Bathroom Accessory Set", price_pkr: 6800, image_url: "", is_published: true, display_order: 4 },
  { id: "sp-kb-5", category_id: "kitchen-bath", subcategory: "LED and bathroom mirrors", name: "LED Bathroom Mirror", price_pkr: 24500, image_url: "", is_published: true, display_order: 5 },
  { id: "sp-kb-6", category_id: "kitchen-bath", subcategory: "Kitchen sinks", name: "Stainless Steel Kitchen Sink", price_pkr: 18500, image_url: "", is_published: true, display_order: 6 },
  { id: "sp-kb-7", category_id: "kitchen-bath", subcategory: "Kitchen faucets", name: "Pull-Down Kitchen Faucet", price_pkr: 14800, image_url: "", is_published: true, display_order: 7 },
  { id: "sp-kb-8", category_id: "kitchen-bath", subcategory: "Cabinet handles", name: "Brushed Steel Cabinet Handle", price_pkr: 950, image_url: "", is_published: true, display_order: 8 },
  { id: "sp-kb-9", category_id: "kitchen-bath", subcategory: "Drawer systems and storage accessories", name: "Soft-Close Drawer System", price_pkr: 16500, image_url: "", is_published: true, display_order: 9 },

  // exterior
  { id: "sp-ext-2", category_id: "exterior", subcategory: "Exterior wall lights", name: "Wall Light (Outdoor)", price_pkr: 7800, image_url: "/images/shop/products/wall-light-outdoor.jpg", is_published: true, display_order: 1 },
  { id: "sp-ext-2", category_id: "exterior", subcategory: "House numbers and address plaques", name: "House Number Plaque", price_pkr: 4200, image_url: "", is_published: true, display_order: 2 },
  { id: "sp-ext-3", category_id: "exterior", subcategory: "Door handles and hardware", name: "Door Handle Set", price_pkr: 8600, image_url: "", is_published: true, display_order: 3 },
  { id: "sp-ext-1", category_id: "exterior", subcategory: "Main doors and gates", name: "Main Door Set", price_pkr: 85000, image_url: "", is_published: true, display_order: 4 },
  { id: "sp-ext-5", category_id: "exterior", subcategory: "Exterior cladding", name: "Exterior Wood Cladding", price_pkr: 5200, price_unit: "sq.ft", image_url: "", is_published: true, display_order: 5 },
  { id: "sp-ext-6", category_id: "exterior", subcategory: "Decorative screens", name: "Decorative Privacy Screen", price_pkr: 22500, image_url: "", is_published: true, display_order: 6 },
  { id: "sp-ext-7", category_id: "exterior", subcategory: "Outdoor tiles", name: "Outdoor Paving Tile", price_pkr: 3400, price_unit: "sq.ft", image_url: "", is_published: true, display_order: 7 },
  { id: "sp-ext-8", category_id: "exterior", subcategory: "Exterior planters", name: "Large Exterior Planter", price_pkr: 11500, image_url: "", is_published: true, display_order: 8 },

  // garden-landscape
  { id: "sp-garden-1", category_id: "garden-landscape", subcategory: "Planters and pots", name: "Outdoor Planter", price_pkr: 7200, image_url: "", is_published: true, display_order: 1 },
  { id: "sp-garden-2", category_id: "garden-landscape", subcategory: "Indoor and outdoor plants", name: "Potted Plant", price_pkr: 4800, image_url: "", is_published: true, display_order: 2 },
  { id: "sp-garden-3", category_id: "garden-landscape", subcategory: "Garden lighting", name: "Solar String Lights", price_pkr: 3900, image_url: "", is_published: true, display_order: 3 },
  { id: "sp-garden-2", category_id: "garden-landscape", subcategory: "Garden benches and swings", name: "Garden Bench", price_pkr: 32000, image_url: "", is_published: true, display_order: 4 },
  { id: "sp-garden-5", category_id: "garden-landscape", subcategory: "Outdoor décor", name: "Garden Wind Chime", price_pkr: 2600, image_url: "", is_published: true, display_order: 5 },
  { id: "sp-garden-6", category_id: "garden-landscape", subcategory: "Fountains and water features", name: "Tiered Water Fountain", price_pkr: 48500, image_url: "", is_published: true, display_order: 6 },
  { id: "sp-garden-7", category_id: "garden-landscape", subcategory: "Pergolas and trellises", name: "Wooden Pergola Kit", price_pkr: 165000, image_url: "", is_published: true, display_order: 7 },
  { id: "sp-garden-8", category_id: "garden-landscape", subcategory: "Artificial grass", name: "Artificial Grass Turf", price_pkr: 950, price_unit: "sq.ft", image_url: "", is_published: true, display_order: 8 },
  { id: "sp-garden-9", category_id: "garden-landscape", subcategory: "Garden edging", name: "Stone Garden Edging", price_pkr: 1200, price_unit: "ft", image_url: "", is_published: true, display_order: 9 },
  { id: "sp-garden-10", category_id: "garden-landscape", subcategory: "Outdoor umbrellas", name: "Cantilever Patio Umbrella", price_pkr: 38500, image_url: "", is_published: true, display_order: 10 },

  // shop-the-look
  { id: "sp-look-1", category_id: "shop-the-look", subcategory: "Living room collections", name: "Living Room Collection", price_pkr: 185000, image_url: "", is_published: true, display_order: 1 },
  { id: "sp-look-2", category_id: "shop-the-look", subcategory: "Bedroom collections", name: "Bedroom Collection", price_pkr: 165000, image_url: "", is_published: true, display_order: 2 },
  { id: "sp-look-3", category_id: "shop-the-look", subcategory: "Dining room collections", name: "Dining Room Collection", price_pkr: 195000, image_url: "", is_published: true, display_order: 3 },
  { id: "sp-look-4", category_id: "shop-the-look", subcategory: "Kitchen collections", name: "Kitchen Styling Collection", price_pkr: 145000, image_url: "", is_published: true, display_order: 4 },
  { id: "sp-look-5", category_id: "shop-the-look", subcategory: "Bathroom collections", name: "Bathroom Styling Collection", price_pkr: 98000, image_url: "", is_published: true, display_order: 5 },
  { id: "sp-look-6", category_id: "shop-the-look", subcategory: "House elevation collections", name: "House Elevation Package", price_pkr: 450000, image_url: "", is_published: true, display_order: 6 },
  { id: "sp-look-7", category_id: "shop-the-look", subcategory: "Balcony and terrace collections", name: "Balcony & Terrace Collection", price_pkr: 78000, image_url: "", is_published: true, display_order: 7 },
  { id: "sp-look-8", category_id: "shop-the-look", subcategory: "Garden and landscape collections", name: "Garden & Landscape Collection", price_pkr: 225000, image_url: "", is_published: true, display_order: 8 },
];
