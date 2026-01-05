import { format } from 'date-fns';
import type { SalesRecord } from '@/lib/types/sales';
import type { DrillDownFilter } from '@/lib/context/drill-down-context';

export function filterSalesData(
  allRecords: SalesRecord[],
  filter: DrillDownFilter
): SalesRecord[] {
  switch (filter.type) {
    case 'month':
      // Filter by month (value format: "2023-02")
      return allRecords.filter((record) => {
        const recordMonth = format(record.Date, 'yyyy-MM');
        return recordMonth === filter.value;
      });

    case 'region':
      return allRecords.filter((record) => record.Region === filter.value);

    case 'product':
      return allRecords.filter((record) => record.Product === filter.value);

    case 'customerType':
      return allRecords.filter((record) => record.CustomerType === filter.value);

    default:
      return allRecords;
  }
}
