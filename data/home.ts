import type {
  FeaturedService,
  CuratedProject,
  AdminTestimonial,
} from "@/types";

export const featuredServices: FeaturedService[] = [];

export const curatedProjects: CuratedProject[] = [
  {
    title: "The Hayatabad Minimalist",
    category: "RESIDENTIAL",
    location: "Hayatabad, Peshawar, Pakistan",
    image: "/images/dha_lahore_villa.png",
    scale: "1 Kanal • 6,200 sq. ft.",
  },
  {
    title: "Margalla Crest Contemporary Mansion",
    category: "RESIDENTIAL",
    location: "DHA Phase 2, Islamabad, Pakistan",
    image: "/images/dha_islamabad_mansion.png",
    scale: "2 Kanal • 9,500 sq. ft.",
  },
  {
    title: "The Clifton Coastal Residence",
    category: "RESIDENTIAL",
    location: "Clifton Block 4, Karachi, Pakistan",
    image: "/images/clifton_karachi_villa.png",
    scale: "10 Marla • 3,850 sq. ft.",
  },
];

export const fallbackTestimonials: AdminTestimonial[] = [
  {
    id: "test_1",
    client_name: "Usman Ghani",
    company: "Ghani Holdings",
    position: "Managing Director",
    rating: 5,
    project_title: "1 Kanal Villa Review • DHA Lahore",
    photo_url: "/images/profile.png",
    is_featured: true,
    is_published: true,
    display_order: 1,
    review:
      "MARK Architects caught three critical structural clashes in under 48 hours. Saved us millions before pouring concrete.",
  },
  {
    id: "test_2",
    client_name: "Fatima Noor",
    company: "Bespoke Living Studio",
    position: "Founder & Creative Director",
    rating: 5,
    project_title: "Modern Facade Concept • Islamabad",
    photo_url: "/images/profile.png",
    is_featured: true,
    is_published: true,
    display_order: 2,
    review:
      "The 3D front elevation render was so photorealistic that the CDA approval board passed our facade on first presentation without a single revision.",
  },
  {
    id: "test_3",
    client_name: "Engr. Tariq Mehmood",
    company: "Mehmood & Sons Construction",
    position: "Lead Civil Engineer",
    rating: 5,
    project_title: "10 Marla Turnkey Engineering Blueprints",
    photo_url: "/images/profile.png",
    is_featured: false,
    is_published: true,
    display_order: 3,
    review:
      "Their mathematical precision in structural column schedules and plumbing layouts makes on-site execution flawless. By far the most detailed drawings in Pakistan.",
  },
  {
    id: "test_4",
    client_name: "Dr. Arshad Khan",
    company: "Hayatabad Residency",
    position: "Homeowner",
    rating: 5,
    project_title: "Passive Solar Layout Planning • Peshawar",
    photo_url: "/images/profile.png",
    is_featured: true,
    is_published: true,
    display_order: 4,
    review:
      "The passive solar ventilation corridors work exceptionally well. Our home stays comfortably cool during peak summer heat with noticeably reduced air conditioning bills.",
  },
];

export const homeStudioLocations: {
  city: string;
  address: string;
  role: string;
  isHQ?: boolean;
}[] = [];
