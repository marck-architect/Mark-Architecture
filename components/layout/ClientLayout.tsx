"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { Header } from "@/components/navigation/Header";
import { MobileMenu } from "@/components/navigation/MobileMenu";
import { Footer } from "@/components/footer/Footer";
import { CartDrawer } from "@/components/ui/CartDrawer";
import { ProductModal } from "@/components/ui/ProductModal";
import { LightboxModal } from "@/components/ui/LightboxModal";
import { SuccessModal } from "@/components/ui/SuccessModal";
import { Toast } from "@/components/ui/Toast";
import type { ClientLayoutProps } from "@/types";

export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    // If admin route, skip Lenis smooth scroll for standard administrative behavior
    if (isAdminRoute) return;

    // Instantiate Lenis smooth scrolling globally
    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, [isAdminRoute]);

  if (isAdminRoute) {
    return (
      <>
        <main className="flex-grow min-h-screen bg-surface text-on-surface">
          {children}
        </main>
        <Toast />
      </>
    );
  }

  return (
    <>
      <Header />
      <MobileMenu />

      {/* Main content wrapper */}
      <main className="flex-grow min-w-0 overflow-x-clip">{children}</main>

      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <ProductModal />
      <LightboxModal />
      <SuccessModal />
      <Toast />
    </>
  );
};
export default ClientLayout;
