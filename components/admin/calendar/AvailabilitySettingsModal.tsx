"use client";

import React, { useState } from "react";
import { X, Save, Check, Loader2 } from "lucide-react";
import type { AvailabilitySettings, BlockedDate } from "@/types";

interface AvailabilitySettingsModalProps {
  settings: AvailabilitySettings;
  blockedDates: BlockedDate[];
  onClose: () => void;
  onSaveSettings: (newSettings: AvailabilitySettings) => Promise<void>;
  onAddBlockedDate: (
    date: string,
    reason: string,
    isFullDay: boolean,
  ) => Promise<void>;
  onDeleteBlockedDate: (id: string) => Promise<void>;
}

export const AvailabilitySettingsModal: React.FC<
  AvailabilitySettingsModalProps
> = ({
  settings,
  blockedDates,
  onClose,
  onSaveSettings,
  onAddBlockedDate,
  onDeleteBlockedDate,
}) => {
  const [workingDays, setWorkingDays] = useState<number[]>(
    settings.working_days || [1, 2, 3, 4, 5, 6],
  );
  const [startTime, setStartTime] = useState(settings.start_time || "10:00");
  const [endTime, setEndTime] = useState(settings.end_time || "19:00");
  const [bufferMinutes, setBufferMinutes] = useState(
    settings.buffer_minutes || 15,
  );
  const [maxPerDay, setMaxPerDay] = useState(settings.max_per_day || 6);

  // New Blocked Date inputs
  const [newBlockDate, setNewBlockDate] = useState("");
  const [newBlockReason, setNewBlockReason] = useState("");
  const [newBlockFullDay, setNewBlockFullDay] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const daysMap = [
    { num: 1, label: "Monday" },
    { num: 2, label: "Tuesday" },
    { num: 3, label: "Wednesday" },
    { num: 4, label: "Thursday" },
    { num: 5, label: "Friday" },
    { num: 6, label: "Saturday" },
    { num: 0, label: "Sunday" },
  ];

  const toggleDay = (dayNum: number) => {
    setWorkingDays((prev) =>
      prev.includes(dayNum)
        ? prev.filter((d) => d !== dayNum)
        : [...prev, dayNum],
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setFeedback(null);
    try {
      await onSaveSettings({
        ...settings,
        working_days: workingDays,
        start_time: startTime,
        end_time: endTime,
        buffer_minutes: Number(bufferMinutes),
        max_per_day: Number(maxPerDay),
      });
      setFeedback("Studio working hours & availability successfully updated.");
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      setFeedback("Failed to update availability settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockDate || !newBlockReason) return;
    setIsAddingBlock(true);
    try {
      await onAddBlockedDate(newBlockDate, newBlockReason, newBlockFullDay);
      setNewBlockDate("");
      setNewBlockReason("");
      setFeedback("Date blocked successfully from client booking calendar.");
      setTimeout(() => setFeedback(null), 3000);
    } catch {
      setFeedback("Failed to block date.");
    } finally {
      setIsAddingBlock(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-xs animate-fadeIn font-inter">
      <div className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden text-stone-800">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div>
            <h2 className="font-playfair text-lg sm:text-xl font-bold text-stone-900">
              Availability &amp; Calendar Controls
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Configure working days, studio operating hours, and blacked-out
              dates.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-stone-500 hover:text-stone-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {feedback && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
              {feedback}
            </div>
          )}

          {/* 1. Working Days */}
          <div className="space-y-2">
            <label className="block text-xs uppercase font-mono tracking-widest text-[#7E5714] font-bold">
              Active Studio Working Days
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {daysMap.map((d) => {
                const isSelected = workingDays.includes(d.num);
                return (
                  <button
                    key={d.num}
                    type="button"
                    onClick={() => toggleDay(d.num)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#1C1B1B] text-white border-[#1C1B1B] shadow-2xs"
                        : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    <span>{d.label}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Studio Operating Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-stone-600 font-medium mb-1">
                Studio Open Time (PKT)
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:border-[#7E5714]"
              />
            </div>
            <div>
              <label className="block text-stone-600 font-medium mb-1">
                Studio Close Time (PKT)
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:border-[#7E5714]"
              />
            </div>
            <div>
              <label className="block text-stone-600 font-medium mb-1">
                Buffer Between Calls (minutes)
              </label>
              <input
                type="number"
                value={bufferMinutes}
                onChange={(e) => setBufferMinutes(Number(e.target.value))}
                min={0}
                step={5}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:border-[#7E5714]"
              />
            </div>
            <div>
              <label className="block text-stone-600 font-medium mb-1">
                Max Daily Consultations
              </label>
              <input
                type="number"
                value={maxPerDay}
                onChange={(e) => setMaxPerDay(Number(e.target.value))}
                min={1}
                max={20}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:border-[#7E5714]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-2.5 rounded-xl bg-[#7E5714] hover:bg-[#684710] text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>Save Operating Hours</span>
            </button>
          </div>

          {/* 3. Blocked Dates Manager */}
          <div className="pt-4 border-t border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs uppercase font-mono tracking-widest text-[#7E5714] font-bold">
                Blackout / Blocked Dates ({blockedDates.length})
              </label>
            </div>

            {/* Add Block Form */}
            <form
              onSubmit={handleCreateBlock}
              className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200 space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">
                    Block Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newBlockDate}
                    onChange={(e) => setNewBlockDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">
                    Reason / Note
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Site Visit, Public Holiday"
                    value={newBlockReason}
                    onChange={(e) => setNewBlockReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newBlockFullDay}
                    onChange={(e) => setNewBlockFullDay(e.target.checked)}
                    className="rounded border-stone-300"
                  />
                  <span>Full Day Block</span>
                </label>

                <button
                  type="submit"
                  disabled={isAddingBlock}
                  className="px-4 py-2 rounded-xl bg-[#1C1B1B] hover:bg-black text-white text-xs font-semibold cursor-pointer shadow-2xs"
                >
                  {isAddingBlock ? "Blocking..." : "+ Add Blocked Date"}
                </button>
              </div>
            </form>

            {/* Existing Blocked Dates List */}
            {blockedDates.length > 0 ? (
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden bg-white text-xs">
                {blockedDates.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="font-mono font-bold text-stone-900">
                        {b.date}
                      </span>
                      <span className="text-stone-500 ml-2">({b.reason})</span>
                    </div>
                    <button
                      onClick={() => onDeleteBlockedDate(b.id)}
                      className="text-rose-600 hover:text-rose-800 hover:underline text-[11px] font-medium cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic">
                No dates currently blocked.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
