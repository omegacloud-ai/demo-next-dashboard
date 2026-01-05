"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDrillDown } from "@/lib/context/drill-down-context";
import { formatCurrency, formatPercent } from "@/lib/utils/formatters";
import { format } from "date-fns";
import { Download } from "lucide-react";

export function DrillDownTable() {
  const { isOpen, setIsOpen, filter, filteredData } = useDrillDown();

  const handleDownloadCSV = () => {
    if (filteredData.length === 0) return;

    // Create CSV headers
    const headers = [
      "#",
      "Order ID",
      "Date",
      "Customer",
      "Product",
      "Region",
      "Type",
      "Quantity",
      "Unit Price",
      "Discount",
      "Total",
      "Returned",
      "Payment Method",
      "Salesperson",
    ];

    // Create CSV rows
    const rows = filteredData.map((record, index) => [
      index + 1,
      record.OrderID,
      format(record.Date, "yyyy-MM-dd"),
      record.CustomerName,
      record.Product,
      record.Region,
      record.CustomerType,
      record.Quantity,
      record.UnitPrice,
      record.Discount,
      record.TotalPrice,
      record.Returned ? "Yes" : "No",
      record.PaymentMethod,
      record.Salesperson,
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `sales-${filter?.value || "data"}-${Date.now()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!filter) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="w-full sm:max-w-4xl overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <SheetTitle>Sales Details: {filter.label}</SheetTitle>
              <SheetDescription>
                Showing {filteredData.length} transaction{filteredData.length !== 1 ? "s" : ""}
              </SheetDescription>
            </div>
            <Button
              onClick={handleDownloadCSV}
              variant="outline"
              size="sm"
              className="gap-2 shrink-0 mr-8"
              disabled={filteredData.length === 0}
            >
              <Download className="h-4 w-4" />
              Download CSV
            </Button>
          </div>
        </SheetHeader>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">#</TableHead>
                <TableHead className="w-[100px]">Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Discount</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Returned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center text-muted-foreground">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((record, index) => (
                  <TableRow key={record.OrderID}>
                    <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                    <TableCell className="font-medium">{record.OrderID}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {format(record.Date, "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>{record.CustomerName}</TableCell>
                    <TableCell>{record.Product}</TableCell>
                    <TableCell>{record.Region}</TableCell>
                    <TableCell>{record.CustomerType}</TableCell>
                    <TableCell className="text-right">{record.Quantity}</TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      {formatCurrency(record.UnitPrice)}
                    </TableCell>
                    <TableCell className="text-right">
                      {record.Discount > 0 ? formatPercent(record.Discount * 100) : "-"}
                    </TableCell>
                    <TableCell className="text-right font-medium whitespace-nowrap">
                      {formatCurrency(record.TotalPrice)}
                    </TableCell>
                    <TableCell className="text-center">
                      {record.Returned ? (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                          Yes
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </SheetContent>
    </Sheet>
  );
}
