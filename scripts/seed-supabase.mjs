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
        console.warn(
          "⚠️ Notice while creating bucket (may need SQL Editor or Service Role):",
          bCreateErr.message,
        );
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

      const { data: uploadData, error: upErr } = await supabase.storage
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
        // Fallback default
        uploadedUrls[file] = `/images/${file}`;
        uploadedUrls[`/images/${file}`] = `/images/${file}`;
      }
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

  console.log("\n🏛️ Step 3: Seeding Projects (Portfolio)...");
  const projectsData = [
    {
      title: "The Hayatabad Contemporary Estate",
      slug: "the-hayatabad-contemporary-estate",
      category: "residential",
      location: "Ring Road, Hayatabad, Peshawar",
      year: "2026",
      client_name: "Private Patron",
      area_sqft: 6200,
      description:
        "Iconic 1 Kanal luxury residential villa featuring passive solar design, cantilevers, and locally sourced stone finishes.",
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
      title: "Margalla Hillside Modern Residence",
      slug: "margalla-hillside-modern-residence",
      category: "residential",
      location: "DHA Phase 2, Islamabad",
      year: "2025",
      client_name: "Ambassadorial Client",
      area_sqft: 9500,
      description:
        "2 Kanal hilltop residence maximizing northern light with double-height glazing and seismic steel reinforcement.",
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
      title: "The Clifton Coastal Residence",
      slug: "the-clifton-coastal-residence",
      category: "residential",
      location: "Clifton Block 4, Karachi",
      year: "2025",
      client_name: "Corporate Executive",
      area_sqft: 3850,
      description:
        "10 Marla coastal residence incorporating corrosion-resistant finishes, sea breeze cross-ventilation, and rooftop terrace.",
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
  ];

  const { error: pErr } = await supabase
    .from("projects")
    .upsert(projectsData, { onConflict: "slug" });
  if (pErr) console.warn("⚠️ Projects insert:", pErr.message);
  else console.log(`✅ Seeded ${projectsData.length} projects.`);

  console.log(
    "\n📐 Step 4: Seeding Collection Packages (Villas & Blueprints)...",
  );
  const collectionData = [
    {
      slug: "hpr-standard",
      name: "House Plan Review (Standard)",
      subtitle: "Detailed blueprint diagnostic audit by licensed architects.",
      tag: "Standard Package",
      covered_area_sqft: 4500,
      plot_dimensions: "10 Marla (35' x 70')",
      price_pkr: 9000,
      estimated_construction_cost: "PKR 25M – 35M",
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
        "Room Sizing Feasibility",
        "Annotated Architectural PDF Plan",
      ],
      is_published: true,
      display_order: 1,
    },
    {
      slug: "hpc-standard",
      name: "House Plan Correction (10 Marla)",
      subtitle:
        "Turn flawed drawings into an optimized, harmonious 10 Marla home layout.",
      tag: "Standard Package",
      covered_area_sqft: 4500,
      plot_dimensions: "10 Marla (35' x 70')",
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
      slug: "fe-standard",
      name: "Front Elevation 3D Render (10 Marla)",
      subtitle:
        "Ultra-realistic 3D exterior visualization showcasing daytime lighting and finishes.",
      tag: "Standard Package",
      covered_area_sqft: 4500,
      plot_dimensions: "10 Marla (35' x 70')",
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
      slug: "full-house-design",
      name: "Turnkey Full House Architectural Suite",
      subtitle:
        "Full architectural, structural, MEP, and municipal approval blueprint suite.",
      tag: "Turnkey Architecture",
      covered_area_sqft: 4500,
      plot_dimensions: "Custom Plot",
      price_pkr: 57000,
      estimated_construction_cost: "PKR 45M – 65M",
      turnaround_weeks: "2–6 Weeks",
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
      deliverables: [
        "Complete Architectural Drafting Suite",
        "Structural Engineering Framing & Calculations",
        "Plumbing, Electrical & HVAC Schemes",
        "PDA / CDA / Municipal Submission Sets",
      ],
      is_published: true,
      display_order: 4,
    },
  ];

  const { error: cErr } = await supabase
    .from("collection_packages")
    .upsert(collectionData, { onConflict: "slug" });
  if (cErr) console.warn("⚠️ Collection insert:", cErr.message);
  else console.log(`✅ Seeded ${collectionData.length} collection packages.`);

  console.log("\n👤 Step 5: Seeding Leadership & Team...");
  const teamData = [
    {
      name: "Muhammad Arsalan",
      role: "Principal Architect & Founder",
      credentials: "B.Arch • PCATP Reg. A-48291 • IAP Member",
      bio: "15+ years spearheading luxury residential estates and commercial hubs across Peshawar, Islamabad, and Karachi. Specializing in passive solar optimization and municipal code compliance.",
      experience_years: 15,
      council_registration: "PCATP-A-48291",
      image_url: getStorageUrl("profile.jpeg", "profile.jpeg"),
      is_active: true,
      display_order: 1,
    },
  ];

  const { error: tErr } = await supabase
    .from("team_members")
    .upsert(teamData, { onConflict: "name" });
  if (tErr) console.warn("⚠️ Team insert:", tErr.message);
  else console.log(`✅ Seeded ${teamData.length} team members.`);

  console.log("\n❓ Step 6: Seeding FAQs...");
  const faqs = [
    {
      category: "pricing",
      question: "How much does an architect charge in Pakistan?",
      answer:
        "In Pakistan, architectural fees typically range from PKR 40 to PKR 120 per sq. ft. for complete turnkey blueprint packages. At MARK Architects, our transparent rate is PKR 57/sq. ft. for complete architectural, structural, and MEP working drawings.",
      display_order: 1,
      is_published: true,
    },
    {
      category: "consultation",
      question: "What is included in the PKR 3,000 Live Video Consultation?",
      answer:
        "A 30-minute direct live HD video session with principal architect Muhammad Arsalan. We diagnose spatial bottlenecks, review your plot orientation, and answer questions on local municipal bylaws.",
      display_order: 2,
      is_published: true,
    },
    {
      category: "approvals",
      question: "Do you handle PDA, CDA, and DHA building approval drawings?",
      answer:
        "Yes, all our blueprint packages are designed in strict accordance with local municipal building regulations (Peshawar Development Authority, Capital Development Authority Islamabad, and Defence Housing Authority).",
      display_order: 3,
      is_published: true,
    },
    {
      category: "pricing",
      question: "How does Safepay payment protection work for clients?",
      answer:
        "We accept all major Pakistani debit/credit cards and bank transfers via Safepay. For turnkey full-house packages, payments are split into 50% advance and 50% on deliverable milestones.",
      display_order: 4,
      is_published: true,
    },
  ];

  const { error: fErr } = await supabase
    .from("faqs")
    .upsert(faqs, { onConflict: "question" });
  if (fErr) console.warn("⚠️ FAQs insert:", fErr.message);
  else console.log(`✅ Seeded ${faqs.length} FAQs.`);

  console.log("\n⭐ Step 7: Seeding Testimonials...");
  const testimonials = [
    {
      client_name: "Brig. Tariq Mehmood (Retd)",
      client_title: "1 Kanal Residence, DHA Islamabad",
      location: "Islamabad",
      quote:
        "Muhammad Arsalan corrected critical circulation and ventilation errors in our previous architect's plan. The house remains naturally cool during summer and is exceptionally bright.",
      rating: 5,
      is_featured: true,
      is_published: true,
      display_order: 1,
    },
    {
      client_name: "Dr. Asim Khattak",
      client_title: "Commercial Plaza, University Road",
      location: "Peshawar",
      quote:
        "Flawless PDA approval submission. Structural drawings and parking layout were approved by the authorities on the first review cycle without a single rejection.",
      rating: 5,
      is_featured: true,
      is_published: true,
      display_order: 2,
    },
  ];

  const { error: testErr } = await supabase
    .from("testimonials")
    .upsert(testimonials, { onConflict: "quote" });
  if (testErr) console.warn("⚠️ Testimonials insert:", testErr.message);
  else console.log(`✅ Seeded ${testimonials.length} testimonials.`);

  console.log("\n🎉 Seeding process completed successfully!");
}

main().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});
