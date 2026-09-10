"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
} from "lucide-react";
import { useStore, AttachedFile } from "@/hooks/useStore";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";
import { SafepayService } from "@/lib/safepay";

// Schema for Consultation Form requiring client details and brief
const briefFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Your name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z
    .string()
    .min(10, { message: "Please enter a valid contact/WhatsApp number." }),
  projectType: z
    .string()
    .min(1, { message: "Please select your property category." }),
  message: z
    .string()
    .min(10, {
      message:
        "Please outline your questions or design requirements (min 10 chars).",
    }),
});

type BriefFormValues = z.infer<typeof briefFormSchema>;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const timeSlots = ["11:00 AM", "02:30 PM", "05:00 PM", "08:00 PM"];

interface CallTierOption {
  name: "Basic Call" | "Premium Call";
  duration: string;
  price: number;
  description: string;
  features: string[];
}

const callTiers: CallTierOption[] = [
  {
    name: "Basic Call",
    duration: "30 Minutes",
    price: 3000,
    description:
      "Focused video session for immediate layout review, structural feedback, and quick solutions.",
    features: [
      "30 min Zoom / WhatsApp Video",
      "Immediate layout flaw diagnosis",
      "Material & design directional advice",
    ],
  },
  {
    name: "Premium Call",
    duration: "60 Minutes",
    price: 5000,
    description:
      "In-depth architectural consultation covering spatial planning, material schedules, and realistic budget roadmaps.",
    features: [
      "60 min Comprehensive Session",
      "Deep-dive space & circulation review",
      "Finishing materials & contractor guidance",
      "Realistic budget allocation roadmap",
    ],
  },
];

export default function ConsultationPage() {
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
    openSuccessModal,
    showToast,
  } = useStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
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

  // Calculate calendar elements
  const currentYear = 2026;
  const currentMonthIdx = 8 + booking.monthOffset; // September 2026 anchor
  const dateObj = new Date(currentYear, currentMonthIdx, 1);
  const displayedMonth = dateObj.getMonth();
  const displayedYear = dateObj.getFullYear();

  let startDay = dateObj.getDay();
  if (startDay === 0) startDay = 7;

  const daysInMonth = new Date(displayedYear, displayedMonth + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 1; i < startDay; i++) {
    calendarDays.push({ day: null, key: `empty-${i}` });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({ day, key: `day-${day}` });
  }

  // Handle file uploads (Mandatory for booking)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    const attached: AttachedFile = {
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
    };
    setAttachedFile(attached);
    showToast(`Attached: ${file.name}`);
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
    setAppointmentLinked(true);
    showToast(
      "Consultation schedule locked. Proceed to complete your brief & attach drawings.",
    );

    const formSection = document.getElementById("consultation-form-section");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFormSubmit = (values: BriefFormValues) => {
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

    const selectedCallTier =
      callTiers.find((t) => t.name === booking.callTier) || callTiers[0];
    const { day, month, year } = booking.selectedDate;
    const formattedDate = `${months[month]} ${day}, ${year}`;

    const confirmationDesc = `Thank you, ${values.name}. Your ${booking.callTier} (${SafepayService.formatPKR(
      selectedCallTier.price,
    )}) has been reserved for ${formattedDate} at ${booking.selectedTime} (PKT).
    
Plan Attached: ${booking.attachedFile.name} (${(booking.attachedFile.size / (1024 * 1024)).toFixed(2)} MB).
Payment is processed through Safepay. A secure video room link and meeting invitation have been generated.`;

    openSuccessModal("Consultation Reserved via Safepay", confirmationDesc);

    // Reset Form
    reset();
    unlinkAppointment();
    setAttachedFile(null);
  };

  const selectedTierData =
    callTiers.find((t) => t.name === booking.callTier) || callTiers[0];

  return (
    <div className="relative overflow-x-hidden min-h-screen pt-20 bg-surface dark:bg-zinc-950">
      {/* Header */}
      <header className="px-4 md:px-margin-desktop max-w-container-max mx-auto py-16 md:py-24 border-b border-outline-variant/30">
        <ScrollReveal>
          <div className="max-w-4xl space-y-4">
            <span className="font-inter text-xs md:text-sm font-bold text-tertiary uppercase tracking-widest block">
              1-on-1 Architect Discovery Session
            </span>
            <h1 className="font-playfair text-4xl md:text-6xl text-on-surface dark:text-zinc-100 font-normal leading-tight">
              Online Video Consultation &amp; <br />
              <span className="italic font-light">Drawing Audit.</span>
            </h1>
            <p className="font-inter text-base md:text-lg text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed max-w-3xl">
              Connect directly with our licensed principal architects via Zoom
              or WhatsApp. To ensure maximum value, clients are required to
              attach existing floor plans or site photos prior to call
              confirmation.
            </p>
          </div>
        </ScrollReveal>
      </header>

      {/* Step 1: Call Tier Selection */}
      <section className="px-4 md:px-margin-desktop max-w-container-max mx-auto py-16 border-b border-outline-variant/20">
        <ScrollReveal>
          <div className="space-y-3 mb-10">
            <span className="font-inter text-xs font-bold text-tertiary uppercase tracking-widest block">
              Step 1: Choose Call Tier
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl text-on-surface dark:text-zinc-100 font-normal">
              Select Your Consultation Scope.
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {callTiers.map((tier) => {
            const isSelected = booking.callTier === tier.name;
            return (
              <div
                key={tier.name}
                onClick={() => setCallTier(tier.name)}
                className={`p-8 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-6 ${
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
                    Paid via Safepay
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
      <section className="px-4 md:px-margin-desktop max-w-container-max mx-auto py-16 border-b border-outline-variant/20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <ScrollReveal>
              <span className="font-inter text-xs font-bold text-tertiary uppercase tracking-widest block">
                Step 2: Reserve Calendar Slot
              </span>
              <h2 className="font-playfair text-3xl md:text-4xl text-on-surface dark:text-zinc-100 font-normal">
                Select Date &amp; Time.
              </h2>
              <p className="font-inter text-sm text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                Slots are synchronized in Pakistan Standard Time (PKT). After
                booking, a direct Zoom &amp; WhatsApp conference link will be
                dispatched.
              </p>

              <div className="space-y-4 pt-4 border-t border-outline-variant/20 mt-6">
                <div className="flex items-center gap-3 text-xs text-on-surface-variant dark:text-zinc-400">
                  <Clock className="w-4 h-4 text-tertiary" />
                  <span>{selectedTierData.duration} Live Video Audit</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-on-surface-variant dark:text-zinc-400">
                  <Video className="w-4 h-4 text-tertiary" />
                  <span>Zoom / WhatsApp Screen Sharing</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-on-surface-variant dark:text-zinc-400">
                  <CreditCard className="w-4 h-4 text-tertiary" />
                  <span>
                    Fee: {SafepayService.formatPKR(selectedTierData.price)}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-8">
            <ScrollReveal delay={0.1}>
              <div className="bg-surface-container-low dark:bg-zinc-900 p-6 md:p-10 border border-outline-variant/30 rounded-3xl shadow-sm space-y-8">
                {/* Month selector */}
                <div className="flex justify-between items-center">
                  <h4 className="font-playfair text-lg font-bold text-secondary dark:text-zinc-200">
                    {months[displayedMonth]} {displayedYear}
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => changeMonth(-1)}
                      className="p-2 border border-outline-variant hover:bg-secondary hover:text-white transition-colors cursor-pointer dark:border-zinc-700 dark:text-zinc-300 rounded-lg"
                      aria-label="Previous Month"
                    >
                      &larr;
                    </button>
                    <button
                      onClick={() => changeMonth(1)}
                      className="p-2 border border-outline-variant hover:bg-secondary hover:text-white transition-colors cursor-pointer dark:border-zinc-700 dark:text-zinc-300 rounded-lg"
                      aria-label="Next Month"
                    >
                      &rarr;
                    </button>
                  </div>
                </div>

                {/* Days labels */}
                <div>
                  <div className="grid grid-cols-7 text-center font-inter text-[10px] font-extrabold tracking-widest text-on-surface/50 mb-3 uppercase dark:text-zinc-500">
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                    <div>Sun</div>
                  </div>

                  {/* Days grid */}
                  <div className="grid grid-cols-7 gap-1 text-center font-inter text-sm font-bold">
                    {calendarDays.map((cell) => {
                      if (cell.day === null) {
                        return (
                          <div key={cell.key} className="py-4 opacity-20" />
                        );
                      }

                      const isSelected =
                        booking.selectedDate &&
                        booking.selectedDate.day === cell.day &&
                        booking.selectedDate.month === displayedMonth &&
                        booking.selectedDate.year === displayedYear;

                      return (
                        <button
                          key={cell.key}
                          onClick={() =>
                            selectDate(cell.day!, displayedMonth, displayedYear)
                          }
                          className={cn(
                            "py-4 rounded-xl transition-colors border border-transparent flex items-center justify-center cursor-pointer",
                            isSelected
                              ? "bg-tertiary text-white font-bold border-tertiary shadow-md"
                              : "hover:bg-tertiary/10 dark:text-zinc-300 hover:text-tertiary",
                          )}
                        >
                          {cell.day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots */}
                <div className="pt-6 border-t border-outline-variant/20 space-y-4">
                  <h5 className="font-inter text-xs font-bold text-secondary dark:text-zinc-300 uppercase tracking-widest">
                    Available Time Slots (Pakistan Time)
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {timeSlots.map((slot) => {
                      const isSelected = booking.selectedTime === slot;
                      return (
                        <button
                          key={slot}
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
                    onClick={handleLinkAppointment}
                    className="bg-primary hover:bg-tertiary text-on-primary px-8 py-3.5 rounded-xl font-inter font-bold text-xs tracking-wider uppercase transition-all duration-300 active:scale-95 cursor-pointer text-center"
                  >
                    Confirm Slot &amp; Proceed to Upload
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Step 3: Brief Form & MANDATORY File Upload */}
      <section
        id="consultation-form-section"
        className="relative py-20 px-4 max-w-4xl mx-auto scroll-mt-24"
      >
        <ScrollReveal>
          <div className="text-center mb-12 space-y-3">
            <span className="font-inter text-xs font-bold text-tertiary uppercase tracking-widest block">
              Step 3: Details &amp; Mandatory Drawing Upload
            </span>
            <h2 className="font-playfair text-3xl md:text-5xl text-on-surface dark:text-zinc-100 font-normal">
              Finalize Consultation Brief.
            </h2>
            <p className="font-inter text-sm text-on-surface-variant dark:text-zinc-400 font-light max-w-xl mx-auto">
              Our architects review your drawings in advance of the call to
              prepare actionable solutions.
            </p>
          </div>
        </ScrollReveal>

        <div className="bg-surface-container-low dark:bg-zinc-900 border border-outline-variant/30 rounded-3xl p-8 md:p-12 shadow-xl">
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
                    {booking.selectedDate.day}, {booking.selectedDate.year} at{" "}
                    {booking.selectedTime}
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400 font-light">
                    Fee: {SafepayService.formatPKR(selectedTierData.price)}
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

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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
                  <option value="commercial">Commercial / Mixed-Use</option>
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
                  <span>Mandatory Drawing / Site Photos Attachment *</span>
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

              {!booking.attachedFile ? (
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
                      <p className="font-inter text-xs font-bold text-on-surface dark:text-zinc-200 truncate">
                        {booking.attachedFile.name}
                      </p>
                      <p className="font-inter text-[10px] text-zinc-500">
                        {(booking.attachedFile.size / (1024 * 1024)).toFixed(2)}{" "}
                        MB • Ready for audit
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
                rows={3}
                placeholder="Detail any room dimension issues, ventilation concerns, municipal submission queries, or specific material advice..."
                className="w-full bg-white dark:bg-zinc-950 border border-outline-variant/50 rounded-xl px-4 py-3 text-xs text-on-surface dark:text-white focus:outline-none focus:border-tertiary transition-colors"
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
                className="w-full sm:w-auto bg-primary hover:bg-tertiary text-on-primary px-10 py-4.5 rounded-xl font-inter font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>
                  CONFIRM &amp; PAY{" "}
                  {SafepayService.formatPKR(selectedTierData.price)}
                </span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
