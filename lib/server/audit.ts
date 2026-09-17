import "server-only";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export interface LogAdminActionParams {
  adminEmail: string;
  action: string;
  entity: string;
  entityId: string;
  metadata?: Record<string, unknown>;
}

/**
 * Records an immutable administrative action into Supabase audit_logs.
 * Non-blocking: logs warnings if database schema is waiting for table creation.
 */
export async function logAdminAction({
  adminEmail,
  action,
  entity,
  entityId,
  metadata,
}: LogAdminActionParams): Promise<void> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    await supabase.from("audit_logs").insert({
      admin_email: adminEmail,
      action,
      entity,
      entity_id: entityId,
      metadata: metadata || null,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn(
      `[AuditLog] Non-fatal: unable to record action ${action} for ${entity}:${entityId}`,
      err,
    );
  }
}
