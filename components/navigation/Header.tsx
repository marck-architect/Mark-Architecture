"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { cn } from "@/lib/utils";
import { navLinks } from "@/data/navigation";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const { toggleCartDrawer, toggleMobileMenu, mobileMenuOpen, cart } =
    useStore();

  const totalCartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    let ticking = false;

    const evaluateScroll = () => {
      if (pathname === "/") {
        const nextSection = document.getElementById("home-content");
        if (nextSection) {
          const rect = nextSection.getBoundingClientRect();
          // Keep header completely transparent during both hero images
          // until the next content section reaches the top of the viewport
          return rect.top <= 80;
        }
      }
      return window.scrollY > 40;
    };

    const initialFrame = requestAnimationFrame(() => {
      setIsScrolled(evaluateScroll());
    });

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = evaluateScroll();
          setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(initialFrame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  const isHomeHero = pathname === "/" && !isScrolled;

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-40 transition-all duration-300 border-b",
        isScrolled
          ? "bg-white/85 dark:bg-zinc-950/85 backdrop-blur-xl shadow-[0px_10px_30px_rgba(0,0,0,0.02)] border-outline-variant/30"
          : "bg-transparent border-transparent",
      )}
    >
      <nav className="flex justify-between items-center px-4 md:px-margin-desktop py-4 w-full max-w-container-max mx-auto">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center group cursor-pointer focus:outline-none"
          aria-label="MARK Architects Home"
        >
          {isHomeHero ? (
            <Image
              src="/images/logo-white.png"
              alt="MARK Architects"
              width={142}
              height={40}
              priority
              className="h-8 md:h-9 w-auto object-contain transition-opacity duration-200 group-hover:opacity-90"
            />
          ) : (
            <>
              <Image
                src="/images/logo-dark.png"
                alt="MARK Architects"
                width={142}
                height={40}
                priority
                className="h-8 md:h-9 w-auto object-contain dark:hidden transition-opacity duration-200 group-hover:opacity-90"
              />
              <Image
                src="/images/logo-white.png"
                alt="MARK Architects"
                width={142}
                height={40}
                priority
                className="h-8 md:h-9 w-auto object-contain hidden dark:block transition-opacity duration-200 group-hover:opacity-90"
              />
            </>
          )}
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-inter text-sm font-semibold tracking-wide transition-colors pb-1 border-b-2 border-transparent",
                  isHomeHero
                    ? "text-white/80 hover:text-tertiary-fixed"
                    : "text-on-surface-variant hover:text-tertiary",
                  isActive &&
                    (isHomeHero
                      ? "text-tertiary-fixed! border-tertiary-fixed!"
                      : "text-tertiary! border-tertiary!"),
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Header Utilities */}
        <div className="flex items-center gap-4">
          {/* Interactive Shopping Cart Button */}
          <button
            onClick={toggleCartDrawer}
            className={cn(
              "relative p-2.5 rounded-full transition-colors focus:outline-none cursor-pointer",
              isHomeHero ? "hover:bg-white/10" : "hover:bg-surface-container",
            )}
            aria-label="Shopping Cart"
          >
            <ShoppingBag
              className={cn(
                "text-2xl w-6 h-6 transition-colors",
                isHomeHero ? "text-white" : "text-secondary dark:text-white",
              )}
            />
            <span
              className={cn(
                "absolute -top-1 -right-1 bg-tertiary text-white font-montserrat text-[10px] font-extrabold w-5 h-5 flex items-center justify-center rounded-full transition-transform duration-300 shadow-md",
                totalCartQuantity > 0 ? "scale-100" : "scale-0",
              )}
            >
              {totalCartQuantity}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className={cn(
              "lg:hidden p-2.5 rounded-full transition-colors focus:outline-none cursor-pointer",
              isHomeHero ? "hover:bg-white/10" : "hover:bg-surface-container",
            )}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X
                className={cn(
                  "text-2xl w-6 h-6 transition-colors",
                  isHomeHero ? "text-white" : "text-secondary dark:text-white",
                )}
              />
            ) : (
              <Menu
                className={cn(
                  "text-2xl w-6 h-6 transition-colors",
                  isHomeHero ? "text-white" : "text-secondary dark:text-white",
                )}
              />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};
