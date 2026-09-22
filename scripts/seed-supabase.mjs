import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Load .env.local manually
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [k, ...v] = trimmed.split("=");
      process.env[k.trim()] = v
        .join("=")
        .trim()
        .replace(/^['"]|['"]$/g, "");
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "❌ Missing NEXT_PUBLIC_SUPABASE_URL or Supabase Key in .env.local",
  );
  process.exit(1);
}

console.log("🚀 Initializing Supabase client to:", supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

const BUCKET_NAME = "media";

async function main() {
  console.log("\n📦 Step 1: Checking and preparing storage bucket 'media'...");
  try {
    const { data: buckets, error: bListErr } =
      await supabase.storage.listBuckets();
    const hasMedia = buckets?.some(
      (b) => b.id === BUCKET_NAME || b.name === BUCKET_NAME,
    );

    if (!hasMedia) {
      const { error: bCreateErr } = await supabase.storage.createBucket(
        BUCKET_NAME,
        {
          public: true,
          fileSizeLimit: 26214400,
        },
      );
      if (bCreateErr) {
        console.warn("⚠️ Notice while creating bucket:", bCreateErr.message);
      } else {
        console.log("✅ Bucket 'media' created successfully!");
      }
    } else {
      console.log("✅ Bucket 'media' already exists.");
    }
  } catch (err) {
    console.warn("Bucket check warning:", err);
  }

  console.log(
    "\n📸 Step 2: Uploading images from public/images to Supabase Storage...",
  );
  const publicImagesDir = path.join(process.cwd(), "public", "images");
  const uploadedUrls = {};
  const mediaAssetRecords = [];

  if (fs.existsSync(publicImagesDir)) {
    const files = fs.readdirSync(publicImagesDir);

    for (const file of files) {
      const filePath = path.join(publicImagesDir, file);
      const stats = fs.statSync(filePath);
      if (!stats.isFile()) continue;

      let folder = "media";
      const lower = file.toLowerCase();
      if (
        lower.includes("villa") ||
        lower.includes("mansion") ||
        lower.includes("dha") ||
        lower.includes("clifton")
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
        uploadedUrls[storagePath] = publicUrl;
        console.log(`  ✓ Uploaded [${folder}]: ${file} -> ${publicUrl}`);

        mediaAssetRecords.push({
          file_name: file,
          file_path: storagePath,
          public_url: publicUrl,
          folder,
          mime_type: mimeType,
          size_bytes: stats.size,
        });
      } else {
        console.warn(`  ⚠️ Upload failed for ${file}: ${upErr.message}`);
        uploadedUrls[file] = `/images/${file}`;
        uploadedUrls[`/images/${file}`] = `/images/${file}`;
      }
    }

    // Special fallback alias for profile.png
    if (!uploadedUrls["profile.png"] && uploadedUrls["profile.jpeg"]) {
      uploadedUrls["profile.png"] = uploadedUrls["profile.jpeg"];
      uploadedUrls["/images/profile.png"] = uploadedUrls["profile.jpeg"];
    }
  }

  const getStorageUrl = (name, fallback) => {
    return (
      uploadedUrls[name] ||
      uploadedUrls[`/images/${name}`] ||
      uploadedUrls[fallback] ||
      `/images/${fallback}`
    );
  };

  console.log("\n🏛️ Step 3: Seeding Portfolio Projects (8 Projects)...");
  const projectsData = [
    {
      id: "proj_1",
      title: "The Hayatabad Minimalist Estate",
      slug: "the-hayatabad-minimalist-estate",
      category: "residential",
      location: "Ring Road, Hayatabad, Peshawar, Pakistan",
      year: "2025",
      client_name: "Private Client",
      area_sqft: 6200,
      price: "1 Kanal • 6,200 sq. ft.",
      aspectClass: "aspect-[4/5]",
      description:
        "An ultra-luxury 1-Kanal residence in Hayatabad, Peshawar. Designed with passive solar layout, exposed structural concrete, floor-to-ceiling thermal double-glazing, and private interior courtyard.",
      short_description:
        "An ultra-luxury 1-Kanal residence in Hayatabad, Peshawar with passive solar layout and private interior courtyard.",
      cover_image: getStorageUrl(
        "dha_lahore_villa.png",
        "dha_lahore_villa.png",
      ),
      gallery_urls: [
        getStorageUrl("dha_lahore_villa.png", "dha_lahore_villa.png"),
      ],
      is_featured: true,
      is_published: true,
      display_order: 1,
    },
    {
      id: "proj_2",
      title: "Margalla Crest Contemporary Mansion",
      slug: "margalla-crest-contemporary-mansion",
      category: "residential",
      location: "DHA Phase 2, Islamabad, Pakistan",
      year: "2026",
      client_name: "Ambassadorial Client",
      area_sqft: 9500,
      price: "2 Kanal • 9,500 sq. ft.",
      aspectClass: "aspect-[4/5]",
      description:
        "A modernist 2-Kanal hillside mansion facing the Margalla ridges. Features seismic reinforcement calculations, double-height entrance atrium, travertine stone cladding, and wide cantilevered balconies.",
      short_description:
        "A modernist 2-Kanal hillside mansion facing the Margalla ridges with seismic calculations and travertine cladding.",
      cover_image: getStorageUrl(
        "dha_islamabad_mansion.png",
        "dha_islamabad_mansion.png",
      ),
      gallery_urls: [
        getStorageUrl("dha_islamabad_mansion.png", "dha_islamabad_mansion.png"),
      ],
      is_featured: true,
      is_published: true,
      display_order: 2,
    },
    {
      id: "proj_3",
      title: "The Clifton Coastal Residence",
      slug: "the-clifton-coastal-residence",
      category: "residential",
      location: "Clifton Block 4, Karachi, Pakistan",
      year: "2024",
      client_name: "Corporate Executive",
      area_sqft: 3850,
      price: "10 Marla • 3,850 sq. ft.",
      aspectClass: "aspect-[4/5]",
      description:
        "An ultra-premium modern coastal residence in Clifton, Karachi. Features marine-grade corrosion-resistant concrete facades, geometric brise-soleil shading louvers, and a rooftop viewing pavilion over the Arabian Sea.",
      short_description:
        "An ultra-premium modern coastal residence in Clifton, Karachi with marine-grade facades and Arabian Sea views.",
      cover_image: getStorageUrl(
        "clifton_karachi_villa.png",
        "clifton_karachi_villa.png",
      ),
      gallery_urls: [
        getStorageUrl("clifton_karachi_villa.png", "clifton_karachi_villa.png"),
      ],
      is_featured: true,
      is_published: true,
      display_order: 3,
    },
    {
      id: "proj_4",
      title: "AL Haj Sher Commercial Center",
      slug: "al-haj-sher-commercial-center",
      category: "commercial",
      location: "Ring Road, Near Hayatabad, Peshawar",
      year: "2025",
      client_name: "Sher Group",
      area_sqft: 18500,
      price: "Multi-Storey Corporate Hub",
      aspectClass: "aspect-[16/10]",
      description:
        "A multi-storey corporate hub and mixed-use commercial center. Features full MEP schematics, life safety egress plans, high-efficiency mechanical circulation, and PDA municipal submission drawings.",
      short_description:
        "Multi-storey corporate hub and mixed-use commercial center with full MEP schematics and PDA submission sets.",
      cover_image: getStorageUrl(
        "Full House Design Package.png",
        "Full House Design Package.png",
      ),
      gallery_urls: [
        getStorageUrl(
          "Full House Design Package.png",
          "Full House Design Package.png",
        ),
      ],
      is_featured: false,
      is_published: true,
      display_order: 4,
    },
    {
      id: "proj_5",
      title: "Modern Facade Redesign & Elevation",
      slug: "modern-facade-redesign-elevation",
      category: "renovation",
      location: "Hayatabad Phase 5, Peshawar, Pakistan",
      year: "2025",
      client_name: "Private Patron",
      area_sqft: 4500,
      price: "1 Kanal Facade • 3D Elevation",
      aspectClass: "aspect-[16/9]",
      description:
        "Contemporary 3D facade transformation for a 1-Kanal residence. Replaced traditional brickwork with sleek composite stone panels, dramatic vertical illumination, and modern aluminum louvers.",
      short_description:
        "Contemporary 3D facade transformation for a 1-Kanal residence with composite stone panels and dramatic lighting.",
      cover_image: getStorageUrl(
        "Front Elevation 3D (Exterior Render).png",
        "Front Elevation 3D (Exterior Render).png",
      ),
      gallery_urls: [
        getStorageUrl(
          "Front Elevation 3D (Exterior Render).png",
          "Front Elevation 3D (Exterior Render).png",
        ),
      ],
      is_featured: false,
      is_published: true,
      display_order: 5,
    },
    {
      id: "proj_6",
      title: "Executive Penthouse Suite & Lounge",
      slug: "executive-penthouse-suite-lounge",
      category: "interior",
      location: "Blue Area, Islamabad, Pakistan",
      year: "2025",
      client_name: "Private Client",
      area_sqft: 3200,
      price: "Master Suite & Lounge",
      aspectClass: "aspect-[16/10]",
      description:
        "Luxury interior room makeover featuring bespoke Swat walnut wood millwork, acoustic ceiling geometry, architectural ambient cove lighting, and curated imported marble surfaces.",
      short_description:
        "Luxury interior room makeover featuring bespoke Swat walnut wood millwork and architectural cove lighting.",
      cover_image: getStorageUrl(
        "Interior Room Makeover.png",
        "Interior Room Makeover.png",
      ),
      gallery_urls: [
        getStorageUrl(
          "Interior Room Makeover.png",
          "Interior Room Makeover.png",
        ),
      ],
      is_featured: false,
      is_published: true,
      display_order: 6,
    },
    {
      id: "proj_7",
      title: "Comprehensive Layout Optimization",
      slug: "comprehensive-layout-optimization",
      category: "renovation",
      location: "DHA Phase 6, Karachi, Pakistan",
      year: "2025",
      client_name: "Private Client",
      area_sqft: 4500,
      price: "10 Marla • Corrected Blueprint",
      aspectClass: "aspect-[16/10]",
      description:
        "Complete architectural redrafting for a 10 Marla corner plot with circulation bottlenecks. Restructured the layout to introduce natural light shafts, cross-ventilation, and dedicated family zones.",
      short_description:
        "Complete architectural redrafting for a 10 Marla corner plot with circulation bottlenecks resolved.",
      cover_image: getStorageUrl(
        "House Plan Correction.png",
        "House Plan Correction.png",
      ),
      gallery_urls: [
        getStorageUrl("House Plan Correction.png", "House Plan Correction.png"),
      ],
      is_featured: false,
      is_published: true,
      display_order: 7,
    },
    {
      id: "proj_8",
      title: "Biophilic Courtyard & Landscape Garden",
      slug: "biophilic-courtyard-landscape-garden",
      category: "landscape",
      location: "DHA Phase 2, Islamabad, Pakistan",
      year: "2024",
      client_name: "Private Patron",
      area_sqft: 2500,
      price: "Estate Garden & Circulation Audit",
      aspectClass: "aspect-[16/10]",
      description:
        "Internal biophilic courtyard integrating indigenous flora, geometric stone water rills, and shaded outdoor seating designed for thermal microclimate regulation in peak summer months.",
      short_description:
        "Internal biophilic courtyard integrating indigenous flora and shaded seating for thermal regulation.",
      cover_image: getStorageUrl(
        "House Plan review.png",
        "House Plan review.png",
      ),
      gallery_urls: [
        getStorageUrl("House Plan review.png", "House Plan review.png"),
      ],
      is_featured: false,
      is_published: true,
      display_order: 8,
    },
  ];

  try {
    const { error: pErr } = await supabase
      .from("projects")
      .upsert(projectsData, { onConflict: "slug" });
    if (pErr) console.warn("  ⚠️ Projects table upsert:", pErr.message);
    else
      console.log(
        `  ✅ Seeded ${projectsData.length} projects to 'projects' table.`,
      );
  } catch (err) {
    console.warn("  ⚠️ Projects table catch:", err);
  }

  console.log("\n📐 Step 4: Seeding Collection Packages (5 Packages)...");
  const collectionData = [
    {
      id: "hpr-standard",
      slug: "hpr-standard",
      name: "House Plan Review (Standard)",
      subtitle: "Detailed blueprint diagnostic audit by licensed architects.",
      tag: "Standard Package",
      covered_area_sqft: 4500,
      plot_dimensions: "Any Plot Size",
      price_pkr: 9000,
      estimated_construction_cost: "Market Standard",
      turnaround_weeks: "24–48 Hours",
      cover_image: getStorageUrl(
        "House Plan review.png",
        "House Plan review.png",
      ),
      gallery_urls: [
        getStorageUrl("House Plan review.png", "House Plan review.png"),
      ],
      deliverables: [
        "Comprehensive Diagnostic Report",
        "Circulation & Ventilation Optimization",
        "Room Sizing & Furniture Feasibility",
        "Annotated Architectural PDF Plan",
      ],
      is_published: true,
      display_order: 1,
    },
    {
      id: "hpc-standard",
      slug: "hpc-standard",
      name: "House Plan Correction (10 Marla)",
      subtitle:
        "Turn flawed drawings into an optimized, harmonious 10 Marla home layout with complete furniture and flow planning.",
      tag: "Standard Package",
      covered_area_sqft: 4500,
      plot_dimensions: "10 Marla",
      price_pkr: 22000,
      estimated_construction_cost: "PKR 30M – 40M",
      turnaround_weeks: "3–5 Days",
      cover_image: getStorageUrl(
        "House Plan Correction.png",
        "House Plan Correction.png",
      ),
      gallery_urls: [
        getStorageUrl("House Plan Correction.png", "House Plan Correction.png"),
      ],
      deliverables: [
        "2 Corrected Layout Alternatives",
        "Scaled Furniture Arrangement Plan",
        "Natural Ventilation & Sunlight Routing",
        "2 Design Revision Rounds",
      ],
      is_published: true,
      display_order: 2,
    },
    {
      id: "fe-standard",
      slug: "fe-standard",
      name: "Front Elevation 3D Render (10 Marla)",
      subtitle:
        "Ultra-realistic 3D exterior visualization showcasing daytime lighting, premium materials, and exterior finishes.",
      tag: "Standard Package",
      covered_area_sqft: 4500,
      plot_dimensions: "10 Marla",
      price_pkr: 25000,
      estimated_construction_cost: "PKR 35M – 45M",
      turnaround_weeks: "3–5 Days",
      cover_image: getStorageUrl(
        "Front Elevation 3D (Exterior Render).png",
        "Front Elevation 3D (Exterior Render).png",
      ),
      gallery_urls: [
        getStorageUrl(
          "Front Elevation 3D (Exterior Render).png",
          "Front Elevation 3D (Exterior Render).png",
        ),
      ],
      deliverables: [
        "2 High-Res 3D Views (Front & Angle)",
        "Exterior Material & Paint Color Specs",
        "Modern Facade Cladding Concepts",
        "2 Revision Rounds Included",
      ],
      is_published: true,
      display_order: 3,
    },
    {
      id: "irm-premium",
      slug: "irm-premium",
      name: "Interior Room Makeover (Premium)",
      subtitle:
        "Complete luxury transformation for master bedroom suites, formal drawing rooms, or designer open-plan kitchens.",
      tag: "Premium Package",
      covered_area_sqft: 1200,
      plot_dimensions: "Master Suite / Open Living",
      price_pkr: 30000,
      estimated_construction_cost: "Custom Finishes",
      turnaround_weeks: "5–7 Days",
      cover_image: getStorageUrl(
        "Interior Room Makeover.png",
        "Interior Room Makeover.png",
      ),
      gallery_urls: [
        getStorageUrl(
          "Interior Room Makeover.png",
          "Interior Room Makeover.png",
        ),
      ],
      deliverables: [
        "Photorealistic 3D Interior Render",
        "Complete Aesthetic Moodboard",
        "Scaled 2D Furniture & Ceiling Plan",
        "Custom Ambient Lighting Scheme",
      ],
      is_published: true,
      display_order: 4,
    },
    {
      id: "cce-detailed",
      slug: "cce-detailed",
      name: "Grey Structure Cost Estimate (10 Marla)",
      subtitle:
        "Protect your investment with exact material calculations and construction rate verification based on market data.",
      tag: "Detailed Package",
      covered_area_sqft: 4500,
      plot_dimensions: "10 Marla",
      price_pkr: 19000,
      estimated_construction_cost: "Cost Assurance",
      turnaround_weeks: "4–6 Days",
      cover_image: getStorageUrl(
        "Construction Cost Estimate.png",
        "Construction Cost Estimate.png",
      ),
      gallery_urls: [
        getStorageUrl(
          "Construction Cost Estimate.png",
          "Construction Cost Estimate.png",
        ),
      ],
      deliverables: [
        "Complete Grey Structure Bill of Quantities",
        "Finishing Material Budget Projections",
        "Steel, Cement & Brick Quantity Schedules",
        "Contractor Cost Benchmark Sheet",
      ],
      is_published: true,
      display_order: 5,
    },
  ];

  try {
    const { error: cErr } = await supabase
      .from("collection_packages")
      .upsert(collectionData, { onConflict: "slug" });
    if (cErr) console.warn("  ⚠️ Collection table upsert:", cErr.message);
    else
      console.log(
        `  ✅ Seeded ${collectionData.length} packages to 'collection_packages' table.`,
      );
  } catch (err) {
    console.warn("  ⚠️ Collection table catch:", err);
  }

  console.log("\n🛠️ Step 5: Seeding Services & Pricing Tiers (7 Services)...");
  const servicesCatalog = [
    {
      slug: "online-consultation",
      title: "Online Consultation (Video / Call)",
      category: "Consultation",
      short_description:
        "Live 1-on-1 strategy sessions with a principal architect via Live HD Video.",
      image_url: getStorageUrl("For Call.png", "For Call.png"),
      pricing_type: "flat",
      popularity_rank: 1,
      is_active: true,
      tiers: [
        {
          name: "Basic Call",
          delivery_time: "30 Minutes Live",
          price_pkr: 3000,
          description:
            "Discussion + design guidance + immediate layout solutions.",
          deliverables: [
            "30 min Live Video Session",
            "Spatial Flow Guidance",
            "Live Q&A with Lead Architect",
          ],
        },
        {
          name: "Premium Call",
          delivery_time: "60 Minutes Live",
          price_pkr: 5000,
          description:
            "Proper planning roadmap + material selections + budget allocation strategy.",
          deliverables: [
            "60 min In-Depth Session",
            "Comprehensive Layout Roadmap",
            "Material Grade Suggestions",
            "Budget Planning Strategy",
          ],
        },
      ],
    },
    {
      slug: "house-plan-review",
      title: "House Plan Review by Professional Architect",
      category: "Diagnostic Audit",
      short_description:
        "Comprehensive blueprint audit identifying structural, ventilation, and circulation bottlenecks.",
      image_url: getStorageUrl(
        "House Plan review.png",
        "House Plan review.png",
      ),
      pricing_type: "flat",
      popularity_rank: 2,
      is_active: true,
      tiers: [
        {
          name: "Basic",
          delivery_time: "24 Hours",
          price_pkr: 5000,
          description:
            "Voice notes, marked plan (PDF/JPG), and 3–5 critical issue diagnostics.",
          deliverables: [
            "Annotated Marked Plan (PDF/JPG)",
            "Detailed Audio Voice Notes",
            "3–5 Critical Issue Solutions",
          ],
        },
        {
          name: "Standard",
          delivery_time: "24–48 Hours",
          price_pkr: 9000,
          description:
            "Analytical report with circulation, ventilation, and dimensional sizing optimizations.",
          deliverables: [
            "Formal Analytical Report",
            "Circulation & Ventilation Audit",
            "Room Sizing Corrections",
            "Annotated Master Plan",
          ],
        },
        {
          name: "Premium",
          delivery_time: "48 Hours",
          price_pkr: 24000,
          description:
            "Full review, improved rough layout sketch, furniture suggestions, and 2 revision rounds.",
          deliverables: [
            "Full Diagnostic Report",
            "Improved Rough Layout Sketch",
            "Optimal Furniture Placement",
            "2 Revision Cycles Included",
          ],
        },
      ],
    },
    {
      slug: "house-plan-correction",
      title: "House Plan Correction",
      category: "Architectural Redrafting",
      short_description:
        "Professional revision of existing floor plans to eliminate circulation bottlenecks and improve light.",
      image_url: getStorageUrl(
        "House Plan Correction.png",
        "House Plan Correction.png",
      ),
      pricing_type: "size_based",
      popularity_rank: 3,
      is_active: true,
      tiers: [
        {
          name: "Basic",
          delivery_time: "2–3 Days",
          description:
            "Wall repositioning, door/window relocations, and spatial flow optimization.",
          deliverables: [
            "Corrected 2D Master Plan",
            "Optimized Wall Placements",
            "1 Revision Included",
          ],
          pricing: { "5 Marla": 10000, "10 Marla": 14000, "1 Kanal": 20000 },
        },
        {
          name: "Standard",
          delivery_time: "3–5 Days",
          description:
            "Corrected layout + 2 options + furniture arrangement + natural ventilation routing.",
          deliverables: [
            "2 Corrected Layout Alternatives",
            "Scaled Furniture Placement",
            "Ventilation & Light Pathing",
            "2 Revisions",
          ],
          pricing: { "5 Marla": 16000, "10 Marla": 22000, "1 Kanal": 30000 },
        },
        {
          name: "Premium",
          delivery_time: "5–7 Days",
          description:
            "Complete redesign + structural alignment check + plumbing/electrical roughs + 3 revision rounds.",
          deliverables: [
            "Full Floorplan Architectural Re-draft",
            "Structural Grid Verification",
            "Rough MEP Conduit Pathing",
            "3 Revisions + CAD Export",
          ],
          pricing: { "5 Marla": 30000, "10 Marla": 40000, "1 Kanal": 55000 },
        },
      ],
    },
    {
      slug: "front-elevation-3d",
      title: "Front Elevation 3D (Exterior Render)",
      category: "3D Visualization",
      short_description:
        "Ultra-realistic 3D exterior renders showcasing modern facades, lighting, and materials.",
      image_url: getStorageUrl(
        "Front Elevation 3D (Exterior Render).png",
        "Front Elevation 3D (Exterior Render).png",
      ),
      pricing_type: "size_based",
      popularity_rank: 4,
      is_active: true,
      tiers: [
        {
          name: "Basic",
          delivery_time: "2–3 Days",
          description:
            "1 High-resolution 3D front view render with basic modern material application.",
          deliverables: [
            "1 High-Res 3D Front View",
            "Modern Material Specs",
            "Daylight Lighting Model",
          ],
          pricing: { "5 Marla": 12000, "10 Marla": 15000, "1 Kanal": 22000 },
        },
        {
          name: "Standard",
          delivery_time: "3–5 Days",
          description:
            "2 Views (Front & Angle) + material callouts + color palette specs + 2 revision rounds.",
          deliverables: [
            "2 High-Res 3D Perspectives",
            "Exterior Material Callout Sheet",
            "Color Palette Specification",
            "2 Revisions",
          ],
          pricing: { "5 Marla": 18000, "10 Marla": 25000, "1 Kanal": 35000 },
        },
        {
          name: "Premium",
          delivery_time: "5–7 Days",
          description:
            "3 Views (Front, Angle, Night render) + exterior lighting design + 3D source files + 3 revisions.",
          deliverables: [
            "3 Photorealistic Views (Day + Night)",
            "Architectural Facade Lighting Scheme",
            "High-Res Printable PDFs",
            "3 Revisions Included",
          ],
          pricing: { "5 Marla": 32000, "10 Marla": 45000, "1 Kanal": 65000 },
        },
      ],
    },
    {
      slug: "interior-room-design",
      title: "Interior Room Design & Makeover",
      category: "Interior Architecture",
      short_description:
        "Transform bedrooms, living rooms, and kitchens with bespoke false ceilings, lighting, and finishes.",
      image_url: getStorageUrl(
        "Interior Room Makeover.png",
        "Interior Room Makeover.png",
      ),
      pricing_type: "flat",
      popularity_rank: 5,
      is_active: true,
      tiers: [
        {
          name: "Basic",
          delivery_time: "2 Days",
          price_pkr: 7000,
          description:
            "Moodboard specifying color schemes, furniture styles, and ambient lighting.",
          deliverables: [
            "Aesthetic Moodboard",
            "Color Palette Schedule",
            "Furniture Sourcing Direction",
          ],
        },
        {
          name: "Standard",
          delivery_time: "3–4 Days",
          price_pkr: 12000,
          description:
            "Moodboard + 2D scaled furniture layout + false ceiling & lighting design concepts.",
          deliverables: [
            "Concept Moodboard",
            "2D Scaled Furniture Layout",
            "Ceiling Geometry & Lighting Concept",
          ],
        },
        {
          name: "Premium",
          delivery_time: "5–7 Days",
          price_pkr: 30000,
          description:
            "Moodboard + photorealistic 3D render + furniture layout + ceiling & lighting construction details.",
          deliverables: [
            "Photorealistic 3D Interior Render",
            "Complete Moodboard & Material Specs",
            "Scaled Furniture & Ceiling Plans",
            "2 Revisions",
          ],
        },
      ],
    },
    {
      slug: "construction-cost-estimate",
      title: "Construction Cost Estimate (Grey Structure)",
      category: "Cost Estimation",
      short_description:
        "Market-verified bill of quantities and accurate material projections for grey structure.",
      image_url: getStorageUrl(
        "Construction Cost Estimate.png",
        "Construction Cost Estimate.png",
      ),
      pricing_type: "size_based",
      popularity_rank: 6,
      is_active: true,
      tiers: [
        {
          name: "Basic",
          delivery_time: "2–3 Days",
          description:
            "Approximate grey structure cost breakdown with covered area statement.",
          deliverables: [
            "Grey Structure Cost Breakdown",
            "Covered Area Calculation",
            "Steel & Cement Quantities Summary",
          ],
          pricing: { "5 Marla": 5000, "10 Marla": 7000, "1 Kanal": 9000 },
        },
        {
          name: "Detailed",
          delivery_time: "4–6 Days",
          description:
            "Grey structure + finishing estimate, material grade suggestions, and bill of quantities.",
          deliverables: [
            "Grey Structure + Finishing Projections",
            "Material Grade Suggestions",
            "Itemized Bill of Quantities",
            "Contractor Negotiation Guide",
          ],
          pricing: { "5 Marla": 16000, "10 Marla": 19000, "1 Kanal": 30000 },
        },
      ],
    },
    {
      slug: "full-house-design-package",
      title: "Full House Design Package (Rate-Based)",
      category: "Flagship Full Turnkey Package",
      short_description:
        "Complete architectural, structural, plumbing, electrical, and fire/safety blueprint suite billed by covered area.",
      image_url: getStorageUrl(
        "Full House Design Package.png",
        "Full House Design Package.png",
      ),
      pricing_type: "rate_formula",
      popularity_rank: 7,
      is_active: true,
      tiers: [
        {
          name: "Complete Turnkey Architectural Blueprint Suite",
          delivery_time: "3–4 Weeks",
          price_pkr: 57,
          description:
            "Complete 2D working drawings, structural calculations, MEP, 3D exterior renders, and municipal submission sets.",
          deliverables: [
            "Architectural Working Drawings",
            "3D Elevation Set (Day & Night)",
            "Structural Engineering Framing (PEC Certified)",
            "Electrical & Plumbing (MEP) Layouts",
            "Municipal Submission Blueprints (PDA / CDA / DHA)",
          ],
        },
      ],
    },
  ];

  try {
    for (let sIdx = 0; sIdx < servicesCatalog.length; sIdx++) {
      const s = servicesCatalog[sIdx];
      const { data: sData, error: sErr } = await supabase
        .from("services")
        .upsert(
          {
            slug: s.slug,
            title: s.title,
            category: s.category,
            short_description: s.short_description,
            image_url: s.image_url,
            pricing_type: s.pricing_type,
            popularity_rank: s.popularity_rank,
            is_active: s.is_active,
          },
          { onConflict: "slug" },
        )
        .select()
        .single();

      if (!sErr && sData && s.tiers) {
        for (let tIdx = 0; tIdx < s.tiers.length; tIdx++) {
          const t = s.tiers[tIdx];
          const { data: tData, error: tErr } = await supabase
            .from("service_tiers")
            .insert({
              service_id: sData.id,
              tier_name: t.name,
              description: t.description || "",
              deliverables: t.deliverables || [],
              delivery_time: t.delivery_time || "Prompt",
              display_order: tIdx + 1,
            })
            .select()
            .single();

          if (!tErr && tData) {
            if (t.price_pkr) {
              await supabase.from("pricing_rules").insert({
                tier_id: tData.id,
                plot_size: "Any",
                price_pkr: t.price_pkr,
              });
            } else if (t.pricing) {
              for (const [plot, price] of Object.entries(t.pricing)) {
                await supabase.from("pricing_rules").insert({
                  tier_id: tData.id,
                  plot_size: plot,
                  price_pkr: price,
                });
              }
            }
          }
        }
      }
    }
    console.log(
      `  ✅ Seeded ${servicesCatalog.length} services to 'services' tables.`,
    );
  } catch (err) {
    console.warn("  ⚠️ Services table catch:", err);
  }

  console.log("\n👤 Step 6: Seeding Leadership & Team Members...");
  const teamData = [
    {
      id: "team_1",
      name: "Muhammad Arsalan",
      role: "Principal Architect & Founder",
      credentials: "PCATP Registered • B.Arch • Lead Structural Designer",
      bio: "Pioneering mathematical precision in residential and commercial architecture across Pakistan. Specialist in passive solar layouts, municipal submission codes, and structural efficiency.",
      experience_years: 15,
      council_registration: "PCATP-A-48291",
      image_url: getStorageUrl("profile-removebg-preview.png", "profile.jpeg"),
      is_active: true,
      display_order: 1,
    },
    {
      id: "team_2",
      name: "Engr. Salman Raza",
      role: "Lead Structural Engineer",
      credentials: "M.Sc. Structural Engineering (UET), PEC Certified",
      bio: "Specialist in post-tensioned concrete slab systems, seismic stabilization, and large-span architectural cantilevers.",
      experience_years: 12,
      council_registration: "PEC-CIVIL-29182",
      image_url: getStorageUrl("profile.jpeg", "profile.jpeg"),
      is_active: true,
      display_order: 2,
    },
  ];

  try {
    const { error: tErr } = await supabase
      .from("team_members")
      .upsert(teamData, { onConflict: "name" });
    if (tErr) console.warn("  ⚠️ Team table upsert:", tErr.message);
    else
      console.log(
        `  ✅ Seeded ${teamData.length} team members to 'team_members' table.`,
      );
  } catch (err) {
    console.warn("  ⚠️ Team table catch:", err);
  }

  console.log("\n❓ Step 7: Seeding Frequently Asked Questions (10 FAQs)...");
  const faqs = [
    {
      id: "faq_1",
      category: "pricing",
      question:
        "How much does MARK Architects charge for architectural design in Pakistan?",
      answer:
        "MARK Architects charges a fixed formula rate of PKR 57 per square foot for complete turnkey architectural and engineering design packages, while 1-on-1 strategic video consultations start at PKR 3,000 for 30 minutes. All pricing is 100% transparent and standardized in Pakistani Rupees (PKR) with zero hidden drafting charges.",
      display_order: 1,
      is_published: true,
    },
    {
      id: "faq_2",
      category: "pricing",
      question:
        "How do I pay for architectural services and consultations on MARK Architects?",
      answer:
        "Payments are processed securely online through Safepay, accepting all major Pakistani and international Visa, Mastercard, and PayPak debit/credit cards with instant transaction verification. We operate on a 50% advance milestone structure for full turnkey custom estates.",
      display_order: 2,
      is_published: true,
    },
    {
      id: "faq_3",
      category: "consultation",
      question:
        "What happens during the online architectural consultation via Live Video Session?",
      answer:
        "You meet directly with Principal Architect Muhammad Arsalan to review your plot dimensions, diagnose layout bottlenecks, evaluate natural lighting and ventilation, and receive an actionable design roadmap. After the call, you receive a curated meeting recap summary with structural advice.",
      display_order: 3,
      is_published: true,
    },
    {
      id: "faq_4",
      category: "consultation",
      question:
        "What documents and files are mandatory before confirming a consultation appointment?",
      answer:
        "Clients must upload either a site contour survey, existing CAD/PDF floor plan, municipal allotment letter with dimensions, or clear on-site plot photographs (up to 25MB) so our lead architect can review municipal bylaws and solar sun-path angles beforehand.",
      display_order: 4,
      is_published: true,
    },
    {
      id: "faq_5",
      category: "consultation",
      question: "How far in advance must I book an architectural consultation?",
      answer:
        "Consultations must be booked for future dates through our live calendar scheduler; past dates and fully reserved dates are automatically locked out to prevent overbooking. Available time slots operate in Pakistan Standard Time (PKT) at 11:00 AM, 02:30 PM, 05:00 PM, and 08:00 PM.",
      display_order: 5,
      is_published: true,
    },
    {
      id: "faq_6",
      category: "approvals",
      question:
        "Does MARK Architects deliver drawings approved by PDA Peshawar, CDA Islamabad, and DHA?",
      answer:
        "Yes. As a PCATP-licensed architectural firm, all MARK Architects drawings are drafted in strict conformity with PDA (Peshawar), CDA (Islamabad), KDA (Karachi), and DHA bylaws, achieving a 100% municipal approval success rate. Each submission drawing is signed and stamped by PCATP-registered architects and PEC-registered structural engineers.",
      display_order: 6,
      is_published: true,
    },
    {
      id: "faq_7",
      category: "approvals",
      question:
        "Are structural drawings compliant with the Building Code of Pakistan (BCP) seismic zones?",
      answer:
        "Yes. Every structural engineering blueprint is calculated specifically for the seismic acceleration zone of your city (Zone 2B in Islamabad/Karachi, Zone 3 in Peshawar) adhering to the Building Code of Pakistan 2021 with ductile moment frame designs.",
      display_order: 7,
      is_published: true,
    },
    {
      id: "faq_8",
      category: "drawings",
      question:
        "What is included in the PKR 57 per sq. ft. Turnkey House Design Package?",
      answer:
        "The package includes complete 2D architectural working drawings, photorealistic 3D front elevations, structural engineering drawings, electrical & plumbing (MEP) layouts, and municipal submission blueprints formatted for PDA, CDA, or DHA one-window approval.",
      display_order: 8,
      is_published: true,
    },
    {
      id: "faq_9",
      category: "drawings",
      question:
        "How long does it take to deliver full architectural drawings for a house in Pakistan?",
      answer:
        "Initial concept layouts and 3D elevation sketches are delivered within 7 to 10 working days, with complete turnkey engineering and municipal approval blueprints finalized in 3 to 4 weeks.",
      display_order: 9,
      is_published: true,
    },
    {
      id: "faq_10",
      category: "passive-solar",
      question:
        "How does MARK Architects' passive solar planning reduce summer electricity and AC bills?",
      answer:
        "By angling window openings, optimizing southern solar azimuths, and designing cross-ventilation breeze corridors, our homes stay naturally up to 6°C cooler in summer and trap winter warmth, reducing HVAC loads by up to 35%.",
      display_order: 10,
      is_published: true,
    },
  ];

  try {
    const { error: fErr } = await supabase
      .from("faqs")
      .upsert(faqs, { onConflict: "question" });
    if (fErr) console.warn("  ⚠️ FAQs table upsert:", fErr.message);
    else console.log(`  ✅ Seeded ${faqs.length} FAQs to 'faqs' table.`);
  } catch (err) {
    console.warn("  ⚠️ FAQs table catch:", err);
  }

  console.log("\n⭐ Step 8: Seeding Testimonials (2 Reviews)...");
  const testimonials = [
    {
      id: "test_1",
      client_name: "Usman Ghani",
      company: "Ghani Holdings",
      position: "Managing Director",
      review:
        "MARK Architects spotted three critical structural clashes and a missing sunlight shaft in our contractor's drawings in under 48 hours. Saved us millions before pouring concrete.",
      rating: 5,
      photo_url: getStorageUrl("profile.jpeg", "profile.jpeg"),
      project_title: "1 Kanal Villa Review",
      is_featured: true,
      is_published: true,
      display_order: 1,
    },
    {
      id: "test_2",
      client_name: "Fatima Noor",
      company: "Bespoke Living Studio",
      position: "Founder & Creative Director",
      review:
        "The 3D front elevation render was so photorealistic that the DHA approval board approved our facade on first presentation without a single revision.",
      rating: 5,
      photo_url: getStorageUrl("profile.jpeg", "profile.jpeg"),
      project_title: "Modern Facade Concept",
      is_featured: true,
      is_published: true,
      display_order: 2,
    },
  ];

  try {
    const { error: testErr } = await supabase
      .from("testimonials")
      .upsert(testimonials, { onConflict: "client_name" });
    if (testErr)
      console.warn("  ⚠️ Testimonials table upsert:", testErr.message);
    else
      console.log(
        `  ✅ Seeded ${testimonials.length} reviews to 'testimonials' table.`,
      );
  } catch (err) {
    console.warn("  ⚠️ Testimonials table catch:", err);
  }

  console.log(
    "\n🌐 Step 9: Seeding Dynamic CMS Content in 'site_content' Table...",
  );
  const studioAchievements = [
    {
      metric: "15+",
      label: "Years of Architectural Practice",
      subtext: "Continuous PCATP-accredited excellence.",
    },
    {
      metric: "250+",
      label: "Residential & Commercial Masterpieces",
      subtext: "Across Islamabad, Lahore, Peshawar & Karachi.",
    },
    {
      metric: "1.8M+",
      label: "Sq. Ft. Designed & Built",
      subtext: "High-efficiency, climate-responsive covered space.",
    },
    {
      metric: "100%",
      label: "Statutory Approval & Code Compliance",
      subtext: "Unblemished compliance record across PDA, CDA & DHA.",
    },
  ];

  const studioLocations = [
    {
      city: "Peshawar",
      role: "Headquarters (Atelier)",
      address: "4A, AL Haj Sher Tower, Ring Rd, Near Hayatabad, Peshawar",
      region: "KPK, Pakistan",
      isHQ: true,
    },
    {
      city: "Islamabad",
      role: "Capital Studio",
      address: "Blue Area & DHA Phase 2, Islamabad, Pakistan",
      region: "ICT, Pakistan",
      isHQ: false,
    },
    {
      city: "Karachi",
      role: "Coastal Studio",
      address: "Clifton Block 4 & DHA Phase 6, Karachi, Pakistan",
      region: "Sindh, Pakistan",
      isHQ: false,
    },
  ];

  const siteContentSections = [
    {
      section_key: "projects",
      content: projectsData,
    },
    {
      section_key: "collection_packages",
      content: collectionData,
    },
    {
      section_key: "services",
      content: servicesCatalog,
    },
    {
      section_key: "team_members",
      content: { members: teamData },
    },
    {
      section_key: "faqs",
      content: faqs,
    },
    {
      section_key: "testimonials",
      content: testimonials,
    },
    {
      section_key: "about_studio",
      content: {
        achievements: studioAchievements,
        studioLocations: studioLocations,
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
    {
      section_key: "pricing_settings",
      content: {
        turnkeyRateSqFt: 57,
        consultationRateBasic: 3000,
        consultationRatePremium: 5000,
        currency: "PKR",
      },
    },
  ];

  try {
    const { error: scErr } = await supabase
      .from("site_content")
      .upsert(siteContentSections, { onConflict: "section_key" });
    if (scErr) console.warn("  ⚠️ Site content upsert:", scErr.message);
    else
      console.log(
        `  ✅ Seeded ${siteContentSections.length} sections to 'site_content' table.`,
      );
  } catch (err) {
    console.warn("  ⚠️ Site content catch:", err);
  }

  console.log("\n🎉 Seeding process completed successfully!");
}

main().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});
