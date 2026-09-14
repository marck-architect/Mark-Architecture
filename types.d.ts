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
  safepay_tracker?: string | null;
  safepay_token?: string | null;
  created_at?: string;
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
