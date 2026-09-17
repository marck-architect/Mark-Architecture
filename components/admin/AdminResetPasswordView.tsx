"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export const AdminResetPasswordView: React.FC = () => {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        // 1. Check if user already has an active recovery session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session && isMounted) {
          setHasValidSession(true);
          setIsCheckingSession(false);
          return;
        }

        // 2. Listen for auth state change (e.g. PASSWORD_RECOVERY or SIGNED_IN from hash fragment)
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          if (
            (event === "PASSWORD_RECOVERY" ||
              event === "SIGNED_IN" ||
              currentSession) &&
            isMounted
          ) {
            setHasValidSession(true);
            setIsCheckingSession(false);
          }
        });

        // Give the browser client a moment to parse the URL hash if present
        setTimeout(() => {
          if (isMounted) {
            setIsCheckingSession(false);
          }
        }, 1500);

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error("[Reset Password] Error checking recovery session:", err);
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters in length.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify both inputs.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setErrorMessage(
          error.message ||
            "Unable to update password. Your recovery link may have expired.",
        );
        setIsLoading(false);
        return;
      }

      setSuccessMessage(
        "Password successfully updated! Redirecting to Studio Command Center...",
      );
      setIsLoading(false);

      // Redirect after brief confirmation
      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 1500);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while saving your new password.",
      );
      setIsLoading(false);
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
            Set New Password
          </p>
          <p className="text-xs text-stone-500 mt-2">
            Establish new administrator credentials for the Atelier Command
            Center.
          </p>
        </div>

        {/* Loading recovery check state */}
        {isCheckingSession ? (
          <div className="py-12 text-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#7E5714] mx-auto" />
            <p className="text-xs text-stone-500 font-mono">
              Verifying secure recovery token...
            </p>
          </div>
        ) : !hasValidSession && !successMessage ? (
          /* Missing or Expired Session Warning */
          <div className="space-y-6">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3">
              <KeyRound className="w-5 h-5 text-[#7E5714] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">
                  Recovery Session Expired or Required
                </p>
                <p className="text-amber-800/90 leading-relaxed">
                  To reset your password, please click the link sent to your
                  administrator email inbox, or request a new reset link from
                  the login page.
                </p>
              </div>
            </div>

            <Link
              href="/admin/login"
              className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Administrator Sign In</span>
            </Link>
          </div>
        ) : (
          /* Active Reset Form */
          <>
            {errorMessage && (
              <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-start gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-950 mb-0.5">
                    Success
                  </p>
                  <p>{successMessage}</p>
                </div>
              </div>
            )}

            {!successMessage && (
              <form onSubmit={handleUpdatePassword} className="space-y-5">
                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-2 uppercase tracking-wider">
                    New Secret Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full pl-10 pr-10 py-3 bg-stone-50/70 border border-stone-200 rounded-xl text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:border-[#7E5714] focus:bg-white focus:ring-1 focus:ring-[#7E5714]/20 shadow-2xs transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-2 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full pl-10 pr-10 py-3 bg-stone-50/70 border border-stone-200 rounded-xl text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:border-[#7E5714] focus:bg-white focus:ring-1 focus:ring-[#7E5714]/20 shadow-2xs transition-all"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-stone-400 font-mono">
                  Password requirement: At least 8 characters with numbers or
                  symbols recommended.
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
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Save Password & Sign In</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <Link
                    href="/admin/login"
                    className="text-xs text-stone-500 hover:text-stone-800 transition-colors inline-flex items-center gap-1 font-medium"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Cancel & Return to Sign In
                  </Link>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
