'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { CustomerSegmentMetrics } from '@/lib/types/sales';
import { formatCurrency } from '@/lib/utils/formatters';
import { ChartCard } from './chart-card';

interface CustomerSegmentationChartProps {
  data: CustomerSegmentMetrics[];
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))'];

export function CustomerSegmentationChart({ data }: CustomerSegmentationChartProps) {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  const chartData = data.map((item) => ({
    ...item,
    percentage: ((item.revenue / totalRevenue) * 100).toFixed(1),
  }));

  return (
    <ChartCard title="Customer Segmentation">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ segment, percentage }) => `${segment}: ${percentage}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="revenue"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as CustomerSegmentMetrics & { percentage: string };
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid gap-2">
                      <div className="font-bold">{data.segment}</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Revenue</span>
                          <span className="font-bold">{formatCurrency(data.revenue)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Percentage</span>
                          <span className="font-bold">{data.percentage}%</span>
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
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
