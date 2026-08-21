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
  backgroundColor: "#0F172A",
  border: "none",
  borderRadius: 12,
  color: "#F8FAFC",
  fontSize: 12,
  fontFamily: "var(--font-mono)",
};

export function GenerationVsDrawChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={GENERATION_HISTORY} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="genGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="drawGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0F172A" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#0F172A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area
          type="monotone"
          dataKey="generationKwh"
          name="Solar Generation (kWh)"
          stroke="#F59E0B"
          fill="url(#genGradient)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="gridDrawKwh"
          name="Grid Draw (kWh)"
          stroke="#0F172A"
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
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="creditsEarnedKwh" name="VNM Credits Earned (kWh)" fill="#10B981" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
