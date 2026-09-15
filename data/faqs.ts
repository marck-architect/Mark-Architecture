export interface FaqItem {
  id: string;
  category:
    | "pricing"
    | "consultation"
    | "approvals"
    | "drawings"
    | "passive-solar";
  question: string;
  shortAnswer: string;
  fullAnswer: string[];
  keywords: string[];
}

export interface FaqCategory {
  key:
    | "all"
    | "pricing"
    | "consultation"
    | "approvals"
    | "drawings"
    | "passive-solar";
  label: string;
  description: string;
}

export const faqCategories: FaqCategory[] = [
  {
    key: "all",
    label: "All Questions",
    description:
      "Browse our complete architectural knowledge base and client guidelines.",
  },
  {
    key: "pricing",
    label: "Pricing & Payments",
    description:
      "Transparent fixed fees, per square foot formula rates, and Safepay milestones.",
  },
  {
    key: "consultation",
    label: "Consultation & Booking",
    description:
      "Online 1-on-1 video sessions with principal architects via Zoom or WhatsApp.",
  },
  {
    key: "approvals",
    label: "PDA & CDA Approvals",
    description:
      "Municipal building bylaws, seismic codes, and submission drawing requirements in Pakistan.",
  },
  {
    key: "drawings",
    label: "Drawings & Deliverables",
    description:
      "Turnkey architectural blueprints, 3D photorealistic elevations, and engineering sets.",
  },
  {
    key: "passive-solar",
    label: "Passive Solar Architecture",
    description:
      "Energy-efficient spatial planning designed for Pakistan's extreme summer and winter climates.",
  },
];

export const faqsData: FaqItem[] = [
  // 1. Pricing & Payments
  {
    id: "how-much-does-an-architect-charge-in-pakistan",
    category: "pricing",
    question:
      "How much does MARK Architects charge for architectural design in Pakistan?",
    shortAnswer:
      "MARK Architects charges a fixed formula rate of PKR 57 per square foot for complete turnkey architectural and engineering design packages, while 1-on-1 strategic video consultations start at PKR 3,000 for 30 minutes.",
    fullAnswer: [
      "Our full turnkey design package is priced at PKR 57 per square foot of total covered area. For a standard 1-Kanal residence (approx. 6,200 sq. ft. covered area), the complete blueprint package is PKR 353,400.",
      "Live 1-on-1 strategic consultations are available at PKR 3,000 for a 30-minute basic session and PKR 5,000 for a 60-minute in-depth masterclass.",
      "All pricing is 100% transparent and standardized in Pakistani Rupees (PKR) with zero hidden drafting charges or surprise site audit fees.",
    ],
    keywords: [
      "architect fee pakistan",
      "cost of 1 kanal house design",
      "architect rate per sq ft",
      "blueprint design price pkr",
      "safepay architectural payments",
    ],
  },
  {
    id: "what-payment-methods-are-accepted-for-consultations",
    category: "pricing",
    question:
      "How do I pay for architectural services and consultations on MARK Architects?",
    shortAnswer:
      "Payments are processed securely online through Safepay, accepting all major Pakistani and international Visa, Mastercard, and PayPak debit/credit cards with instant transaction verification.",
    fullAnswer: [
      "Consultation bookings and standardized design packages are paid directly through Safepay's licensed payment gateway.",
      "We operate on a 50% advance milestone structure for full turnkey custom estates: 50% upon project kickoff and preliminary concept approval, and the remaining 50% upon delivery of municipal submission sets.",
      "Bank transfer and corporate cross-check options are also available for registered commercial plazas and institutional developers.",
    ],
    keywords: [
      "safepay checkout",
      "pay architect online pakistan",
      "debit card payment architectural drawings",
      "50 advance milestone terms",
    ],
  },

  // 2. Consultation & Booking
  {
    id: "what-happens-during-the-online-architectural-consultation",
    category: "consultation",
    question:
      "What happens during the online architectural consultation via Zoom or WhatsApp?",
    shortAnswer:
      "You meet directly with Principal Architect Muhammad Rafiq to review your plot dimensions, diagnose layout bottlenecks, evaluate natural lighting and ventilation, and receive an actionable design roadmap.",
    fullAnswer: [
      "During the 30-minute or 60-minute video audit, we share screens to annotate your existing blueprint, floor sketch, or site photographs in real time.",
      "We calculate room circulation efficiency, check municipal setback compliance (PDA, CDA, DHA), and recommend structural grid alignments that avoid unnecessary RCC column costs.",
      "After the call, you receive a curated meeting recap summary with structural advice and recommended next design phases.",
    ],
    keywords: [
      "online architect consultation zoom",
      "whatsapp architect call pakistan",
      "muhammad rafiq architect",
      "floor plan audit",
      "house design review online",
    ],
  },
  {
    id: "what-documents-should-i-upload-before-my-consultation",
    category: "consultation",
    question:
      "What documents and files are mandatory before confirming a consultation appointment?",
    shortAnswer:
      "Clients must upload either a site contour survey, existing CAD/PDF floor plan, municipal allotment letter with dimensions, or clear on-site plot photographs (up to 25MB).",
    fullAnswer: [
      "Uploading your site details allows our lead architect to inspect municipal bylaws and solar sun-path angles before the live call begins.",
      "Supported file formats include PDF blueprints, DWG CAD exports, high-resolution JPEG/PNG drawings, and compressed ZIP archives.",
      "Files are securely processed with Sharp image optimization and stored in private encrypted Supabase cloud storage buckets.",
    ],
    keywords: [
      "mandatory plot plan upload",
      "architectural brief documents",
      "allotment letter drawing upload",
      "house layout pdf",
    ],
  },
  {
    id: "can-i-book-a-consultation-on-the-same-day",
    category: "consultation",
    question: "How far in advance must I book an architectural consultation?",
    shortAnswer:
      "Consultations must be booked for future dates through our live calendar scheduler; past dates and fully reserved dates are automatically locked out to prevent overbooking.",
    fullAnswer: [
      "Our interactive booking system enforces a future-only scheduling rule so our team has adequate preparation time to review your uploaded site drawings.",
      "Available time slots operate in Pakistan Standard Time (PKT) at 11:00 AM, 02:30 PM, 05:00 PM, and 08:00 PM.",
      "Once an appointment date and slot are confirmed, they are permanently reserved for your session and cannot be claimed by another client.",
    ],
    keywords: [
      "consultation booking rules",
      "pakistan time architect appointment",
      "reserve architect slot",
      "future date calendar",
    ],
  },

  // 3. Municipal Approvals & Bylaws
  {
    id: "does-mark-architects-provide-pda-and-cda-approved-drawings",
    category: "approvals",
    question:
      "Does MARK Architects deliver drawings approved by PDA Peshawar, CDA Islamabad, and DHA?",
    shortAnswer:
      "Yes. As a PCATP-licensed architectural firm, all MARK Architects drawings are drafted in strict conformity with PDA (Peshawar), CDA (Islamabad), KDA (Karachi), and DHA bylaws, achieving a 100% municipal approval success rate.",
    fullAnswer: [
      "We prepare full submission sets including site plans, mandatory ground coverage ratios, front/rear/side setbacks, fire egress routes, and rainwater harvesting provisions required by local authorities.",
      "Each submission drawing is signed and stamped by PCATP-registered architects and PEC-registered structural engineers.",
      "If a municipal authority requests technical adjustments, MARK Architects resolves and updates the drawings with zero additional fees.",
    ],
    keywords: [
      "pda peshawar code approval",
      "cda islamabad architectural drawings",
      "dha bylaw setback compliance",
      "pcatp registered architect stamp",
      "building plan approval pakistan",
    ],
  },
  {
    id: "how-are-seismic-and-earthquake-standards-handled-in-drawings",
    category: "approvals",
    question:
      "Are structural drawings compliant with the Building Code of Pakistan (BCP) seismic zones?",
    shortAnswer:
      "Yes. Every structural engineering blueprint is calculated specifically for the seismic acceleration zone of your city (Zone 2B in Islamabad/Karachi, Zone 3 in Peshawar) adhering to the Building Code of Pakistan 2021.",
    fullAnswer: [
      "Our PEC-licensed structural engineers formulate foundation schedules, raft/strip footings, shear walls, and steel rebar bar-bending schedules (BBS) based on your site's geotechnical soil bearing capacity.",
      "We design ductile concrete frame moments that absorb lateral seismic tremors without brittle failure, ensuring total life-safety compliance.",
    ],
    keywords: [
      "building code of pakistan seismic",
      "earthquake resistant house design",
      "zone 3 peshawar structural engineering",
      "bar bending schedule bbs",
      "pec registered engineer",
    ],
  },

  // 4. Drawings & Deliverables
  {
    id: "what-is-included-in-a-turnkey-house-design-package",
    category: "drawings",
    question:
      "What is included in the PKR 57 per sq. ft. Turnkey House Design Package?",
    shortAnswer:
      "The package includes complete 2D architectural working drawings, photorealistic 3D front elevations, structural engineering drawings, electrical & plumbing (MEP) layouts, and municipal submission blueprints.",
    fullAnswer: [
      "1. Architectural Set: Dimensioned floor plans, door/window schedules, furniture layouts, cross-sections, and external stair/balcony details.",
      "2. 3D Elevation Set: Day and night photorealistic 3D exterior renders with precise material finish specs (travertine, aluminum louvers, thermal glazing).",
      "3. Structural Engineering: Foundation layout, column/beam reinforcement schedules, slab structural plans, and water tank details.",
      "4. MEP Engineering: Electrical conduit diagrams, lighting power circuits, plumbing drainage, clean water supply, and HVAC ducting provisions.",
      "5. Municipal Submission Set: Authoritative blueprint formatted for PDA, CDA, or DHA one-window approval.",
    ],
    keywords: [
      "turnkey architectural package deliverables",
      "3d front elevation exterior render",
      "electrical plumbing mep layout",
      "working drawings construction",
    ],
  },
  {
    id: "what-is-the-turnaround-time-for-architectural-drawings",
    category: "drawings",
    question:
      "How long does it take to deliver full architectural drawings for a house in Pakistan?",
    shortAnswer:
      "Initial concept layouts and 3D elevation sketches are delivered within 7 to 10 working days, with complete turnkey engineering and municipal approval blueprints finalized in 3 to 4 weeks.",
    fullAnswer: [
      "Stage 1 (Week 1–2): Functional space planning, plot circulation options, and client feedback rounds.",
      "Stage 2 (Week 2–3): 3D facade modeling, material grading, and window geometry.",
      "Stage 3 (Week 3–4): Structural calculations, MEP schematics, and municipality submission sets.",
      "Urgent fast-track drafting is available for commercial tenders and time-sensitive municipal deadlines.",
    ],
    keywords: [
      "architectural drawing turnaround time",
      "how long to design a house",
      "fast house plans pakistan",
    ],
  },

  // 5. Passive Solar & Energy Efficiency
  {
    id: "how-does-passive-solar-architecture-save-electricity-bills",
    category: "passive-solar",
    question:
      "How does MARK Architects' passive solar planning reduce summer electricity and AC bills?",
    shortAnswer:
      "By angling window openings, optimizing southern solar azimuths, and designing cross-ventilation breeze corridors, our homes stay naturally up to 6°C cooler in summer and trap winter warmth, reducing HVAC loads by up to 35%.",
    fullAnswer: [
      "We design custom overhangs and cantilevered brise-soleil shading louvers that block vertical high-noon summer sun while permitting low-angle winter sunlight into living spaces.",
      "Thermal double-glazed window placements capture prevailing southern and western monsoon drafts for natural heat purging without relying continuously on air conditioners.",
      "Cavity wall insulation specs and roof reflective coatings prevent thermal bridging common in standard brick construction in Punjab and Khyber Pakhtunkhwa.",
    ],
    keywords: [
      "passive solar design pakistan",
      "reduce ac bill architecture",
      "energy efficient house lahore peshawar",
      "brise soleil louvers",
      "sustainable luxury homes",
    ],
  },
  {
    id: "where-are-mark-architects-physical-studios-located",
    category: "consultation",
    question: "Where are MARK Architects design studios located in Pakistan?",
    shortAnswer:
      "MARK Architects operates its flagship design headquarters on Ring Road, Hayatabad, Peshawar, with regional ateliers serving Islamabad (DHA Phase 2) and Karachi (Clifton Block 4).",
    fullAnswer: [
      "Peshawar HQ: Ring Road, Hayatabad, Peshawar, KPK — handling core drafting, engineering calculation, and regional site supervision.",
      "Islamabad Atelier: DHA Phase 2, Islamabad — focusing on Margalla ridge luxury mansions and CDA commercial hubs.",
      "Karachi Atelier: Clifton Block 4, Karachi — specializing in coastal corrosion-resistant estates and urban renovations.",
      "We also deliver turnkey architectural drawings remotely to overseas Pakistanis in the UK, UAE, USA, and Canada building luxury estates back home.",
    ],
    keywords: [
      "architect office peshawar hayatabad",
      "islamabad dha phase 2 architect",
      "clifton karachi architecture firm",
      "overseas pakistani house design",
    ],
  },
];

export const aeoQuickFacts = [
  { label: "Turnkey Design Rate", value: "PKR 57 / sq. ft." },
  { label: "Consultation Fee", value: "PKR 3,000 / 30 min" },
  { label: "Licensing Credentials", value: "PCATP Registered" },
  { label: "Bylaw Approvals", value: "100% PDA, CDA & DHA" },
  { label: "Headquarters", value: "Peshawar, PK" },
  { label: "Seismic Design", value: "Zone 2B & Zone 3 (BCP)" },
];
