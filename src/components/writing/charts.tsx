"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ReferenceLine,
} from "recharts";
import { ReactNode } from "react";

// Black + pink chart palette.
export const C = {
  pink: "#8C1515",
  pinkHi: "#6f1010",
  white: "#8C1515",
  mauve: "#4b5563",
  faint: "#9a9a9a",
  deep: "#8C1515",
  axis: "#9a9a9a",
  grid: "rgba(140,21,21,0.14)",
  text: "#262626",
};

const tooltipStyle = {
  background: "#f4f4f5",
  border: "1px solid rgba(140,21,21,0.4)",
  borderRadius: 0,
  color: "#8C1515",
  fontFamily: "monospace",
  fontSize: 12,
};
const tooltipLabel = { color: "#4b5563" };
const legendStyle = { fontSize: 11, color: C.text, fontFamily: "monospace" };

export function Fig({ caption, children }: { caption: ReactNode; children: ReactNode }) {
  return (
    <figure className="my-10 not-prose">
      <div className="border border-[#d4d4d8] bg-white p-4 pt-5">{children}</div>
      <figcaption className="mt-3 text-xs text-[#9a9a9a] leading-relaxed">{caption}</figcaption>
    </figure>
  );
}

type LineSeries = { key: string; label: string; color: string; dash?: string };

export function LineFig({
  title,
  data,
  xKey,
  xLabel,
  yLabel,
  yDomain = [0, 1],
  series,
  crossoverAt,
}: {
  title?: string;
  data: Record<string, number | string | null>[];
  xKey: string;
  xLabel?: string;
  yLabel?: string;
  yDomain?: [number, number];
  series: LineSeries[];
  crossoverAt?: string | number;
}) {
  return (
    <div>
      {title && (
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8C1515] mb-3">{title}</p>
      )}
      <ResponsiveContainer width="100%" height={264}>
        <LineChart data={data} margin={{ top: 26, right: 18, bottom: 20, left: 2 }}>
          <CartesianGrid stroke={C.grid} strokeDasharray="2 3" />
          <XAxis
            dataKey={xKey}
            stroke={C.axis}
            tick={{ fill: C.axis, fontSize: 11 }}
            tickLine={{ stroke: C.axis }}
            label={xLabel ? { value: xLabel, position: "insideBottom", offset: -8, fill: C.axis, fontSize: 11 } : undefined}
          />
          <YAxis
            domain={yDomain}
            stroke={C.axis}
            tick={{ fill: C.axis, fontSize: 11 }}
            tickLine={{ stroke: C.axis }}
            width={42}
            label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft", fill: C.axis, fontSize: 11 } : undefined}
          />
          <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabel} cursor={{ stroke: C.faint, strokeDasharray: "3 3" }} />
          <Legend wrapperStyle={legendStyle} iconType="plainline" verticalAlign="top" align="right" height={22} />
          {crossoverAt !== undefined && (
            <ReferenceLine x={crossoverAt} stroke={C.deep} strokeDasharray="4 4" />
          )}
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={s.color === C.pink ? 2.4 : 1.8}
              strokeDasharray={s.dash}
              dot={{ r: 2, fill: s.color, strokeWidth: 0 }}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

type BarSeries = { key: string; label: string; color: string };

// Grouped bars: several series side by side per category.
export function BarFig({
  title,
  data,
  xKey,
  xLabel,
  yLabel,
  yDomain,
  series,
}: {
  title?: string;
  data: Record<string, number | string | null>[];
  xKey: string;
  xLabel?: string;
  yLabel?: string;
  yDomain?: [number, number];
  series: BarSeries[];
}) {
  return (
    <div>
      {title && (
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8C1515] mb-3">{title}</p>
      )}
      <ResponsiveContainer width="100%" height={264}>
        <BarChart data={data} margin={{ top: 26, right: 18, bottom: 20, left: 2 }}>
          <CartesianGrid stroke={C.grid} strokeDasharray="2 3" vertical={false} />
          <XAxis dataKey={xKey} stroke={C.axis} tick={{ fill: C.axis, fontSize: 11 }} tickLine={{ stroke: C.axis }}
            label={xLabel ? { value: xLabel, position: "insideBottom", offset: -8, fill: C.axis, fontSize: 11 } : undefined} />
          <YAxis domain={yDomain} stroke={C.axis} tick={{ fill: C.axis, fontSize: 11 }} tickLine={{ stroke: C.axis }} width={42}
            label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft", fill: C.axis, fontSize: 11 } : undefined} />
          <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabel} cursor={{ fill: "rgba(140,21,21,0.08)" }} />
          <Legend wrapperStyle={legendStyle} verticalAlign="top" align="right" height={22} />
          {series.map((s) => (
            <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} isAnimationActive={false} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Single series, one color per bar (for rankings that carry meaning).
export function RankBar({
  title,
  data,
  yLabel,
  yDomain,
}: {
  title?: string;
  data: { name: string; value: number; color: string }[];
  yLabel?: string;
  yDomain?: [number, number];
}) {
  return (
    <div>
      {title && (
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8C1515] mb-3">{title}</p>
      )}
      <ResponsiveContainer width="100%" height={264}>
        <BarChart data={data} margin={{ top: 6, right: 18, bottom: 20, left: 2 }}>
          <CartesianGrid stroke={C.grid} strokeDasharray="2 3" vertical={false} />
          <XAxis dataKey="name" stroke={C.axis} tick={{ fill: C.axis, fontSize: 10 }} tickLine={{ stroke: C.axis }} interval={0} />
          <YAxis domain={yDomain} stroke={C.axis} tick={{ fill: C.axis, fontSize: 11 }} tickLine={{ stroke: C.axis }} width={42}
            label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft", fill: C.axis, fontSize: 11 } : undefined} />
          <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabel} cursor={{ fill: "rgba(140,21,21,0.08)" }} />
          <ReferenceLine y={0} stroke={C.faint} />
          <Bar dataKey="value" isAnimationActive={false}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
