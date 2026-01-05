import type { SalesRecord } from "@/lib/types/sales";
import { copyFileSync, existsSync } from "fs";
import { readFile } from "fs/promises";
import path from "path";
import * as XLSX from "xlsx";

export async function loadSalesData(): Promise<SalesRecord[]> {
  try {
    // Read Excel file
    // The main working dir is process.env.DATA_PATH. Sales data file should be there.
    const SALES_DATA_FILE = "product-sales.xlsx";
    const projectDir = process.cwd();
    const dataDir = process.env.DATA_PATH || projectDir;
    const dataFilePath = path.join(dataDir, SALES_DATA_FILE);
    if (!existsSync(dataFilePath)) {
      // If not, then copy it from the project root.
      const projectFilePath = path.join(projectDir, SALES_DATA_FILE);
      if (existsSync(projectFilePath)) {
        copyFileSync(projectFilePath, dataFilePath);
      } else {
        throw new Error(`Sales data file ${SALES_DATA_FILE} not found`);
      }
    }

    const fileBuffer = await readFile(dataFilePath);

    // Parse Excel with cellDates option to convert numeric dates to Date objects
    const workbook = XLSX.read(fileBuffer, { type: "buffer", cellDates: true });

    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON (first row is headers)
    const rawData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

    // Transform and validate data
    const records: SalesRecord[] = rawData
      .map((row, index) => {
        try {
          // Validate required fields exist
          if (!row.OrderID || typeof row.TotalPrice !== "number") {
            console.warn(`Row ${index + 2}: Missing required fields, skipping`);
            return null;
          }

          return {
            Date: row.Date instanceof Date ? row.Date : new Date(row.Date as string),
            OrderDate:
              row.OrderDate instanceof Date ? row.OrderDate : new Date(row.OrderDate as string),
            DeliveryDate:
              row.DeliveryDate instanceof Date
                ? row.DeliveryDate
                : new Date(row.DeliveryDate as string),
            Region: row.Region as SalesRecord["Region"],
            Product: row.Product as SalesRecord["Product"],
            Quantity: Number(row.Quantity),
            UnitPrice: Number(row.UnitPrice),
            TotalPrice: Number(row.TotalPrice),
            Discount: Number(row.Discount),
            ShippingCost: Number(row.ShippingCost),
            StoreLocation: String(row.StoreLocation),
            CustomerType: row.CustomerType as SalesRecord["CustomerType"],
            Salesperson: String(row.Salesperson),
            CustomerName: String(row.CustomerName),
            RegionManager: String(row.RegionManager),
            PaymentMethod: String(row.PaymentMethod),
            Promotion: String(row.Promotion),
            Returned: Boolean(row.Returned),
            OrderID: String(row.OrderID),
          };
        } catch (error) {
          console.warn(`Row ${index + 2}: Error parsing, skipping`, error);
          return null;
        }
      })
      .filter((record): record is SalesRecord => record !== null);

    console.log(`Loaded ${records.length} sales records from Excel`);
    return records;
  } catch (error) {
    console.error("Error loading sales data:", error);
    throw new Error(
      "Failed to load sales data. Please check the Excel file exists at project root."
    );
  }
}
