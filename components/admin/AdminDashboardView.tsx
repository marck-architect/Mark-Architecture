"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AdminSidebar } from "./layout/AdminSidebar";
import { AdminTopNav } from "./layout/AdminTopNav";
import { DashboardOverview } from "./dashboard/DashboardOverview";
import { ConsultationsManager } from "./consultations/ConsultationsManager";
import { CalendarManager } from "./calendar/CalendarManager";
import { ServicesManager } from "./services/ServicesManager";
import { PricingManager } from "./pricing/PricingManager";
import { ProjectsManager } from "./projects/ProjectsManager";
import { CollectionManager } from "./collection/CollectionManager";
import { ClientsManager } from "./clients/ClientsManager";
import { PaymentsManager } from "./payments/PaymentsManager";
import { MediaLibraryManager } from "./media/MediaLibraryManager";
import { TestimonialsManager } from "./testimonials/TestimonialsManager";
import { TeamManager } from "./team/TeamManager";
import { ContentManager } from "./content/ContentManager";
import { CommunicationsManager } from "./communications/CommunicationsManager";
import { AnalyticsView } from "./analytics/AnalyticsView";
import { SettingsManager } from "./settings/SettingsManager";
import { AuditLogsView } from "./audit/AuditLogsView";
import { BookingDetailModal } from "./BookingDetailModal";
import type {
  ConsultationRecord,
  OrderRecord,
  AdminTabType,
  AdminNotification,
  AdminProject,
  AdminService,
  AvailabilitySettings,
  BlockedDate,
  AdminDashboardViewProps,
} from "@/types";
import { seedAvailabilitySettings } from "@/data/adminSeed";

const VALID_TABS: AdminTabType[] = [
  "dashboard",
  "consultations",
  "calendar",
  "services",
  "pricing",
  "projects",
  "collection",
  "clients",
  "payments",
  "media",
  "testimonials",
  "team",
  "content",
  "communications",
  "analytics",
  "settings",
  "audit",
];

function AdminDashboardInner({
  initialConsultations,
  initialOrders,
  adminEmail = "admin@markarchitects.com",
}: AdminDashboardViewProps) {
  const searchParams = useSearchParams();

  // Core Consultation & Order Data
  const [consultations, setConsultations] = useState<ConsultationRecord[]>(
    initialConsultations || [],
  );
  const [orders] = useState<OrderRecord[]>(initialOrders || []);

  // Studio Services & Portfolio Data
  const [services, setServices] = useState<AdminService[]>([]);
  const [projects, setProjects] = useState<AdminProject[]>([]);

  // Calendar & Availability Data
  const [availabilitySettings, setAvailabilitySettings] =
    useState<AvailabilitySettings>(seedAvailabilitySettings);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);

  // Layout & Navigation State
  const initialTab = (searchParams.get("tab") as AdminTabType) || "dashboard";
  const [activeTab, setActiveTab] = useState<AdminTabType>(
    VALID_TABS.includes(initialTab) ? initialTab : "dashboard",
  );
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Global Search in Topbar
  const [globalSearch, setGlobalSearch] = useState("");

  // Notifications State
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  // Inspection Modal
  const [selectedBooking, setSelectedBooking] =
    useState<ConsultationRecord | null>(null);

  // Fetch initial dynamic data from APIs (with graceful fallback to seeds)
  useEffect(() => {
    // Services
    fetch("/api/admin/services")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.services?.length > 0) setServices(data.services);
      })
      .catch(() => {});

    // Projects
    fetch("/api/admin/projects")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.projects?.length > 0) setProjects(data.projects);
      })
      .catch(() => {});

    // Availability
    fetch("/api/admin/availability")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.settings) setAvailabilitySettings(data.settings);
      })
      .catch(() => {});

    // Blocked dates
    fetch("/api/admin/blocked-dates")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.blocked_dates) setBlockedDates(data.blocked_dates);
      })
      .catch(() => {});
  }, []);

  // Sync tab change with URL without hard refresh
  const handleTabChange = (tab: AdminTabType) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (tab === "dashboard") {
        url.searchParams.delete("tab");
      } else {
        url.searchParams.set("tab", tab);
      }
      window.history.pushState({}, "", url.toString());
    }
  };

  // Listen to popstate (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const currentTab = new URL(window.location.href).searchParams.get(
        "tab",
      ) as AdminTabType;
      if (currentTab && VALID_TABS.includes(currentTab)) {
        setActiveTab(currentTab);
      } else {
        setActiveTab("dashboard");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Update Booking handler
  const handleBookingUpdate = (updated: ConsultationRecord) => {
    setConsultations((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c)),
    );
    setSelectedBooking(updated);
  };

  // Services handlers
  const handleSaveService = async (serviceData: Partial<AdminService>) => {
    if (serviceData.id) {
      // Update
      setServices((prev) =>
        prev.map((s) =>
          s.id === serviceData.id
            ? ({ ...s, ...serviceData } as AdminService)
            : s,
        ),
      );
      try {
        await fetch(`/api/admin/services/${serviceData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(serviceData),
        });
      } catch {}
    } else {
      // Create
      const newService: AdminService = {
        id: `srv_${Date.now()}`,
        slug: serviceData.slug || "new-service",
        title: serviceData.title || "Untitled Service",
        category: serviceData.category || "Advisory",
        short_description: serviceData.short_description || "",
        image_url:
          serviceData.image_url || "/images/Full House Design Package.png",
        pricing_type: serviceData.pricing_type || "flat",
        popularity_rank: services.length + 1,
        is_active: serviceData.is_active ?? true,
      };
      setServices((prev) => [...prev, newService]);
      try {
        await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(serviceData),
        });
      } catch {}
    }
  };

  const handleDeleteService = async (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    try {
      await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    } catch {}
  };

  // Projects handlers
  const handleSaveProject = async (projectData: Partial<AdminProject>) => {
    if (projectData.id) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectData.id
            ? ({ ...p, ...projectData } as AdminProject)
            : p,
        ),
      );
      try {
        await fetch(`/api/admin/projects/${projectData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData),
        });
      } catch {}
    } else {
      const newProj: AdminProject = {
        id: `proj_${Date.now()}`,
        title: projectData.title || "Untitled Case Study",
        slug: projectData.slug || "untitled-case-study",
        category: projectData.category || "residential",
        location: projectData.location || "Lahore, Pakistan",
        year: projectData.year || new Date().getFullYear().toString(),
        description: projectData.description || "",
        cover_image:
          projectData.cover_image || "/images/Full House Design Package.png",
        gallery_urls: projectData.gallery_urls || [],
        is_featured: projectData.is_featured ?? false,
        is_published: projectData.is_published ?? true,
        display_order: projects.length + 1,
      };
      setProjects((prev) => [newProj, ...prev]);
      try {
        await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData),
        });
      } catch {}
    }
  };

  const handleDeleteProject = async (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    } catch {}
  };

  // Calendar Availability handlers
  const handleUpdateAvailability = async (settings: AvailabilitySettings) => {
    setAvailabilitySettings(settings);
    try {
      await fetch("/api/admin/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
    } catch {}
  };

  const handleAddBlockedDate = async (
    date: string,
    reason: string,
    isFullDay: boolean,
  ) => {
    const newBlock: BlockedDate = {
      id: `block_${Date.now()}`,
      date,
      reason,
      is_full_day: isFullDay,
    };
    setBlockedDates((prev) => [...prev, newBlock]);
    try {
      await fetch("/api/admin/blocked-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, reason, is_full_day: isFullDay }),
      });
    } catch {}
  };

  const handleDeleteBlockedDate = async (id: string) => {
    setBlockedDates((prev) => prev.filter((b) => b.id !== id));
    try {
      await fetch(`/api/admin/blocked-dates/${id}`, { method: "DELETE" });
    } catch {}
  };

  // Mark notifications read
  const handleMarkNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  // Pending Count for badges
  const pendingCount = useMemo(() => {
    return consultations.filter(
      (c) => c.payment_status === "pending" || !c.confirmed_by_admin,
    ).length;
  }, [consultations]);

  const unreadNotifsCount = useMemo(() => {
    return notifications.filter((n) => !n.is_read).length;
  }, [notifications]);

  return (
    <div className="min-h-screen flex bg-[#FCF8F8] text-[#1C1B1B]">
      {/* Collapsible / Responsive Drawer Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        pendingCount={pendingCount}
        unreadNotifsCount={unreadNotifsCount}
      />

      {/* Main Content Area - offset by compact sidebar width so page layout never jumps */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:pl-20">
        {/* Modern Topbar */}
        <AdminTopNav
          adminEmail={adminEmail}
          activeTab={activeTab}
          onMobileMenuOpen={() => setMobileSidebarOpen(true)}
          notifications={notifications}
          onMarkNotificationsRead={handleMarkNotificationsRead}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && (
            <DashboardOverview
              consultations={consultations}
              orders={orders}
              projects={projects}
              services={services}
              onNavigateTab={handleTabChange}
              onInspectConsultation={setSelectedBooking}
            />
          )}

          {activeTab === "consultations" && (
            <ConsultationsManager
              consultations={consultations}
              onInspect={setSelectedBooking}
            />
          )}

          {activeTab === "calendar" && (
            <CalendarManager
              consultations={consultations}
              availabilitySettings={availabilitySettings}
              blockedDates={blockedDates}
              onInspectBooking={setSelectedBooking}
              onUpdateAvailability={handleUpdateAvailability}
              onAddBlockedDate={handleAddBlockedDate}
              onDeleteBlockedDate={handleDeleteBlockedDate}
            />
          )}

          {activeTab === "services" && (
            <ServicesManager
              services={services}
              onSaveService={handleSaveService}
              onDeleteService={handleDeleteService}
            />
          )}

          {activeTab === "pricing" && <PricingManager />}

          {activeTab === "projects" && (
            <ProjectsManager
              projects={projects}
              onSaveProject={handleSaveProject}
              onDeleteProject={handleDeleteProject}
            />
          )}

          {activeTab === "collection" && <CollectionManager />}

          {activeTab === "clients" && (
            <ClientsManager consultations={consultations} orders={orders} />
          )}

          {activeTab === "payments" && (
            <PaymentsManager consultations={consultations} orders={orders} />
          )}

          {activeTab === "media" && <MediaLibraryManager />}

          {activeTab === "testimonials" && <TestimonialsManager />}

          {activeTab === "team" && <TeamManager />}

          {activeTab === "content" && <ContentManager />}

          {activeTab === "communications" && <CommunicationsManager />}

          {activeTab === "analytics" && (
            <AnalyticsView consultations={consultations} orders={orders} />
          )}

          {activeTab === "settings" && (
            <SettingsManager adminEmail={adminEmail} />
          )}

          {activeTab === "audit" && <AuditLogsView />}
        </main>
      </div>

      {/* Consultation / Booking Inspection & Payment Dispatch Modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdate={handleBookingUpdate}
        />
      )}
    </div>
  );
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = (
  props,
) => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FCF8F8] text-stone-500 font-mono text-xs">
          Loading Atelier Command Center...
        </div>
      }
    >
      <AdminDashboardInner {...props} />
    </Suspense>
  );
};
