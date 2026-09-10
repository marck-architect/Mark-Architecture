'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar, Video, Clock, X, Compass, Armchair, Home, Monitor, Database, TreePine } from 'lucide-react';
import Image from 'next/image';
import { useStore } from '@/hooks/useStore';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { cn } from '@/lib/utils';
import { ServicesPopup } from '@/components/consultation/ServicesPopup';

// Form validation schema
const briefFormSchema = z.object({
  name: z.string().min(2, { message: 'Your name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(6, { message: 'Please enter a valid phone number.' }),
  projectType: z.string().min(1, { message: 'Please select a project type.' }),
  budget: z.string().optional(),
  message: z.string().min(10, { message: 'Please write a brief of at least 10 characters.' }),
});

type BriefFormValues = z.infer<typeof briefFormSchema>;

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const timeSlots = ['09:00 AM', '10:30 AM', '01:00 PM', '03:30 PM'];

export default function ConsultationPage() {
  const {
    booking,
    selectDate,
    selectTimeSlot,
    changeMonth,
    unlinkAppointment,
    isAppointmentLinked,
    setAppointmentLinked,
    openSuccessModal,
    showToast,
  } = useStore();

  const [isConfigPopupOpen, setIsConfigPopupOpen] = useState(false);
  const [selectedConfigService, setSelectedConfigService] = useState('Architectural Design');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BriefFormValues>({
    resolver: zodResolver(briefFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      projectType: '',
      budget: '',
      message: '',
    },
  });

  const servicesList = [
    {
      icon: <Compass className="w-8 h-8 text-tertiary" />,
      title: 'Architectural Design',
      description: 'Conceptualizing structural blueprints that redefine modern living through mathematical precision.'
    },
    {
      icon: <Armchair className="w-8 h-8 text-tertiary" />,
      title: 'Interior Design',
      description: 'Curating internal environments with bespoke materials, custom lighting, and comfort.'
    },
    {
      icon: <Home className="w-8 h-8 text-tertiary" />,
      title: 'Exterior Design',
      description: 'Crafting the visual identity of structures through facade engineering.'
    },
    {
      icon: <Monitor className="w-8 h-8 text-tertiary" />,
      title: '3D Visualization',
      description: 'Hyper-realistic renders that bring your future spaces to life before construction.'
    },
    {
      icon: <Database className="w-8 h-8 text-tertiary" />,
      title: '3D Modeling',
      description: 'Advanced BIM and technical modeling for precise coordination.'
    },
    {
      icon: <TreePine className="w-8 h-8 text-tertiary" />,
      title: 'Landscape Design',
      description: 'Integrating nature with architecture through geometric gardens and ecosystems.'
    }
  ];

  const handleOpenServiceConfig = (title: string) => {
    setSelectedConfigService(title);
    setIsConfigPopupOpen(true);
  };

  const handleSelectService = (projectType: string, briefText: string) => {
    setValue('projectType', projectType, { shouldValidate: true });
    setValue('message', briefText, { shouldValidate: true });
    showToast('Linked customized service configuration.');
    
    // Smooth scroll down to brief form
    setTimeout(() => {
      const briefSection = document.getElementById('consultation-form-section');
      if (briefSection) {
        briefSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Calculate calendar elements
  const currentYear = 2026;
  const currentMonthIdx = 6 + booking.monthOffset; // July 2026 anchor
  const dateObj = new Date(currentYear, currentMonthIdx, 1);
  const displayedMonth = dateObj.getMonth();
  const displayedYear = dateObj.getFullYear();

  // Find start day padding
  let startDay = dateObj.getDay();
  if (startDay === 0) startDay = 7; // Adjust Sunday to position 7

  const daysInMonth = new Date(displayedYear, displayedMonth + 1, 0).getDate();

  const calendarDays = [];
  // Padded empty cells
  for (let i = 1; i < startDay; i++) {
    calendarDays.push({ day: null, key: `empty-${i}` });
  }
  // Month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({ day, key: `day-${day}` });
  }

  const handleLinkAppointment = () => {
    if (!booking.selectedDate || !booking.selectedTime) {
      showToast('Please select a date and time slot first.', 'warning');
      return;
    }
    setAppointmentLinked(true);
    showToast('Linked scheduled slot to Consultation Brief.');
    
    // Smooth scroll down to brief form
    const briefSection = document.getElementById('consultation-form-section');
    if (briefSection) {
      briefSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormSubmit = (values: BriefFormValues) => {
    const projectTypeName =
      values.projectType === 'residential'
        ? 'Luxury Residential Estate'
        : values.projectType === 'commercial'
        ? 'Premium Commercial Hub'
        : values.projectType === 'interior'
        ? 'Bespoke Interior Design'
        : values.projectType === 'landscape'
        ? 'Landscape & Biophilic Design'
        : 'Architecture';

    let desc = `Thank you, ${values.name}. We have received your structural design brief for a "${projectTypeName}". Our lead architect will review the documents and contact you at ${values.email} shortly.`;

    if (isAppointmentLinked && booking.selectedDate && booking.selectedTime) {
      const { day, month, year } = booking.selectedDate;
      desc += ` Your Discovery Call is locked for ${months[month]} ${day}, ${year} at ${booking.selectedTime} (Geneva Time). A calendar invitation with secure video conference details has been sent.`;
    }

    openSuccessModal('Commission Registered', desc);

    // Reset Form
    reset();
    unlinkAppointment();
  };

  return (
    <div className="relative overflow-x-hidden min-h-screen pt-20">
      {/* Page Header */}
      <header className="px-4 md:px-margin-desktop max-w-container-max mx-auto py-16 md:py-20 border-b border-outline-variant/30">
        <ScrollReveal>
          <div className="max-w-3xl space-y-4">
            <span className="font-inter text-xs md:text-sm font-bold text-tertiary uppercase tracking-widest block">
              COLLABORATIVE INITIATIVE
            </span>
            <h1 className="font-playfair text-4xl md:text-6xl text-on-surface dark:text-zinc-100 font-normal leading-tight">
              Begin your architectural <br />
              <span className="italic font-light">legacy.</span>
            </h1>
            <p className="font-inter text-base md:text-lg text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
              We design bespoke legacy commissions. Follow the direct brief submission and calendar scheduler below to coordinate directly with our design team.
            </p>
          </div>
        </ScrollReveal>
      </header>

      {/* Services Integration Grid Section */}
      <section className="px-4 md:px-margin-desktop max-w-container-max mx-auto py-16 border-b border-outline-variant/30 scroll-mt-24">
        <ScrollReveal>
          <div className="space-y-3 mb-10 text-center md:text-left max-w-3xl">
            <span className="font-inter text-xs md:text-sm font-bold text-tertiary uppercase tracking-widest block">
              Step 1: Tailor Your Commission
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl text-on-surface dark:text-zinc-100 font-normal">
              Select & Customise Services.
            </h2>
            <p className="font-inter text-sm md:text-base text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
              We translate bespoke visions into physical space. Click any specialized service card below to adjust scope parameters, project scale, and design aesthetic, and load the tailored brief directly into your booking.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesList.map((service, index) => (
            <ScrollReveal key={service.title} delay={0.05 * index}>
              <button
                onClick={() => handleOpenServiceConfig(service.title)}
                className="w-full text-left bg-surface-container-low dark:bg-zinc-900/50 p-8 flex flex-col items-start transition-all duration-300 border border-outline-variant/30 hover:border-tertiary rounded-2xl hover:shadow-[0px_20px_40px_rgba(126,87,20,0.04)] cursor-pointer h-full justify-between group"
              >
                <div>
                  <div className="mb-5 text-tertiary group-hover:scale-105 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h4 className="font-playfair text-xl font-bold mb-2 text-on-surface dark:text-zinc-200 group-hover:text-tertiary transition-colors">
                    {service.title}
                  </h4>
                  <p className="font-inter text-xs text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <span className="font-inter text-[10px] font-bold tracking-widest text-tertiary uppercase mt-6 flex items-center gap-1">
                  Configure & Book &rarr;
                </span>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Direct Scheduling Calendar Section */}
      <section className="px-4 md:px-margin-desktop max-w-container-max mx-auto py-20 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Calendar Sidebar info */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <ScrollReveal>
              <span className="font-inter text-xs md:text-sm font-bold text-tertiary uppercase tracking-widest block">
                Direct Scheduling
              </span>
              <h2 className="font-playfair text-3xl md:text-4xl text-on-surface dark:text-zinc-100 font-normal">
                Secure Your Window.
              </h2>
              <p className="font-inter text-sm text-on-surface-variant dark:text-zinc-400 font-light leading-relaxed">
                Our lead architects are available for private 15-minute introductory sessions. Select an available date and time slot to review your brief directly.
              </p>

              <div className="space-y-4 pt-4 border-t border-outline-variant/20 mt-6">
                <div className="flex items-center gap-3 text-xs text-on-surface-variant dark:text-zinc-400">
                  <Clock className="w-4 h-4 text-tertiary" />
                  <span>15-Minute Brief Review</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-on-surface-variant dark:text-zinc-400">
                  <Video className="w-4 h-4 text-tertiary" />
                  <span>Secure Video Room Link Provided</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Calendar Interactive Block */}
          <div className="lg:col-span-8">
            <ScrollReveal delay={0.1}>
              <div className="bg-surface-container-low dark:bg-zinc-900 p-6 md:p-10 border border-outline-variant/30 rounded-2xl shadow-sm space-y-8">
                {/* Calendar Header Month selector */}
                <div className="flex justify-between items-center">
                  <h4 className="font-playfair text-lg font-bold text-secondary dark:text-zinc-200">
                    {months[displayedMonth]} {displayedYear}
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => changeMonth(-1)}
                      className="p-2 border border-outline-variant hover:bg-secondary hover:text-white transition-colors cursor-pointer dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      aria-label="Previous Month"
                    >
                      &larr;
                    </button>
                    <button
                      onClick={() => changeMonth(1)}
                      className="p-2 border border-outline-variant hover:bg-secondary hover:text-white transition-colors cursor-pointer dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
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
                        return <div key={cell.key} className="py-4 opacity-20" />;
                      }

                      const isSelected =
                        booking.selectedDate &&
                        booking.selectedDate.day === cell.day &&
                        booking.selectedDate.month === displayedMonth &&
                        booking.selectedDate.year === displayedYear;

                      return (
                        <button
                          key={cell.key}
                          onClick={() => selectDate(cell.day!, displayedMonth, displayedYear)}
                          className={cn(
                            'py-4 rounded-lg transition-colors border border-transparent flex items-center justify-center cursor-pointer',
                            isSelected
                              ? 'bg-tertiary text-white font-bold border-tertiary shadow-md'
                              : 'hover:bg-tertiary/10 dark:text-zinc-300 hover:text-tertiary'
                          )}
                        >
                          {cell.day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots selector */}
                <div className="pt-6 border-t border-outline-variant/20 space-y-4">
                  <h5 className="font-inter text-xs font-bold text-secondary dark:text-zinc-300 uppercase tracking-widest">
                    Available Slots (Geneva Time)
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {timeSlots.map((slot) => {
                      const isSelected = booking.selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          onClick={() => selectTimeSlot(slot)}
                          className={cn(
                            'py-3 text-xs font-bold border transition-all duration-300 cursor-pointer',
                            isSelected
                              ? 'bg-tertiary-fixed text-on-tertiary-fixed border-tertiary'
                              : 'bg-white dark:bg-zinc-800 border-outline-variant hover:border-tertiary hover:text-tertiary dark:border-zinc-700 dark:text-zinc-300'
                          )}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Link Appointment Action */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleLinkAppointment}
                    className="bg-primary hover:bg-tertiary text-on-primary px-8 py-3.5 rounded-xl font-inter font-bold text-xs tracking-wider uppercase transition-all duration-300 active:scale-95 cursor-pointer text-center"
                  >
                    Link to Consultation Brief
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Brief Consultation Form section */}
      <section
        id="consultation-form-section"
        className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden scroll-mt-24"
      >
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full relative">
            <Image
              fill
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBDk0flUFoLkFlHDDJaWOhar0kHLBRywE3QcebKRcCNXi2EXgTXJKYWGZhFTSbsNSS7zBcE8KvU89G7gUah2CiY0jv_DxUOQEJbiKShTFYk2jyPzQYxGyLWZcOMWPcqBwRkfZS_PAMHM1xhilIyh0bW_p5gnUPsyBwEfUxYgJAS376P-XCOtfXGdlwPjv8ZKNHTroeRSLZdfc_UL08Rjhfs1xmtPVhUM0HiCQC0oaT4Wn2FFrkY_JEldFkXP1LGAT2jYN4JVW7a_1U"
              alt="Architectural Blueprint Drawing"
              className="object-cover brightness-[0.25] contrast-[1.1]"
              sizes="100vw"
            />
          </div>
        </div>

        <div className="max-w-4xl w-full z-10 glass-panel p-8 md:p-16 rounded-3xl shadow-2xl relative my-8 bg-white/40 dark:bg-zinc-950/40">
          <ScrollReveal>
            <div className="text-center mb-12 space-y-3">
              <h2 className="font-playfair text-3xl md:text-5xl text-on-surface dark:text-zinc-100 font-normal">
                Start Your Journey.
              </h2>
              <p className="font-inter text-base text-on-surface-variant dark:text-zinc-400 font-light">
                Precision begins with a conversation. Define your architectural vision below.
              </p>
            </div>
          </ScrollReveal>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
            {/* Input Name */}
            <div className="relative">
              <input
                {...register('name')}
                className="w-full bg-transparent border-0 border-b border-outline/70 py-2 focus:ring-0 focus:border-tertiary transition-colors peer placeholder-transparent text-on-surface dark:text-white"
                id="form-name"
                placeholder="Name"
                type="text"
              />
              <label
                className="absolute left-0 top-2 font-inter text-xs font-semibold text-outline-variant tracking-wider uppercase pointer-events-none transition-all duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:top-[-16px] peer-focus:text-xs peer-focus:text-tertiary peer-[:not(:placeholder-shown)]:top-[-16px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-tertiary"
                aria-label="YOUR NAME"
                htmlFor="form-name"
              >
                YOUR NAME
              </label>
              {errors.name && (
                <span className="text-[10px] text-red-500 font-bold block mt-1">{errors.name.message}</span>
              )}
            </div>

            {/* Input Email */}
            <div className="relative">
              <input
                {...register('email')}
                className="w-full bg-transparent border-0 border-b border-outline/70 py-2 focus:ring-0 focus:border-tertiary transition-colors peer placeholder-transparent text-on-surface dark:text-white"
                id="form-email"
                placeholder="Email"
                type="email"
              />
              <label
                className="absolute left-0 top-2 font-inter text-xs font-semibold text-outline-variant tracking-wider uppercase pointer-events-none transition-all duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:top-[-16px] peer-focus:text-xs peer-focus:text-tertiary peer-[:not(:placeholder-shown)]:top-[-16px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-tertiary"
                aria-label="EMAIL ADDRESS"
                htmlFor="form-email"
              >
                EMAIL ADDRESS
              </label>
              {errors.email && (
                <span className="text-[10px] text-red-500 font-bold block mt-1">{errors.email.message}</span>
              )}
            </div>

            {/* Input Phone */}
            <div className="relative">
              <input
                {...register('phone')}
                className="w-full bg-transparent border-0 border-b border-outline/70 py-2 focus:ring-0 focus:border-tertiary transition-colors peer placeholder-transparent text-on-surface dark:text-white"
                id="form-phone"
                placeholder="Phone"
                type="tel"
              />
              <label
                className="absolute left-0 top-2 font-inter text-xs font-semibold text-outline-variant tracking-wider uppercase pointer-events-none transition-all duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:top-[-16px] peer-focus:text-xs peer-focus:text-tertiary peer-[:not(:placeholder-shown)]:top-[-16px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-tertiary"
                aria-label="PHONE NUMBER"
                htmlFor="form-phone"
              >
                PHONE NUMBER
              </label>
              {errors.phone && (
                <span className="text-[10px] text-red-500 font-bold block mt-1">{errors.phone.message}</span>
              )}
            </div>

            {/* Selection Project Type */}
            <div className="relative">
              <select
                {...register('projectType')}
                className="w-full bg-transparent border-0 border-b border-outline/70 py-2 focus:ring-0 focus:border-tertiary transition-colors text-on-surface dark:text-zinc-100 focus:outline-none cursor-pointer"
                id="form-project-type"
                defaultValue=""
              >
                <option value="" disabled className="text-outline-variant font-inter text-xs tracking-wider uppercase bg-zinc-900">
                  PROJECT TYPE
                </option>
                <option value="residential" className="text-on-surface dark:bg-zinc-900">Luxury Residential Estate</option>
                <option value="commercial" className="text-on-surface dark:bg-zinc-900">Premium Commercial Hub</option>
                <option value="interior" className="text-on-surface dark:bg-zinc-900">Bespoke Interior Design</option>
                <option value="landscape" className="text-on-surface dark:bg-zinc-900">Landscape &amp; Biophilic Design</option>
                <option value="renovation" className="text-on-surface dark:bg-zinc-900">Legacy Renovations</option>
              </select>
              {errors.projectType && (
                <span className="text-[10px] text-red-500 font-bold block mt-1">{errors.projectType.message}</span>
              )}
            </div>

            {/* Input Estimated Budget */}
            <div className="md:col-span-2 relative">
              <input
                {...register('budget')}
                className="w-full bg-transparent border-0 border-b border-outline/70 py-2 focus:ring-0 focus:border-tertiary transition-colors peer placeholder-transparent text-on-surface dark:text-white"
                id="form-budget"
                placeholder="Budget"
                type="text"
              />
              <label
                className="absolute left-0 top-2 font-inter text-xs font-semibold text-outline-variant tracking-wider uppercase pointer-events-none transition-all duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:top-[-16px] peer-focus:text-xs peer-focus:text-tertiary peer-[:not(:placeholder-shown)]:top-[-16px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-tertiary"
                aria-label="ESTIMATED BUDGET Range"
                htmlFor="form-budget"
              >
                ESTIMATED BUDGET RANGE
              </label>
            </div>

            {/* Textarea Brief details */}
            <div className="md:col-span-2 relative">
              <textarea
                {...register('message')}
                className="w-full bg-transparent border-0 border-b border-outline/70 py-2 focus:ring-0 focus:border-tertiary transition-colors peer placeholder-transparent text-on-surface dark:text-white"
                id="form-message"
                placeholder="Message"
                rows={3}
              />
              <label
                className="absolute left-0 top-2 font-inter text-xs font-semibold text-outline-variant tracking-wider uppercase pointer-events-none transition-all duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:top-[-16px] peer-focus:text-xs peer-focus:text-tertiary peer-[:not(:placeholder-shown)]:top-[-16px] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-tertiary"
                aria-label="TELL US ABOUT YOUR BRIEF"
                htmlFor="form-message"
              >
                TELL US ABOUT YOUR BRIEF
              </label>
              {errors.message && (
                <span className="text-[10px] text-red-500 font-bold block mt-1">{errors.message.message}</span>
              )}
            </div>

            {/* Linked Appointment Banner Info */}
            {isAppointmentLinked && booking.selectedDate && booking.selectedTime && (
              <div className="md:col-span-2 bg-tertiary/10 border border-tertiary/30 rounded-xl p-4 flex justify-between items-center text-xs text-white">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-tertiary" />
                  <div>
                    <p className="font-bold text-zinc-950 dark:text-zinc-200">Discovery Meeting Linked</p>
                    <p className="text-zinc-600 dark:text-zinc-400 font-light mt-0.5">
                      Date: {months[booking.selectedDate.month]} {booking.selectedDate.day}, {booking.selectedDate.year} at {booking.selectedTime}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={unlinkAppointment}
                  className="text-primary hover:text-tertiary cursor-pointer"
                  aria-label="Unlink appointment"
                >
                  <X className="w-4 h-4 text-zinc-800 dark:text-zinc-300" />
                </button>
              </div>
            )}

            <div className="md:col-span-2 flex justify-center pt-8">
              <button
                type="submit"
                className="bg-secondary text-on-primary hover:bg-tertiary px-12 py-5 font-bold tracking-[0.15em] transition-all duration-300 shadow-xl active:scale-95 uppercase font-inter text-sm cursor-pointer"
              >
                INITIATE COMMISSION
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Services Configurator Modal Popup */}
      <ServicesPopup
        isOpen={isConfigPopupOpen}
        onClose={() => setIsConfigPopupOpen(false)}
        initialServiceTitle={selectedConfigService}
        onSelectService={handleSelectService}
      />
    </div>
  );
}
