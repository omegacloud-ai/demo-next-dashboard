'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ProductMetrics } from '@/lib/types/sales';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import { ChartCard } from './chart-card';

interface ProductAnalysisChartProps {
  data: ProductMetrics[];
}

export function ProductAnalysisChart({ data }: ProductAnalysisChartProps) {
  return (
    <ChartCard title="Product Analysis">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} className="text-xs" />
          <YAxis dataKey="product" type="category" className="text-xs" width={80} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as ProductMetrics;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid gap-2">
                      <div className="font-bold">{data.product}</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Revenue</span>
                          <span className="font-bold">{formatCurrency(data.revenue)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Units Sold</span>
                          <span className="font-bold">{formatNumber(data.unitsSold)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Avg Price</span>
                          <span className="font-bold">{formatCurrency(data.avgPrice)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
