export type Network = "leon" | "1xbet";

export interface Offer {
  id: string;
  name: string;
  network: Network;
  cabinet_url: string | null;
}

export interface StatsSnapshot {
  clicks: number;
  registrations: number;
  ftdCount: number;
  ftdAmount: number;
  revenue: number;
}

export interface StatsConnector {
  getStats(offer: Offer): Promise<StatsSnapshot>;
}
