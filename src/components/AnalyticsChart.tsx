"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { GENERATION_HISTORY } from "@/lib/mockData";

const tooltipStyle = {
  backgroundColor: "#0D2B21",
  border: "1px solid #1F4A38",
  borderRadius: 12,
  color: "#E8F5E9",
  fontSize: 12,
  fontFamily: "var(--font-mono)",
};

const tooltipLabelStyle = { color: "#E8F5E9", marginBottom: 4 };
const tooltipItemStyle = { color: "#E8F5E9" };
const legendStyle = { fontSize: 12, color: "#A7B8AE" };

export function GenerationVsDrawChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={GENERATION_HISTORY} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="genGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FACC15" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#FACC15" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="drawGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#A7B8AE" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#A7B8AE" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1F4A38" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#A7B8AE" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#A7B8AE" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />
        <Legend wrapperStyle={legendStyle} />
        <Area
          type="monotone"
          dataKey="generationKwh"
          name="Solar Generation (kWh)"
          stroke="#FACC15"
          fill="url(#genGradient)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="gridDrawKwh"
          name="Grid Draw (kWh)"
          stroke="#A7B8AE"
          fill="url(#drawGradient)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function CreditsEarnedChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={GENERATION_HISTORY} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1F4A38" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#A7B8AE" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#A7B8AE" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} labelStyle={tooltipLabelStyle} itemStyle={tooltipItemStyle} />
        <Bar dataKey="creditsEarnedKwh" name="VNM Credits Earned (kWh)" fill="#22C55E" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
