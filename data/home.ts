import type { FeaturedService, CuratedProject } from "@/types";

export const featuredServices: FeaturedService[] = [];

export const curatedProjects: CuratedProject[] = [];

export const homeStudioLocations: {
  city: string;
  address: string;
  role: string;
  isHQ?: boolean;
}[] = [];
