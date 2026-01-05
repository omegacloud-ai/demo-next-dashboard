'use client';

import { DrillDownProvider } from '@/lib/context/drill-down-context';
import { DrillDownTable } from './drill-down-table';
import { SalesOverTimeChart } from '@/components/charts/sales-over-time-chart';
import { RegionalPerformanceChart } from '@/components/charts/regional-performance-chart';
import { ProductAnalysisChart } from '@/components/charts/product-analysis-chart';
import { CustomerSegmentationChart } from '@/components/charts/customer-segmentation-chart';
import type { DashboardData, SalesRecord } from '@/lib/types/sales';

interface DashboardClientProps {
  data: DashboardData;
  records: SalesRecord[];
}

export function DashboardClient({ data, records }: DashboardClientProps) {
  return (
    <DrillDownProvider>
      <div className="grid gap-6 md:grid-cols-2">
        <SalesOverTimeChart data={data.timeSeries} allRecords={records} />
        <RegionalPerformanceChart data={data.regional} allRecords={records} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ProductAnalysisChart data={data.products} allRecords={records} />
        <CustomerSegmentationChart data={data.customerSegments} allRecords={records} />
      </div>

      <DrillDownTable />
    </DrillDownProvider>
  );
}
