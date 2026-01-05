// Raw data row from Excel
export interface SalesRecord {
  Date: Date;
  OrderDate: Date;
  DeliveryDate: Date;
  Region: 'East' | 'West' | 'North' | 'South' | 'Central';
  Product: 'Laptop' | 'Phone' | 'Desk' | 'Chair' | 'Monitor' | 'Printer' | 'Tablet';
  Quantity: number;
  UnitPrice: number;
  TotalPrice: number;
  Discount: number;
  ShippingCost: number;
  StoreLocation: string;
  CustomerType: 'Retail' | 'Wholesale';
  Salesperson: string;
  CustomerName: string;
  RegionManager: string;
  PaymentMethod: string;
  Promotion: string;
  Returned: boolean;
  OrderID: string;
}

// Aggregated data types (JSON-serializable)
export interface TimeSeriesDataPoint {
  date: string; // ISO date string for serialization
  revenue: number;
  orders: number;
  avgOrderValue: number;
}

export interface RegionalMetrics {
  region: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
  returnRate: number;
}

export interface ProductMetrics {
  product: string;
  revenue: number;
  unitsSold: number;
  avgPrice: number;
  returnRate: number;
}

export interface CustomerSegmentMetrics {
  segment: string; // 'Retail' or 'Wholesale'
  revenue: number;
  orders: number;
  avgOrderValue: number;
  topPaymentMethod: string;
}

export interface PaymentMethodMetrics {
  paymentMethod: string;
  count: number;
  revenue: number;
  percentage: number;
}

export interface DashboardData {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    returnRate: number;
  };
  timeSeries: TimeSeriesDataPoint[];
  regional: RegionalMetrics[];
  products: ProductMetrics[];
  customerSegments: CustomerSegmentMetrics[];
  paymentMethods: PaymentMethodMetrics[];
}
