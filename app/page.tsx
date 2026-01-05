import { loadSalesData } from '@/lib/data/load-sales-data';
import { calculateDashboardData } from '@/lib/data/sales-analytics';
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { DashboardClient } from '@/components/dashboard/dashboard-client';

export default async function Home() {
  // Server-side data loading
  const records = await loadSalesData();
  const data = calculateDashboardData(records);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Sales Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive analysis of {data.summary.totalOrders.toLocaleString()} sales transactions
          </p>
        </div>

        <SummaryCards summary={data.summary} />

        <DashboardClient data={data} records={records} />
      </div>
    </div>
  );
}
