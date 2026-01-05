import { loadSalesData } from '@/lib/data/load-sales-data';
import { calculateDashboardData } from '@/lib/data/sales-analytics';
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { SalesOverTimeChart } from '@/components/charts/sales-over-time-chart';
import { RegionalPerformanceChart } from '@/components/charts/regional-performance-chart';
import { ProductAnalysisChart } from '@/components/charts/product-analysis-chart';
import { CustomerSegmentationChart } from '@/components/charts/customer-segmentation-chart';

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

        <div className="grid gap-6 md:grid-cols-2">
          <SalesOverTimeChart data={data.timeSeries} />
          <RegionalPerformanceChart data={data.regional} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ProductAnalysisChart data={data.products} />
          <CustomerSegmentationChart data={data.customerSegments} />
        </div>
      </div>
    </div>
  );
}
