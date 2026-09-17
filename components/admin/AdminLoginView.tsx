"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import {
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Loader2,
  KeyRound,
} from "lucide-react";

export const AdminLoginView: React.FC = () => {
  const router = useRouter();
  const supabase = createClient();

  // Mode: "login" or "forgot"
  const [viewMode, setViewMode] = useState<"login" | "forgot">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim().toLowerCase();

    // Enforce single-email lockdown on client
    if (adminEmail && trimmedEmail !== adminEmail.toLowerCase()) {
      setErrorMessage(
        "Access denied. This email is not authorized to access the MARK Architects Atelier portal.",
      );
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        setErrorMessage(
          error.message ||
            "Invalid credentials. Please verify your email and password.",
        );
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        // Double check user email from Supabase response
        if (
          adminEmail &&
          data.user.email?.toLowerCase() !== adminEmail.toLowerCase()
        ) {
          await supabase.auth.signOut();
          setErrorMessage("Access denied. Unauthorized user account.");
          setIsLoading(false);
          return;
        }

        router.push("/admin");
        router.refresh();
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during authentication.",
      );
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setErrorMessage("Please enter a valid administrator email address.");
      return;
    }

    // Single-email lockdown check
    if (adminEmail && trimmedEmail !== adminEmail.toLowerCase()) {
      setErrorMessage(
        "Access denied. Only the authorized administrator email can request a password reset.",
      );
      return;
    }

    setIsResetting(true);

    try {
      // 1. Dispatch request through dedicated backend route
      const res = await fetch("/api/admin/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const resData = await res.json();

      if (!res.ok) {
        // Fallback: trigger client-side resetPasswordForEmail directly
        const origin =
          typeof window !== "undefined"
            ? window.location.origin
            : "http://localhost:3000";
        const { error: clientError } =
          await supabase.auth.resetPasswordForEmail(trimmedEmail, {
            redirectTo: `${origin}/auth/callback?next=/admin/reset-password`,
          });

        if (clientError) {
          throw new Error(
            resData.error ||
              clientError.message ||
              "Failed to send password reset email.",
          );
        }
      }

      setSuccessMessage(
        `Password reset link dispatched! Please check your email inbox (${trimmedEmail}) to set your new password.`,
      );
      setIsResetting(false);
    } catch (err: unknown) {
      console.error("[Forgot Password Error]:", err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Failed to dispatch password reset email. Please try again.",
      );
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF8F8] text-[#1C1B1B] flex flex-col justify-center items-center px-4 py-12 selection:bg-amber-100 selection:text-amber-900">
      {/* Background Architectural Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Card */}
      <div className="relative w-full max-w-md bg-white border border-stone-200 rounded-2xl shadow-xl shadow-stone-200/50 backdrop-blur-xl p-8 md:p-10 z-10 animate-fadeIn">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/25 p-3 mb-4 shadow-2xs">
            <Image
              src="/images/icon-dark.png"
              alt="MARK Architects Emblem"
              width={32}
              height={32}
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="font-playfair text-2xl md:text-3xl text-stone-900 tracking-wide font-normal">
            MARK Architects
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-[#7E5714] font-semibold mt-1">
            {viewMode === "login"
              ? "Atelier Executive Portal"
              : "Password Recovery"}
          </p>
          <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {viewMode === "login"
                ? "Single Admin Secure Verification"
                : "Automated Reset Link Dispatch"}
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-start gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-950 mb-0.5">
                Dispatched
              </p>
              <p className="leading-relaxed">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Form Container */}
        {viewMode === "login" ? (
          /* Sign In Form */
          <form onSubmit={handleSignIn} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2 uppercase tracking-wider">
                Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@markarchitects.com"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50/70 border border-stone-200 rounded-xl text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:border-[#7E5714] focus:bg-white focus:ring-1 focus:ring-[#7E5714]/20 shadow-2xs transition-all"
                />
              </div>
            </div>

            {/* Password Input with Forgot Password Button */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Secret Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setSuccessMessage(null);
                    setViewMode("forgot");
                  }}
                  className="text-xs text-[#7E5714] hover:text-[#684710] font-medium transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50/70 border border-stone-200 rounded-xl text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:border-[#7E5714] focus:bg-white focus:ring-1 focus:ring-[#7E5714]/20 shadow-2xs transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-5 bg-[#7E5714] hover:bg-[#684710] active:scale-[0.99] text-white font-medium text-sm rounded-xl shadow-md shadow-amber-900/10 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Access...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Forgot Password Request Form */
          <form onSubmit={handleForgotPassword} className="space-y-5">
            <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-[#7E5714] flex items-start gap-2.5">
              <KeyRound className="w-4 h-4 text-[#7E5714] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Enter your registered administrator email address. We will
                automatically send a secure password reset link to your email.
              </p>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2 uppercase tracking-wider">
                Administrator Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@markarchitects.com"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50/70 border border-stone-200 rounded-xl text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:border-[#7E5714] focus:bg-white focus:ring-1 focus:ring-[#7E5714]/20 shadow-2xs transition-all"
                />
              </div>
            </div>

            {/* Reset Submit Button */}
            <button
              type="submit"
              disabled={isResetting}
              className="w-full mt-2 py-3.5 px-5 bg-[#7E5714] hover:bg-[#684710] active:scale-[0.99] text-white font-medium text-sm rounded-xl shadow-md shadow-amber-900/10 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isResetting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Sending Reset Link...</span>
                </>
              ) : (
                <>
                  <span>Send Password Reset Link</span>
                  <Mail className="w-4 h-4 text-white" />
                </>
              )}
            </button>

            {/* Return to login button */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setSuccessMessage(null);
                  setViewMode("login");
                }}
                className="text-xs text-stone-500 hover:text-stone-800 transition-colors inline-flex items-center gap-1.5 font-medium cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to Sign In
              </button>
            </div>
          </form>
        )}

        {/* Footer info note */}
        <div className="mt-8 pt-6 border-t border-stone-100 text-center">
          <p className="text-[11px] text-stone-400 leading-relaxed">
            Public registration is disabled. User credentials must be
            provisioned directly in the database.
          </p>
        </div>
      </div>
    </div>
  );
};
