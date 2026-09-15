"use client";

import { MetricChart } from "./MetricChart";
import { StatsRow } from "@/lib/db/stats";

const rubFormat = (v: number) => `${v.toLocaleString("ru-RU")} ₽`;

export function OfferStatsPanel({ stats }: { stats: StatsRow[] }) {
  if (stats.length === 0) {
    return (
      <p className="px-4 py-6 text-sm text-neutral-500">
        Статистики пока нет — она появится после первого утреннего сбора.
      </p>
    );
  }

  const clicks = stats.map((s) => ({ date: s.snapshot_date, value: s.clicks }));
  const registrations = stats.map((s) => ({ date: s.snapshot_date, value: s.registrations }));
  const ftdCount = stats.map((s) => ({ date: s.snapshot_date, value: s.ftd_count }));
  const ftdAmount = stats.map((s) => ({ date: s.snapshot_date, value: s.ftd_amount }));
  const revenue = stats.map((s) => ({ date: s.snapshot_date, value: s.revenue }));

  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      <MetricChart title="Клики" data={clicks} />
      <MetricChart title="Регистрации" data={registrations} />
      <MetricChart title="FTD, количество" data={ftdCount} />
      <MetricChart title="FTD, сумма" data={ftdAmount} formatValue={rubFormat} />
      <MetricChart title="Доход" data={revenue} formatValue={rubFormat} />
    </div>
  );
}
