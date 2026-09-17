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
  RefreshCw,
  Mail,
  ShieldCheck,
} from "lucide-react";

export const AdminResetPasswordView: React.FC = () => {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingLink, setIsVerifyingLink] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Quick resend / OTP code state
  const defaultAdminEmail =
    process.env.NEXT_PUBLIC_ADMIN_EMAIL || "markarchitects.web@gmail.com";
  const [resendEmail, setResendEmail] = useState(defaultAdminEmail);
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  // Direct OTP entry
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const parseAndEstablishSession = async () => {
      try {
        if (typeof window === "undefined") return;

        // 1. First check if a session is already established on the client
        const {
          data: { session: existingSession },
        } = await supabase.auth.getSession();

        if (existingSession && isMounted) {
          setHasValidSession(true);
          setIsVerifyingLink(false);
        }

        const url = new URL(window.location.href);

        // 2. Check for error parameters in search query or hash fragment
        const searchErrorCode = url.searchParams.get("error_code");
        const searchError =
          url.searchParams.get("error_description") ||
          url.searchParams.get("error");

        let hashError: string | null = null;
        let hashErrorCode: string | null = null;

        if (window.location.hash.includes("error")) {
          const hashParams = new URLSearchParams(
            window.location.hash.substring(1),
          );
          hashError =
            hashParams.get("error_description") || hashParams.get("error");
          hashErrorCode = hashParams.get("error_code");
        }

        const detectedErrorCode = searchErrorCode || hashErrorCode;
        const detectedError = searchError || hashError;

        if (detectedError && !existingSession) {
          if (isMounted) {
            if (
              detectedErrorCode === "otp_expired" ||
              detectedError.toLowerCase().includes("expired") ||
              detectedError.toLowerCase().includes("invalid")
            ) {
              setErrorMessage(
                "Your password reset email link has expired or has already been used. Please request a fresh reset link below or verify via a 6-digit code.",
              );
            } else {
              setErrorMessage(decodeURIComponent(detectedError));
            }
            setIsVerifyingLink(false);
          }
          return;
        }

        // 3. Check for PKCE Authorization Code in query params (?code=...)
        const code = url.searchParams.get("code");
        if (code) {
          const { data, error } =
            await supabase.auth.exchangeCodeForSession(code);
          if (!error && data?.session) {
            if (isMounted) {
              setHasValidSession(true);
              setErrorMessage(null);
              setIsVerifyingLink(false);
            }
            return;
          } else if (error) {
            console.warn(
              "[Reset Password] exchangeCodeForSession error:",
              error.message,
            );
          }
        }

        // 4. Check for Token Hash in query params (?token_hash=...&type=recovery)
        const tokenHash = url.searchParams.get("token_hash");
        if (tokenHash) {
          const type =
            (url.searchParams.get("type") as "recovery") || "recovery";
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type,
          });
          if (!error && data?.session) {
            if (isMounted) {
              setHasValidSession(true);
              setErrorMessage(null);
              setIsVerifyingLink(false);
            }
            return;
          } else if (error) {
            console.warn("[Reset Password] verifyOtp error:", error.message);
          }
        }

        // 5. Check for Access Token in Hash fragment (#access_token=...&refresh_token=...)
        if (window.location.hash.includes("access_token")) {
          const hashParams = new URLSearchParams(
            window.location.hash.substring(1),
          );
          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token");

          if (accessToken && refreshToken) {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (!error && data?.session) {
              if (isMounted) {
                setHasValidSession(true);
                setErrorMessage(null);
                setIsVerifyingLink(false);
              }
              return;
            }
          }
        }

        // 6. Listen for auth state changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, currentSession) => {
          if (
            (event === "PASSWORD_RECOVERY" ||
              event === "SIGNED_IN" ||
              currentSession) &&
            isMounted
          ) {
            setHasValidSession(true);
            setErrorMessage(null);
            setIsVerifyingLink(false);
          }
        });

        // Grace period fallback
        setTimeout(() => {
          if (isMounted) {
            setIsVerifyingLink(false);
          }
        }, 1200);

        return () => {
          subscription.unsubscribe();
        };
      } catch (err: unknown) {
        console.error("[Reset Password] Error establishing session:", err);
        if (isMounted) {
          setIsVerifyingLink(false);
        }
      }
    };

    parseAndEstablishSession();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  // Request a fresh reset link directly from this page
  const handleResendResetEmail = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!resendEmail || !resendEmail.includes("@")) {
      setErrorMessage("Please provide a valid administrator email address.");
      return;
    }

    setIsResending(true);
    setResendStatus(null);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/admin/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (res.ok) {
        setResendStatus(
          data.message ||
            `A fresh password reset link has been dispatched to ${resendEmail}. Please open the newest email immediately.`,
        );
      } else {
        setErrorMessage(
          data.error || "Failed to send reset email. Please verify the email.",
        );
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while requesting reset link.",
      );
    } finally {
      setIsResending(false);
    }
  };

  // Verify direct 6-digit OTP code if received
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) return;

    setIsVerifyingOtp(true);
    setErrorMessage(null);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: resendEmail.trim().toLowerCase(),
        token: otpCode.trim(),
        type: "recovery",
      });

      if (error) {
        setErrorMessage(
          error.message || "Invalid or expired verification code.",
        );
      } else if (data?.session) {
        setHasValidSession(true);
        setShowOtpInput(false);
        setErrorMessage(null);
        setSuccessMessage(
          "Code verified successfully! Enter your new password below.",
        );
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to verify code.",
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  };

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
      // First verify if we have a valid session before updating
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session && !hasValidSession) {
        setErrorMessage(
          "No active recovery session was detected. Please request a fresh reset link below or enter your verification code.",
        );
        setIsLoading(false);
        return;
      }

      // Update password in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setErrorMessage(
          error.message ||
            "Unable to update password. Your reset link may have expired.",
        );
        setIsLoading(false);
        return;
      }

      setSuccessMessage(
        "Password successfully updated! Redirecting to Studio Command Center...",
      );
      setIsLoading(false);

      // Redirect after confirmation
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
            Set New Administrator Password
          </p>
          <p className="text-xs text-stone-500 mt-2">
            Establish new administrator credentials for the Atelier Command
            Center.
          </p>
        </div>

        {/* Verifying Token Banner */}
        {isVerifyingLink && (
          <div className="mb-6 p-3.5 bg-amber-50/70 border border-amber-200/70 rounded-xl text-xs text-[#7E5714] flex items-center gap-2.5">
            <Loader2 className="w-4 h-4 animate-spin shrink-0 text-[#7E5714]" />
            <span>Verifying secure reset credentials...</span>
          </div>
        )}

        {/* Resend Status Banner */}
        {resendStatus && (
          <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-start gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="block font-semibold mb-0.5">
                Link Dispatched
              </span>
              <span className="block leading-relaxed">{resendStatus}</span>
            </div>
          </div>
        )}

        {/* Error Alert with One-Click Resend and OTP options */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs flex flex-col gap-3 animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="block font-semibold mb-1">
                  Reset Link Notice
                </span>
                <span className="block leading-relaxed text-rose-800">
                  {errorMessage}
                </span>
              </div>
            </div>

            {/* Quick Action Box */}
            <div className="pt-3 border-t border-rose-200/70 flex flex-col gap-2">
              <p className="text-[11px] text-rose-700 font-medium">
                Request a fresh reset link for:
              </p>
              <div className="flex gap-2 items-center">
                <input
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="flex-1 px-3 py-2 bg-white border border-rose-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-[#7E5714]"
                />
                <button
                  type="button"
                  onClick={() => handleResendResetEmail()}
                  disabled={isResending}
                  className="px-3.5 py-2 bg-[#7E5714] hover:bg-[#684710] text-white rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-60 transition-colors"
                >
                  {isResending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  <span>Send Fresh Link</span>
                </button>
              </div>

              <div className="mt-1 flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={() => setShowOtpInput(!showOtpInput)}
                  className="text-[#7E5714] font-medium hover:underline cursor-pointer"
                >
                  {showOtpInput
                    ? "Hide code verification"
                    : "Or enter 6-digit code from email"}
                </button>
                <Link
                  href="/admin/login"
                  className="text-stone-500 hover:text-stone-800 transition-colors font-medium"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Direct OTP Input Form */}
        {showOtpInput && !hasValidSession && (
          <form
            onSubmit={handleVerifyOtp}
            className="mb-6 p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3 animate-fadeIn"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
              <KeyRound className="w-4 h-4 text-[#7E5714]" />
              <span>Verify 6-Digit Email Code</span>
            </div>
            <p className="text-[11px] text-stone-500">
              If your reset email contained a 6-digit verification code or
              token, enter it here:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="e.g. 123456"
                className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs tracking-widest font-mono text-stone-900 focus:outline-none focus:border-[#7E5714]"
              />
              <button
                type="submit"
                disabled={isVerifyingOtp || !otpCode.trim()}
                className="px-3.5 py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-lg shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isVerifyingOtp ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span>Verify</span>
              </button>
            </div>
          </form>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs flex items-start gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-950 mb-0.5">Success</p>
              <p>{successMessage}</p>
            </div>
          </div>
        )}

        {/* Password Reset Form */}
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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

        {/* Footer info note */}
        <div className="mt-8 pt-6 border-t border-stone-100 text-center">
          <p className="text-[11px] text-stone-400 leading-relaxed">
            Public registration is disabled. Administrator access is restricted
            to authorized credentials only.
          </p>
        </div>
      </div>
    </div>
  );
};
