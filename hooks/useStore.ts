import { create } from "zustand";

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
}

export interface BookingState {
  selectedDate: { day: number; month: number; year: number } | null;
  selectedTime: string | null;
  monthOffset: number;
  callTier: "Basic Call" | "Premium Call";
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

interface ToastState {
  message: string;
  type: "success" | "warning";
  isOpen: boolean;
}

interface AppStore {
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
  setCallTier: (tier: "Basic Call" | "Premium Call") => void;
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

let toastTimeout: NodeJS.Timeout;

export const useStore = create<AppStore>((set, get) => ({
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  toggleMobileMenu: () =>
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

  cartDrawerOpen: false,
  setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),
  toggleCartDrawer: () =>
    set((state) => ({ cartDrawerOpen: !state.cartDrawerOpen })),

  cart: [],
  addToCart: (item) =>
    set((state) => {
      const existingIndex = state.cart.findIndex(
        (i) =>
          i.title === item.title &&
          i.tier === item.tier &&
          i.plotSize === item.plotSize,
      );
      const newCart = [...state.cart];

      if (existingIndex > -1) {
        newCart[existingIndex].quantity += 1;
      } else {
        newCart.push({
          ...item,
          currency: item.currency || "PKR",
          quantity: 1,
        });
      }

      // Trigger toast notification
      get().showToast(`"${item.title}" added to order!`);

      return { cart: newCart };
    }),
  removeFromCart: (index) =>
    set((state) => {
      const item = state.cart[index];
      const newCart = state.cart.filter((_, i) => i !== index);
      if (item) {
        get().showToast(`Removed "${item.title}" from order.`);
      }
      return { cart: newCart };
    }),
  changeQuantity: (index, delta) =>
    set((state) => {
      const newCart = [...state.cart];
      if (newCart[index]) {
        newCart[index].quantity = Math.max(1, newCart[index].quantity + delta);
      }
      return { cart: newCart };
    }),
  clearCart: () => set({ cart: [] }),

  quickView: {
    isOpen: false,
    product: null,
  },
  openQuickView: (product) => set({ quickView: { isOpen: true, product } }),
  closeQuickView: () =>
    set((state) => ({ quickView: { ...state.quickView, isOpen: false } })),

  lightbox: {
    isOpen: false,
    project: null,
  },
  openLightbox: (project) => set({ lightbox: { isOpen: true, project } }),
  closeLightbox: () =>
    set((state) => ({ lightbox: { ...state.lightbox, isOpen: false } })),

  successModal: {
    isOpen: false,
    title: "",
    description: "",
  },
  openSuccessModal: (title, description) =>
    set({ successModal: { isOpen: true, title, description } }),
  closeSuccessModal: () =>
    set((state) => ({
      successModal: { ...state.successModal, isOpen: false },
    })),

  booking: {
    selectedDate: null,
    selectedTime: null,
    monthOffset: 0,
    callTier: "Basic Call",
    attachedFile: null,
  },
  selectDate: (day, month, year) =>
    set((state) => ({
      booking: {
        ...state.booking,
        selectedDate: { day, month, year },
      },
    })),
  selectTimeSlot: (time) =>
    set((state) => ({
      booking: {
        ...state.booking,
        selectedTime: time,
      },
    })),
  changeMonth: (direction) =>
    set((state) => ({
      booking: {
        ...state.booking,
        monthOffset: state.booking.monthOffset + direction,
      },
    })),
  setCallTier: (tier) =>
    set((state) => ({
      booking: {
        ...state.booking,
        callTier: tier,
      },
    })),
  setAttachedFile: (file) =>
    set((state) => ({
      booking: {
        ...state.booking,
        attachedFile: file,
      },
    })),
  unlinkAppointment: () =>
    set((state) => ({
      booking: {
        ...state.booking,
        selectedDate: null,
        selectedTime: null,
        attachedFile: null,
      },
      isAppointmentLinked: false,
    })),
  isAppointmentLinked: false,
  setAppointmentLinked: (linked) => set({ isAppointmentLinked: linked }),

  portfolioFilter: "all",
  setPortfolioFilter: (filter) => set({ portfolioFilter: filter }),

  toast: {
    message: "",
    type: "success",
    isOpen: false,
  },
  showToast: (message, type = "success") => {
    if (toastTimeout) clearTimeout(toastTimeout);
    set({ toast: { message, type, isOpen: true } });
    toastTimeout = setTimeout(() => {
      get().hideToast();
    }, 3000);
  },
  hideToast: () =>
    set((state) => ({ toast: { ...state.toast, isOpen: false } })),
}));
