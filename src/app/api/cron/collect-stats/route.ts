import { NextRequest, NextResponse } from "next/server";
import { listActiveOffers } from "@/lib/db/offers";
import { saveSnapshot } from "@/lib/db/stats";
import { getConnector } from "@/lib/connectors";

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const offers = await listActiveOffers();

  const results = await Promise.allSettled(
    offers.map(async (offer) => {
      const connector = getConnector(offer.network);
      const snapshot = await connector.getStats({
        id: offer.id,
        name: offer.name,
        network: offer.network,
        cabinet_url: offer.cabinet_url,
      });
      await saveSnapshot(offer.id, today, snapshot);
      return offer.id;
    })
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  const failed = results
    .map((r, i) => ({ r, offer: offers[i] }))
    .filter(({ r }) => r.status === "rejected")
    .map(({ r, offer }) => ({
      offerId: offer.id,
      offerName: offer.name,
      error: r.status === "rejected" ? String(r.reason) : "",
    }));

  return NextResponse.json({ date: today, total: offers.length, succeeded, failed });
}
