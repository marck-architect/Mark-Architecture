'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const {
    toggleCartDrawer,
    toggleMobileMenu,
    mobileMenuOpen,
    cart,
  } = useStore();

  const totalCartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Services', href: '/services' },
    { label: 'Collection', href: '/collection' },
    { label: 'Consultation', href: '/consultation' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-40 transition-all duration-300 border-b border-transparent',
        isScrolled
          ? 'bg-white/85 dark:bg-zinc-950/85 backdrop-blur-xl shadow-[0px_10px_30px_rgba(0,0,0,0.02)] border-outline-variant/30'
          : 'bg-surface/60 dark:bg-black/60 backdrop-blur-xl'
      )}
    >
      <nav className="flex justify-between items-center px-4 md:px-margin-desktop py-4 w-full max-w-container-max mx-auto">
        {/* Brand Logo */}
        <Link
          href="/"
          className="font-playfair text-2xl md:text-3xl font-bold tracking-tight text-secondary hover:text-tertiary transition-colors cursor-pointer"
        >
          MARK <span className="font-light italic text-primary">Archit</span>
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
                  'font-inter text-sm font-semibold tracking-wide text-on-surface-variant hover:text-tertiary transition-colors pb-1 border-b-2 border-transparent',
                  isActive && 'text-tertiary! border-tertiary!'
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
            className="relative p-2.5 rounded-full hover:bg-surface-container transition-colors focus:outline-none cursor-pointer"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="text-secondary text-2xl w-6 h-6" />
            <span
              className={cn(
                'absolute -top-1 -right-1 bg-tertiary text-white font-montserrat text-[10px] font-extrabold w-5 h-5 flex items-center justify-center rounded-full transition-transform duration-300 shadow-md',
                totalCartQuantity > 0 ? 'scale-100' : 'scale-0'
              )}
            >
              {totalCartQuantity}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2.5 rounded-full hover:bg-surface-container transition-colors focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="text-secondary text-2xl w-6 h-6" />
            ) : (
              <Menu className="text-secondary text-2xl w-6 h-6" />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};
