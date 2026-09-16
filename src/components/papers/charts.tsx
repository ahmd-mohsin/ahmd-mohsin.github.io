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
  ScatterChart,
  Scatter,
} from "recharts";
import { ReactNode } from "react";

// Black-and-white paper palette with Stanford-red accents.
export const R = {
  red: "#8C1515", // Stanford cardinal
  red2: "#B83A4B", // lighter cardinal
  redSoft: "#C98A93",
  ink: "#1a1a1a",
  gray: "#9a9a9a",
  grid: "#e6e6e6",
  axis: "#555555",
};

const tooltipStyle = {
  background: "#ffffff",
  border: "1px solid #d9d9d9",
  borderRadius: 0,
  color: "#1a1a1a",
  fontFamily: "monospace",
  fontSize: 12,
};
const legendStyle = { fontSize: 11, color: R.ink, fontFamily: "monospace" };

export function Fig({ caption, children }: { caption: ReactNode; children: ReactNode }) {
  return (
    <figure className="my-9">
      <div className="border border-black/10 bg-white p-4 pt-4">{children}</div>
      <figcaption className="mt-3 text-xs text-neutral-500 leading-relaxed">{caption}</figcaption>
    </figure>
  );
}

type LineSeries = { key: string; label: string; color: string; dash?: string };

export function LineFig({
  title, data, xKey, xLabel, yLabel, yDomain = [0, 1], series, crossoverAt,
}: {
  title?: string;
  data: Record<string, number | string | null>[];
  xKey: string; xLabel?: string; yLabel?: string;
  yDomain?: [number, number]; series: LineSeries[]; crossoverAt?: string | number;
}) {
  return (
    <div>
      {title && <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8C1515] mb-3">{title}</p>}
      <ResponsiveContainer width="100%" height={268}>
        <LineChart data={data} margin={{ top: 26, right: 18, bottom: 20, left: 2 }}>
          <CartesianGrid stroke={R.grid} />
          <XAxis dataKey={xKey} stroke={R.axis} tick={{ fill: R.axis, fontSize: 11 }} tickLine={{ stroke: R.axis }}
            label={xLabel ? { value: xLabel, position: "insideBottom", offset: -8, fill: R.axis, fontSize: 11 } : undefined} />
          <YAxis domain={yDomain} stroke={R.axis} tick={{ fill: R.axis, fontSize: 11 }} tickLine={{ stroke: R.axis }} width={42}
            label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft", fill: R.axis, fontSize: 11 } : undefined} />
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#8C1515" }} cursor={{ stroke: R.gray, strokeDasharray: "3 3" }} />
          <Legend wrapperStyle={legendStyle} iconType="plainline" verticalAlign="top" align="right" height={22} />
          {crossoverAt !== undefined && <ReferenceLine x={crossoverAt} stroke={R.gray} strokeDasharray="4 4" />}
          {series.map((s) => (
            <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color}
              strokeWidth={s.color === R.red ? 2.4 : 1.8} strokeDasharray={s.dash}
              dot={{ r: 2, fill: s.color, strokeWidth: 0 }} activeDot={{ r: 4 }} isAnimationActive={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

type BarSeries = { key: string; label: string; color: string };

export function BarFig({
  title, data, xKey, xLabel, yLabel, yDomain, series, angledX,
}: {
  title?: string;
  data: Record<string, number | string | null>[];
  xKey: string; xLabel?: string; yLabel?: string;
  yDomain?: [number, number]; series: BarSeries[]; angledX?: boolean;
}) {
  return (
    <div>
      {title && <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8C1515] mb-3">{title}</p>}
      <ResponsiveContainer width="100%" height={angledX ? 300 : 268}>
        <BarChart data={data} margin={{ top: 26, right: 18, bottom: angledX ? 54 : 20, left: 2 }}>
          <CartesianGrid stroke={R.grid} vertical={false} />
          <XAxis dataKey={xKey} stroke={R.axis} tick={{ fill: R.axis, fontSize: 10 }} tickLine={{ stroke: R.axis }}
            interval={0} angle={angledX ? -30 : 0} textAnchor={angledX ? "end" : "middle"} height={angledX ? 60 : 30}
            label={xLabel ? { value: xLabel, position: "insideBottom", offset: -8, fill: R.axis, fontSize: 11 } : undefined} />
          <YAxis domain={yDomain} stroke={R.axis} tick={{ fill: R.axis, fontSize: 11 }} tickLine={{ stroke: R.axis }} width={42}
            label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft", fill: R.axis, fontSize: 11 } : undefined} />
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#8C1515" }} cursor={{ fill: "rgba(140,21,21,0.06)" }} />
          <Legend wrapperStyle={legendStyle} verticalAlign="top" align="right" height={22} />
          {series.map((s) => (
            <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} isAnimationActive={false} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RankBar({
  title, data, yLabel, yDomain,
}: {
  title?: string;
  data: { name: string; value: number; color: string }[];
  yLabel?: string; yDomain?: [number, number];
}) {
  return (
    <div>
      {title && <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8C1515] mb-3">{title}</p>}
      <ResponsiveContainer width="100%" height={268}>
        <BarChart data={data} margin={{ top: 10, right: 18, bottom: 20, left: 2 }}>
          <CartesianGrid stroke={R.grid} vertical={false} />
          <XAxis dataKey="name" stroke={R.axis} tick={{ fill: R.axis, fontSize: 10 }} tickLine={{ stroke: R.axis }} interval={0} />
          <YAxis domain={yDomain} stroke={R.axis} tick={{ fill: R.axis, fontSize: 11 }} tickLine={{ stroke: R.axis }} width={42}
            label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft", fill: R.axis, fontSize: 11 } : undefined} />
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#8C1515" }} cursor={{ fill: "rgba(140,21,21,0.06)" }} />
          <Bar dataKey="value" isAnimationActive={false}>
            {data.map((d, i) => (<Cell key={i} fill={d.color} />))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ScatterFig({
  title, data, xLabel, yLabel, xDomain = [0, 1], yDomain = [0, 1], diagonalSegment,
}: {
  title?: string;
  data: { x: number; y: number; name?: string }[];
  xLabel?: string; yLabel?: string;
  xDomain?: [number, number]; yDomain?: [number, number];
  diagonalSegment?: { x: number; y: number }[];
}) {
  return (
    <div>
      {title && <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8C1515] mb-3">{title}</p>}
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 16, right: 18, bottom: 24, left: 2 }}>
          <CartesianGrid stroke={R.grid} />
          <XAxis type="number" dataKey="x" domain={xDomain} stroke={R.axis} tick={{ fill: R.axis, fontSize: 11 }} tickLine={{ stroke: R.axis }}
            label={xLabel ? { value: xLabel, position: "insideBottom", offset: -10, fill: R.axis, fontSize: 11 } : undefined} />
          <YAxis type="number" dataKey="y" domain={yDomain} stroke={R.axis} tick={{ fill: R.axis, fontSize: 11 }} tickLine={{ stroke: R.axis }} width={44}
            label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft", fill: R.axis, fontSize: 11 } : undefined} />
          <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#8C1515" }} cursor={{ stroke: R.gray, strokeDasharray: "3 3" }} />
          {diagonalSegment && <ReferenceLine segment={diagonalSegment} stroke={R.gray} strokeDasharray="5 4" ifOverflow="extendDomain" />}
          <Scatter data={data} fill={R.red} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
