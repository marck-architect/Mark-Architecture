import "server-only";
import { createClient } from "@supabase/supabase-js";
import { projects as fallbackProjects } from "@/data/portfolio";
import { architecturalPackages as fallbackCollection } from "@/data/collection";
import {
  leaders as fallbackLeaders,
  achievements as fallbackAchievements,
  studioLocations as fallbackStudioLocations,
} from "@/data/about";
import { faqsData as fallbackFaqs } from "@/data/faqs";
import {
  seedServices as fallbackServices,
  seedTestimonials,
} from "@/data/adminSeed";
import type {
  AdminProject,
  AdminService,
  Leader,
  Achievement,
  StudioLocation,
  ArchitecturalPackage,
  AdminTestimonial,
  AdminFaq,
} from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

function getPublicSupabaseClient() {
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
}

/**
 * Public Projects for /portfolio and Homepage Featured Section
 */
export async function getPublicProjects(): Promise<AdminProject[]> {
  try {
    const supabase = getPublicSupabaseClient();
    if (!supabase) return mapFallbackProjects();

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data as AdminProject[];
    }
  } catch (err) {
    console.warn("Notice: Fetching projects from database fallback:", err);
  }

  return mapFallbackProjects();
}

function mapFallbackProjects(): AdminProject[] {
  return fallbackProjects.map((p, idx) => ({
    id: `proj_fallback_${idx + 1}`,
    title: p.title,
    slug: p.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-"),
    category: p.category,
    location: p.location,
    year: p.year,
    description: p.description,
    short_description: p.description.slice(0, 140) + "...",
    cover_image: p.imageSrc,
    gallery_urls: [p.imageSrc],
    is_featured: idx < 3,
    is_published: true,
    display_order: idx + 1,
    area_sqft: p.price ? 5000 : null,
  }));
}

/**
 * Public Services for /services and /services/[slug]
 */
export async function getPublicServices(): Promise<AdminService[]> {
  try {
    const supabase = getPublicSupabaseClient();
    if (!supabase) return fallbackServices as unknown as AdminService[];

    const { data: services, error } = await supabase
      .from("services")
      .select(
        `
        *,
        tiers:service_tiers (
          *,
          pricing_rules (*)
        )
      `,
      )
      .eq("is_active", true)
      .order("popularity_rank", { ascending: true });

    if (!error && services && services.length > 0) {
      return services as AdminService[];
    }
  } catch (err) {
    console.warn("Notice: Fetching services from database fallback:", err);
  }

  return fallbackServices as unknown as AdminService[];
}

/**
 * Public Collection Packages for /collection
 */
export async function getPublicCollection(): Promise<ArchitecturalPackage[]> {
  try {
    const supabase = getPublicSupabaseClient();
    if (!supabase) return fallbackCollection;

    const { data, error } = await supabase
      .from("collection_packages")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((item) => ({
        id: item.slug || item.id,
        title: item.name,
        tier: item.tag || "Signature Package",
        pricePKR: Number(item.price_pkr) || 28000,
        deliveryTime: item.turnaround_weeks || "3-4 weeks delivery",
        image: item.cover_image || "/images/Full House Design Package.png",
        plotSize: item.plot_dimensions || "Standard",
        inclusions: item.deliverables || [],
        description: item.subtitle || "",
      }));
    }
  } catch (err) {
    console.warn("Notice: Fetching collection from database fallback:", err);
  }

  return fallbackCollection;
}

/**
 * Public Leadership & Team for /about and Homepage
 */
export async function getPublicTeam(): Promise<{
  leaders: Leader[];
  achievements: Achievement[];
  studioLocations: StudioLocation[];
}> {
  let leaders = fallbackLeaders;
  let achievements = fallbackAchievements;
  let studioLocations = fallbackStudioLocations;

  try {
    const supabase = getPublicSupabaseClient();
    if (supabase) {
      // 1. Fetch team members
      const { data: teamData, error: teamError } = await supabase
        .from("team_members")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!teamError && teamData && teamData.length > 0) {
        leaders = teamData.map((m) => ({
          name: m.name,
          role: m.role,
          credentials: m.credentials || "",
          bio: m.bio || "",
          experience: m.experience || "",
          image: m.image_url || "/images/profile-removebg-preview.png",
        }));
      }

      // 2. Fetch studio copy & achievements
      const { data: contentData } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", "about_studio")
        .single();

      if (contentData?.content) {
        const c = contentData.content;
        if (Array.isArray(c.achievements) && c.achievements.length > 0) {
          achievements = c.achievements;
        }
        if (Array.isArray(c.studioLocations) && c.studioLocations.length > 0) {
          studioLocations = c.studioLocations;
        }
      }
    }
  } catch (err) {
    console.warn("Notice: Fetching team from database fallback:", err);
  }

  return { leaders, achievements, studioLocations };
}

/**
 * Public FAQs for /faqs
 */
export async function getPublicFaqs(): Promise<AdminFaq[]> {
  try {
    const supabase = getPublicSupabaseClient();
    if (!supabase)
      return fallbackFaqs.map((f, idx) => ({
        id: f.id,
        question: f.question,
        answer: f.fullAnswer
          ? `${f.shortAnswer} ${f.fullAnswer.join(" ")}`
          : f.shortAnswer,
        category: f.category,
        display_order: idx + 1,
        is_published: true,
      }));

    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return data as AdminFaq[];
    }
  } catch (err) {
    console.warn("Notice: Fetching faqs from database fallback:", err);
  }

  return fallbackFaqs.map((f, idx) => ({
    id: f.id,
    question: f.question,
    answer: f.fullAnswer
      ? `${f.shortAnswer} ${f.fullAnswer.join(" ")}`
      : f.shortAnswer,
    category: f.category,
    display_order: idx + 1,
    is_published: true,
  }));
}

/**
 * Public Testimonials for Homepage
 */
export async function getPublicTestimonials(): Promise<AdminTestimonial[]> {
  try {
    const supabase = getPublicSupabaseClient();
    if (!supabase) return seedTestimonials;

    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return data as AdminTestimonial[];
    }
  } catch (err) {
    console.warn("Notice: Fetching testimonials from database fallback:", err);
  }

  return seedTestimonials;
}

/**
 * Site Content JSON (e.g. 'home_hero', 'about_studio')
 */
export async function getSiteContent<T>(
  sectionKey: string,
  fallback: T,
): Promise<T> {
  try {
    const supabase = getPublicSupabaseClient();
    if (!supabase) return fallback;

    const { data, error } = await supabase
      .from("site_content")
      .select("content")
      .eq("section_key", sectionKey)
      .single();

    if (!error && data?.content) {
      return data.content as T;
    }
  } catch (err) {
    console.warn(
      `Notice: Fetching site_content [${sectionKey}] fallback:`,
      err,
    );
  }

  return fallback;
}
