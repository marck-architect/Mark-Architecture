"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Clock, Settings } from "lucide-react";
import { AvailabilitySettingsModal } from "./AvailabilitySettingsModal";
import type {
  ConsultationRecord,
  AvailabilitySettings,
  BlockedDate,
} from "@/types";

interface CalendarManagerProps {
  consultations: ConsultationRecord[];
  availabilitySettings: AvailabilitySettings;
  blockedDates: BlockedDate[];
  onInspectBooking: (b: ConsultationRecord) => void;
  onUpdateAvailability: (settings: AvailabilitySettings) => Promise<void>;
  onAddBlockedDate: (
    date: string,
    reason: string,
    isFullDay: boolean,
  ) => Promise<void>;
  onDeleteBlockedDate: (id: string) => Promise<void>;
}

export const CalendarManager: React.FC<CalendarManagerProps> = ({
  consultations,
  availabilitySettings,
  blockedDates,
  onInspectBooking,
  onUpdateAvailability,
  onAddBlockedDate,
  onDeleteBlockedDate,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation
  const handlePrev = () => {
    if (viewMode === "month") {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (viewMode === "week") {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 86400000));
    } else {
      setCurrentDate(new Date(currentDate.getTime() - 86400000));
    }
  };

  const handleNext = () => {
    if (viewMode === "month") {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (viewMode === "week") {
      setCurrentDate(new Date(currentDate.getTime() + 7 * 86400000));
    } else {
      setCurrentDate(new Date(currentDate.getTime() + 86400000));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Month Grid Calculation
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0=Sun, 1=Mon

  // Generate calendar cells (Monday first)
  const calendarCells = useMemo(() => {
    const cells = [];
    // Adjust Sunday to 6, Mon to 0
    const startOffset = (firstDayIndex + 6) % 7;

    for (let i = 0; i < startOffset; i++) {
      cells.push({ dayNumber: null, dateStr: "" });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const monthStr = String(month + 1).padStart(2, "0");
      const dayStr = String(d).padStart(2, "0");
      const dateStr = `${year}-${monthStr}-${dayStr}`;
      cells.push({ dayNumber: d, dateStr });
    }

    return cells;
  }, [year, month, daysInMonth, firstDayIndex]);

  const todayStr = new Date().toISOString().split("T")[0];

  const monthLabel = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6 font-inter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-playfair text-xl sm:text-2xl font-bold text-stone-900">
            Calendar &amp; Appointment Dispatch
          </h2>
          <p className="text-xs text-stone-500 font-light mt-0.5">
            Overview of scheduled architectural consultations, confirmed video
            calls, and blackout days.
          </p>
        </div>

        <button
          onClick={() => setSettingsOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Settings className="w-3.5 h-3.5 text-[#7E5714]" />
          <span>Availability &amp; Hours</span>
        </button>
      </div>

      {/* Calendar Controls Bar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Date Title & Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-playfair text-base sm:text-lg font-bold text-stone-900 min-w-[180px] text-center">
            {monthLabel}
          </span>

          <button
            onClick={handleNext}
            className="p-2 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleToday}
            className="ml-2 px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 shadow-2xs cursor-pointer"
          >
            Today
          </button>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
          {(["month", "week", "day"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className={`px-3 py-1 rounded-lg capitalize font-medium transition-all cursor-pointer ${
                viewMode === m
                  ? "bg-white text-stone-900 shadow-2xs font-semibold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Month View Grid */}
      <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs">
        {/* Day Header Row */}
        <div className="grid grid-cols-7 border-b border-stone-200 bg-stone-50/80 text-[11px] font-mono uppercase font-bold text-stone-500 py-3 text-center">
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>

        {/* Calendar Day Cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-stone-100 min-h-[500px]">
          {calendarCells.map((cell, idx) => {
            if (!cell.dayNumber) {
              return (
                <div key={idx} className="bg-stone-50/40 min-h-[90px] p-2" />
              );
            }

            const isToday = cell.dateStr === todayStr;
            const dayBookings = consultations.filter(
              (c) => c.booking_date === cell.dateStr,
            );
            const isBlocked = blockedDates.find((b) => b.date === cell.dateStr);

            return (
              <div
                key={idx}
                className={`min-h-[100px] p-2 transition-colors flex flex-col justify-between ${
                  isToday ? "bg-amber-50/20" : "hover:bg-stone-50/60"
                } ${isBlocked ? "bg-rose-50/30" : ""}`}
              >
                {/* Date Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isToday
                        ? "bg-[#7E5714] text-white shadow-2xs"
                        : "text-stone-700"
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  {isBlocked && (
                    <span
                      className="text-[9px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded"
                      title={isBlocked.reason}
                    >
                      Blocked
                    </span>
                  )}
                </div>

                {/* Day Items */}
                <div className="space-y-1 my-1 flex-1">
                  {dayBookings.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => onInspectBooking(b)}
                      className={`p-1.5 rounded-lg text-[10px] cursor-pointer border transition-all truncate ${
                        b.payment_status === "paid"
                          ? "bg-emerald-50 text-emerald-900 border-emerald-200/80 hover:border-emerald-400"
                          : "bg-amber-50 text-amber-900 border-amber-200/80 hover:border-amber-400"
                      }`}
                      title={`${b.client_name} (${b.booking_time} PKT) - ${b.tier_name}`}
                    >
                      <div className="font-semibold truncate">
                        {b.client_name}
                      </div>
                      <div className="text-[9px] font-mono flex items-center gap-1 opacity-80">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{b.booking_time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Slot counter */}
                {dayBookings.length > 0 && (
                  <span className="text-[9px] text-stone-400 font-mono text-right block">
                    {dayBookings.length} booking
                    {dayBookings.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Availability Settings Dialog */}
      {settingsOpen && (
        <AvailabilitySettingsModal
          settings={availabilitySettings}
          blockedDates={blockedDates}
          onClose={() => setSettingsOpen(false)}
          onSaveSettings={onUpdateAvailability}
          onAddBlockedDate={onAddBlockedDate}
          onDeleteBlockedDate={onDeleteBlockedDate}
        />
      )}
    </div>
  );
};
