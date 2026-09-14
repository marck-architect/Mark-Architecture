"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";

export const AdminLoginView: React.FC = () => {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

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

  return (
    <div className="min-h-screen bg-[#FCF8F8] text-[#1C1B1B] flex flex-col justify-center items-center px-4 py-12 selection:bg-amber-100 selection:text-amber-900">
      {/* Background Architectural Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-white border border-stone-200 rounded-2xl shadow-xl shadow-stone-200/50 backdrop-blur-xl p-8 md:p-10 z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[#7E5714] mb-4 shadow-2xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-playfair text-2xl md:text-3xl text-stone-900 tracking-wide font-normal">
            MARK Architects
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-[#7E5714] font-semibold mt-1">
            Atelier Executive Portal
          </p>
          <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Single Admin Secure Verification</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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

          {/* Password Input */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2 uppercase tracking-wider">
              Secret Password
            </label>
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
