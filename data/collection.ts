import type {
  ArchitecturalPackage,
  Product,
  Product3D,
  ProductType,
} from "@/types";

export const architecturalPackages: ArchitecturalPackage[] = [];

export const physicalProducts: Product[] = [];

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
