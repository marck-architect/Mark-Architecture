"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Bell, Search, ExternalLink, LogOut, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import type { AdminTabType, AdminNotification } from "@/types";

interface AdminTopNavProps {
  adminEmail: string;
  activeTab: AdminTabType;
  onMobileMenuOpen: () => void;
  notifications: AdminNotification[];
  onMarkNotificationsRead: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const AdminTopNav: React.FC<AdminTopNavProps> = ({
  adminEmail,
  activeTab,
  onMobileMenuOpen,
  notifications,
  onMarkNotificationsRead,
  searchQuery,
  onSearchChange,
}) => {
  const router = useRouter();
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
    router.push("/markarchit/admin/login");
    router.refresh();
  };

  const getTabBreadcrumb = () => {
    switch (activeTab) {
      case "dashboard":
        return "Studio Command Center";
      case "consultations":
        return "Consultation Appointments & Review";
      case "calendar":
        return "Calendar & Availability Settings";
      case "services":
        return "Architectural Services & Tiers";
      case "projects":
        return "Portfolio Projects & Case Studies";
      case "collection":
        return "Architectural Products Catalog";
      case "clients":
        return "Client Directory & Historical Records";
      case "payments":
        return "Payments & Safepay Gateway Verification";
      case "media":
        return "Atelier Media & Asset Library";
      case "testimonials":
        return "Client Testimonials & Reviews";
      case "team":
        return "Studio Architects & Leadership";
      case "content":
        return "Website CMS & FAQs";
      case "communications":
        return "Communications & Email Invitations";
      case "analytics":
        return "Studio Performance Analytics";
      case "settings":
        return "Studio & Gateway Configuration";
      case "audit":
        return "Administrative Audit Trail";
      default:
        return "Admin Atelier";
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#FCF8F8]/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 flex items-center justify-between gap-4 font-inter">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden p-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:text-stone-900 shadow-2xs cursor-pointer"
          aria-label="Open Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium">
            <span>Admin</span>
            <span>/</span>
            <span className="capitalize">
              {activeTab === "collection" ? "Products" : activeTab}
            </span>
          </div>
          <h1 className="font-playfair text-sm sm:text-base font-bold text-stone-900 truncate">
            {getTabBreadcrumb()}
          </h1>
        </div>
      </div>

      {/* Right: Search, Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Quick search..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#7E5714] focus:ring-1 focus:ring-[#7E5714]/20 shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifsOpen(!notifsOpen);
              setUserDropdownOpen(false);
            }}
            className="relative p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 shadow-2xs transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#7E5714] text-white text-[9px] font-bold font-mono flex items-center justify-center shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {notifsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-fadeIn">
              <div className="p-3.5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#7E5714]" />
                  <span className="font-playfair text-xs font-bold text-stone-900">
                    Notifications ({notifications.length})
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkNotificationsRead}
                    className="text-[10px] text-[#7E5714] font-medium hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-stone-100 p-1">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-xl transition-colors text-xs space-y-1 ${
                        n.is_read ? "opacity-75" : "bg-amber-50/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-stone-900">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono shrink-0">
                          {new Date(n.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-stone-600 leading-relaxed text-[11px]">
                        {n.message}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-stone-400">
                    No active notifications.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Logout */}
        <div className="relative">
          <button
            onClick={() => {
              setUserDropdownOpen(!userDropdownOpen);
              setNotifsOpen(false);
            }}
            className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 shadow-2xs transition-all cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-[#1C1B1B] text-[#D4AF37] flex items-center justify-center text-xs font-bold font-playfair shadow-2xs">
              {adminEmail.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline-block text-xs font-medium text-stone-800 max-w-[120px] truncate">
              {adminEmail}
            </span>
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 p-1.5 animate-fadeIn text-xs">
              <div className="px-3 py-2 border-b border-stone-100 mb-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 block">
                  Signed in as
                </span>
                <span className="font-medium text-stone-900 truncate block">
                  {adminEmail}
                </span>
              </div>

              <Link
                href="/"
                target="_blank"
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-stone-700 hover:bg-stone-50 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#7E5714]" />
                <span>View Public Site</span>
              </Link>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer text-left"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
