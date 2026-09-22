import type {
  ConsultationRecord,
  OrderRecord,
  AvailabilitySettings,
  BlockedDate,
  AdminProject,
  AdminClient,
  AdminTestimonial,
  AdminTeamMember,
  AdminFaq,
  AdminNotification,
  CommunicationLog,
  AuditLogEntry,
  AdminService,
  MediaAsset,
} from "@/types";

export const seedConsultations: ConsultationRecord[] = [];

export const seedOrders: OrderRecord[] = [];

export const seedAvailabilitySettings: AvailabilitySettings = {
  working_days: [1, 2, 3, 4, 5, 6], // Monday through Saturday
  start_time: "10:00",
  end_time: "19:00",
  slot_durations: [30, 60],
  buffer_minutes: 15,
  timezone: "Asia/Karachi",
  max_per_day: 6,
};

export const seedBlockedDates: BlockedDate[] = [];

export const seedProjects: AdminProject[] = [];

export const seedClients: AdminClient[] = [];

export const seedTestimonials: AdminTestimonial[] = [];

export const seedTeamMembers: AdminTeamMember[] = [];

export const seedFaqs: AdminFaq[] = [];

export const seedNotifications: AdminNotification[] = [];

export const seedCommunicationLogs: CommunicationLog[] = [];

export const seedAuditLogs: AuditLogEntry[] = [];

export const seedServices: AdminService[] = [];

export const seedMediaAssets: MediaAsset[] = [];
