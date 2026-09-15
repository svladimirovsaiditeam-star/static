import { supabaseAdmin } from "@/lib/supabase";
import { Network } from "@/lib/connectors/types";

export type OfferStatus = "active" | "archived";

export interface OfferRow {
  id: string;
  name: string;
  network: Network;
  cabinet_url: string | null;
  start_date: string;
  status: OfferStatus;
  created_at: string;
  archived_at: string | null;
}

export async function listOffers(): Promise<OfferRow[]> {
  const { data, error } = await supabaseAdmin()
    .from("offers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function listActiveOffers(): Promise<OfferRow[]> {
  const { data, error } = await supabaseAdmin()
    .from("offers")
    .select("*")
    .eq("status", "active");

  if (error) throw error;
  return data;
}

export async function createOffer(input: {
  name: string;
  network: Network;
  cabinet_url: string;
  start_date: string;
}): Promise<OfferRow> {
  const { data, error } = await supabaseAdmin()
    .from("offers")
    .insert({
      name: input.name,
      network: input.network,
      cabinet_url: input.cabinet_url || null,
      start_date: input.start_date,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function archiveOffer(id: string): Promise<void> {
  const { error } = await supabaseAdmin()
    .from("offers")
    .update({ status: "archived", archived_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
}
