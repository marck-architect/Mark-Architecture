'use client';

import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { Header } from '@/components/navigation/Header';
import { MobileMenu } from '@/components/navigation/MobileMenu';
import { Footer } from '@/components/footer/Footer';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { ProductModal } from '@/components/ui/ProductModal';
import { LightboxModal } from '@/components/ui/LightboxModal';
import { SuccessModal } from '@/components/ui/SuccessModal';
import { Toast } from '@/components/ui/Toast';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  useEffect(() => {
    // Instantiate Lenis smooth scrolling globally
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Header />
      <MobileMenu />
      
      {/* Main content wrapper */}
      <main className="flex-grow z-10">
        {children}
      </main>

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
