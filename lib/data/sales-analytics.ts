import * as aq from 'arquero';
import { format } from 'date-fns';
import type {
  SalesRecord,
  DashboardData,
  TimeSeriesDataPoint,
  RegionalMetrics,
  ProductMetrics,
  CustomerSegmentMetrics,
  PaymentMethodMetrics,
} from '@/lib/types/sales';

export function calculateDashboardData(records: SalesRecord[]): DashboardData {
  const table = aq.from(records);

  return {
    summary: calculateSummaryMetrics(table),
    timeSeries: calculateTimeSeries(table),
    regional: calculateRegionalMetrics(table),
    products: calculateProductMetrics(table),
    customerSegments: calculateCustomerSegments(table),
    paymentMethods: calculatePaymentMethods(table),
  };
}

function calculateSummaryMetrics(table: aq.Table) {
  const summary = table
    .rollup({
      totalRevenue: aq.op.sum('TotalPrice'),
      totalOrders: aq.op.count(),
      avgOrderValue: aq.op.mean('TotalPrice'),
      totalReturned: (d: aq.ColumnTable) => aq.op.sum(d.Returned ? 1 : 0),
    })
    .object() as {
      totalRevenue: number;
      totalOrders: number;
      avgOrderValue: number;
      totalReturned: number;
    };

  return {
    totalRevenue: summary.totalRevenue,
    totalOrders: summary.totalOrders,
    avgOrderValue: summary.avgOrderValue,
    returnRate: (summary.totalReturned / summary.totalOrders) * 100,
  };
}

function calculateTimeSeries(table: aq.Table): TimeSeriesDataPoint[] {
  // Get all records as objects
  const records = table.objects() as Array<{ Date: Date; TotalPrice: number }>;

  // Group by month manually
  const monthlyData = new Map<string, { revenue: number; orders: number; prices: number[] }>();

  records.forEach((record) => {
    const monthKey = format(record.Date, 'yyyy-MM');
    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, { revenue: 0, orders: 0, prices: [] });
    }
    const data = monthlyData.get(monthKey)!;
    data.revenue += record.TotalPrice;
    data.orders += 1;
    data.prices.push(record.TotalPrice);
  });

  // Convert to array and sort by month
  const timeSeries = Array.from(monthlyData.entries())
    .map(([month, data]) => ({
      date: month + '-01',
      revenue: data.revenue,
      orders: data.orders,
      avgOrderValue: data.revenue / data.orders,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return timeSeries;
}

function calculateRegionalMetrics(table: aq.Table): RegionalMetrics[] {
  const regional = table
    .groupby('Region')
    .rollup({
      revenue: aq.op.sum('TotalPrice'),
      orders: aq.op.count(),
      avgOrderValue: aq.op.mean('TotalPrice'),
      totalReturned: (d: aq.ColumnTable) => aq.op.sum(d.Returned ? 1 : 0),
      totalOrders: aq.op.count(),
    })
    .orderby(aq.desc('revenue'))
    .objects() as Array<{
      Region: string;
      revenue: number;
      orders: number;
      avgOrderValue: number;
      totalReturned: number;
      totalOrders: number;
    }>;

  return regional.map((d) => ({
    region: d.Region,
    revenue: d.revenue,
    orders: d.orders,
    avgOrderValue: d.avgOrderValue,
    returnRate: (d.totalReturned / d.totalOrders) * 100,
  }));
}

function calculateProductMetrics(table: aq.Table): ProductMetrics[] {
  const products = table
    .groupby('Product')
    .rollup({
      revenue: aq.op.sum('TotalPrice'),
      unitsSold: aq.op.sum('Quantity'),
      totalOrders: aq.op.count(),
      totalReturned: (d: aq.ColumnTable) => aq.op.sum(d.Returned ? 1 : 0),
    })
    .orderby(aq.desc('revenue'))
    .objects() as Array<{
      Product: string;
      revenue: number;
      unitsSold: number;
      totalOrders: number;
      totalReturned: number;
    }>;

  return products.map((d) => ({
    product: d.Product,
    revenue: d.revenue,
    unitsSold: d.unitsSold,
    avgPrice: d.revenue / d.unitsSold,
    returnRate: (d.totalReturned / d.totalOrders) * 100,
  }));
}

function calculateCustomerSegments(table: aq.Table): CustomerSegmentMetrics[] {
  const segments = table
    .groupby('CustomerType')
    .rollup({
      revenue: aq.op.sum('TotalPrice'),
      orders: aq.op.count(),
      avgOrderValue: aq.op.mean('TotalPrice'),
    })
    .orderby(aq.desc('revenue'))
    .objects() as Array<{
      CustomerType: string;
      revenue: number;
      orders: number;
      avgOrderValue: number;
    }>;

  // Get top payment method per segment using separate aggregation
  const paymentBySegment = table
    .groupby('CustomerType', 'PaymentMethod')
    .rollup({
      count: aq.op.count(),
    })
    .objects() as Array<{
      CustomerType: string;
      PaymentMethod: string;
      count: number;
    }>;

  // Find top payment method for each segment
  const topPaymentMethods = new Map<string, string>();
  segments.forEach((segment) => {
    const segmentPayments = paymentBySegment
      .filter((p) => p.CustomerType === segment.CustomerType)
      .sort((a, b) => b.count - a.count);
    topPaymentMethods.set(segment.CustomerType, segmentPayments[0]?.PaymentMethod || 'N/A');
  });

  return segments.map((segment) => ({
    segment: segment.CustomerType,
    revenue: segment.revenue,
    orders: segment.orders,
    avgOrderValue: segment.avgOrderValue,
    topPaymentMethod: topPaymentMethods.get(segment.CustomerType) || 'N/A',
  }));
}

function calculatePaymentMethods(table: aq.Table): PaymentMethodMetrics[] {
  const totalOrders = table.numRows();

  const paymentMethods = table
    .groupby('PaymentMethod')
    .rollup({
      count: aq.op.count(),
      revenue: aq.op.sum('TotalPrice'),
    })
    .orderby(aq.desc('count'))
    .objects() as Array<{
      PaymentMethod: string;
      count: number;
      revenue: number;
    }>;

  return paymentMethods.map((d) => ({
    paymentMethod: d.PaymentMethod,
    count: d.count,
    revenue: d.revenue,
    percentage: (d.count / totalOrders) * 100,
  }));
}
