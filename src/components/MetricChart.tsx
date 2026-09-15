"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const LINE_COLOR = "#3987e5";
const GRID_COLOR = "#2c2c2a";
const MUTED_COLOR = "#898781";

interface MetricChartProps {
  title: string;
  data: { date: string; value: number }[];
  formatValue?: (value: number) => string;
}

function formatDate(iso: string) {
  const [, month, day] = iso.split("-");
  return `${day}.${month}`;
}

export function MetricChart({ title, data, formatValue }: MetricChartProps) {
  const format = formatValue ?? ((v: number) => String(v));

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
      <p className="mb-2 text-sm text-neutral-400">{title}</p>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={GRID_COLOR} vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke={MUTED_COLOR}
              tick={{ fontSize: 11, fill: MUTED_COLOR }}
              tickLine={false}
              axisLine={{ stroke: GRID_COLOR }}
              minTickGap={20}
            />
            <YAxis
              stroke={MUTED_COLOR}
              tick={{ fontSize: 11, fill: MUTED_COLOR }}
              tickLine={false}
              axisLine={false}
              width={40}
              tickFormatter={format}
            />
            <Tooltip
              formatter={(value) => format(Number(value))}
              labelFormatter={(label) => formatDate(String(label))}
              contentStyle={{
                background: "#1a1a19",
                border: "1px solid #383835",
                borderRadius: 6,
                fontSize: 12,
              }}
              labelStyle={{ color: "#c3c2b7" }}
              itemStyle={{ color: "#ffffff" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={LINE_COLOR}
              strokeWidth={2}
              dot={data.length <= 30}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
