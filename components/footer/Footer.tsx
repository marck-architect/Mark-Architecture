"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Globe, Mail, MapPin, Video } from "lucide-react";
import { footerNavigationLinks, footerResourceLinks } from "@/data/navigation";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full min-w-0 overflow-hidden bg-inverse-surface dark:bg-zinc-950 py-20 px-4 md:px-margin-desktop border-t border-outline/20 z-20 text-white/80 mt-auto">
      <div className="grid min-w-0 grid-cols-1 md:grid-cols-12 gap-8 w-full max-w-container-max mx-auto">
        {/* Brand Information */}
        <div className="min-w-0 col-span-12 md:col-span-4 space-y-6">
          <Link
            href="/"
            className="inline-block group focus:outline-none"
            aria-label="MARK Architects Home"
          >
            <Image
              src="/images/logo-white.png"
              alt="MARK Architects"
              width={160}
              height={45}
              className="h-9 md:h-10 w-auto object-contain transition-opacity group-hover:opacity-90"
            />
          </Link>
          <p className="max-w-xs break-words font-inter text-sm text-outline-variant font-light leading-relaxed">
            Precision in every pixel. Defining the future of architectural
            luxury and spatial legacy across the globe.
          </p>
          <div className="flex gap-4">
            <a
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-tertiary hover:border-tertiary transition-colors"
              href="#"
              aria-label="Website"
            >
              <Globe className="w-4 h-4 text-white" />
            </a>
            <a
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-tertiary hover:border-tertiary transition-colors"
              href="mailto:briefs@markarchitects.com"
              aria-label="Email"
            >
              <Mail className="w-4 h-4 text-white" />
            </a>
            <a
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-tertiary hover:border-tertiary transition-colors"
              href="#"
              aria-label="Video Call"
            >
              <Video className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>

        {/* Navigation Quick Links */}
        <div className="min-w-0 col-span-6 sm:col-span-6 md:col-span-2 space-y-4">
          <h4 className="font-inter text-xs font-bold text-tertiary-fixed uppercase tracking-wider">
            Navigation
          </h4>
          <ul className="space-y-2.5 font-inter text-sm font-light">
            {footerNavigationLinks.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  prefetch={true}
                  className="hover:text-tertiary-fixed transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources Section */}
        <div className="min-w-0 col-span-6 sm:col-span-6 md:col-span-2 space-y-4">
          <h4 className="font-inter text-xs font-bold text-tertiary-fixed uppercase tracking-wider">
            Resources
          </h4>
          <ul className="space-y-2.5 font-inter text-sm font-light">
            {footerResourceLinks.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  prefetch={true}
                  className="hover:text-tertiary-fixed transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Studios Section */}
        <div className="min-w-0 col-span-12 md:col-span-4 space-y-4">
          <h4 className="font-inter text-xs font-bold text-tertiary-fixed uppercase tracking-wider">
            Studios
          </h4>
          <ul className="space-y-3 font-inter text-sm font-light">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-tertiary shrink-0" />
              <span className="min-w-0 break-all sm:break-normal">
                briefs@markarchitects.com
              </span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-tertiary mt-1 flex-shrink-0" />
              <span className="min-w-0 break-words">
                4A, AL Haj Sher Tower, Ring Rd, Near Hayatabad, Peshawar
              </span>
            </li>
          </ul>
        </div>

        {/* Copyright and locations footer bottom */}
        <div className="min-w-0 col-span-12 mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/50 font-light text-center sm:text-left">
          <p className="break-words">
            © 2026 MARK Architects Pvt. Ltd. Precision in every pixel.
          </p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 uppercase tracking-widest text-[9px] font-bold">
            <span>Islamabad</span>
            <span>Karachi</span>
            <span>Peshawar</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
