"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Briefcase,
  FolderGit2,
  Users,
  CreditCard,
  Image as ImageIcon,
  MessageSquareQuote,
  UserCheck,
  FileText,
  Mail,
  BarChart3,
  Settings,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  X,
  ExternalLink,
} from "lucide-react";
import type { AdminTabType } from "@/types";

interface AdminSidebarProps {
  activeTab: AdminTabType;
  onTabChange: (tab: AdminTabType) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  pendingCount?: number;
  unreadNotifsCount?: number;
}

interface NavItem {
  id: AdminTabType;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
  pendingCount = 0,
  unreadNotifsCount = 0,
}) => {
  const navSections: { title?: string; items: NavItem[] }[] = [
    {
      items: [
        { id: "dashboard", label: "Studio Command", icon: LayoutDashboard },
        {
          id: "consultations",
          label: "Consultations",
          icon: Clock,
          badge: pendingCount > 0 ? pendingCount : undefined,
          badgeColor: "bg-amber-100 text-amber-900 border-amber-200",
        },
        { id: "calendar", label: "Calendar & Hours", icon: Calendar },
      ],
    },
    {
      title: "Studio Operations",
      items: [
        { id: "services", label: "Services & Tiers", icon: Briefcase },
        { id: "projects", label: "Portfolio Projects", icon: FolderGit2 },
        { id: "clients", label: "Client Directory", icon: Users },
        { id: "payments", label: "Payments & Safepay", icon: CreditCard },
        { id: "media", label: "Media Library", icon: ImageIcon },
      ],
    },
    {
      title: "Content & Atelier",
      items: [
        { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
        { id: "team", label: "Studio Team", icon: UserCheck },
        { id: "content", label: "Content CMS & FAQs", icon: FileText },
        { id: "communications", label: "Communications", icon: Mail },
      ],
    },
    {
      title: "Intelligence & Admin",
      items: [
        { id: "analytics", label: "Studio Analytics", icon: BarChart3 },
        { id: "settings", label: "Studio Settings", icon: Settings },
        { id: "audit", label: "Audit Trail", icon: ShieldAlert },
      ],
    },
  ];

  const handleSelect = (id: AdminTabType) => {
    onTabChange(id);
    onMobileClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-stone-950/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#FCF8F8] border-r border-stone-200/90 transition-all duration-300 font-inter ${
          mobileOpen
            ? "translate-x-0 w-72"
            : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-stone-200/80 bg-stone-50/50">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 overflow-hidden focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[#1C1B1B] flex items-center justify-center text-[#D4AF37] font-playfair font-bold text-base shrink-0 shadow-xs">
              M
            </div>
            {(!isCollapsed || mobileOpen) && (
              <div className="flex flex-col">
                <span className="font-playfair text-sm font-semibold tracking-wide text-stone-900 leading-tight">
                  MARK Architects
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#7E5714]">
                  Studio Atelier
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Button */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={onMobileClose}
            className="lg:hidden p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {section.title && (!isCollapsed || mobileOpen) && (
                <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-stone-400 font-mono">
                  {section.title}
                </div>
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer text-left group ${
                      isActive
                        ? "bg-[#1C1B1B] text-white shadow-xs font-semibold"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-200/50"
                    }`}
                    title={isCollapsed && !mobileOpen ? item.label : undefined}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isActive
                          ? "text-[#D4AF37]"
                          : "text-stone-500 group-hover:text-stone-800"
                      }`}
                    />

                    {(!isCollapsed || mobileOpen) && (
                      <span className="truncate flex-1">{item.label}</span>
                    )}

                    {(!isCollapsed || mobileOpen) &&
                      item.badge !== undefined && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full border ${
                            item.badgeColor ||
                            "bg-stone-100 text-stone-700 border-stone-200"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Public Website Footer Link */}
        <div className="p-3 border-t border-stone-200/80 bg-stone-50/50">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 hover:text-stone-900 text-xs font-medium transition-all shadow-2xs group"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#7E5714] group-hover:scale-110 transition-transform" />
            {(!isCollapsed || mobileOpen) && (
              <span>Live Architecture Website</span>
            )}
          </Link>
        </div>
      </aside>
    </>
  );
};
