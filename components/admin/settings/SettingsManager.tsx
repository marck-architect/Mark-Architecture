"use client";

import React, { useState } from "react";
import {
  Settings,
  Shield,
  CreditCard,
  Video,
  Copy,
  CheckCircle2,
  Lock,
  Globe,
  Save,
  Clock,
  ExternalLink,
} from "lucide-react";

interface SettingsManagerProps {
  adminEmail: string;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({
  adminEmail,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  const [settings, setSettings] = useState({
    studioName: "MARK Architects",
    pcatpRegistration: "PCATP-A-48291",
    timezone: "Asia/Karachi (PKT, UTC+5)",
    currency: "PKR (Pakistani Rupee)",
    meetingProvider: "google_meet",
    defaultDuration: "60",
    bufferMinutes: "15",
    safepayMode: "production",
    autoSendReceipts: true,
  });

  const webhookUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/safepay/webhook`
      : "https://markarchitects.com/api/safepay/webhook";

  const successUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/consultation/success`
      : "https://markarchitects.com/consultation/success";

  const handleCopy = (field: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-[#7E5714] uppercase">
            System & Configurations
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 tracking-tight mt-1">
            Studio Operations Settings
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Configure architectural practice metadata, Safepay gateway
            endpoints, and meeting defaults.
          </p>
        </div>

        {saveToast && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono rounded-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Settings Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Studio Identity */}
        <div className="bg-white border border-stone-200 p-6 rounded-sm shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Globe className="w-4 h-4 text-[#7E5714]" />
            <h3 className="font-serif text-sm font-semibold text-stone-900">
              Practice Identity & Licensing
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-stone-700 font-medium mb-1">
                Studio Legal Name
              </label>
              <input
                type="text"
                value={settings.studioName}
                onChange={(e) =>
                  setSettings({ ...settings, studioName: e.target.value })
                }
                className="w-full p-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714]"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">
                PCATP Registration Number
              </label>
              <input
                type="text"
                value={settings.pcatpRegistration}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    pcatpRegistration: e.target.value,
                  })
                }
                className="w-full p-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714] font-mono"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">
                Authenticated Studio Admin
              </label>
              <input
                type="text"
                readOnly
                value={adminEmail}
                className="w-full p-2.5 border border-stone-200 rounded-sm bg-stone-50 text-stone-500 font-mono"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Single-email authenticated identity
              </span>
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">
                Atelier Timezone
              </label>
              <input
                type="text"
                readOnly
                value={settings.timezone}
                className="w-full p-2.5 border border-stone-200 rounded-sm bg-stone-50 text-stone-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Safepay Gateway Settings */}
        <div className="bg-white border border-stone-200 p-6 rounded-sm shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#7E5714]" />
              <h3 className="font-serif text-sm font-semibold text-stone-900">
                Safepay Pakistan Gateway Integration
              </h3>
            </div>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono uppercase rounded-full">
              Production Mode Active
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            All Safepay API secret credentials (
            <code className="font-mono text-[11px] text-[#7E5714]">
              SAFEPAY_API_KEY
            </code>
            ,{" "}
            <code className="font-mono text-[11px] text-[#7E5714]">
              SAFEPAY_WEBHOOK_SECRET
            </code>
            ) are stored securely on server-side environment variables and are
            never exposed in browser runtimes.
          </p>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-stone-500 text-[10px] uppercase mb-1">
                Safepay Webhook Endpoint URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={webhookUrl}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-sm text-stone-800 select-all"
                />
                <button
                  type="button"
                  onClick={() => handleCopy("webhook", webhookUrl)}
                  className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs rounded-sm shrink-0"
                >
                  {copiedField === "webhook" ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-stone-500 text-[10px] uppercase mb-1">
                Safepay Client Return URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={successUrl}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-sm text-stone-800 select-all"
                />
                <button
                  type="button"
                  onClick={() => handleCopy("return", successUrl)}
                  className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs rounded-sm shrink-0"
                >
                  {copiedField === "return" ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Meeting Preferences */}
        <div className="bg-white border border-stone-200 p-6 rounded-sm shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <Video className="w-4 h-4 text-[#7E5714]" />
            <h3 className="font-serif text-sm font-semibold text-stone-900">
              Virtual Architecture Consultation Defaults
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-stone-700 font-medium mb-1">
                Preferred Virtual Platform
              </label>
              <select
                value={settings.meetingProvider}
                onChange={(e) =>
                  setSettings({ ...settings, meetingProvider: e.target.value })
                }
                className="w-full p-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714] font-mono"
              >
                <option value="google_meet">Google Meet (Recommended)</option>
                <option value="zoom">Zoom Video Communications</option>
                <option value="teams">Microsoft Teams</option>
                <option value="custom">Custom HTTPS Video Conference</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">
                Default Buffer Time Between Sessions
              </label>
              <select
                value={settings.bufferMinutes}
                onChange={(e) =>
                  setSettings({ ...settings, bufferMinutes: e.target.value })
                }
                className="w-full p-2.5 border border-stone-200 rounded-sm focus:outline-none focus:border-[#7E5714] font-mono"
              >
                <option value="10">10 Minutes</option>
                <option value="15">15 Minutes (Standard)</option>
                <option value="30">30 Minutes</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={settings.autoSendReceipts}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    autoSendReceipts: e.target.checked,
                  })
                }
                className="accent-[#7E5714]"
              />
              <span className="text-stone-700">
                Automatically generate branded PDF invoice receipt on payment
                confirmation
              </span>
            </label>
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#7E5714] hover:bg-[#684710] text-white text-xs font-medium tracking-wider uppercase rounded-sm shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Configurations</span>
          </button>
        </div>
      </form>
    </div>
  );
};
