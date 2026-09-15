import { supabaseAdmin } from "@/lib/supabase";
import { StatsSnapshot } from "@/lib/connectors/types";

export interface StatsRow {
  snapshot_date: string;
  clicks: number;
  registrations: number;
  ftd_count: number;
  ftd_amount: number;
  revenue: number;
}

export async function listStatsForOffer(offerId: string): Promise<StatsRow[]> {
  const { data, error } = await supabaseAdmin()
    .from("stats_snapshots")
    .select("snapshot_date, clicks, registrations, ftd_count, ftd_amount, revenue")
    .eq("offer_id", offerId)
    .order("snapshot_date", { ascending: true });

  if (error) throw error;
  return data;
}

// upsert по (offer_id, snapshot_date): повторный запуск за тот же день
// перезаписывает снимок, а не плодит дубликаты.
export async function saveSnapshot(
  offerId: string,
  date: string,
  snapshot: StatsSnapshot
): Promise<void> {
  const { error } = await supabaseAdmin()
    .from("stats_snapshots")
    .upsert(
      {
        offer_id: offerId,
        snapshot_date: date,
        clicks: snapshot.clicks,
        registrations: snapshot.registrations,
        ftd_count: snapshot.ftdCount,
        ftd_amount: snapshot.ftdAmount,
        revenue: snapshot.revenue,
      },
      { onConflict: "offer_id,snapshot_date" }
    );

  if (error) throw error;
}
