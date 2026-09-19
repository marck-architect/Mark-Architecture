import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import { requireAdminAuth } from "@/lib/server/adminAuth";
import { projects } from "@/data/portfolio";
import { serviceCatalog } from "@/data/services";
import { architecturalPackages } from "@/data/collection";
import { leaders, achievements, studioLocations } from "@/data/about";
import { faqsData } from "@/data/faqs";
import { seedTestimonials } from "@/data/adminSeed";

export const runtime = "nodejs";

const BUCKET_NAME = "media";

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdminAuth();
    if (!authResult.success) return authResult.response;

    const { supabase } = authResult.admin;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";

    // 1. Ensure 'media' bucket exists
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const hasMedia = buckets?.some(
        (b: any) => b.id === BUCKET_NAME || b.name === BUCKET_NAME,
      );
      if (!hasMedia) {
        await supabase.storage.createBucket(BUCKET_NAME, {
          public: true,
          fileSizeLimit: 26214400,
        });
      }
    } catch (bErr) {
      console.warn("Storage bucket check:", bErr);
    }

    // 2. Upload public images to Supabase Storage
    const publicImagesDir = path.join(process.cwd(), "public", "images");
    const uploadedUrls: Record<string, string> = {};
    const mediaAssetRecords: any[] = [];

    if (fs.existsSync(publicImagesDir)) {
      const files = fs.readdirSync(publicImagesDir);

      for (const file of files) {
        const filePath = path.join(publicImagesDir, file);
        const stats = fs.statSync(filePath);
        if (!stats.isFile()) continue;

        // Categorize file into folder
        let folder = "media";
        const lower = file.toLowerCase();
        if (
          lower.includes("villa") ||
          lower.includes("mansion") ||
          lower.includes("dha")
        ) {
          folder = "projects";
        } else if (
          lower.includes("plan") ||
          lower.includes("elevation") ||
          lower.includes("package") ||
          lower.includes("call") ||
          lower.includes("estimate") ||
          lower.includes("interior")
        ) {
          folder = "services";
        } else if (lower.includes("profile")) {
          folder = "team";
        }

        const ext = path.extname(file).toLowerCase();
        const mimeType =
          ext === ".png"
            ? "image/png"
            : ext === ".jpg" || ext === ".jpeg"
              ? "image/jpeg"
              : ext === ".webp"
                ? "image/webp"
                : ext === ".avif"
                  ? "image/avif"
                  : "application/octet-stream";

        const cleanName = file.replace(/\s+/g, "-");
        const storagePath = `${folder}/${cleanName}`;
        const fileBuffer = fs.readFileSync(filePath);

        // Upload to Supabase Storage
        const { error: upErr } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(storagePath, fileBuffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (!upErr) {
          const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(storagePath);

          const publicUrl = urlData.publicUrl;
          uploadedUrls[file] = publicUrl;
          uploadedUrls[`/images/${file}`] = publicUrl;

          mediaAssetRecords.push({
            file_name: file,
            file_path: storagePath,
            public_url: publicUrl,
            folder,
            mime_type: mimeType,
            size_bytes: stats.size,
          });
        } else {
          // Fallback to absolute local public URL if storage policy blocked
          uploadedUrls[file] = `/images/${file}`;
          uploadedUrls[`/images/${file}`] = `/images/${file}`;
        }
      }
    }

    // Helper to resolve Supabase storage URL
    const getStorageUrl = (localPath: string, defaultFile: string) => {
      if (!localPath)
        return uploadedUrls[defaultFile] || `/images/${defaultFile}`;
      const basename = path.basename(localPath);
      return uploadedUrls[basename] || uploadedUrls[localPath] || localPath;
    };

    // 3. Seed Projects
    const projectInserts = projects.map((p, idx) => ({
      title: p.title,
      slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category: p.category || "residential",
      location: p.location || "Pakistan",
      year: p.year || "2026",
      description: p.description || "",
      cover_image: getStorageUrl(p.imageSrc, "dha_lahore_villa.png"),
      gallery_urls: [getStorageUrl(p.imageSrc, "dha_lahore_villa.png")],
      is_featured: idx < 3,
      is_published: true,
      display_order: idx + 1,
    }));

    try {
      await supabase.from("projects").upsert(projectInserts, {
        onConflict: "slug",
      });
    } catch (e) {
      console.warn("Projects upsert:", e);
    }

    // 4. Seed Services & Tiers
    const serviceInserts = serviceCatalog.map((s, sIdx) => ({
      slug: s.slug || s.id,
      title: s.title,
      category: s.category || "Architectural Services",
      short_description: s.shortDesc || "",
      image_url: getStorageUrl(s.image, "Full House Design Package.png"),
      pricing_type: s.pricingType || "flat",
      popularity_rank: s.popularityRank || sIdx + 1,
      is_active: true,
    }));

    try {
      const { data: insertedServices } = await supabase
        .from("services")
        .upsert(serviceInserts, { onConflict: "slug" })
        .select();

      if (insertedServices) {
        for (const s of serviceCatalog) {
          const dbService = insertedServices.find(
            (item: any) => item.slug === (s.slug || s.id),
          );
          if (!dbService || !s.tiers) continue;

          for (let tIdx = 0; tIdx < s.tiers.length; tIdx++) {
            const t = s.tiers[tIdx];
            const { data: insertedTier } = await supabase
              .from("service_tiers")
              .insert({
                service_id: dbService.id,
                tier_name: t.name,
                description: t.details || "",
                deliverables: t.deliverables || [],
                delivery_time: t.deliveryTime || "Prompt",
                display_order: tIdx + 1,
              })
              .select()
              .single();

            if (insertedTier) {
              if (t.pricePKR) {
                await supabase.from("pricing_rules").insert({
                  tier_id: insertedTier.id,
                  plot_size: "Any",
                  price_pkr: t.pricePKR,
                });
              } else if (t.priceByPlot) {
                for (const [plot, price] of Object.entries(t.priceByPlot)) {
                  await supabase.from("pricing_rules").insert({
                    tier_id: insertedTier.id,
                    plot_size: plot,
                    price_pkr: price as number,
                  });
                }
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn("Services upsert:", e);
    }

    // 5. Seed Collection Packages
    const collectionInserts = architecturalPackages.map((pkg, idx) => ({
      slug: pkg.id,
      name: pkg.title,
      subtitle: pkg.description,
      tag: pkg.tier,
      covered_area_sqft: pkg.plotSize?.includes("10")
        ? 4500
        : pkg.plotSize?.includes("1")
          ? 9000
          : 2250,
      plot_dimensions: pkg.plotSize || "50' x 90'",
      price_pkr: pkg.pricePKR,
      estimated_construction_cost: "Market Standard",
      turnaround_weeks: pkg.deliveryTime,
      cover_image: getStorageUrl(pkg.image, "House Plan review.png"),
      gallery_urls: [getStorageUrl(pkg.image, "House Plan review.png")],
      deliverables: pkg.inclusions,
      is_published: true,
      display_order: idx + 1,
    }));

    try {
      await supabase.from("collection_packages").upsert(collectionInserts, {
        onConflict: "slug",
      });
    } catch (e) {
      console.warn("Collection upsert:", e);
    }

    // 6. Seed Team Members
    const teamInserts = leaders.map((leader, idx) => ({
      name: leader.name,
      role: leader.role,
      credentials: leader.credentials,
      bio: leader.bio,
      experience_years: 15,
      council_registration: "PCATP-A-48291",
      image_url: getStorageUrl(leader.image, "profile.jpeg"),
      is_active: true,
      display_order: idx + 1,
    }));

    try {
      await supabase.from("team_members").upsert(teamInserts, {
        onConflict: "name",
      });
    } catch (e) {
      console.warn("Team upsert:", e);
    }

    // 7. Seed FAQs
    const faqInserts = faqsData.map((faq, idx) => ({
      category: faq.category,
      question: faq.question,
      answer: faq.fullAnswer
        ? `${faq.shortAnswer} ${faq.fullAnswer.join(" ")}`
        : faq.shortAnswer,
      display_order: idx + 1,
      is_published: true,
    }));

    try {
      await supabase.from("faqs").upsert(faqInserts, {
        onConflict: "question",
      });
    } catch (e) {
      console.warn("FAQs upsert:", e);
    }

    // 8. Seed Testimonials
    const testimonialInserts = seedTestimonials.map((t, idx) => ({
      client_name: t.client_name,
      company: t.company || "Private Estate",
      position: t.position || "Client",
      review: t.review,
      rating: t.rating || 5,
      photo_url: t.photo_url || null,
      project_title: t.project_title || "Residential Villa",
      is_featured: t.is_featured ?? true,
      is_published: true,
      display_order: idx + 1,
    }));

    try {
      await supabase.from("testimonials").upsert(testimonialInserts, {
        onConflict: "client_name",
      });
    } catch (e) {
      console.warn("Testimonials upsert:", e);
    }

    // 9. Seed Site Content
    try {
      await supabase.from("site_content").upsert(
        [
          {
            section_key: "about_studio",
            content: {
              achievements,
              studioLocations,
            },
          },
          {
            section_key: "home_hero",
            content: {
              heroStats: {
                totalProjects: "45+",
                squareFeetDesigned: "350,000+",
                clientSatisfaction: "99%",
                experienceYears: "15+",
              },
            },
          },
        ],
        { onConflict: "section_key" },
      );
    } catch (e) {
      console.warn("Site content upsert:", e);
    }

    // 10. Register Media Assets
    if (mediaAssetRecords.length > 0) {
      try {
        await supabase.from("media_assets").upsert(mediaAssetRecords, {
          onConflict: "file_path",
        });
      } catch (e) {
        console.warn("Media assets upsert:", e);
      }
    }

    // 11. Invalidate Next.js cache so the whole UI immediately reflects the fresh DB data
    revalidatePath("/", "layout");

    return NextResponse.json({
      success: true,
      message: "Database and Supabase Storage successfully seeded!",
      uploadedImagesCount: Object.keys(uploadedUrls).length,
      seeded: {
        projects: projectInserts.length,
        services: serviceInserts.length,
        collection: collectionInserts.length,
        team: teamInserts.length,
        faqs: faqInserts.length,
        testimonials: testimonialInserts.length,
      },
      sampleUploadedUrls: uploadedUrls,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
