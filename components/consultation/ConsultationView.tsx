"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar as CalendarIcon,
  Video,
  Clock,
  X,
  UploadCloud,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  CreditCard,
  ArrowDown,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Lock,
  PhoneCall,
  ArrowUpRight,
  Layers,
} from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";
import { SafepayService } from "@/lib/safepay";
import { ServiceDetailModal } from "@/components/consultation/ServiceDetailModal";
import type {
  ServiceData,
  Tier,
  PlotSize,
  AttachedFile,
  BriefFormValues,
} from "@/types";
import {
  briefFormSchema,
  consultationMonths as months,
  consultationTimeSlots as timeSlots,
  callTiers,
  serviceCatalog,
  getStartingPriceText,
} from "@/data/services";

export const ConsultationView: React.FC = () => {
  const {
    booking,
    selectDate,
    selectTimeSlot,
    changeMonth,
    setCallTier,
    setAttachedFile,
    unlinkAppointment,
    isAppointmentLinked,
    setAppointmentLinked,
    showToast,
  } = useStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  // Packages start collapsed to a compact price preview (not fully hidden —
  // both prices are visible immediately) and expand to the full cards once
  // the visitor asks for them, either via the hero CTA or the preview's own
  // expand button.
  const [packagesExpanded, setPackagesExpanded] = useState(false);

  // Modal & Services Dropdown State
  const [selectedServiceModal, setSelectedServiceModal] =
    useState<ServiceData | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState<boolean>(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] =
    useState<boolean>(false);
  // Starts unselected on purpose: showing a full preview (image, price,
  // description, two buttons) for a service nobody picked yet made this
  // "lighter, secondary" panel just as heavy as the main booking flow.
  const [activeSidebarService, setActiveSidebarService] =
    useState<ServiceData | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [isLoadingBookedDates, setIsLoadingBookedDates] =
    useState<boolean>(true);

  // Fetch booked dates from API to ensure already booked dates cannot be selected again
  useEffect(() => {
    let isMounted = true;
    async function fetchBookedDates() {
      try {
        const res = await fetch("/api/consultations/booked-dates");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data.bookedDates)) {
            setBookedDates(data.bookedDates);
          }
        }
      } catch (err) {
        console.warn("Could not fetch booked dates:", err);
      } finally {
        if (isMounted) setIsLoadingBookedDates(false);
      }
    }
    fetchBookedDates();
    return () => {
      isMounted = false;
    };
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<BriefFormValues>({
    resolver: zodResolver(briefFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      projectType: "",
      message: "",
    },
  });

  // Calculate dynamic calendar elements based on current date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const baseYear = today.getFullYear();
  const baseMonth = today.getMonth();

  // Target month object based on monthOffset
  const dateObj = new Date(baseYear, baseMonth + booking.monthOffset, 1);
  const displayedMonth = dateObj.getMonth();
  const displayedYear = dateObj.getFullYear();

  let startDay = dateObj.getDay();
  if (startDay === 0) startDay = 7; // Convert Sunday (0) to 7 for Mon-Sun grid

  const daysInMonth = new Date(displayedYear, displayedMonth + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 1; i < startDay; i++) {
    calendarDays.push({ day: null, key: `empty-${i}` });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({ day, key: `day-${day}` });
  }

  // Safe date selection handler: enforces future-only and single-booking rules
  const handleSelectDate = (day: number, month: number, year: number) => {
    const targetDate = new Date(year, month, day);
    targetDate.setHours(0, 0, 0, 0);

    const formattedKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    if (targetDate.getTime() < today.getTime()) {
      showToast(
        "Past dates cannot be selected. Please choose an upcoming date.",
        "warning",
      );
      return;
    }

    if (bookedDates.includes(formattedKey)) {
      showToast(
        "This date is already booked and reserved. Please select another date.",
        "warning",
      );
      return;
    }

    selectDate(day, month, year);
  };

  // Handle file uploads (Mandatory for booking)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 25MB
    const maxBytes = 25 * 1024 * 1024;
    if (file.size > maxBytes) {
      setFileError(
        "File size exceeds 25MB limit. Please attach a compressed file or PDF.",
      );
      return;
    }

    setFileError(null);
    setIsUploadingFile(true);
    showToast("Processing file & uploading to Supabase Storage...", "success");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "consultations");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Upload failed. Please try again.");
      }

      const attached: AttachedFile = {
        name: file.name,
        size: data.processedSize || file.size,
        type: data.mimeType || file.type,
        url: data.url,
      };
      setAttachedFile(attached);
      showToast(
        data.isImage
          ? "Drawing optimized with Sharp & uploaded to Supabase Storage!"
          : "PDF blueprint uploaded to Supabase Storage!",
        "success",
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setFileError(msg);
      showToast(msg, "warning");
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFormSubmit = async (values: BriefFormValues) => {
    // MANDATORY REQUIREMENT: Client must attach file/photo before confirmation
    if (!booking.attachedFile) {
      setFileError(
        "Mandatory: Please attach your architectural plan or site photos before booking can be confirmed.",
      );
      showToast("Please attach your floor plan or site photos.", "warning");
      const uploadElement = document.getElementById("mandatory-upload-box");
      if (uploadElement) {
        uploadElement.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    if (
      !isAppointmentLinked ||
      !booking.selectedDate ||
      !booking.selectedTime
    ) {
      showToast("Please choose and confirm a calendar slot above.", "warning");
      return;
    }

    const { day, month, year } = booking.selectedDate;
    const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    if (bookedDates.includes(formattedDate)) {
      showToast(
        "This date is already booked and reserved. Please select another date.",
        "warning",
      );
      return;
    }

    // Immediately mark date as booked so it cannot be selected again
    setBookedDates((prev) =>
      prev.includes(formattedDate) ? prev : [...prev, formattedDate],
    );

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/checkout/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          callTier: booking.callTier,
          bookingDate: formattedDate,
          bookingTime: booking.selectedTime,
          message: values.message,
          attachmentUrls: booking.attachedFile?.url
            ? [booking.attachedFile.url]
            : booking.attachedFile?.name
              ? [booking.attachedFile.name]
              : [],
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.checkoutUrl) {
        throw new Error(data.error || "Failed to initiate payment session.");
      }

      showToast("Connecting to Safepay Checkout...", "success");

      // Reset local inputs
      reset();
      unlinkAppointment();
      setAttachedFile(null);

      // Redirect client to Safepay hosted checkout
      window.location.assign(data.checkoutUrl);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Safepay checkout error:", message);
      showToast(message || "Payment checkout failed", "warning");
      setIsSubmitting(false);
    }
  };

  const selectedTierData =
    callTiers.find((t) => t.name === booking.callTier) || callTiers[0];

  // Close services dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        servicesDropdownRef.current &&
        !servicesDropdownRef.current.contains(event.target as Node)
      ) {
        setIsServicesDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectServiceFromDropdown = (service: ServiceData) => {
    setActiveSidebarService(service);
    setSelectedServiceModal(service);
    setIsServiceModalOpen(true);
    setIsServicesDropdownOpen(false);
  };

  const handleApplyServiceToBrief = (
    service: ServiceData,
    tier?: Tier,
    selectedPlot?: PlotSize,
  ) => {
    let addMessage = `Interested in Service: ${service.title}`;
    if (tier) addMessage += ` (${tier.name} Tier)`;
    if (selectedPlot) addMessage += ` for plot size: ${selectedPlot}`;

    setValue("message", `${getValues("message") || ""}\n${addMessage}`.trim());
    showToast(
      `Added "${service.title}" requirements to your brief!`,
      "success",
    );

    const formEl = document.getElementById("consultation-contact-section");
    if (formEl) {
      formEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleViewPackages = () => {
    setPackagesExpanded(true);
    requestAnimationFrame(() => {
      document
        .getElementById("view-packages-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleSelectTierAndProceed = (
    tierName: (typeof callTiers)[number]["name"],
  ) => {
    setCallTier(tierName);
    document
      .getElementById("consultation-contact-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative overflow-x-hidden min-h-screen bg-surface dark:bg-zinc-950">
      {/* Whole-screen Hero Section (Full Initial Page down to Consultation Booking) */}
      <header className="relative w-full min-h-[100dvh] flex items-center overflow-x-hidden border-b border-outline-variant/30">
        {/* Background Architectural Drafting Grid Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

        {/* Large Subtle Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.03] dark:opacity-[0.05]">
          <span className="font-montserrat text-[20vw] font-black tracking-tighter">
            ADVISORY
          </span>
        </div>

        {/* Center Main Hero Content */}
        <div className="relative z-10 w-full max-w-container-max mx-auto px-4 md:px-margin-desktop pt-16">
          <ScrollReveal>
            <div className="max-w-4xl space-y-5">
              <h1
                className="font-playfair text-on-surface dark:text-zinc-100 font-normal leading-[1.08] tracking-tight"
                style={{ fontSize: "clamp(2.25rem, 1.5rem + 3vw, 4rem)" }}
              >
                Make design decisions <br />
                <span className="font-light text-tertiary">
                  with absolute confidence.
                </span>
              </h1>

              <p
                className="font-inter text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed max-w-3xl"
                style={{
                  fontSize: "clamp(0.9375rem, 0.85rem + 0.3vw, 1.125rem)",
                }}
              >
                A direct conversation with our licensed principal architects
                about your plan, plot, or project. Choose a session, pick a
                time, and send us your brief.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-stretch sm:items-center">
                <button
                  type="button"
                  onClick={handleViewPackages}
                  className="w-full sm:w-auto bg-primary hover:bg-tertiary text-on-primary px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold tracking-wider transition-all duration-300 shadow-md active:scale-95 text-center inline-flex items-center justify-center gap-2 font-inter text-xs uppercase cursor-pointer min-h-[48px]"
                >
                  <span>Explore Design Packages</span>
                  <ArrowDown className="w-4 h-4" />
                </button>
                <Link
                  href="/portfolio"
                  className="w-full sm:w-auto border border-outline-variant hover:border-tertiary hover:text-tertiary px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold tracking-wider transition-all active:scale-95 text-center font-inter text-xs uppercase min-h-[48px] inline-flex items-center justify-center"
                >
                  View Selected Works
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </header>

      {/* Main Content: Left Column (Packages -> Contact Form -> Consultation Form) + Right Column (Services Dropdown) */}
      <main
        id="consultation-flow"
        className="px-4 md:px-margin-desktop max-w-container-max mx-auto py-12 md:py-16 scroll-mt-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column (8 cols): Packages -> Contact Form -> Consultation Scheduling */}
          <div className="lg:col-span-8 space-y-16">
            {/* 1. View Packages Section */}
            <section
              id="view-packages-section"
              className="space-y-8 scroll-mt-24 pb-12 border-b border-outline-variant/20"
            >
              <ScrollReveal>
                <div className="space-y-3">
                  <span className="font-inter text-xs font-bold text-tertiary uppercase tracking-widest block">
                    Step 1
                  </span>
                  <h2 className="font-playfair text-3xl md:text-4xl text-on-surface dark:text-zinc-100 font-normal">
                    Talk to an Architect First.
                  </h2>
                  <p className="font-inter text-sm text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed max-w-2xl">
                    This is a real conversation with one of our architects. Tell
                    them about your plot or your house plan, and they will
                    answer your questions and help you plan the next step. Not
                    sure what you need yet? That is completely fine, start here.
                    Already know exactly what you want? Browse our full list of
                    services on the right.
                  </p>
                </div>
              </ScrollReveal>

              <AnimatePresence initial={false} mode="wait">
                {!packagesExpanded ? (
                  <motion.div
                    key="packages-collapsed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {callTiers.map((tier) => (
                        <button
                          key={tier.name}
                          type="button"
                          onClick={handleViewPackages}
                          className="text-left p-5 rounded-2xl border border-outline-variant/30 bg-surface-container-low dark:bg-zinc-900/50 hover:border-tertiary/60 transition-all cursor-pointer flex items-center justify-between gap-4"
                        >
                          <div>
                            <span className="text-[10px] font-inter font-bold text-tertiary uppercase tracking-widest block">
                              {tier.duration}
                            </span>
                            <h3 className="font-playfair text-lg font-bold text-on-surface dark:text-white">
                              {tier.name}
                            </h3>
                          </div>
                          <span className="font-montserrat text-lg font-extrabold text-secondary dark:text-zinc-100 shrink-0">
                            {SafepayService.formatPKR(tier.price)}
                          </span>
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleViewPackages}
                      className="w-full rounded-xl py-3.5 border border-tertiary/40 text-tertiary hover:bg-tertiary hover:text-on-tertiary hover:border-tertiary transition-all font-inter text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>View Full Details &amp; Book</span>
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="packages-expanded"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                  >
                    {callTiers.map((tier, idx) => {
                      const isSelected = booking.callTier === tier.name;
                      return (
                        <div
                          key={tier.name}
                          onClick={() => setCallTier(tier.name)}
                          className={`relative p-6 md:p-8 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-6 ${
                            isSelected
                              ? "border-tertiary bg-tertiary/5 dark:bg-tertiary/10 shadow-lg scale-[1.01]"
                              : "border-outline-variant/30 bg-surface-container-low dark:bg-zinc-900/50 hover:border-tertiary/60"
                          }`}
                        >
                          {idx === 1 && (
                            <span className="absolute -top-3 right-6 rounded-full bg-tertiary px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                              Most Popular
                            </span>
                          )}

                          <div className="space-y-4">
                            <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-2">
                              <div>
                                <span className="text-[11px] font-inter font-bold text-tertiary uppercase tracking-widest block">
                                  {tier.duration}
                                </span>
                                <h3 className="font-playfair text-xl sm:text-2xl font-bold text-on-surface dark:text-white mt-0.5">
                                  {tier.name}
                                </h3>
                              </div>
                              <span className="font-montserrat text-xl sm:text-2xl font-extrabold text-secondary dark:text-zinc-100">
                                {SafepayService.formatPKR(tier.price)}
                              </span>
                            </div>

                            <p className="font-inter text-xs text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                              {tier.description}
                            </p>

                            <div className="pt-3 border-t border-outline-variant/15 divide-y divide-outline-variant/15">
                              {tier.features.map((feat, fIdx) => (
                                <p
                                  key={fIdx}
                                  className="font-inter text-xs text-on-surface dark:text-zinc-300 font-light leading-relaxed py-2 first:pt-0 last:pb-0"
                                >
                                  {feat}
                                </p>
                              ))}
                            </div>
                          </div>

                          <div className="pt-4 border-t border-outline-variant/20 space-y-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectTierAndProceed(tier.name);
                              }}
                              className={`w-full rounded-xl py-3 font-inter text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-tertiary text-on-tertiary shadow-md"
                                  : "bg-primary hover:bg-tertiary text-on-primary"
                              }`}
                            >
                              {isSelected
                                ? "Selected Tier • Proceed to Details"
                                : "Select This Package"}
                            </button>
                            <span
                              className={`block text-center font-inter text-[10px] font-bold uppercase tracking-wider ${
                                isSelected ? "text-tertiary" : "text-zinc-400"
                              }`}
                            >
                              {isSelected
                                ? "Active Selection"
                                : "Click to choose"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Unified Form containing Contact Form (Step 2) & Consultation Scheduling (Step 3) */}
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-16"
            >
              {/* 2. Contact Form Section */}
              <section
                id="consultation-contact-section"
                className="space-y-8 scroll-mt-24 pb-12 border-b border-outline-variant/20"
              >
                <ScrollReveal>
                  <div className="space-y-3">
                    <span className="font-inter text-xs font-bold text-tertiary uppercase tracking-widest block">
                      Step 2
                    </span>
                    <h2 className="font-playfair text-3xl md:text-4xl text-on-surface dark:text-zinc-100 font-normal">
                      Tell Us About You and Your Project.
                    </h2>
                    <p className="font-inter text-sm text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed max-w-2xl">
                      Share your contact details and a little about your plot or
                      project. This helps our architects prepare before they
                      speak with you.
                    </p>
                  </div>
                </ScrollReveal>

                <div className="bg-surface-container-low dark:bg-zinc-900 border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                  {/* Contact Inputs Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="font-inter text-xs font-bold text-on-surface dark:text-zinc-300 uppercase tracking-wider block mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        {...register("name")}
                        placeholder="e.g. Asad Malik"
                        className="w-full bg-white dark:bg-zinc-950 border border-outline-variant/50 rounded-xl px-4 py-3 text-xs text-on-surface dark:text-white focus:outline-none focus:border-tertiary transition-colors"
                      />
                      {errors.name && (
                        <span className="text-[10px] text-red-500 font-bold block mt-1">
                          {errors.name.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="font-inter text-xs font-bold text-on-surface dark:text-zinc-300 uppercase tracking-wider block mb-1.5">
                        Email Address *
                      </label>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="name@company.com"
                        className="w-full bg-white dark:bg-zinc-950 border border-outline-variant/50 rounded-xl px-4 py-3 text-xs text-on-surface dark:text-white focus:outline-none focus:border-tertiary transition-colors"
                      />
                      {errors.email && (
                        <span className="text-[10px] text-red-500 font-bold block mt-1">
                          {errors.email.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="font-inter text-xs font-bold text-on-surface dark:text-zinc-300 uppercase tracking-wider block mb-1.5">
                        Contact / Phone Number *
                      </label>
                      <input
                        {...register("phone")}
                        type="tel"
                        placeholder="+92 300 0000000"
                        className="w-full bg-white dark:bg-zinc-950 border border-outline-variant/50 rounded-xl px-4 py-3 text-xs text-on-surface dark:text-white focus:outline-none focus:border-tertiary transition-colors"
                      />
                      {errors.phone && (
                        <span className="text-[10px] text-red-500 font-bold block mt-1">
                          {errors.phone.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="font-inter text-xs font-bold text-on-surface dark:text-zinc-300 uppercase tracking-wider block mb-1.5">
                        Property Scale / Category *
                      </label>
                      <select
                        {...register("projectType")}
                        className="w-full bg-white dark:bg-zinc-950 border border-outline-variant/50 rounded-xl px-4 py-3 text-xs text-on-surface dark:text-white focus:outline-none focus:border-tertiary transition-colors cursor-pointer"
                      >
                        <option value="">Select Property Size...</option>
                        <option value="5_marla">5 Marla Residential</option>
                        <option value="10_marla">10 Marla Residential</option>
                        <option value="1_kanal">1 Kanal Residential</option>
                        <option value="2_kanal_plus">2 Kanal+ Estate</option>
                        <option value="commercial">
                          Commercial / Mixed-Use
                        </option>
                      </select>
                      {errors.projectType && (
                        <span className="text-[10px] text-red-500 font-bold block mt-1">
                          {errors.projectType.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Key Questions / Scope */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-inter text-xs font-bold text-on-surface dark:text-zinc-300 uppercase tracking-wider block">
                        Key Questions &amp; Issues You Wish to Resolve *
                      </label>
                      <span className="text-[11px] text-tertiary font-inter">
                        (Selecting a service from the right adds it here)
                      </span>
                    </div>
                    <textarea
                      {...register("message")}
                      rows={4}
                      placeholder="Detail any room dimension issues, ventilation concerns, municipal submission queries, or specific material advice..."
                      className="w-full bg-white dark:bg-zinc-950 border border-outline-variant/50 rounded-xl px-4 py-3 text-xs text-on-surface dark:text-white focus:outline-none focus:border-tertiary transition-colors leading-relaxed"
                    />
                    {errors.message && (
                      <span className="text-[10px] text-red-500 font-bold block mt-1">
                        {errors.message.message}
                      </span>
                    )}
                  </div>
                </div>
              </section>

              {/* 3. Consultation Scheduling Form (Calendar, Time Slot, File Upload & Safepay Checkout) */}
              <section
                id="consultation-booking-section"
                className="space-y-8 scroll-mt-24"
              >
                <ScrollReveal>
                  <div className="space-y-3">
                    <span className="font-inter text-xs font-bold text-tertiary uppercase tracking-widest block">
                      Step 3
                    </span>
                    <h2 className="font-playfair text-3xl md:text-4xl text-on-surface dark:text-zinc-100 font-normal">
                      Pick a Time and Upload Your Plan.
                    </h2>
                    <p className="font-inter text-xs md:text-sm text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                      Choose a date and time that works for you (Pakistan time).
                      You also need to upload your floor plan or site photos.
                      This lets the architect understand your project before
                      your session.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant dark:text-zinc-400 bg-surface-container-low dark:bg-zinc-900 px-3.5 py-2 rounded-xl border border-outline-variant/30">
                      <Clock className="w-3.5 h-3.5 text-tertiary" />
                      <span>{selectedTierData.duration} Live Video Audit</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant dark:text-zinc-400 bg-surface-container-low dark:bg-zinc-900 px-3.5 py-2 rounded-xl border border-outline-variant/30">
                      <Video className="w-3.5 h-3.5 text-tertiary" />
                      <span>Live HD Video Session</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant dark:text-zinc-400 bg-surface-container-low dark:bg-zinc-900 px-3.5 py-2 rounded-xl border border-outline-variant/30">
                      <CreditCard className="w-3.5 h-3.5 text-tertiary" />
                      <span>
                        Fee: {SafepayService.formatPKR(selectedTierData.price)}
                      </span>
                    </div>
                  </div>
                </ScrollReveal>

                <div className="bg-surface-container-low dark:bg-zinc-900 p-4 sm:p-6 md:p-8 border border-outline-variant/30 rounded-3xl shadow-sm space-y-6 sm:space-y-8">
                  {/* Calendar Box */}
                  <div className="space-y-6">
                    {/* Month selector header */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-4 pb-4 border-b border-outline-variant/20">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-playfair text-xl sm:text-2xl font-bold text-secondary dark:text-zinc-100">
                            {months[displayedMonth]} {displayedYear}
                          </h4>
                          {booking.monthOffset === 0 && (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-tertiary/15 text-tertiary border border-tertiary/30 uppercase tracking-wider">
                              Current Month
                            </span>
                          )}
                          {isLoadingBookedDates && (
                            <span className="flex items-center gap-1 text-[10px] font-medium text-zinc-400">
                              <Loader2 className="w-3 h-3 animate-spin text-tertiary" />
                              <span>Syncing slots...</span>
                            </span>
                          )}
                        </div>
                        <p className="font-inter text-xs text-on-surface-variant dark:text-zinc-400 font-light mt-0.5">
                          Pick any date that has not passed. Dates that are
                          already booked cannot be chosen.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                          type="button"
                          disabled={booking.monthOffset <= 0}
                          onClick={() => changeMonth(-1)}
                          className={cn(
                            "p-2.5 border rounded-xl transition-all flex items-center justify-center",
                            booking.monthOffset <= 0
                              ? "opacity-30 cursor-not-allowed border-outline-variant/30 text-zinc-400 dark:text-zinc-600"
                              : "border-outline-variant hover:bg-tertiary hover:text-white hover:border-tertiary cursor-pointer dark:border-zinc-700 dark:text-zinc-300",
                          )}
                          aria-label="Previous Month"
                          title={
                            booking.monthOffset <= 0
                              ? "Past months are not accessible"
                              : "Previous Month"
                          }
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => changeMonth(1)}
                          className="p-2.5 border border-outline-variant hover:bg-tertiary hover:text-white hover:border-tertiary transition-all cursor-pointer dark:border-zinc-700 dark:text-zinc-300 rounded-xl flex items-center justify-center"
                          aria-label="Next Month"
                          title="Next Month"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Status Legend Bar */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-5 text-xs font-inter py-2 sm:py-2.5 px-3 sm:px-4 rounded-2xl bg-surface-container/60 dark:bg-zinc-800/50 border border-outline-variant/20">
                      <span className="font-bold text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Legend:
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
                        <span className="text-zinc-700 dark:text-zinc-300 text-[10px] sm:text-[11px] font-medium">
                          Available
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-tertiary ring-2 ring-tertiary/30" />
                        <span className="text-zinc-700 dark:text-zinc-300 text-[10px] sm:text-[11px] font-semibold">
                          Selected
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-500/20" />
                        <span className="text-zinc-700 dark:text-zinc-300 text-[10px] sm:text-[11px] font-medium">
                          Booked
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                        <span className="text-zinc-400 dark:text-zinc-500 text-[10px] sm:text-[11px]">
                          Past
                        </span>
                      </div>
                    </div>

                    {/* Days labels */}
                    <div>
                      <div className="grid grid-cols-7 text-center font-inter text-[10px] sm:text-[11px] font-extrabold tracking-widest text-on-surface/50 mb-2 sm:mb-3 uppercase dark:text-zinc-500">
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                        <div>Sun</div>
                      </div>

                      {/* Days grid */}
                      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center font-inter text-xs sm:text-sm font-bold">
                        {calendarDays.map((cell) => {
                          if (cell.day === null) {
                            return (
                              <div
                                key={cell.key}
                                className="py-3 sm:py-4 opacity-10"
                              />
                            );
                          }

                          const cellDate = new Date(
                            displayedYear,
                            displayedMonth,
                            cell.day,
                          );
                          cellDate.setHours(0, 0, 0, 0);

                          const dateKey = `${displayedYear}-${String(displayedMonth + 1).padStart(2, "0")}-${String(cell.day).padStart(2, "0")}`;

                          const isPast = cellDate.getTime() < today.getTime();
                          const isToday =
                            cellDate.getTime() === today.getTime();
                          const isBooked = bookedDates.includes(dateKey);
                          const isSelected =
                            booking.selectedDate &&
                            booking.selectedDate.day === cell.day &&
                            booking.selectedDate.month === displayedMonth &&
                            booking.selectedDate.year === displayedYear;

                          const isDisabled = isPast || isBooked;

                          return (
                            <button
                              key={cell.key}
                              type="button"
                              disabled={isDisabled}
                              onClick={() => {
                                handleSelectDate(
                                  cell.day!,
                                  displayedMonth,
                                  displayedYear,
                                );
                                setAppointmentLinked(true);
                              }}
                              className={cn(
                                "relative py-2.5 sm:py-3.5 px-0.5 sm:px-1 rounded-xl sm:rounded-2xl transition-all border flex flex-col items-center justify-center gap-0.5",
                                isSelected &&
                                  "bg-tertiary text-white font-bold border-tertiary shadow-lg ring-2 ring-tertiary/40 scale-[1.02] cursor-pointer",
                                isBooked &&
                                  !isSelected &&
                                  "bg-rose-500/10 dark:bg-rose-950/20 text-rose-700/80 dark:text-rose-400 border-rose-500/30 cursor-not-allowed",
                                isPast &&
                                  "bg-zinc-100/40 dark:bg-zinc-900/40 text-zinc-300 dark:text-zinc-600 border-transparent cursor-not-allowed line-through",
                                !isDisabled &&
                                  !isSelected &&
                                  "bg-white dark:bg-zinc-800/90 text-on-surface dark:text-zinc-200 border-outline-variant/30 hover:border-tertiary hover:bg-tertiary/10 hover:text-tertiary cursor-pointer shadow-xs active:scale-95",
                              )}
                              title={
                                isBooked
                                  ? "This date is already booked and cannot be selected"
                                  : isPast
                                    ? "Past dates cannot be selected"
                                    : isSelected
                                      ? "Your selected appointment date"
                                      : `Available for booking (${dateKey})`
                              }
                            >
                              <span className="text-xs sm:text-sm font-bold leading-none">
                                {cell.day}
                              </span>

                              {isBooked ? (
                                <span className="flex items-center gap-0.5 text-[8px] sm:text-[9px] font-extrabold uppercase tracking-tighter text-rose-600 dark:text-rose-400 mt-0.5">
                                  <Lock className="w-1.5 h-1.5 sm:w-2 sm:h-2" />
                                  <span>Booked</span>
                                </span>
                              ) : isSelected ? (
                                <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-tighter text-white/90 mt-0.5">
                                  Selected
                                </span>
                              ) : isToday ? (
                                <span className="text-[8px] sm:text-[9px] font-bold text-tertiary tracking-tighter mt-0.5">
                                  Today
                                </span>
                              ) : !isPast ? (
                                <span className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5 sm:mt-1" />
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Selected Date Indicator Banner */}
                    {booking.selectedDate && (
                      <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-tertiary/10 border border-tertiary/30">
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                          <div className="p-2 sm:p-2.5 rounded-xl bg-tertiary text-white shadow-xs shrink-0">
                            <CalendarIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest block truncate">
                              Reserved Date
                            </span>
                            <p className="font-playfair text-xs sm:text-base font-bold text-on-surface dark:text-zinc-100 truncate">
                              {new Date(
                                booking.selectedDate.year,
                                booking.selectedDate.month,
                                booking.selectedDate.day,
                              ).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-semibold text-tertiary bg-white dark:bg-zinc-800 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-tertiary/30 shadow-xs shrink-0">
                          Locked
                        </span>
                      </div>
                    )}

                    {/* Time Slots */}
                    <div className="pt-4 border-t border-outline-variant/20 space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="font-inter text-xs font-bold text-secondary dark:text-zinc-300 uppercase tracking-widest">
                          Available Time Slots (Pakistan Time)
                        </h5>
                        {booking.selectedTime && (
                          <span className="text-xs font-semibold text-tertiary">
                            Selected: {booking.selectedTime}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                        {timeSlots.map((slot) => {
                          const isSelected = booking.selectedTime === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => {
                                selectTimeSlot(slot);
                                setAppointmentLinked(true);
                              }}
                              className={cn(
                                "py-3 sm:py-3.5 text-xs font-bold border rounded-xl transition-all duration-300 cursor-pointer min-h-[44px] flex items-center justify-center",
                                isSelected
                                  ? "bg-tertiary text-white border-tertiary shadow-sm"
                                  : "bg-white dark:bg-zinc-800 border-outline-variant hover:border-tertiary hover:text-tertiary dark:border-zinc-700 dark:text-zinc-300",
                              )}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* MANDATORY FILE ATTACHMENT BOX */}
                  <div
                    id="mandatory-upload-box"
                    className="space-y-3 pt-4 border-t border-outline-variant/20"
                  >
                    <div className="flex items-center justify-between">
                      <label className="font-inter text-xs font-bold text-on-surface dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                        <span>Upload Your Plan or Photos *</span>
                        <span className="text-tertiary text-[11px] font-normal lowercase">
                          (required before you can book)
                        </span>
                      </label>
                      <span className="text-[10px] text-zinc-400 font-inter">
                        Max 25MB (PDF, JPG, PNG, ZIP)
                      </span>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.zip,.dwg"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload-input"
                    />

                    {isUploadingFile ? (
                      <div className="border-2 border-dashed border-tertiary/60 bg-tertiary/5 rounded-2xl p-8 text-center">
                        <Loader2 className="w-10 h-10 text-tertiary animate-spin mx-auto mb-3" />
                        <p className="font-inter text-xs font-bold text-on-surface dark:text-zinc-200">
                          Uploading Your File...
                        </p>
                        <p className="font-inter text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 font-light">
                          This will only take a moment.
                        </p>
                      </div>
                    ) : !booking.attachedFile ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                          fileError
                            ? "border-red-500/70 bg-red-500/5"
                            : "border-outline-variant hover:border-tertiary bg-surface dark:bg-zinc-950 hover:bg-tertiary/5"
                        }`}
                      >
                        <UploadCloud className="w-10 h-10 text-tertiary mx-auto mb-3" />
                        <p className="font-inter text-xs font-bold text-on-surface dark:text-zinc-200">
                          Click to Choose a File, or Drag It Here
                        </p>
                        <p className="font-inter text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 font-light">
                          Your floor plan, a sketch, or photos of the site all
                          work. Your architect will look at it before you talk.
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-surface dark:bg-zinc-950 border border-tertiary/50 flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FileText className="w-8 h-8 text-tertiary shrink-0" />
                          <div className="overflow-hidden">
                            <div className="flex items-center gap-2">
                              <p className="font-inter text-xs font-bold text-on-surface dark:text-zinc-200 truncate">
                                {booking.attachedFile.name}
                              </p>
                              <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded-sm border border-emerald-500/20 shrink-0">
                                Uploaded
                              </span>
                            </div>
                            <p className="font-inter text-[10px] text-zinc-500 mt-0.5">
                              {(
                                booking.attachedFile.size /
                                (1024 * 1024)
                              ).toFixed(2)}{" "}
                              MB &bull; Ready to send
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="p-2 hover:bg-red-500/10 text-zinc-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {fileError && (
                      <span className="text-[11px] text-red-500 font-bold block mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {fileError}
                      </span>
                    )}
                  </div>

                  {/* Summary of Chosen Slot */}
                  {booking.selectedDate && booking.selectedTime && (
                    <div className="p-4 rounded-2xl bg-tertiary/10 border border-tertiary/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CalendarIcon className="w-5 h-5 text-tertiary shrink-0" />
                        <div className="text-xs">
                          <span className="font-bold text-on-surface dark:text-white block">
                            {booking.callTier} Reserved:{" "}
                            {months[booking.selectedDate.month]}{" "}
                            {booking.selectedDate.day},{" "}
                            {booking.selectedDate.year} at{" "}
                            {booking.selectedTime}
                          </span>
                          <span className="text-zinc-500 dark:text-zinc-400 font-light">
                            Fee:{" "}
                            {SafepayService.formatPKR(selectedTierData.price)}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={unlinkAppointment}
                        className="text-zinc-400 hover:text-red-500 cursor-pointer p-1"
                        aria-label="Change slot"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Payment & Submission */}
                  <div className="pt-6 border-t border-outline-variant/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Safepay Pakistan • 100% Encrypted Payment</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto bg-primary hover:bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed text-on-primary px-6 sm:px-10 py-4 sm:py-4.5 rounded-xl font-inter font-bold text-xs tracking-wider sm:tracking-widest uppercase transition-all duration-300 shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-2 min-h-[48px]"
                    >
                      {isSubmitting ? (
                        <>
                          <Clock className="w-4 h-4 animate-spin text-tertiary" />
                          <span>CONNECTING SAFEPAY...</span>
                        </>
                      ) : (
                        <>
                          <span>
                            CONFIRM &amp; PAY{" "}
                            {SafepayService.formatPKR(selectedTierData.price)}
                          </span>
                          <Sparkles className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </section>
            </form>
          </div>

          {/* Right Column (4 cols): Services Dropdown & Catalog.
              Follows normal source order (after the Step 1/2/3 form) on
              every breakpoint, so the primary booking flow stays the first
              thing a mobile visitor sees, with the "skip the call"
              alternative offered right after it. */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            {/* Services Dropdown Card */}
            <div className="bg-surface-container-low dark:bg-zinc-900/80 p-6 rounded-3xl border border-outline-variant/30 dark:border-zinc-800 shadow-sm space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-tertiary/10 text-tertiary">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <span className="font-inter text-[11px] font-bold text-tertiary uppercase tracking-widest">
                    Already Know What You Need?
                  </span>
                </div>
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-on-surface dark:text-zinc-100">
                  Skip the Call. Book a Service Directly.
                </h3>
                <p className="font-inter text-xs text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                  We offer {serviceCatalog.length} design services, like plan
                  reviews, 3D renders, and full house design. Each one shows you
                  exactly what you get and what it costs. Pick one below.
                </p>
              </div>

              {/* Custom Services Dropdown */}
              <div ref={servicesDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsServicesDropdownOpen((prev) => !prev)}
                  className="w-full bg-white dark:bg-zinc-950 border border-outline-variant/60 hover:border-tertiary rounded-2xl px-4 py-3.5 flex items-center justify-between gap-3 text-left transition-all shadow-xs cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-tertiary block">
                        Select Service
                      </span>
                      <span className="font-playfair text-sm font-bold text-on-surface dark:text-zinc-100 block leading-snug">
                        {activeSidebarService?.title || "Choose a Service"}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0",
                      isServicesDropdownOpen && "rotate-180 text-tertiary",
                    )}
                  />
                </button>

                {/* Floating Dropdown Menu */}
                {isServicesDropdownOpen && (
                  <div
                    data-lenis-prevent
                    onWheel={(e) => e.stopPropagation()}
                    className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-zinc-900 border border-outline-variant/40 dark:border-zinc-800 rounded-2xl shadow-2xl p-2 space-y-1 max-h-[min(70vh,34rem)] overflow-y-auto overscroll-contain touch-pan-y backdrop-blur-xl"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 border-b border-outline-variant/20 mb-1">
                      Available Services ({serviceCatalog.length})
                    </div>
                    {serviceCatalog.map((service) => {
                      const isSelected =
                        activeSidebarService?.id === service.id;
                      return (
                        <div
                          key={service.id}
                          onClick={() =>
                            handleSelectServiceFromDropdown(service)
                          }
                          className={cn(
                            "flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer group",
                            isSelected
                              ? "bg-tertiary/10 border border-tertiary/30 text-tertiary"
                              : "hover:bg-surface-container dark:hover:bg-zinc-800/80 text-on-surface dark:text-zinc-200",
                          )}
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-zinc-950 shrink-0 border border-outline-variant/20">
                            <Image
                              src={service.image}
                              alt={service.title}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-tertiary truncate">
                                {service.category}
                              </span>
                              <span className="text-[10px] font-bold text-secondary dark:text-zinc-300 shrink-0">
                                {getStartingPriceText(service)}
                              </span>
                            </div>
                            <p className="font-playfair text-xs font-bold truncate group-hover:text-tertiary transition-colors">
                              {service.title}
                            </p>
                            <span className="text-[10px] text-zinc-400 flex items-center gap-0.5 mt-0.5 group-hover:text-tertiary transition-colors">
                              <span>Open Service</span>
                              <ArrowUpRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Active Service Card Preview — only appears once the visitor
                  has actually picked something from the dropdown above. */}
              {!activeSidebarService && (
                <p className="pt-2 border-t border-outline-variant/20 font-inter text-xs text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                  Pick a service above to see what it includes and what it
                  costs.
                </p>
              )}
              {activeSidebarService && (
                <div className="pt-2 border-t border-outline-variant/20 space-y-3">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-950 border border-outline-variant/20 shadow-xs">
                    <Image
                      src={activeSidebarService.image}
                      alt={activeSidebarService.title}
                      fill
                      className="object-cover"
                      sizes="320px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-tertiary text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-tertiary/30">
                      {activeSidebarService.category}
                    </span>
                    <span className="absolute bottom-3 right-3 text-white font-montserrat text-xs font-bold">
                      {getStartingPriceText(activeSidebarService)}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-playfair text-base font-bold text-on-surface dark:text-zinc-100">
                      {activeSidebarService.title}
                    </h4>
                    <p className="font-inter text-xs text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed line-clamp-2">
                      {activeSidebarService.shortDesc}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedServiceModal(activeSidebarService);
                        setIsServiceModalOpen(true);
                      }}
                      className="w-full bg-primary hover:bg-tertiary text-on-primary py-2.5 px-3 rounded-xl font-inter text-xs font-bold uppercase tracking-wider transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                    >
                      <span>Open Service</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleApplyServiceToBrief(activeSidebarService)
                      }
                      className="w-full border border-outline-variant hover:border-tertiary hover:text-tertiary py-2.5 px-3 rounded-xl font-inter text-xs font-bold uppercase tracking-wider transition-all text-center cursor-pointer active:scale-95"
                    >
                      <span>Add to Brief</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Studio Hotline Banner */}
            <div className="p-5 rounded-2xl bg-tertiary/10 border border-tertiary/25 space-y-3">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-tertiary shrink-0" />
                <span className="font-inter text-xs font-bold uppercase tracking-wider text-secondary dark:text-zinc-200">
                  Direct Studio Hotline
                </span>
              </div>
              <p className="font-inter text-[11px] text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                Need immediate guidance regarding plot size regulations or
                bespoke commercial scopes? Speak with our principal architect
                directly.
              </p>
              <a
                href="tel:+923000000000"
                className="inline-flex items-center gap-2 text-xs font-bold text-tertiary hover:underline"
              >
                <span>Call +92 300 0000000</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Verified Standards Card */}
            <div className="p-5 rounded-2xl bg-surface-container-low dark:bg-zinc-900 border border-outline-variant/30 space-y-2.5 text-xs text-on-surface-variant dark:text-zinc-400 font-inter">
              <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary block">
                Verified Standards
              </span>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-tertiary shrink-0" />
                <span>PCATP Registered Architecture Practice</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-tertiary shrink-0" />
                <span>PDA, CDA &amp; KDA Municipal Bylaws Compliance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-tertiary shrink-0" />
                <span>100% Encrypted Safepay Milestone Checkout</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Interactive Service Detail Modal */}
      <ServiceDetailModal
        key={selectedServiceModal?.id || "empty"}
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        service={selectedServiceModal}
        onApplyToBrief={handleApplyServiceToBrief}
      />
    </div>
  );
};
