"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Compass,
  Armchair,
  Home,
  Monitor,
  Database,
  TreePine,
  X,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import type { ServiceItem, ServicesPopupProps } from "@/types";
import {
  popupScales as scales,
  popupStyles as styles,
  popupSectors as sectors,
  popupTimelines as timelines,
} from "@/data/services";

const servicesData: ServiceItem[] = [
  {
    title: "Architectural Design",
    description:
      "Conceptualizing structural blueprints that redefine modern living through mathematical precision and aesthetic purity.",
    icon: <Compass className="w-6 h-6" />,
    defaultProjectType: "residential",
  },
  {
    title: "Interior Design",
    description:
      "Curating internal environments with bespoke materials, custom lighting, and an editorial eye for luxury comfort.",
    icon: <Armchair className="w-6 h-6" />,
    defaultProjectType: "interior",
  },
  {
    title: "Exterior Design",
    description:
      "Crafting the visual identity of structures through innovative cladding, glazing, and facade engineering.",
    icon: <Home className="w-6 h-6" />,
    defaultProjectType: "residential",
  },
  {
    title: "3D Visualization",
    description:
      "Hyper-realistic renders that bring your future spaces to life before the first stone is laid.",
    icon: <Monitor className="w-6 h-6" />,
    defaultProjectType: "interior",
  },
  {
    title: "3D Modeling",
    description:
      "Advanced BIM and technical modeling for precise construction and engineering coordination.",
    icon: <Database className="w-6 h-6" />,
    defaultProjectType: "renovation",
  },
  {
    title: "Landscape Design",
    description:
      "Integrating nature with architecture through geometric gardens and sustainable ecosystems.",
    icon: <TreePine className="w-6 h-6" />,
    defaultProjectType: "landscape",
  },
];

export const ServicesPopup: React.FC<ServicesPopupProps> = ({
  isOpen,
  onClose,
  initialServiceTitle,
  onSelectService,
}) => {
  const [selectedTitle, setSelectedTitle] =
    useState<string>(initialServiceTitle);
  const [projectScale, setProjectScale] = useState<string>("Medium");
  const [designStyle, setDesignStyle] = useState<string>("Minimalist Modern");
  const [projectSector, setProjectSector] = useState<string>(
    servicesData.find((s) => s.title === initialServiceTitle)
      ?.defaultProjectType || "residential",
  );
  const [timeline, setTimeline] = useState<string>("3-6 Months");
  const [customNotes, setCustomNotes] = useState<string>("");

  // Find currently selected service details
  const activeService =
    servicesData.find((s) => s.title === selectedTitle) || servicesData[0];

  // Dynamic brief formulation
  const getDynamicBrief = () => {
    const selectedSectorLabel =
      sectors.find((s) => s.value === projectSector)?.label ||
      "Bespoke Architecture";
    let brief = `Tailored Service Request: ${selectedTitle} (${selectedSectorLabel}).\n`;
    brief += `- Project Scale: ${projectScale}\n`;
    brief += `- Aesthetic Direction: ${designStyle}\n`;
    brief += `- Estimated Timeline: ${timeline}`;
    if (customNotes.trim()) {
      brief += `\n- Additional Requests: ${customNotes.trim()}`;
    }
    return brief;
  };

  const handleBooking = () => {
    onSelectService(projectSector, getDynamicBrief());
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="w-full max-w-5xl bg-zinc-900/90 dark:bg-zinc-950/95 border border-zinc-800/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative max-h-[90vh] md:max-h-[85vh] z-10 font-inter text-zinc-200"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all cursor-pointer border border-zinc-700/30"
              aria-label="Close configuration popup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Sidebar: Service Selection */}
            <div className="w-full md:w-80 bg-zinc-950/40 border-b md:border-b-0 md:border-r border-zinc-800/80 p-6 flex flex-col gap-4 overflow-y-auto shrink-0 pt-16 md:pt-6">
              <span className="text-[10px] font-bold tracking-widest text-tertiary uppercase mb-2">
                Specialized Services
              </span>
              <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 scrollbar-thin">
                {servicesData.map((service) => {
                  const isActive = selectedTitle === service.title;
                  return (
                    <button
                      key={service.title}
                      onClick={() => {
                        setSelectedTitle(service.title);
                        setProjectSector(service.defaultProjectType);
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer w-full text-left justify-between ${
                        isActive
                          ? "bg-tertiary text-white shadow-md"
                          : "bg-zinc-900/50 hover:bg-zinc-805/50 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {service.icon}
                        <span>{service.title}</span>
                      </div>
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform duration-300 hidden md:block ${isActive ? "translate-x-0.5" : "opacity-0"}`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detailed Customizer Area */}
            <div className="flex-grow p-6 md:p-10 overflow-y-auto flex flex-col justify-between max-h-[60vh] md:max-h-full">
              <div className="space-y-8">
                {/* Active Service Title & Description */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="p-2.5 rounded-xl bg-tertiary/10 text-tertiary">
                      {activeService.icon}
                    </span>
                    <h3 className="font-playfair text-2xl md:text-3xl font-bold text-white">
                      {activeService.title}
                    </h3>
                  </div>
                  <p className="text-sm font-light text-zinc-400 leading-relaxed max-w-2xl">
                    {activeService.description}
                  </p>
                </div>

                {/* Adjustments Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-4 border-t border-zinc-800/40">
                  {/* Parameter: Sector */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase block">
                      Target Project Category
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      <select
                        value={projectSector}
                        onChange={(e) => setProjectSector(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-tertiary transition-colors cursor-pointer"
                      >
                        {sectors.map((sec) => (
                          <option key={sec.value} value={sec.value}>
                            {sec.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Parameter: Scale */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase block">
                      Project Scale / Size
                    </label>
                    <select
                      value={projectScale}
                      onChange={(e) => setProjectScale(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-tertiary transition-colors cursor-pointer"
                    >
                      {scales.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Parameter: Aesthetic */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase block">
                      Design Aesthetic Style
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {styles.map((sty) => (
                        <button
                          key={sty}
                          onClick={() => setDesignStyle(sty)}
                          className={`px-3 py-2 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                            designStyle === sty
                              ? "bg-tertiary/25 text-tertiary border border-tertiary/40"
                              : "bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 border border-zinc-800/40"
                          }`}
                        >
                          {sty}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Parameter: Timeline */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase block">
                      Estimated Project Timeline
                    </label>
                    <div className="flex gap-2">
                      {timelines.map((time) => (
                        <button
                          key={time}
                          onClick={() => setTimeline(time)}
                          className={`flex-grow px-3 py-2 rounded-lg text-[10px] font-semibold uppercase tracking-wider text-center transition-all duration-200 cursor-pointer ${
                            timeline === time
                              ? "bg-tertiary/25 text-tertiary border border-tertiary/40"
                              : "bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 border border-zinc-800/40"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Parameter: Custom Comments */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase block">
                      Additional Requirements & Custom Remarks
                    </label>
                    <input
                      type="text"
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      placeholder="e.g. Infinity pool inclusion, Net-zero carbon standards, or smart home automation..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-tertiary transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Action Banner */}
              <div className="mt-10 pt-6 border-t border-zinc-800/40 flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Live Preview Box */}
                <div className="text-left bg-zinc-950/60 border border-zinc-900 rounded-xl p-4 w-full sm:flex-grow">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-tertiary animate-pulse" />
                    <span className="text-[9px] font-bold tracking-widest text-tertiary uppercase">
                      Live Brief Configurator Preview
                    </span>
                  </div>
                  <p className="text-[11px] font-light text-zinc-400 whitespace-pre-line leading-relaxed italic">
                    {getDynamicBrief()}
                  </p>
                </div>

                {/* Confirm & Book */}
                <button
                  onClick={handleBooking}
                  className="bg-primary hover:bg-tertiary text-on-primary px-8 py-4.5 rounded-xl font-inter font-bold text-xs tracking-wider uppercase transition-all duration-300 whitespace-nowrap self-stretch sm:self-auto cursor-pointer flex items-center justify-center gap-2 shadow-lg active:scale-95 shrink-0"
                >
                  Book Consultation
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
