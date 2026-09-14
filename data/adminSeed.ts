import type { ConsultationRecord, OrderRecord } from "@/types";

export const seedConsultations: ConsultationRecord[] = [
  {
    id: "c7e8a1d2-9b34-4f6c-8e01-123456789abc",
    client_name: "Taimur Malik",
    client_email: "taimur.malik@lahoreluxury.pk",
    client_phone: "+92 300 8472910",
    tier_name: "Premium Call",
    price_pkr: 35000,
    booking_date: "2026-09-11",
    booking_time: "14:00",
    attachment_urls: [
      "https://example.com/site_contour_survey.pdf",
      "https://example.com/dha_phase6_plot_photo.jpg",
    ],
    notes:
      "1 Kanal plot in DHA Phase 6 Lahore. Looking to build a contemporary minimalist villa with open courtyard and cantilevered canopy.",
    meeting_url: "https://meet.google.com/mar-karc-hit",
    admin_notes:
      "Client sent architectural brief; prepare DHA Phase 6 by-laws checklist.",
    payment_status: "paid",
    safepay_tracker: "track_live_920182847192",
    safepay_token: "tok_safepay_pkr35k_conf",
    created_at: "2026-09-11T09:00:00Z",
  },
  {
    id: "d9f1b2e3-4c56-7a8b-9c0d-987654321def",
    client_name: "Dr. Ayesha Siddiqui",
    client_email: "ayesha.siddiqui@islamabadhealth.org",
    client_phone: "+92 333 5192834",
    tier_name: "Executive Advisory",
    price_pkr: 75000,
    booking_date: "2026-09-11",
    booking_time: "17:30",
    attachment_urls: ["https://example.com/f7_site_dimensions.pdf"],
    notes:
      "Sector F-7 Islamabad estate. Complete gut renovation and sustainable solar passive design review.",
    meeting_url: "https://meet.google.com/aye-sha7-mrk",
    admin_notes:
      "Coordinate structural engineer availability for 17:30 session.",
    payment_status: "paid",
    safepay_tracker: "track_live_837192019283",
    safepay_token: "tok_safepay_pkr75k_conf",
    created_at: "2026-09-11T10:30:00Z",
  },
  {
    id: "a1b2c3d4-e5f6-7a8b-9c0d-112233445566",
    client_name: "Kamran Qureshi",
    client_email: "kamran.q@qureshigroup.com",
    client_phone: "+92 321 4455667",
    tier_name: "Basic Call",
    price_pkr: 15000,
    booking_date: "2026-09-15",
    booking_time: "11:00",
    attachment_urls: [],
    notes:
      "Initial feasibility discussion for modern commercial office front elevation in Gulberg III.",
    meeting_url: null,
    admin_notes: null,
    payment_status: "pending",
    safepay_tracker: "track_pending_74829102",
    safepay_token: null,
    created_at: "2026-09-11T12:00:00Z",
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
    created_at: "2026-09-11T11:00:00Z",
  },
];
