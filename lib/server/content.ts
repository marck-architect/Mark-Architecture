import "server-only";
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { projects as fallbackProjects } from "@/data/portfolio";
import { architecturalPackages as fallbackCollection } from "@/data/collection";
import { serviceCatalog as fallbackServiceCatalog } from "@/data/services";
import {
  leaders as fallbackLeaders,
  achievements as fallbackAchievements,
  studioLocations as fallbackStudioLocations,
} from "@/data/about";
import { faqsData as fallbackFaqs } from "@/data/faqs";

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

function mapFallbackProjects(): AdminProject[] {
  return fallbackProjects.map((p, idx) => ({
    id: `proj_fallback_${idx + 1}`,
    title: p.title,
    slug: p.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-"),
    category: p.category as any,
    location: p.location,
    year: p.year,
    description: p.description,
    short_description: p.description.slice(0, 140) + "...",
    cover_image: p.imageSrc,
    gallery_urls: [p.imageSrc],
    price: p.price,
    aspectClass: p.aspectClass,
    is_featured: idx < 3,
    is_published: true,
    display_order: idx + 1,
    area_sqft: 5000,
  }));
}

function mapFallbackServices(): AdminService[] {
  return fallbackServiceCatalog.map((s, idx) => ({
    id: s.id,
    slug: s.slug || s.id,
    title: s.title,
    category: s.category || "Architectural Services",
    short_description: s.shortDesc || "",
    image_url: s.image,
    pricing_type: s.pricingType as any,
    popularity_rank: s.popularityRank || idx + 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tiers:
      s.tiers?.map((t, tIdx) => ({
        id: `${s.id}_tier_${tIdx + 1}`,
        service_id: s.id,
        tier_name: t.name,
        description: t.details || "",
        deliverables: t.deliverables || [],
        delivery_time: t.deliveryTime || "Prompt",
        display_order: tIdx + 1,
        pricing_rules: t.pricePKR
          ? [
              {
                id: `pr_${s.id}_${tIdx}`,
                tier_id: `${s.id}_tier_${tIdx + 1}`,
                plot_size: "Any",
                price_pkr: t.pricePKR,
              },
            ]
          : t.priceByPlot
            ? Object.entries(t.priceByPlot).map(([plot, price], prIdx) => ({
                id: `pr_${s.id}_${tIdx}_${prIdx}`,
                tier_id: `${s.id}_tier_${tIdx + 1}`,
                plot_size: plot as any,
                price_pkr: price as number,
              }))
            : [],
      })) || [],
  }));
}

/**
 * Public Projects for /portfolio and Homepage Featured Section
 */
export async function getPublicProjects(): Promise<AdminProject[]> {
  // 1. Try Supabase DB
  try {
    const supabase = getPublicSupabaseClient();
    if (supabase) {
      // 1a. Try 'site_content' table first (contains full rich payload including aspectClass & price)
      const { data: contentData } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", "projects")
        .single();

      if (
        contentData?.content &&
        Array.isArray(contentData.content) &&
        contentData.content.length > 0
      ) {
        return contentData.content.filter(
          (p: AdminProject) => p.is_published !== false,
        );
      }

      // 1b. Try dedicated 'projects' table
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("is_published", true)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        // Read local projects to fill in aspectClass & price if needed
        let localProjects: AdminProject[] = [];
        try {
          const localFile = path.join(process.cwd(), "data", "projects.json");
          if (fs.existsSync(localFile)) {
            localProjects = JSON.parse(fs.readFileSync(localFile, "utf8"));
          }
        } catch {}

        return data.map((p: any) => {
          const matched = localProjects.find(
            (l) => l.id === String(p.id) || l.slug === p.slug,
          );
          return {
            ...p,
            id: String(p.id),
            price: p.price || matched?.price || null,
            aspectClass:
              p.aspectClass || matched?.aspectClass || "aspect-[4/5]",
            short_description:
              p.short_description || matched?.short_description || null,
          } as AdminProject;
        });
      }
    }
  } catch (err) {
    console.warn("Notice: Fetching projects from Supabase:", err);
  }

  // 2. Fallback to local data/projects.json
  try {
    const localFile = path.join(process.cwd(), "data", "projects.json");
    if (fs.existsSync(localFile)) {
      const content = fs.readFileSync(localFile, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((p: AdminProject) => p.is_published !== false);
      }
    }
  } catch (err) {
    console.warn("Notice: Reading local projects file:", err);
  }

  // 3. Static fallback
  return mapFallbackProjects();
}

/**
 * Public Services for /services and /services/[slug]
 */
export async function getPublicServices(): Promise<AdminService[]> {
  try {
    const supabase = getPublicSupabaseClient();
    if (supabase) {
      // 1a. Try dedicated 'services' table
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

      // 1b. Try 'site_content' table
      const { data: contentData } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", "services")
        .single();

      if (
        contentData?.content &&
        Array.isArray(contentData.content) &&
        contentData.content.length > 0
      ) {
        return contentData.content.filter(
          (s: AdminService) => s.is_active !== false,
        );
      }
    }
  } catch (err) {
    console.warn("Notice: Fetching services from Supabase:", err);
  }

  return mapFallbackServices();
}

/**
 * Public Collection Packages for /collection
 */
export async function getPublicCollection(): Promise<ArchitecturalPackage[]> {
  try {
    const supabase = getPublicSupabaseClient();
    if (supabase) {
      // 1a. Try 'site_content' table first (guaranteed to match latest admin edits)
      const { data: contentData } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", "collection_packages")
        .single();

      if (
        contentData?.content &&
        Array.isArray(contentData.content) &&
        contentData.content.length > 0
      ) {
        return contentData.content
          .filter((item: any) => item.is_published !== false)
          .map((item: any) => ({
            id: item.slug || item.id,
            title: item.name || item.title,
            tier: item.tag || item.tier || "Standard Package",
            pricePKR: Number(item.price_pkr || item.pricePKR) || 9000,
            deliveryTime:
              item.turnaround_weeks || item.deliveryTime || "3-5 Days",
            image:
              item.cover_image ||
              item.image ||
              "/images/Full House Design Package.png",
            plotSize: item.plot_dimensions || item.plotSize || "Standard",
            inclusions: item.deliverables || item.inclusions || [],
            description: item.subtitle || item.description || "",
          }));
      }

      // 1b. Try dedicated 'collection_packages' table
      const { data, error } = await supabase
        .from("collection_packages")
        .select("*")
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          id: item.slug || item.id,
          title: item.name,
          tier: item.tag || "Standard Package",
          pricePKR: Number(item.price_pkr) || 9000,
          deliveryTime: item.turnaround_weeks || "3-5 Days",
          image: item.cover_image || "/images/Full House Design Package.png",
          plotSize: item.plot_dimensions || "Standard",
          inclusions: item.deliverables || [],
          description: item.subtitle || "",
        }));
      }
    }
  } catch (err) {
    console.warn("Notice: Fetching collection from Supabase:", err);
  }

  // 2. Fallback to local data/collection.json
  try {
    const localFile = path.join(process.cwd(), "data", "collection.json");
    if (fs.existsSync(localFile)) {
      const content = fs.readFileSync(localFile, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
          .filter((item: any) => item.is_published !== false)
          .map((item: any) => ({
            id: item.slug || item.id,
            title: item.name || item.title,
            tier: item.tag || item.tier || "Standard Package",
            pricePKR: Number(item.price_pkr || item.pricePKR) || 9000,
            deliveryTime:
              item.turnaround_weeks || item.deliveryTime || "3-5 Days",
            image:
              item.cover_image ||
              item.image ||
              "/images/Full House Design Package.png",
            plotSize: item.plot_dimensions || item.plotSize || "Standard",
            inclusions: item.deliverables || item.inclusions || [],
            description: item.subtitle || item.description || "",
          }));
      }
    }
  } catch (err) {
    console.warn("Notice: Reading local collection file:", err);
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
  let leaders: Leader[] = [];
  let achievements = fallbackAchievements;
  let studioLocations = fallbackStudioLocations;

  try {
    const supabase = getPublicSupabaseClient();
    if (supabase) {
      // 1a. Fetch from team_members table
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
          experience: m.experience || m.specialization || "15+ Years Practice",
          image:
            m.photo_url ||
            m.image_url ||
            "/images/profile-removebg-preview.png",
        }));
      } else {
        // 1b. Fallback to site_content table
        try {
          const { data: teamContent } = await supabase
            .from("site_content")
            .select("content")
            .eq("section_key", "team_members")
            .single();

          if (
            teamContent?.content?.members &&
            Array.isArray(teamContent.content.members) &&
            teamContent.content.members.length > 0
          ) {
            leaders = teamContent.content.members
              .filter((m: any) => m.is_active !== false)
              .map((m: any) => ({
                name: m.name,
                role: m.role,
                credentials: m.credentials || "",
                bio: m.bio || "",
                experience:
                  m.experience || m.specialization || "15+ Years Practice",
                image:
                  m.photo_url ||
                  m.image_url ||
                  "/images/profile-removebg-preview.png",
              }));
          }
        } catch {
          // Ignore
        }
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
    console.warn("Notice: Fetching team from Supabase:", err);
  }

  // 3. Local team fallback
  if (leaders.length === 0) {
    try {
      const localTeamFile = path.join(process.cwd(), "data", "team.json");
      if (fs.existsSync(localTeamFile)) {
        const parsed = JSON.parse(fs.readFileSync(localTeamFile, "utf8"));
        if (Array.isArray(parsed) && parsed.length > 0) {
          leaders = parsed
            .filter((m: any) => m.is_active !== false)
            .map((m: any) => ({
              name: m.name,
              role: m.role,
              credentials: m.credentials || "",
              bio: m.bio || "",
              experience:
                m.experience || m.specialization || "15+ Years Practice",
              image:
                m.photo_url ||
                m.image_url ||
                "/images/profile-removebg-preview.png",
            }));
        }
      }
    } catch (err) {
      console.warn("Notice: Reading local team file:", err);
    }
  }

  if (leaders.length === 0 && fallbackLeaders && fallbackLeaders.length > 0) {
    leaders = fallbackLeaders;
  }

  return { leaders, achievements, studioLocations };
}

/**
 * Public FAQs for /faqs
 */
export async function getPublicFaqs(): Promise<AdminFaq[]> {
  try {
    const supabase = getPublicSupabaseClient();
    if (supabase) {
      // 1a. Try faqs table
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as AdminFaq[];
      }

      // 1b. Try site_content table
      const { data: contentData } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", "faqs")
        .single();

      if (
        contentData?.content &&
        Array.isArray(contentData.content) &&
        contentData.content.length > 0
      ) {
        return contentData.content.filter(
          (f: AdminFaq) => f.is_published !== false,
        );
      }
    }
  } catch (err) {
    console.warn("Notice: Fetching faqs from Supabase:", err);
  }

  // 2. Local fallback
  try {
    const localFaqsFile = path.join(process.cwd(), "data", "faqs.json");
    if (fs.existsSync(localFaqsFile)) {
      const parsed = JSON.parse(fs.readFileSync(localFaqsFile, "utf8"));
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((f: any) => f.is_published !== false);
      }
    }
  } catch {
    // Ignore
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
    if (supabase) {
      // 1a. Try testimonials table
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as AdminTestimonial[];
      }

      // 1b. Try site_content table
      const { data: contentData } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", "testimonials")
        .single();

      if (
        contentData?.content &&
        Array.isArray(contentData.content) &&
        contentData.content.length > 0
      ) {
        return contentData.content.filter(
          (t: AdminTestimonial) => t.is_published !== false,
        );
      }
    }
  } catch (err) {
    console.warn("Notice: Fetching testimonials from Supabase:", err);
  }

  // 2. Local file fallback
  try {
    const localTestimonialsFile = path.join(
      process.cwd(),
      "data",
      "testimonials.json",
    );
    if (fs.existsSync(localTestimonialsFile)) {
      const content = fs.readFileSync(localTestimonialsFile, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((t: any) => t.is_published !== false);
      }
    }
  } catch (err) {
    console.warn("Notice: Reading local testimonials file:", err);
  }

  return [];
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
    if (supabase) {
      const { data, error } = await supabase
        .from("site_content")
        .select("content")
        .eq("section_key", sectionKey)
        .single();

      if (!error && data?.content) {
        return data.content as T;
      }
    }
  } catch (err) {
    console.warn(
      `Notice: Fetching site_content [${sectionKey}] from Supabase:`,
      err,
    );
  }

  // Fallback to local persisted file (e.g. data/pricing_settings.json)
  try {
    const localFile = path.join(process.cwd(), "data", `${sectionKey}.json`);
    if (fs.existsSync(localFile)) {
      const raw = fs.readFileSync(localFile, "utf8");
      return JSON.parse(raw) as T;
    }
  } catch {
    // Ignore
  }

  return fallback;
}
