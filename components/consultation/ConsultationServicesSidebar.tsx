"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, ArrowUpRight, PhoneCall, ChevronRight } from "lucide-react";
import type { ConsultationServicesSidebarProps } from "@/types";
import { serviceCatalog, getStartingPriceText } from "@/data/services";

export const ConsultationServicesSidebar: React.FC<
  ConsultationServicesSidebarProps
> = ({ onSelectService }) => {
  return (
    <aside className="w-full space-y-6">
      {/* Sidebar Header */}
      <div className="bg-surface-container-low dark:bg-zinc-900/80 p-6 rounded-3xl border border-outline-variant/30 dark:border-zinc-800 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-tertiary/10 text-tertiary">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="font-inter text-[11px] font-bold text-tertiary uppercase tracking-widest">
            Service Catalog ({serviceCatalog.length})
          </span>
        </div>
        <h3 className="font-playfair text-xl md:text-2xl font-bold text-on-surface dark:text-zinc-100">
          Our Architecture Services
        </h3>
        <p className="font-inter text-xs text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
          Need a specific deliverable alongside your consultation? Click any
          service below to explore tiers, deliverables, and pricing in detail.
        </p>
      </div>

      {/* Services List */}
      <div className="space-y-3">
        {serviceCatalog.map((service) => (
          <div
            key={service.id}
            onClick={() => onSelectService(service)}
            className="group relative bg-surface-container-low dark:bg-zinc-900/60 hover:bg-surface-container-high dark:hover:bg-zinc-800/80 border border-outline-variant/30 dark:border-zinc-800/80 hover:border-tertiary/60 rounded-2xl p-4 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md flex items-center gap-4"
          >
            {/* Thumbnail */}
            <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-zinc-950 border border-outline-variant/20 dark:border-zinc-800">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500 brightness-90 group-hover:brightness-100"
                sizes="80px"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-bold text-tertiary uppercase tracking-wider truncate">
                  {service.category}
                </span>
                <span className="text-[10px] text-zinc-400 font-medium shrink-0 flex items-center gap-0.5 group-hover:text-tertiary transition-colors">
                  <span>Modal</span>
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>

              <h4 className="font-playfair text-sm font-bold text-on-surface dark:text-zinc-100 group-hover:text-tertiary transition-colors line-clamp-1">
                {service.title}
              </h4>

              <div className="flex items-center justify-between pt-0.5">
                <span className="font-montserrat text-xs font-bold text-secondary dark:text-zinc-200">
                  {getStartingPriceText(service)}
                </span>
                <span className="text-[10px] text-zinc-400 font-inter group-hover:text-zinc-300">
                  View Details &rarr;
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* WhatsApp Help Banner */}
      <div className="p-5 rounded-2xl bg-tertiary/10 border border-tertiary/25 space-y-3">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-tertiary shrink-0" />
          <span className="font-inter text-xs font-bold uppercase tracking-wider text-secondary dark:text-zinc-200">
            Direct Architect Hotline
          </span>
        </div>
        <p className="font-inter text-[11px] text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
          Need immediate guidance regarding plot size regulations or bespoke
          commercial scopes? Message Muhammad Arsalan directly.
        </p>
        <a
          href="https://wa.me/923000000000"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-bold text-tertiary hover:underline"
        >
          <span>Connect via WhatsApp</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </aside>
  );
};
