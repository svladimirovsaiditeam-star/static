"use client";

import { Fragment, useState, useTransition } from "react";
import { OfferRow } from "@/lib/db/offers";
import { StatsRow } from "@/lib/db/stats";
import { archiveOfferAction, getOfferStatsAction } from "@/app/actions";
import { OfferStatsPanel } from "./OfferStatsPanel";

const NETWORK_LABEL: Record<string, string> = { leon: "Leon", "1xbet": "1xBet" };

type Filter = "active" | "archived" | "all";

export function OffersTable({ offers }: { offers: OfferRow[] }) {
  const [filter, setFilter] = useState<Filter>("active");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statsByOffer, setStatsByOffer] = useState<Record<string, StatsRow[]>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const filtered = offers.filter((o) => filter === "all" || o.status === filter);

  async function toggleExpand(offer: OfferRow) {
    if (expandedId === offer.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(offer.id);
    if (!statsByOffer[offer.id]) {
      setLoadingId(offer.id);
      const stats = await getOfferStatsAction(offer.id);
      setStatsByOffer((prev) => ({ ...prev, [offer.id]: stats }));
      setLoadingId(null);
    }
  }

  function handleArchive(offerId: string) {
    startTransition(() => {
      archiveOfferAction(offerId);
    });
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {(["active", "archived", "all"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md px-3 py-1.5 text-sm transition ${
              filter === f
                ? "bg-neutral-100 text-neutral-900"
                : "border border-neutral-700 text-neutral-300 hover:bg-neutral-800"
            }`}
          >
            {f === "active" ? "Активные" : f === "archived" ? "Освоенные" : "Все"}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-900 text-left text-neutral-400">
              <th className="px-4 py-3 font-medium">Оффер</th>
              <th className="px-4 py-3 font-medium">Партнёрка</th>
              <th className="px-4 py-3 font-medium">Старт</th>
              <th className="px-4 py-3 font-medium">Статус</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                  Пусто
                </td>
              </tr>
            )}
            {filtered.map((offer) => (
              <Fragment key={offer.id}>
                <tr
                  onClick={() => toggleExpand(offer)}
                  className="cursor-pointer border-b border-neutral-800 bg-neutral-950 transition hover:bg-neutral-900"
                >
                  <td className="px-4 py-3 text-neutral-100">{offer.name}</td>
                  <td className="px-4 py-3 text-neutral-300">
                    {NETWORK_LABEL[offer.network]}
                  </td>
                  <td className="px-4 py-3 text-neutral-300">{offer.start_date}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        offer.status === "active"
                          ? "bg-blue-500/15 text-blue-400"
                          : "bg-neutral-700/40 text-neutral-400"
                      }`}
                    >
                      {offer.status === "active" ? "активен" : "освоено"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {offer.status === "active" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArchive(offer.id);
                        }}
                        className="rounded-md border border-neutral-700 px-3 py-1 text-xs text-neutral-300 transition hover:bg-neutral-800"
                      >
                        Перевести в освоено
                      </button>
                    )}
                  </td>
                </tr>
                {expandedId === offer.id && (
                  <tr className="border-b border-neutral-800 bg-neutral-900/40">
                    <td colSpan={5} className="p-0">
                      {loadingId === offer.id ? (
                        <p className="px-4 py-6 text-sm text-neutral-500">Загружаем…</p>
                      ) : (
                        <OfferStatsPanel stats={statsByOffer[offer.id] ?? []} />
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
