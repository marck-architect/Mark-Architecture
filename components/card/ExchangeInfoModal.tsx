"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "./Toast";
import { profile } from "./profile.config";

interface ExchangeInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExchangeInfoModal({ isOpen, onClose }: ExchangeInfoModalProps) {
  const { notify } = useToast();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, loading, onClose]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/card/exchange-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send information");
      }

      setSuccess(true);
      notify("Information shared with Muhammad Arslan!");
      setTimeout(() => {
        setSuccess(false);
        setName("");
        setEmail("");
        setPhone("");
        onClose();
      }, 1800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="exchange-info-title"
    >
      <div
        className="relative w-full max-w-[430px] rounded-2xl bg-white p-6 sm:p-7 shadow-2xl border border-gray-100 text-gray-900 transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
          <h2
            id="exchange-info-title"
            className="text-base sm:text-lg font-bold text-gray-900 tracking-tight"
          >
            Let&apos;s Stay Connected
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close dialog"
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {success ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle2 className="size-12 text-[#25D366] mx-auto animate-in zoom-in duration-300" />
            <h3 className="text-base font-semibold text-gray-900">
              Details Shared Successfully!
            </h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              Muhammad Arslan has received your contact details and will get in touch soon.
            </p>
          </div>
        ) : (
          <>
            {/* Subtitle */}
            <p className="mt-4 text-xs sm:text-sm text-gray-500 leading-relaxed">
              Share your details and make it easy for me to get in touch with you too.
              Let&apos;s build lasting connection!
            </p>

            {/* Error banner */}
            {errorMessage && (
              <div className="mt-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                {errorMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="exchange-name"
                  className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5"
                >
                  Name
                </label>
                <input
                  id="exchange-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder=""
                  disabled={loading}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 bg-white focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed shadow-2xs"
                />
              </div>

              <div>
                <label
                  htmlFor="exchange-email"
                  className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5"
                >
                  Email
                </label>
                <input
                  id="exchange-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                  disabled={loading}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 bg-white focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed shadow-2xs"
                />
              </div>

              <div>
                <label
                  htmlFor="exchange-phone"
                  className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1.5"
                >
                  Phone
                </label>
                <input
                  id="exchange-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder=""
                  disabled={loading}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 bg-white focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed shadow-2xs"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#15191e] hover:bg-black text-white font-medium text-xs sm:text-sm transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Sending details...</span>
                    </>
                  ) : (
                    <span>Share with {profile.name}</span>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
