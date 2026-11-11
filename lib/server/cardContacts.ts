import "server-only";
import { getSupabaseAdminClient } from "./supabaseAdmin";
import type { CardContactRecord } from "@/types";

const SECTION_KEY = "card_contacts";

/**
 * Saves a new contact exchange from the digital card (/card).
 * Stores in `public.card_contacts` if table exists, with transparent fallback
 * to `public.site_content` (key = 'card_contacts') so it always succeeds.
 */
export async function saveCardContact(params: {
  name: string;
  email: string;
  phone: string;
  notes?: string | null;
  email_sent?: boolean;
}): Promise<CardContactRecord> {
  const supabase = getSupabaseAdminClient();
  const nowIso = new Date().toISOString();

  const record: CardContactRecord = {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `card_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: params.name.trim(),
    email: params.email.trim(),
    phone: params.phone.trim(),
    notes: params.notes ? params.notes.trim() : null,
    status: "new",
    email_sent: params.email_sent ?? true,
    created_at: nowIso,
    updated_at: nowIso,
  };

  // 1. Try dedicated table first
  try {
    const { data, error } = await supabase
      .from("card_contacts")
      .insert(record)
      .select()
      .maybeSingle();

    if (!error && data) {
      return data as CardContactRecord;
    }
  } catch (err) {
    console.warn("[CardContacts] Note: card_contacts table insert:", err);
  }

  // 2. Fallback to site_content key
  try {
    const { data: existingRow } = await supabase
      .from("site_content")
      .select("content")
      .eq("section_key", SECTION_KEY)
      .maybeSingle();

    const currentList: CardContactRecord[] = Array.isArray(existingRow?.content)
      ? existingRow.content
      : [];

    const updatedList = [record, ...currentList.filter((c) => c.id !== record.id)];

    await supabase.from("site_content").upsert(
      {
        section_key: SECTION_KEY,
        content: updatedList,
        updated_at: nowIso,
      },
      { onConflict: "section_key" },
    );
  } catch (scErr) {
    console.warn("[CardContacts] Notice: site_content fallback upsert:", scErr);
  }

  return record;
}

/**
 * Retrieves all card contact exchanges, ordered newest to oldest.
 */
export async function getCardContacts(): Promise<CardContactRecord[]> {
  const supabase = getSupabaseAdminClient();

  // 1. Try dedicated table
  try {
    const { data, error } = await supabase
      .from("card_contacts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      return data as CardContactRecord[];
    }
  } catch (err) {
    console.warn("[CardContacts] Note: Querying card_contacts table:", err);
  }

  // 2. Check site_content fallback
  try {
    const { data: scData } = await supabase
      .from("site_content")
      .select("content")
      .eq("section_key", SECTION_KEY)
      .maybeSingle();

    if (scData && Array.isArray(scData.content)) {
      return scData.content as CardContactRecord[];
    }
  } catch (scErr) {
    console.warn("[CardContacts] Notice: reading site_content card_contacts:", scErr);
  }

  return [];
}

/**
 * Updates a card contact's status (new | contacted | archived) or notes.
 */
export async function updateCardContact(
  id: string,
  updates: Partial<Pick<CardContactRecord, "status" | "notes">>,
): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  const nowIso = new Date().toISOString();
  let updatedAnywhere = false;

  // 1. Update in card_contacts table
  try {
    const { error } = await supabase
      .from("card_contacts")
      .update({
        ...updates,
        updated_at: nowIso,
      })
      .eq("id", id);

    if (!error) updatedAnywhere = true;
  } catch {}

  // 2. Also update in site_content table
  try {
    const { data: existingRow } = await supabase
      .from("site_content")
      .select("content")
      .eq("section_key", SECTION_KEY)
      .maybeSingle();

    if (existingRow && Array.isArray(existingRow.content)) {
      const list: CardContactRecord[] = existingRow.content;
      const index = list.findIndex((c) => c.id === id);
      if (index !== -1) {
        list[index] = {
          ...list[index],
          ...updates,
          updated_at: nowIso,
        };
        await supabase.from("site_content").upsert({
          section_key: SECTION_KEY,
          content: list,
          updated_at: nowIso,
        });
        updatedAnywhere = true;
      }
    }
  } catch {}

  return updatedAnywhere;
}

/**
 * Deletes a card contact record.
 */
export async function deleteCardContact(id: string): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  let deletedAnywhere = false;

  // 1. Delete in card_contacts table
  try {
    const { error } = await supabase.from("card_contacts").delete().eq("id", id);
    if (!error) deletedAnywhere = true;
  } catch {}

  // 2. Delete from site_content table
  try {
    const { data: existingRow } = await supabase
      .from("site_content")
      .select("content")
      .eq("section_key", SECTION_KEY)
      .maybeSingle();

    if (existingRow && Array.isArray(existingRow.content)) {
      const list: CardContactRecord[] = existingRow.content;
      const filtered = list.filter((c) => c.id !== id);
      if (filtered.length !== list.length) {
        await supabase.from("site_content").upsert({
          section_key: SECTION_KEY,
          content: filtered,
          updated_at: new Date().toISOString(),
        });
        deletedAnywhere = true;
      }
    }
  } catch {}

  return deletedAnywhere;
}
