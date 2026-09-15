import { create } from "zustand";
import type {
  CartItem,
  AttachedFile,
  BookingState,
  QuickViewProduct,
  LightboxProject,
  ToastState,
  AppStore,
} from "@/types";

export type {
  CartItem,
  AttachedFile,
  BookingState,
  QuickViewProduct,
  LightboxProject,
  ToastState,
  AppStore,
};

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
        monthOffset: Math.max(0, state.booking.monthOffset + direction),
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
