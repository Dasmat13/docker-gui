import React from "react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

export default function ChartMini({ cpu = 0, mem = 0 }: { cpu?: number; mem?: number }) {
  const series = Array.from({ length: 12 }).map((_, i) => ({ i, cpu: Math.max(0, Math.min(100, cpu + Math.random() * 6 - 3)), mem: Math.max(0, Math.min(100, mem + Math.random() * 6 - 3)) }));
  return (
    <div className="h-28">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={series}>
          <defs>
            <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.85}/>
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.06}/>
            </linearGradient>
            <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.85}/>
              <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.06}/>
            </linearGradient>
          </defs>

          <Area type="monotone" dataKey="cpu" stroke="#06b6d4" fill="url(#cpuGrad)" strokeWidth={2} dot={false} />
          <Area type="monotone" dataKey="mem" stroke="#60a5fa" fill="url(#memGrad)" strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
