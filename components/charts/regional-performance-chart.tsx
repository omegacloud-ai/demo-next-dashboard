'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { RegionalMetrics } from '@/lib/types/sales';
import { formatCurrency, formatPercent } from '@/lib/utils/formatters';
import { ChartCard } from './chart-card';

interface RegionalPerformanceChartProps {
  data: RegionalMetrics[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export function RegionalPerformanceChart({ data }: RegionalPerformanceChartProps) {
  const dataWithColors = data.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <ChartCard title="Regional Performance">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dataWithColors}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="region" className="text-xs" />
          <YAxis tickFormatter={(value) => formatCurrency(value)} className="text-xs" />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as RegionalMetrics;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid gap-2">
                      <div className="font-bold">{data.region}</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Revenue</span>
                          <span className="font-bold">{formatCurrency(data.revenue)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Orders</span>
                          <span className="font-bold">{data.orders}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Avg Order</span>
                          <span className="font-bold">{formatCurrency(data.avgOrderValue)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Return Rate</span>
                          <span className="font-bold">{formatPercent(data.returnRate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="revenue" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
