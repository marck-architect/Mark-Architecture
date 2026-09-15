"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
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
  Lock,
} from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";
import { SafepayService } from "@/lib/safepay";
import { FullHouseCalculator } from "@/components/calculator/FullHouseCalculator";
import { ServiceDetailModal } from "@/components/consultation/ServiceDetailModal";
import { ConsultationServicesSidebar } from "@/components/consultation/ConsultationServicesSidebar";
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
  const [fileError, setFileError] = useState<string | null>(null);

  // Modal State for Services
  const [selectedServiceModal, setSelectedServiceModal] =
    useState<ServiceData | null>(null);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState<boolean>(false);
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

  const handleLinkAppointment = () => {
    if (!booking.selectedDate || !booking.selectedTime) {
      showToast("Please select a date and time slot first.", "warning");
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

    setAppointmentLinked(true);
    showToast(
      "Consultation schedule locked. Proceed to complete your brief & attach drawings.",
    );

    const formSection = document.getElementById("consultation-form-section");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
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

  // Open Service Modal
  const handleOpenServiceModal = (service: ServiceData) => {
    setSelectedServiceModal(service);
    setIsServiceModalOpen(true);
  };

  // Apply service selected in modal to the consultation brief
  const handleApplyServiceToBrief = (
    service: ServiceData,
    tier?: Tier,
    plot?: PlotSize,
  ) => {
    // Auto-select property scale if available
    if (plot === "5 Marla") {
      setValue("projectType", "5_marla");
    } else if (plot === "10 Marla") {
      setValue("projectType", "10_marla");
    } else if (plot === "1 Kanal") {
      setValue("projectType", "1_kanal");
    } else if (service.id === "full-package") {
      setValue("projectType", "10_marla");
    }

    const currentMsg = getValues("message") || "";
    const serviceInfo = `[Requested Service: ${service.title}${tier ? ` - ${tier.name} Tier` : ""}${plot ? ` (${plot})` : ""}]`;

    if (!currentMsg.includes(service.title)) {
      setValue(
        "message",
        currentMsg
          ? `${serviceInfo}\n${currentMsg}`
          : `${serviceInfo}\nWe would like to consult on the architectural specifications, timeline, and drawings required for this project.`,
      );
    }

    showToast(`Linked ${service.title} to your consultation brief!`);
    setIsServiceModalOpen(false);

    const formSection = document.getElementById("consultation-form-section");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const selectedTierData =
    callTiers.find((t) => t.name === booking.callTier) || callTiers[0];

  return (
    <div className="relative overflow-x-hidden min-h-screen bg-surface dark:bg-zinc-950">
      {/* Whole-screen Hero Section (Full Initial Page down to Consultation Booking) */}
      <header className="relative w-full h-screen min-h-[100dvh] flex items-center overflow-hidden border-b border-outline-variant/30">
        {/* Background Architectural Drafting Grid Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

        {/* Large Subtle Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.03] dark:opacity-[0.05]">
          <span className="font-montserrat text-[20vw] font-black tracking-tighter">
            CONSULT
          </span>
        </div>

        {/* Center Main Hero Content */}
        <div className="relative z-10 w-full max-w-container-max mx-auto px-4 md:px-margin-desktop pt-16">
          <ScrollReveal>
            <div className="max-w-4xl space-y-6">
              <h1 className="font-playfair text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-on-surface dark:text-zinc-100 font-normal leading-[1.08] tracking-tight">
                Design audits &amp; <br />
                <span className="italic font-light text-tertiary">
                  expert consultations.
                </span>
              </h1>

              <p className="font-inter text-base sm:text-lg md:text-xl text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed max-w-3xl">
                Connect directly with our licensed principal architects via Zoom
                or WhatsApp. Explore our specialized design packages, calculate
                turnkey house plans, or reserve your live advisory slot.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <a
                  href="#consultation-flow"
                  className="bg-primary hover:bg-tertiary text-on-primary px-8 py-4 rounded-xl font-bold tracking-wider transition-all duration-300 shadow-md active:scale-95 text-center inline-flex items-center gap-2 font-inter text-xs uppercase cursor-pointer"
                >
                  <span>Book Consultation</span>
                  <ArrowDown className="w-4 h-4" />
                </a>
                <a
                  href="#turnkey-calculator"
                  className="border border-outline-variant hover:border-tertiary hover:text-tertiary px-8 py-4 rounded-xl font-bold tracking-wider transition-all active:scale-95 text-center font-inter text-xs uppercase cursor-pointer"
                >
                  Turnkey Calculator
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </header>

      {/* Main Content: Consultation Flow (Left 8 cols) + Services Sidebar (Right 4 cols) */}
      <main
        id="consultation-flow"
        className="px-4 md:px-margin-desktop max-w-container-max mx-auto py-12 md:py-16 scroll-mt-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column (8 cols): Step 1, Step 2, Step 3 */}
          <div className="lg:col-span-8 space-y-16">
            {/* Step 1: Call Tier Selection */}
            <section className="space-y-8 pb-12 border-b border-outline-variant/20">
              <ScrollReveal>
                <div className="space-y-3">
                  <span className="font-inter text-xs font-bold text-tertiary uppercase tracking-widest block">
                    Step 1: Choose Call Tier
                  </span>
                  <h2 className="font-playfair text-3xl md:text-4xl text-on-surface dark:text-zinc-100 font-normal">
                    Select Your Consultation Scope.
                  </h2>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {callTiers.map((tier) => {
                  const isSelected = booking.callTier === tier.name;
                  return (
                    <div
                      key={tier.name}
                      onClick={() => setCallTier(tier.name)}
                      className={`p-6 md:p-8 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-6 ${
                        isSelected
                          ? "border-tertiary bg-tertiary/5 dark:bg-tertiary/10 shadow-lg scale-[1.01]"
                          : "border-outline-variant/30 bg-surface-container-low dark:bg-zinc-900/50 hover:border-tertiary/60"
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[11px] font-inter font-bold text-tertiary uppercase tracking-widest block">
                              {tier.duration}
                            </span>
                            <h3 className="font-playfair text-2xl font-bold text-on-surface dark:text-white mt-1">
                              {tier.name}
                            </h3>
                          </div>
                          <span className="font-montserrat text-2xl font-extrabold text-secondary dark:text-zinc-100">
                            {SafepayService.formatPKR(tier.price)}
                          </span>
                        </div>

                        <p className="font-inter text-xs text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                          {tier.description}
                        </p>

                        <div className="space-y-2 pt-2">
                          {tier.features.map((feat, fIdx) => (
                            <div
                              key={fIdx}
                              className="flex items-center gap-2 text-xs text-on-surface dark:text-zinc-300"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-tertiary shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between">
                        <span className="text-[11px] font-inter text-zinc-500">
                          Paid
                        </span>
                        <span
                          className={`font-inter text-xs font-bold uppercase tracking-wider ${
                            isSelected ? "text-tertiary" : "text-zinc-400"
                          }`}
                        >
                          {isSelected ? "✓ Selected Tier" : "Select Tier"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Step 2: Calendar Slot Selection */}
            <section className="space-y-8 pb-12 border-b border-outline-variant/20">
              <ScrollReveal>
                <div className="space-y-3">
                  <span className="font-inter text-xs font-bold text-tertiary uppercase tracking-widest block">
                    Step 2: Reserve Calendar Slot
                  </span>
                  <h2 className="font-playfair text-3xl md:text-4xl text-on-surface dark:text-zinc-100 font-normal">
                    Select Date &amp; Time.
                  </h2>
                  <p className="font-inter text-xs md:text-sm text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                    Slots are synchronized in Pakistan Standard Time (PKT). A
                    direct Zoom &amp; WhatsApp conference link will be
                    dispatched upon confirmation.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant dark:text-zinc-400 bg-surface-container-low dark:bg-zinc-900 px-3.5 py-2 rounded-xl border border-outline-variant/30">
                    <Clock className="w-3.5 h-3.5 text-tertiary" />
                    <span>{selectedTierData.duration} Live Video Audit</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant dark:text-zinc-400 bg-surface-container-low dark:bg-zinc-900 px-3.5 py-2 rounded-xl border border-outline-variant/30">
                    <Video className="w-3.5 h-3.5 text-tertiary" />
                    <span>Zoom / WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant dark:text-zinc-400 bg-surface-container-low dark:bg-zinc-900 px-3.5 py-2 rounded-xl border border-outline-variant/30">
                    <CreditCard className="w-3.5 h-3.5 text-tertiary" />
                    <span>
                      Fee: {SafepayService.formatPKR(selectedTierData.price)}
                    </span>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="bg-surface-container-low dark:bg-zinc-900 p-6 md:p-8 border border-outline-variant/30 rounded-3xl shadow-sm space-y-6">
                  {/* Month selector header */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-outline-variant/20">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-playfair text-2xl font-bold text-secondary dark:text-zinc-100">
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
                        Dates in the future are open for booking. Booked dates
                        cannot be selected again.
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
                  <div className="flex flex-wrap items-center gap-3 md:gap-5 text-xs font-inter py-2.5 px-4 rounded-2xl bg-surface-container/60 dark:bg-zinc-800/50 border border-outline-variant/20">
                    <span className="font-bold text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Legend:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
                      <span className="text-zinc-700 dark:text-zinc-300 text-[11px] font-medium">
                        Available
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-tertiary ring-2 ring-tertiary/30" />
                      <span className="text-zinc-700 dark:text-zinc-300 text-[11px] font-semibold">
                        Selected
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-500/20" />
                      <span className="text-zinc-700 dark:text-zinc-300 text-[11px] font-medium">
                        Booked (Unavailable)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                      <span className="text-zinc-400 dark:text-zinc-500 text-[11px]">
                        Past Date
                      </span>
                    </div>
                  </div>

                  {/* Days labels */}
                  <div>
                    <div className="grid grid-cols-7 text-center font-inter text-[11px] font-extrabold tracking-widest text-on-surface/50 mb-3 uppercase dark:text-zinc-500">
                      <div>Mon</div>
                      <div>Tue</div>
                      <div>Wed</div>
                      <div>Thu</div>
                      <div>Fri</div>
                      <div>Sat</div>
                      <div>Sun</div>
                    </div>

                    {/* Days grid */}
                    <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center font-inter text-sm font-bold">
                      {calendarDays.map((cell) => {
                        if (cell.day === null) {
                          return (
                            <div key={cell.key} className="py-4 opacity-10" />
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
                        const isToday = cellDate.getTime() === today.getTime();
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
                            onClick={() =>
                              handleSelectDate(
                                cell.day!,
                                displayedMonth,
                                displayedYear,
                              )
                            }
                            className={cn(
                              "relative py-3.5 sm:py-4 px-1 rounded-2xl transition-all border flex flex-col items-center justify-center gap-0.5",
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
                            <span className="text-sm font-bold leading-none">
                              {cell.day}
                            </span>

                            {isBooked ? (
                              <span className="flex items-center gap-0.5 text-[8px] font-extrabold uppercase tracking-tighter text-rose-600 dark:text-rose-400 mt-0.5">
                                <Lock className="w-2 h-2" />
                                <span>Booked</span>
                              </span>
                            ) : isSelected ? (
                              <span className="text-[8px] font-extrabold uppercase tracking-tighter text-white/90 mt-0.5">
                                Selected
                              </span>
                            ) : isToday ? (
                              <span className="text-[8px] font-bold text-tertiary tracking-tighter mt-0.5">
                                Today
                              </span>
                            ) : !isPast ? (
                              <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1" />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected Date Indicator Banner */}
                  {booking.selectedDate && (
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-tertiary/10 border border-tertiary/30">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-tertiary text-white shadow-xs">
                          <CalendarIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest block">
                            Reserved Appointment Date
                          </span>
                          <p className="font-playfair text-sm md:text-base font-bold text-on-surface dark:text-zinc-100">
                            {new Date(
                              booking.selectedDate.year,
                              booking.selectedDate.month,
                              booking.selectedDate.day,
                            ).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-tertiary bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-full border border-tertiary/30 shadow-xs">
                        Date Locked
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
                          Selected: {booking.selectedTime} PKT
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {timeSlots.map((slot) => {
                        const isSelected = booking.selectedTime === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => selectTimeSlot(slot)}
                            className={cn(
                              "py-3.5 text-xs font-bold border rounded-xl transition-all duration-300 cursor-pointer",
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

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={handleLinkAppointment}
                      className="bg-primary hover:bg-tertiary text-on-primary px-8 py-3.5 rounded-xl font-inter font-bold text-xs tracking-wider uppercase transition-all duration-300 active:scale-95 cursor-pointer text-center shadow-md"
                    >
                      Confirm Slot &amp; Proceed to Upload
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            </section>

            {/* Step 3: Brief Form & MANDATORY File Upload */}
            <section
              id="consultation-form-section"
              className="space-y-8 scroll-mt-24"
            >
              <ScrollReveal>
                <div className="space-y-3">
                  <span className="font-inter text-xs font-bold text-tertiary uppercase tracking-widest block">
                    Step 3: Details &amp; Mandatory Drawing Upload
                  </span>
                  <h2 className="font-playfair text-3xl md:text-4xl text-on-surface dark:text-zinc-100 font-normal">
                    Finalize Consultation Brief.
                  </h2>
                  <p className="font-inter text-sm text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                    Our architects review your drawings in advance of the call
                    to prepare actionable, high-precision recommendations.
                  </p>
                </div>
              </ScrollReveal>

              <div className="bg-surface-container-low dark:bg-zinc-900 border border-outline-variant/30 rounded-3xl p-6 md:p-10 shadow-xl">
                {/* Selected Booking Badge */}
                {isAppointmentLinked &&
                booking.selectedDate &&
                booking.selectedTime ? (
                  <div className="mb-8 p-4 rounded-2xl bg-tertiary/10 border border-tertiary/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="w-5 h-5 text-tertiary shrink-0" />
                      <div className="text-xs">
                        <span className="font-bold text-on-surface dark:text-white block">
                          {booking.callTier} Reserved:{" "}
                          {months[booking.selectedDate.month]}{" "}
                          {booking.selectedDate.day},{" "}
                          {booking.selectedDate.year} at {booking.selectedTime}
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
                ) : (
                  <div className="mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>
                      Please pick and confirm a calendar slot in Step 2 above to
                      complete your appointment reservation.
                    </span>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className="space-y-6"
                >
                  {/* Contact Details Grid */}
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
                        WhatsApp / Phone Number *
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

                  {/* MANDATORY FILE ATTACHMENT BOX */}
                  <div id="mandatory-upload-box" className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="font-inter text-xs font-bold text-on-surface dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                        <span>
                          Mandatory Drawing / Site Photos Attachment *
                        </span>
                        <span className="text-tertiary text-[11px] font-normal lowercase">
                          (required before call confirmation)
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
                          Resizing with Sharp &amp; Uploading to Supabase
                          Storage...
                        </p>
                        <p className="font-inter text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 font-light">
                          Optimizing architectural blueprints and high-res site
                          photos for instant audit.
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
                          Click to browse or drop your architectural plan / site
                          photos here
                        </p>
                        <p className="font-inter text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 font-light">
                          Upload floor plan blueprints, sketches, or plot site
                          pictures for our lead architect to inspect.
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
                                Supabase Storage
                              </span>
                            </div>
                            <p className="font-inter text-[10px] text-zinc-500 mt-0.5">
                              {(
                                booking.attachedFile.size /
                                (1024 * 1024)
                              ).toFixed(2)}{" "}
                              MB • Sharp-optimized &bull; Ready for audit
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

                  {/* Questions / Scope */}
                  <div>
                    <label className="font-inter text-xs font-bold text-on-surface dark:text-zinc-300 uppercase tracking-wider block mb-1.5">
                      Key Questions &amp; Issues You Wish to Resolve *
                    </label>
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

                  {/* Payment & Submission */}
                  <div className="pt-6 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Safepay Pakistan • 100% Encrypted Payment</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto bg-primary hover:bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed text-on-primary px-10 py-4.5 rounded-xl font-inter font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-2"
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
                </form>
              </div>
            </section>
          </div>

          {/* Right Column (4 cols): All 7 Services Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <ConsultationServicesSidebar
              onSelectService={handleOpenServiceModal}
            />
          </div>
        </div>
      </main>

      {/* Flagship Turnkey Solution Calculator Section */}
      <section
        id="turnkey-calculator"
        className="border-t border-outline-variant/30 py-16 md:py-24 bg-surface-container-lowest dark:bg-zinc-900/40 scroll-mt-24"
      >
        <div className="px-4 md:px-margin-desktop max-w-container-max mx-auto space-y-8">
          <ScrollReveal>
            <div className="max-w-3xl space-y-3">
              <span className="font-inter text-xs font-bold text-tertiary uppercase tracking-widest block">
                Flagship Turnkey Solution
              </span>
              <h2 className="font-playfair text-3xl md:text-5xl text-on-surface dark:text-zinc-100 font-normal">
                Full Turnkey Architectural Suite Calculator.
              </h2>
              <p className="font-inter text-sm md:text-base text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                Estimate complete architectural, structural, plumbing,
                electrical, and 3D elevation drawings based on covered area (PKR
                280–380 / sq ft). Includes 50% milestone advance terms via
                Safepay.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <FullHouseCalculator />
          </ScrollReveal>
        </div>
      </section>

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
