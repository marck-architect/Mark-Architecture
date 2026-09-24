import React from "react";

// ============================================================================
// Navigation & Common Layout Types
// ============================================================================

export interface NavLink {
  label: string;
  href: string;
}

export interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  className?: string;
}

export interface ClientLayoutProps {
  children: React.ReactNode;
}

// ============================================================================
// Store & State Management Types (Zustand)
// ============================================================================

export interface CartItem {
  title: string;
  price: number;
  image: string;
  quantity: number;
  currency?: "PKR" | "USD";
  tier?: string;
  plotSize?: string;
}

export interface AttachedFile {
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
  url?: string;
}

export interface BookingDate {
  day: number;
  month: number;
  year: number;
}

export type CallTierName = "Basic Call" | "Premium Call";

export interface BookingState {
  selectedDate: BookingDate | null;
  selectedTime: string | null;
  monthOffset: number;
  callTier: CallTierName;
  attachedFile: AttachedFile | null;
}

export interface QuickViewProduct {
  title: string;
  price: string; // e.g. "PKR 15,000"
  category: string;
  image: string;
  description: string;
  deliveryTime?: string;
  tier?: string;
}

export interface LightboxProject {
  title: string;
  location: string;
  imageSrc: string;
  year: string;
  description: string;
  category: string;
  price?: string;
}

export interface ToastState {
  message: string;
  type: "success" | "warning";
  isOpen: boolean;
}

export interface AppStore {
  // Navigation & UI States
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;

  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  toggleCartDrawer: () => void;

  // Cart State
  cart: CartItem[];
  hasHydrated?: boolean;
  setHasHydrated?: (hydrated: boolean) => void;
  addToCart: (item: {
    title: string;
    price: number;
    image: string;
    currency?: "PKR" | "USD";
    tier?: string;
    plotSize?: string;
  }) => void;
  removeFromCart: (index: number) => void;
  changeQuantity: (index: number, delta: number) => void;
  clearCart: () => void;

  // Quick View Modal
  quickView: {
    isOpen: boolean;
    product: QuickViewProduct | null;
  };
  openQuickView: (product: QuickViewProduct) => void;
  closeQuickView: () => void;

  // Lightbox Modal
  lightbox: {
    isOpen: boolean;
    project: LightboxProject | null;
  };
  openLightbox: (project: LightboxProject) => void;
  closeLightbox: () => void;

  // Success Modal
  successModal: {
    isOpen: boolean;
    title: string;
    description: string;
  };
  openSuccessModal: (title: string, description: string) => void;
  closeSuccessModal: () => void;

  // Booking Scheduler State
  booking: BookingState;
  selectDate: (day: number, month: number, year: number) => void;
  selectTimeSlot: (time: string) => void;
  changeMonth: (direction: number) => void;
  setCallTier: (tier: CallTierName) => void;
  setAttachedFile: (file: AttachedFile | null) => void;
  unlinkAppointment: () => void;
  isAppointmentLinked: boolean;
  setAppointmentLinked: (linked: boolean) => void;

  // Portfolio Filters
  portfolioFilter: string;
  setPortfolioFilter: (filter: string) => void;

  // Toast System
  toast: ToastState;
  showToast: (message: string, type?: "success" | "warning") => void;
  hideToast: () => void;
}

// ============================================================================
// Services & Consultation Types
// ============================================================================

export type PlotSize = "5 Marla" | "10 Marla" | "1 Kanal";

export interface Tier {
  name: string;
  deliveryTime?: string;
  details: string;
  deliverables: string[];
  pricePKR?: number; // for flat pricing
  priceByPlot?: Record<PlotSize, number>; // for size_based
}

export type PricingType = "flat" | "size_based" | "rate_formula";

export interface ServiceData {
  id: string;
  slug: string;
  title: string;
  category: string;
  popularityRank: number;
  shortDesc: string;
  image: string;
  pricingType: PricingType;
  tiers?: Tier[];
}

export interface CallTierOption {
  name: CallTierName;
  duration: string;
  price: number;
  description: string;
  features: string[];
}

export interface BriefFormValues {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon?: React.ReactNode;
  defaultProjectType: string;
}

export interface ServicesPopupProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceTitle: string;
  onSelectService: (projectType: string, customBriefText: string) => void;
}

export interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceData | null;
  onApplyToBrief?: (service: ServiceData, tier?: Tier, plot?: PlotSize) => void;
}

export interface ConsultationServicesSidebarProps {
  onSelectService: (service: ServiceData) => void;
  services?: ServiceData[];
}

// ============================================================================
// Store Collection & 3D Viewer Types
// ============================================================================

export interface ArchitecturalPackage {
  id: string;
  title: string;
  tier: string;
  pricePKR: number;
  deliveryTime: string;
  image: string;
  plotSize?: string;
  inclusions: string[];
  description: string;
}

export interface Product {
  title: string;
  price: number;
  currency: "PKR";
  category: string;
  image: string;
  description: string;
  isFeatured?: boolean;
}

export interface CheckoutItem {
  title: string;
  price: number;
  image: string;
  tier?: string;
  plotSize?: string;
  deliveryTime?: string;
}

export interface DirectCheckoutModalProps {
  isOpen: boolean;
  item: CheckoutItem | null;
  onClose: () => void;
}

export type ProductType = "lounger" | "vase";

export interface Product3DSpec {
  name: string;
  value: string;
}

export interface Product3D {
  title: string;
  image: string;
  widthClass: string;
  specs: Product3DSpec[];
}

// ============================================================================
// Portfolio Types
// ============================================================================

export type ProjectCategory =
  | "residential"
  | "commercial"
  | "interior"
  | "landscape"
  | "renovation";

export interface Project {
  title: string;
  location: string;
  imageSrc: string;
  year: string;
  description: string;
  category: ProjectCategory;
  price?: string;
  aspectClass?: string;
}

export interface FilterCategory {
  key: string;
  label: string;
}

// ============================================================================
// About & Practice Types
// ============================================================================

export interface Leader {
  name: string;
  role: string;
  credentials: string;
  bio: string;
  experience: string;
  image: string;
}

export interface Achievement {
  metric: string;
  label: string;
}

export interface StudioLocation {
  city: string;
  address: string;
  role: string;
  isHQ?: boolean;
  region?: string;
}

// ============================================================================
// House Design Calculator Types
// ============================================================================

export interface Discipline {
  id: string;
  name: string;
  rate: number;
  description: string;
}

export interface PlotPreset {
  label: string;
  sqft: number;
  desc: string;
}

// ============================================================================
// Admin & Consultation Records Types
// ============================================================================

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "completed"
  | "rescheduled"
  | "advance_paid";

export interface ConsultationRecord {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  tier_name: string;
  price_pkr: number;
  booking_date: string;
  booking_time: string;
  attachment_urls: string[];
  notes?: string | null;
  meeting_url?: string | null;
  admin_notes?: string | null;
  payment_status:
    | "pending"
    | "paid"
    | "failed"
    | "refunded"
    | "completed"
    | "rescheduled";
  consultation_status?:
    | "pending"
    | "confirmed"
    | "completed"
    | "cancelled"
    | "rescheduled";
  meeting_link_sent_at?: string | null;
  confirmed_by_admin?: boolean;
  confirmed_at?: string | null;
  duration_minutes?: number;
  safepay_tracker?: string | null;
  safepay_token?: string | null;
  meeting_status?:
    | "not_created"
    | "creating"
    | "scheduled"
    | "cancelled"
    | "failed";
  email_status?: "not_sent" | "sending" | "sent" | "failed";
  calendar_event_id?: string | null;
  timezone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MeetingRecord {
  id: string;
  consultation_id: string;
  provider: "google_meet";
  calendar_event_id?: string | null;
  calendar_id?: string;
  meet_space_name?: string | null;
  meeting_url?: string | null;
  scheduled_start?: string | null;
  scheduled_end?: string | null;
  timezone: string;
  status: "not_created" | "creating" | "scheduled" | "cancelled" | "failed";
  error?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface NotificationRecord {
  id: string;
  consultation_id?: string | null;
  type: string;
  recipient: string;
  status: "pending" | "sent" | "failed";
  provider: "resend";
  provider_message_id?: string | null;
  error?: string | null;
  sent_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface GoogleIntegrationRecord {
  id: string;
  provider: "google";
  account_email: string;
  refresh_token: string;
  scope?: string | null;
  expires_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface OrderRecord {
  id: string;
  order_number: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  plot_size?: string | null;
  covered_area_sqft?: number | null;
  total_amount_pkr: number;
  advance_amount_pkr: number;
  remaining_balance_pkr: number;
  payment_type: string;
  payment_status: string;
  safepay_tracker?: string | null;
  created_at: string;
}

// ============================================================================
// Studio Administration Systems Types
// ============================================================================

export type AdminTabType =
  | "dashboard"
  | "consultations"
  | "calendar"
  | "services"
  | "pricing"
  | "projects"
  | "collection"
  | "clients"
  | "payments"
  | "media"
  | "testimonials"
  | "team"
  | "content"
  | "communications"
  | "analytics"
  | "settings"
  | "audit";

export interface PricingTierData {
  id: string;
  name: string;
  pricePKR: number | string;
  priceFormatted: string;
  deliveryTime?: string;
  popular?: boolean;
  tag?: string;
  inclusions: string[];
  notes?: string;
  actionType: "consultation" | "cart";
}

export interface PricingCategoryData {
  id: string;
  letter: string;
  title: string;
  subtitle: string;
  badge?: string;
  description: string;
  clientRequirementNote?: string;
  tiers: PricingTierData[];
}

export interface PricingPolicyPoint {
  title: string;
  description: string;
  icon: string;
}

export interface PricingSettingsContent {
  calculator: {
    disciplines: Discipline[];
    advancePercentage: number;
    plotPresets?: PlotPreset[];
  };
  consultationCalls: {
    basicCallPrice: number;
    premiumCallPrice: number;
    basicCallDuration: number;
    premiumCallDuration: number;
  };
  menuCategories: PricingCategoryData[];
  policyPoints: PricingPolicyPoint[];
  updatedAt?: string;
}

export interface AvailabilitySettings {
  id?: string;
  working_days: number[]; // 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 0=Sun
  start_time: string; // "09:00"
  end_time: string; // "18:00"
  slot_durations: number[]; // [30, 45, 60, 90]
  buffer_minutes: number; // 15
  timezone: string; // "Asia/Karachi"
  max_per_day: number; // 8
}

export interface BlockedDate {
  id: string;
  date: string; // "YYYY-MM-DD"
  start_time?: string | null;
  end_time?: string | null;
  reason: string;
  is_full_day: boolean;
  created_at?: string;
}

export interface AdminProject {
  id: string;
  title: string;
  slug: string;
  category:
    | "residential"
    | "commercial"
    | "interior"
    | "landscape"
    | "renovation";
  location: string;
  year: string;
  client_name?: string | null;
  area_sqft?: number | string | null;
  price?: string | null;
  aspectClass?: string | null;
  description: string;
  short_description?: string | null;
  cover_image: string;
  gallery_urls: string[];
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface AdminClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string | null;
  notes?: string | null;
  total_consultations: number;
  total_orders: number;
  total_spend_pkr: number;
  last_activity_date?: string | null;
  created_at: string;
}

export interface AdminTestimonial {
  id: string;
  client_name: string;
  company?: string | null;
  position?: string | null;
  review: string;
  rating: number; // 1-5
  photo_url?: string | null;
  project_title?: string | null;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  created_at?: string;
}

export interface AdminTeamMember {
  id: string;
  name: string;
  role: string;
  credentials: string;
  bio: string;
  specialization?: string | null;
  photo_url: string;
  email?: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface AdminFaq {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
  display_order: number;
  is_published: boolean;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: "booking" | "payment" | "action_needed" | "system";
  link?: string | null;
  is_read: boolean;
  created_at: string;
}

export interface CommunicationLog {
  id: string;
  recipient_email: string;
  client_name: string;
  type: "meeting_invite" | "order_confirmation" | "reminder" | "manual";
  consultation_id?: string | null;
  meeting_url?: string | null;
  status: "sent" | "failed" | "manual";
  sent_at: string;
  error_message?: string | null;
}

export interface AuditLogEntry {
  id: string;
  admin_email: string;
  action: string; // e.g. "CONFIRM_PAYMENT", "SEND_MEETING_LINK", "UPDATE_SERVICE"
  entity: string; // e.g. "consultation", "service", "project"
  entity_id: string;
  metadata?: Record<string, unknown> | null;
  created_at: string;
}

export interface AdminService {
  id: string;
  slug: string;
  title: string;
  category: string;
  short_description: string;
  detailed_scope?: string | null;
  image_url: string;
  pricing_type: "flat" | "size_based" | "rate_formula";
  popularity_rank: number;
  is_active: boolean;
  tiers?: AdminServiceTier[];
  created_at?: string;
}

export interface AdminServiceTier {
  id: string;
  service_id: string;
  tier_name: string;
  description: string;
  deliverables: string[];
  delivery_time?: string;
  display_order: number;
  pricing_rules?: AdminPricingRule[];
}

export interface AdminPricingRule {
  id: string;
  tier_id: string;
  plot_size: "5 Marla" | "10 Marla" | "1 Kanal" | "Any";
  price_pkr: number;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  size_bytes: number;
  mime_type: string;
  dimensions?: { width: number; height: number };
  alt_text?: string;
  created_at: string;
}

export interface AdminHeaderProps {
  adminEmail: string;
}

export interface BookingDetailModalProps {
  booking: ConsultationRecord;
  onClose: () => void;
  onUpdate: (updatedBooking: ConsultationRecord) => void;
}

export interface AdminDashboardViewProps {
  initialConsultations: ConsultationRecord[];
  initialOrders: OrderRecord[];
  adminEmail?: string;
}

// ============================================================================
// Homepage Highlight Types
// ============================================================================

export interface FeaturedService {
  title: string;
  badge: string;
  price: string;
  duration: string;
  desc: string;
  image: string;
  href: string;
}

export interface CuratedProject {
  title: string;
  category: string;
  location: string;
  image: string;
  scale: string;
}
