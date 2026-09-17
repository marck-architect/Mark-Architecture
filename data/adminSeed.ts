import type {
  ConsultationRecord,
  OrderRecord,
  AvailabilitySettings,
  BlockedDate,
  AdminProject,
  AdminClient,
  AdminTestimonial,
  AdminTeamMember,
  AdminFaq,
  AdminNotification,
  CommunicationLog,
  AuditLogEntry,
  AdminService,
  MediaAsset,
} from "@/types";

export const seedConsultations: ConsultationRecord[] = [
  {
    id: "c7e8a1d2-9b34-4f6c-8e01-123456789abc",
    client_name: "Taimur Malik",
    client_email: "taimur.malik@lahoreluxury.pk",
    client_phone: "+92 300 8472910",
    tier_name: "Premium Call",
    price_pkr: 5000,
    booking_date: "2026-09-18",
    booking_time: "14:00",
    duration_minutes: 60,
    attachment_urls: [
      "/images/Full House Design Package.png",
      "/images/dha_phase6_plot_photo.jpg",
    ],
    notes:
      "1 Kanal plot in DHA Phase 6 Lahore. Looking to build a contemporary minimalist villa with open courtyard and cantilevered canopy.",
    meeting_url: "https://meet.google.com/mar-karc-hit",
    admin_notes:
      "Client sent architectural brief; prepare DHA Phase 6 by-laws checklist.",
    payment_status: "paid",
    consultation_status: "confirmed",
    confirmed_by_admin: true,
    confirmed_at: "2026-09-16T08:30:00Z",
    meeting_link_sent_at: "2026-09-16T08:35:00Z",
    safepay_tracker: "track_live_920182847192",
    safepay_token: "tok_safepay_pkr5k_conf",
    created_at: "2026-09-15T09:00:00Z",
  },
  {
    id: "d9f1b2e3-4c56-7a8b-9c0d-987654321def",
    client_name: "Dr. Ayesha Siddiqui",
    client_email: "ayesha.siddiqui@islamabadhealth.org",
    client_phone: "+92 333 5192834",
    tier_name: "Premium Call",
    price_pkr: 5000,
    booking_date: "2026-09-17",
    booking_time: "17:30",
    duration_minutes: 60,
    attachment_urls: ["/images/House Plan review.png"],
    notes:
      "Sector F-7 Islamabad estate. Complete gut renovation and sustainable solar passive design review.",
    meeting_url: "https://meet.google.com/aye-sha7-mrk",
    admin_notes:
      "Coordinate structural engineer availability for 17:30 session.",
    payment_status: "paid",
    consultation_status: "confirmed",
    confirmed_by_admin: true,
    confirmed_at: "2026-09-16T09:00:00Z",
    meeting_link_sent_at: "2026-09-16T09:05:00Z",
    safepay_tracker: "track_live_837192019283",
    safepay_token: "tok_safepay_pkr5k_conf",
    created_at: "2026-09-15T10:30:00Z",
  },
  {
    id: "a1b2c3d4-e5f6-7a8b-9c0d-112233445566",
    client_name: "Kamran Qureshi",
    client_email: "kamran.q@qureshigroup.com",
    client_phone: "+92 321 4455667",
    tier_name: "Basic Call",
    price_pkr: 3000,
    booking_date: "2026-09-19",
    booking_time: "11:00",
    duration_minutes: 30,
    attachment_urls: [],
    notes:
      "Initial feasibility discussion for modern commercial office front elevation in Gulberg III.",
    meeting_url: null,
    admin_notes: null,
    payment_status: "paid",
    consultation_status: "pending",
    confirmed_by_admin: false,
    confirmed_at: null,
    meeting_link_sent_at: null,
    safepay_tracker: "track_live_748291029412",
    safepay_token: "tok_safepay_pkr3k_rec",
    created_at: "2026-09-16T11:00:00Z",
  },
  {
    id: "f4e3d2c1-b0a9-8765-4321-fedcba987654",
    client_name: "Zainab Tariq",
    client_email: "zainab.tariq@gmail.com",
    client_phone: "+92 301 5566778",
    tier_name: "Basic Call",
    price_pkr: 3000,
    booking_date: "2026-09-20",
    booking_time: "15:30",
    duration_minutes: 30,
    attachment_urls: ["/images/House Plan Correction.png"],
    notes:
      "Review ground floor bathroom layout and duct placement for 10 Marla house in Bahria Town.",
    meeting_url: null,
    admin_notes: null,
    payment_status: "pending",
    consultation_status: "pending",
    confirmed_by_admin: false,
    confirmed_at: null,
    meeting_link_sent_at: null,
    safepay_tracker: "track_pending_8899112233",
    safepay_token: null,
    created_at: "2026-09-16T13:45:00Z",
  },
];

export const seedOrders: OrderRecord[] = [
  {
    id: "ord_102847192",
    order_number: "MARK-2026-081",
    client_name: "Hamza Tariq",
    client_email: "hamza.tariq@investcorp.pk",
    client_phone: "+92 300 9988771",
    plot_size: "1 Kanal",
    covered_area_sqft: 5200,
    total_amount_pkr: 850000,
    advance_amount_pkr: 425000,
    remaining_balance_pkr: 425000,
    payment_type: "50_percent_advance",
    payment_status: "advance_paid",
    safepay_tracker: "track_safepay_ord_081",
    created_at: "2026-09-14T11:00:00Z",
  },
  {
    id: "ord_102847193",
    order_number: "MARK-2026-082",
    client_name: "Bilal Aslam",
    client_email: "bilal.aslam@lahoretech.co",
    client_phone: "+92 322 8844112",
    plot_size: "10 Marla",
    covered_area_sqft: 3200,
    total_amount_pkr: 28000,
    advance_amount_pkr: 14000,
    remaining_balance_pkr: 14000,
    payment_type: "50_percent_advance",
    payment_status: "advance_paid",
    safepay_tracker: "track_safepay_ord_082",
    created_at: "2026-09-15T14:20:00Z",
  },
];

export const seedAvailabilitySettings: AvailabilitySettings = {
  working_days: [1, 2, 3, 4, 5, 6], // Monday through Saturday
  start_time: "10:00",
  end_time: "19:00",
  slot_durations: [30, 60],
  buffer_minutes: 15,
  timezone: "Asia/Karachi",
  max_per_day: 6,
};

export const seedBlockedDates: BlockedDate[] = [
  {
    id: "block_1",
    date: "2026-09-25",
    start_time: null,
    end_time: null,
    reason: "Studio Site Visit - Islamabad Diplomatic Enclave",
    is_full_day: true,
    created_at: "2026-09-10T10:00:00Z",
  },
  {
    id: "block_2",
    date: "2026-10-01",
    start_time: null,
    end_time: null,
    reason: "National Architecture Guild Symposium",
    is_full_day: true,
    created_at: "2026-09-12T12:00:00Z",
  },
];

export const seedProjects: AdminProject[] = [
  {
    id: "proj_1",
    title: "Cantilever Pavilion Residence",
    slug: "cantilever-pavilion-residence",
    category: "residential",
    location: "DHA Phase VIII, Lahore",
    year: "2025",
    client_name: "Malik Family",
    area_sqft: 6500,
    short_description:
      "A monumental minimalist residence characterized by post-tensioned cantilevered overhangs and internal light courtyards.",
    description:
      "Designed for seamless indoor-outdoor living in Lahore's arid sub-tropical climate. Features exposed board-formed concrete, triple-glazed thermally broken louvers, and a sunken reflecting pool acting as a natural evaporative cooling chamber.",
    cover_image: "/images/Full House Design Package.png",
    gallery_urls: [
      "/images/Full House Design Package.png",
      "/images/Front Elevation 3D (Exterior Render).png",
      "/images/Interior Room Makeover.png",
    ],
    is_featured: true,
    is_published: true,
    display_order: 1,
    created_at: "2026-01-15T10:00:00Z",
  },
  {
    id: "proj_2",
    title: "Margalla Terraces Estate",
    slug: "margalla-terraces-estate",
    category: "residential",
    location: "Sector F-6, Islamabad",
    year: "2024",
    client_name: "Ambassadorial Residence",
    area_sqft: 9200,
    short_description:
      "Cascading stepped villa built into the foothills of the Margalla Ridge.",
    description:
      "Multi-tiered living volumes crafted with indigenous travertine stone and weathered copper fascia. Engineered with solar passive cross-ventilation shafts.",
    cover_image: "/images/Front Elevation 3D (Exterior Render).png",
    gallery_urls: [
      "/images/Front Elevation 3D (Exterior Render).png",
      "/images/House Plan review.png",
    ],
    is_featured: true,
    is_published: true,
    display_order: 2,
    created_at: "2026-02-10T12:00:00Z",
  },
  {
    id: "proj_3",
    title: "The Linear Brise-Soleil Headquarters",
    slug: "the-linear-brise-soleil-hq",
    category: "commercial",
    location: "Gulberg III, Lahore",
    year: "2025",
    client_name: "Apex Holdings",
    area_sqft: 18500,
    short_description:
      "Contemporary 5-storey architectural studio & commercial creative hub.",
    description:
      "Passive thermal envelope fitted with vertical aerodynamic terracotta fins to modulate harsh western sunlight while framing city views.",
    cover_image: "/images/Construction Cost Estimate.png",
    gallery_urls: [
      "/images/Construction Cost Estimate.png",
      "/images/Full House Design Package.png",
    ],
    is_featured: false,
    is_published: true,
    display_order: 3,
    created_at: "2026-03-05T09:00:00Z",
  },
];

export const seedClients: AdminClient[] = [
  {
    id: "cli_1",
    name: "Taimur Malik",
    email: "taimur.malik@lahoreluxury.pk",
    phone: "+92 300 8472910",
    company: "Lahore Luxury Developments",
    notes: "High-value developer; planning 3 boutique villas in DHA Phase 6.",
    total_consultations: 2,
    total_orders: 1,
    total_spend_pkr: 435000,
    last_activity_date: "2026-09-16",
    created_at: "2026-05-12T10:00:00Z",
  },
  {
    id: "cli_2",
    name: "Dr. Ayesha Siddiqui",
    email: "ayesha.siddiqui@islamabadhealth.org",
    phone: "+92 333 5192834",
    company: "Capital Medical Consortium",
    notes:
      "Estate renovation in Sector F-7; interested in passive solar heating.",
    total_consultations: 1,
    total_orders: 0,
    total_spend_pkr: 5000,
    last_activity_date: "2026-09-15",
    created_at: "2026-09-01T14:00:00Z",
  },
  {
    id: "cli_3",
    name: "Hamza Tariq",
    email: "hamza.tariq@investcorp.pk",
    phone: "+92 300 9988771",
    company: "Investcorp Pakistan",
    notes: "Full House Turnkey Blueprint order (1 Kanal).",
    total_consultations: 1,
    total_orders: 1,
    total_spend_pkr: 430000,
    last_activity_date: "2026-09-14",
    created_at: "2026-08-20T11:00:00Z",
  },
];

export const seedTestimonials: AdminTestimonial[] = [
  {
    id: "test_1",
    client_name: "Usman Ghani",
    company: "Ghani Holdings",
    position: "Managing Director",
    review:
      "MARK Architects spotted three critical structural clashes and a missing sunlight shaft in our contractor's drawings in under 48 hours. Saved us millions before pouring concrete.",
    rating: 5,
    photo_url: "/images/profile.png",
    project_title: "1 Kanal Villa Review",
    is_featured: true,
    is_published: true,
    display_order: 1,
    created_at: "2026-04-10T10:00:00Z",
  },
  {
    id: "test_2",
    client_name: "Fatima Noor",
    company: "Bespoke Living Studio",
    position: "Founder & Creative Director",
    review:
      "The 3D front elevation render was so photorealistic that the DHA approval board approved our facade on first presentation without a single revision.",
    rating: 5,
    photo_url: "/images/profile.png",
    project_title: "Modern Facade Concept",
    is_featured: true,
    is_published: true,
    display_order: 2,
    created_at: "2026-05-18T12:00:00Z",
  },
];

export const seedTeamMembers: AdminTeamMember[] = [
  {
    id: "team_1",
    name: "Ar. Muhammad Rafiq",
    role: "Principal Studio Architect & Founder",
    credentials: "B.Arch (NCA), PCATP Licensed, AIA Int.",
    bio: "Over 14 years directing high-end residential, passive solar retreats, and civic institutions across Lahore, Islamabad, and Karachi.",
    specialization:
      "Minimalist Residential Architecture & Sustainable Engineering",
    photo_url: "/images/profile.png",
    email: "rafiq@markarchitects.com",
    display_order: 1,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "team_2",
    name: "Engr. Salman Raza",
    role: "Lead Structural Engineer",
    credentials: "M.Sc. Structural Engineering (UET), PEC Certified",
    bio: "Specialist in post-tensioned concrete slab systems, seismic stabilization, and large-span architectural cantilevers.",
    specialization: "Structural Calculation & Earthquake Resistant Design",
    photo_url: "/images/profile.png",
    email: "salman@markarchitects.com",
    display_order: 2,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
  },
];

export const seedFaqs: AdminFaq[] = [
  {
    id: "faq_1",
    question: "Why is a 50% advance milestone required before drafting begins?",
    answer:
      "Principal architects dedicate reserved studio drafting blocks and 3D modeling time to your property. The 50% upfront commitment secures your studio slot, with final deliverables handed over upon milestone sign-off.",
    category: "Payment & Policies",
    display_order: 1,
    is_published: true,
  },
  {
    id: "faq_2",
    question: "What payment gateway is used for checkout?",
    answer:
      "All online consultations and design packages are securely processed through Safepay, supporting Visa, Mastercard, PayPak, direct bank accounts, and digital wallets with 256-bit encryption.",
    category: "Payment & Policies",
    display_order: 2,
    is_published: true,
  },
  {
    id: "faq_3",
    question: "How do I receive the consultation meeting link?",
    answer:
      "Once your booking and payment are authenticated, our principal architect confirms the appointment and automatically dispatches your dedicated Google Meet video link via email and client portal.",
    category: "Consultation Process",
    display_order: 3,
    is_published: true,
  },
];

export const seedNotifications: AdminNotification[] = [
  {
    id: "notif_1",
    title: "New Consultation Paid",
    message:
      "Kamran Qureshi has paid PKR 3,000 for Basic Call on Sept 19. Needs meeting link assigned.",
    type: "action_needed",
    link: "/admin?tab=consultations&id=a1b2c3d4-e5f6-7a8b-9c0d-112233445566",
    is_read: false,
    created_at: "2026-09-16T11:05:00Z",
  },
  {
    id: "notif_2",
    title: "Safepay Advance Settled",
    message:
      "Bilal Aslam completed 50% advance (PKR 14,000) for Order MARK-2026-082 via Safepay.",
    type: "payment",
    link: "/admin?tab=payments",
    is_read: false,
    created_at: "2026-09-15T14:22:00Z",
  },
  {
    id: "notif_3",
    title: "Upcoming Meeting Today",
    message:
      "Dr. Ayesha Siddiqui consultation starts at 17:30 PKT today via Google Meet.",
    type: "booking",
    link: "/admin?tab=calendar",
    is_read: true,
    created_at: "2026-09-16T08:00:00Z",
  },
];

export const seedCommunicationLogs: CommunicationLog[] = [
  {
    id: "comm_1",
    recipient_email: "taimur.malik@lahoreluxury.pk",
    client_name: "Taimur Malik",
    type: "meeting_invite",
    consultation_id: "c7e8a1d2-9b34-4f6c-8e01-123456789abc",
    meeting_url: "https://meet.google.com/mar-karc-hit",
    status: "sent",
    sent_at: "2026-09-16T08:35:00Z",
  },
  {
    id: "comm_2",
    recipient_email: "ayesha.siddiqui@islamabadhealth.org",
    client_name: "Dr. Ayesha Siddiqui",
    type: "meeting_invite",
    consultation_id: "d9f1b2e3-4c56-7a8b-9c0d-987654321def",
    meeting_url: "https://meet.google.com/aye-sha7-mrk",
    status: "sent",
    sent_at: "2026-09-16T09:05:00Z",
  },
];

export const seedAuditLogs: AuditLogEntry[] = [
  {
    id: "aud_1",
    admin_email: "admin@markarchitects.com",
    action: "CONFIRM_PAYMENT_AND_SEND_MEETING_LINK",
    entity: "consultation",
    entity_id: "c7e8a1d2-9b34-4f6c-8e01-123456789abc",
    metadata: {
      meeting_url: "https://meet.google.com/mar-karc-hit",
      client_email: "taimur.malik@lahoreluxury.pk",
    },
    created_at: "2026-09-16T08:35:00Z",
  },
  {
    id: "aud_2",
    admin_email: "admin@markarchitects.com",
    action: "UPDATE_AVAILABILITY_SETTINGS",
    entity: "availability_settings",
    entity_id: "default",
    metadata: { buffer_minutes: 15, max_per_day: 6 },
    created_at: "2026-09-15T16:00:00Z",
  },
  {
    id: "aud_3",
    admin_email: "admin@markarchitects.com",
    action: "PUBLISH_PROJECT",
    entity: "project",
    entity_id: "proj_1",
    metadata: { title: "Cantilever Pavilion Residence" },
    created_at: "2026-09-14T11:00:00Z",
  },
];

export const seedServices: AdminService[] = [
  {
    id: "srv_1",
    slug: "online-consultation",
    title: "Online Consultation (Video / Call)",
    category: "Advisory",
    short_description:
      "Live 1-on-1 strategy sessions with principal architects via Live HD Video Conference.",
    image_url: "/images/For Call.png",
    pricing_type: "flat",
    popularity_rank: 1,
    is_active: true,
    tiers: [
      {
        id: "tier_1",
        service_id: "srv_1",
        tier_name: "Basic Call",
        description:
          "30 min Zoom/Google Meet discussion + design guidance + immediate layout solutions.",
        deliverables: [
          "30 min Live Session",
          "Discussion & Guidance",
          "Direct Spatial Strategy",
        ],
        delivery_time: "Scheduled Slot (30m)",
        display_order: 1,
        pricing_rules: [
          { id: "pr_1", tier_id: "tier_1", plot_size: "Any", price_pkr: 3000 },
        ],
      },
      {
        id: "tier_2",
        service_id: "srv_1",
        tier_name: "Premium Call",
        description:
          "60 min Zoom/Google Meet consultation; Comprehensive spatial planning + material palette + budget roadmap.",
        deliverables: [
          "60 min Deep-dive Session",
          "Planning Roadmap",
          "Material Advice",
          "Budget Guidance",
        ],
        delivery_time: "Scheduled Slot (60m)",
        display_order: 2,
        pricing_rules: [
          { id: "pr_2", tier_id: "tier_2", plot_size: "Any", price_pkr: 5000 },
        ],
      },
    ],
  },
  {
    id: "srv_2",
    slug: "house-plan-review",
    title: "House Plan Review",
    category: "Diagnostic",
    short_description:
      "Fast architectural audit to pinpoint circulation bottlenecks, structural clashes, and sunlight routing.",
    image_url: "/images/House Plan review.png",
    pricing_type: "flat",
    popularity_rank: 2,
    is_active: true,
    tiers: [
      {
        id: "tier_3",
        service_id: "srv_2",
        tier_name: "Basic Plan Review",
        description:
          "Audio voice memo walkthrough + marked corrections highlighting 3-5 critical defects.",
        deliverables: [
          "Voice memo summary",
          "Marked PDF corrections",
          "3-5 key issues highlighted",
        ],
        delivery_time: "24 Hours",
        display_order: 1,
        pricing_rules: [
          { id: "pr_3", tier_id: "tier_3", plot_size: "Any", price_pkr: 2000 },
        ],
      },
      {
        id: "tier_4",
        service_id: "srv_2",
        tier_name: "Standard Plan Review",
        description:
          "Comprehensive diagnostic report with circulation, room sizing, and natural ventilation suggestions.",
        deliverables: [
          "Analytical review report",
          "Circulation analysis",
          "Annotated PDF drawings",
        ],
        delivery_time: "24-48 Hours",
        display_order: 2,
        pricing_rules: [
          { id: "pr_4", tier_id: "tier_4", plot_size: "Any", price_pkr: 4000 },
        ],
      },
    ],
  },
  {
    id: "srv_3",
    slug: "front-elevation-3d",
    title: "Front Elevation 3D (Exterior Render)",
    category: "3D Facade",
    short_description:
      "Photorealistic 3D facade visualization with material palettes and night lighting illumination.",
    image_url: "/images/Front Elevation 3D (Exterior Render).png",
    pricing_type: "size_based",
    popularity_rank: 3,
    is_active: true,
    tiers: [
      {
        id: "tier_5",
        service_id: "srv_3",
        tier_name: "Standard Elevation",
        description:
          "2 views (front + corner angle), material finish palette, and 2 revision rounds.",
        deliverables: [
          "2 4K 3D Views",
          "Material & Color palette",
          "2 Revision rounds",
        ],
        delivery_time: "3-5 Days",
        display_order: 1,
        pricing_rules: [
          {
            id: "pr_5a",
            tier_id: "tier_5",
            plot_size: "5 Marla",
            price_pkr: 18000,
          },
          {
            id: "pr_5b",
            tier_id: "tier_5",
            plot_size: "10 Marla",
            price_pkr: 22000,
          },
          {
            id: "pr_5c",
            tier_id: "tier_5",
            plot_size: "1 Kanal",
            price_pkr: 28000,
          },
        ],
      },
    ],
  },
];

export const seedMediaAssets: MediaAsset[] = [
  {
    id: "med_1",
    name: "Full House Design Package.png",
    url: "/images/Full House Design Package.png",
    size_bytes: 842000,
    mime_type: "image/png",
    dimensions: { width: 1200, height: 800 },
    alt_text: "Full house architectural blueprint presentation",
    created_at: "2026-09-01T10:00:00Z",
  },
  {
    id: "med_2",
    name: "Front Elevation 3D (Exterior Render).png",
    url: "/images/Front Elevation 3D (Exterior Render).png",
    size_bytes: 654000,
    mime_type: "image/png",
    dimensions: { width: 1200, height: 800 },
    alt_text: "Photorealistic 3D exterior facade render",
    created_at: "2026-09-01T10:00:00Z",
  },
  {
    id: "med_3",
    name: "Interior Room Makeover.png",
    url: "/images/Interior Room Makeover.png",
    size_bytes: 712000,
    mime_type: "image/png",
    dimensions: { width: 1200, height: 800 },
    alt_text: "Bespoke minimalist living room interior styling",
    created_at: "2026-09-01T10:00:00Z",
  },
];
