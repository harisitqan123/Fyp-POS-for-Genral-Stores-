"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Loader, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemePalette } from "@/hooks/useThemePalette";

type SaleProduct = {
  productId:
    | string
    | {
        name: string;
        brand: string;
      };
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
};

type Sale = {
  _id: string;
  customerName: string;
  PhoneNO: string;
  paymentType?: string;
  createdAt: string;
  totalAmount: number;
  products: SaleProduct[];
};

export default function SalesHistoryPage() {
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useThemePalette();

  // Example fallback if not yet in themePalette:
  const tableRowBg = theme.tableRowBg || "#fff";
  const tableRowText = theme.tableRowText || "#1a1a1a";
  const tableRowHoverBg = theme.tableRowHoverBg || "#fef9c3"; // light yellow

  useEffect(() => {
    async function fetchSalesData() {
      try {
        const res = await axios.get("/api/sale/get-sales-record");
        setSalesData(res.data.allTransactions || []);
      } catch (err) {
        console.error("Failed to fetch sales:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSalesData();
  }, []);

  const downloadSingleSalePDF = (sale: Sale) => {
    const doc = new jsPDF();

    // Store Name Heading - BIG and BOLD
    doc.setFontSize(22);
    doc.setTextColor(220, 50, 50);
    doc.setFont("helvetica", "bold");
    doc.text("NOOR SUPER MART", 14, 18);

    // Receipt title below the store name
    doc.setFontSize(16);
    doc.setTextColor(180, 20, 20);
    doc.text("Sales Receipt", 14, 28);

    // Reset font for content
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    let y = 36;
    doc.text(`Invoice #: ${sale._id.slice(-6)}`, 14, y);
    doc.text(`Customer Name: ${sale.customerName}`, 14, (y += 8));
    doc.text(`Phone Number: ${sale.PhoneNO}`, 14, (y += 8));
    doc.text(
      `Date: ${new Date(sale.createdAt).toLocaleString()}`,
      14,
      (y += 8)
    );
    doc.text(`Payment Type: ${sale.paymentType || "N/A"}`, 14, (y += 8));
    doc.text(
      `Total Amount: Rs ${sale.totalAmount
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
      14,
      (y += 8)
    );

    // Separator line
    doc.setDrawColor(255, 204, 0);
    doc.setLineWidth(0.5);
    doc.line(14, (y += 6), 195, y);

    // Product Table
    autoTable(doc, {
      startY: y + 6,
      head: [["Product", "Brand", "Quantity", "Unit Price", "Total"]],
      body: sale.products.map((p) => [
        typeof p.productId === "string" ? "N/A" : p.productId.name,
        typeof p.productId === "string" ? "N/A" : p.productId.brand,
        p.quantity.toString(),
        `Rs ${p.pricePerUnit.toLocaleString()}`,
        `Rs ${p.totalPrice.toLocaleString()}`,
      ]),
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [255, 204, 0],
        textColor: 20,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });

    // Footer with thank you note
    const finalY = (doc as any).lastAutoTable?.finalY || y + 40;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Thank you for shopping at NOOR SUPER MART!", 14, finalY + 10);
    doc.text("For queries, contact support@example.com", 14, finalY + 16);

    doc.save(`sale-${sale._id.slice(-6)}.pdf`);
  };

  const downloadAllSalesPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor("#d10000");
    doc.text("Sales History Report", 14, 22);

    salesData.forEach((sale, index) => {
      const yOffset = index === 0 ? 30 : doc.lastAutoTable?.finalY + 14 || 30;

      doc.setFontSize(12);
      doc.setTextColor("#000000");
      doc.text(`Sale ID: ${sale._id.slice(-6)}`, 14, yOffset);
      doc.text(`Customer: ${sale.customerName}`, 14, yOffset + 6);
      doc.text(`Phone: ${sale.PhoneNO}`, 14, yOffset + 12);
      doc.text(
        `Date: ${new Date(sale.createdAt).toLocaleString()}`,
        14,
        yOffset + 18
      );
      doc.text(
        `Payment Type: ${sale.paymentType || "N/A"}`,
        14,
        yOffset + 24
      );
      doc.text(
        `Total Amount: Rs ${sale.totalAmount
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
        14,
        yOffset + 30
      );

      autoTable(doc, {
        startY: yOffset + 36,
        head: [["Product", "Brand", "Qty", "Unit Price", "Total"]],
        body: sale.products.map((p) => [
          typeof p.productId === "string" ? "N/A" : p.productId.name,
          typeof p.productId === "string" ? "N/A" : p.productId.brand,
          p.quantity,
          `Rs ${p.pricePerUnit.toLocaleString()}`,
          `Rs ${p.totalPrice.toLocaleString()}`,
        ]),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [255, 204, 0], textColor: 0 },
        margin: { left: 14, right: 14 },
      });
    });

    doc.save("sales-history-all.pdf");
  };

  return (
    <DashboardLayout>
      <div
        className="p-6 md:p-10"
        style={{ background: theme.background, color: theme.text }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-red-600">
            Sales History
          </h1>
          <Button
            onClick={downloadAllSalesPDF}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-4 py-2 rounded-lg shadow flex items-center gap-2"
          >
            <Download size={18} />
            Download All
          </Button>
        </div>

        <Card className={`rounded-2xl shadow-md border border-yellow-500 ${theme.cardBg}`}>
          <CardContent className="p-4 md:p-6 overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center min-h-[200px]">
                <Loader className="animate-spin text-yellow-500 w-10 h-10" />
              </div>
            ) : salesData.length === 0 ? (
              <p className="text-center py-4 text-gray-500">
                No sales records found.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-yellow-400 text-black">
                    <TableHead>Sale ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-center">Download</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesData.map((sale) => (
                    <TableRow
                      key={sale._id}
                      style={{
                        background: tableRowBg,
                        color: tableRowText,
                        transition: "background 0.2s",
                      }}
                      className="group"
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = tableRowHoverBg)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = tableRowBg)
                      }
                    >
                      <TableCell
                        className="text-xs"
                        style={{ color: tableRowText }}
                      >
                        {sale._id.slice(-6)}
                      </TableCell>
                      <TableCell style={{ color: tableRowText }}>
                        {sale.customerName}
                      </TableCell>
                      <TableCell style={{ color: tableRowText }}>
                        {sale.PhoneNO}
                      </TableCell>
                      <TableCell style={{ color: tableRowText }}>
                        {new Date(sale.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-semibold text-red-600">
                        Rs{" "}
                        {sale.totalAmount
                          .toFixed(2)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-yellow-600 border-yellow-500 hover:bg-yellow-100"
                          onClick={() => downloadSingleSalePDF(sale)}
                        >
                          <Download size={16} className="mr-1" />
                          PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
