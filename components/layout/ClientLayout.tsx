"use client";

import React, { useEffect, Suspense } from "react";
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
import { RouteProgressBar } from "@/components/navigation/RouteProgressBar";
import type { ClientLayoutProps } from "@/types";

export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const isAdminRoute = Boolean(
    pathname?.startsWith("/markarchit/admin") || pathname?.startsWith("/admin"),
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash || "";
    const search = window.location.search || "";

    const isRecoveryHash =
      hash.includes("type=recovery") ||
      hash.includes("error_code=otp_expired") ||
      hash.includes("error=access_denied") ||
      (hash.includes("access_token=") && hash.includes("type=recovery"));

    const isRecoverySearch =
      search.includes("type=recovery") ||
      search.includes("error_code=otp_expired") ||
      search.includes("error=access_denied");

    if (
      (isRecoveryHash || isRecoverySearch) &&
      !pathname?.startsWith("/markarchit/admin/reset-password") &&
      !pathname?.startsWith("/admin/reset-password")
    ) {
      window.location.replace(
        `/markarchit/admin/reset-password${search}${hash}`,
      );
    }
  }, [pathname]);

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

  useEffect(() => {
    // Reset scroll to top immediately on route transitions without friction
    if (!isAdminRoute && typeof window !== "undefined") {
      (window as unknown as { lenis?: Lenis }).lenis?.scrollTo(0, {
        immediate: true,
      });
    }
  }, [pathname, isAdminRoute]);

  if (isAdminRoute) {
    return (
      <>
        <Suspense fallback={null}>
          <RouteProgressBar />
        </Suspense>
        <main className="flex-grow min-h-screen bg-surface text-on-surface">
          {children}
        </main>
        <Toast />
      </>
    );
  }

  return (
    <>
      <Suspense fallback={null}>
        <RouteProgressBar />
      </Suspense>
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
