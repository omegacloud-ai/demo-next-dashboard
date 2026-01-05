'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format, parseISO } from 'date-fns';
import type { TimeSeriesDataPoint } from '@/lib/types/sales';
import { formatCurrency } from '@/lib/utils/formatters';
import { ChartCard } from './chart-card';

interface SalesOverTimeChartProps {
  data: TimeSeriesDataPoint[];
}

export function SalesOverTimeChart({ data }: SalesOverTimeChartProps) {
  return (
    <ChartCard title="Sales Over Time">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(parseISO(date), 'MMM yyyy')}
            className="text-xs"
          />
          <YAxis tickFormatter={(value) => formatCurrency(value)} className="text-xs" />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as TimeSeriesDataPoint;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Month</span>
                        <span className="font-bold text-muted-foreground">
                          {format(parseISO(data.date), 'MMM yyyy')}
                        </span>
                      </div>
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
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="hsl(var(--primary))"
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
