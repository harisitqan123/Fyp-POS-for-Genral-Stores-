"use client";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { IStock } from "@/models/Stock";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useThemePalette } from "@/hooks/useThemePalette"
import { useRouter } from "next/navigation";

const StockHistoryPage = () => {
  const [stockHistory, setStockHistory] = useState<IStock[]>([]);
  const palette = useThemePalette(); // <-- Use your custom palette
  const router=useRouter();

  const getStockHistory = async () => {
    try {
      const response = await axios.get("/api/stock/get-stock-history");
      if (response.data.success) {
        setStockHistory(response.data.stockHistory);
      }
    } catch (error) {
      console.error("Error fetching stock history:", error);
    }
  };

  useEffect(() => {
    getStockHistory();
  }, []);

  return (
    <DashboardLayout>
      <div
        className={`min-h-screen px-6 md:px-12 py-10 transition-colors ${palette.background}`}
      >
        {/* Page Heading */}
        <div className="mb-10">
          <h1 className={`text-4xl font-bold mb-1 ${palette.heading}`}>📚 Stock History</h1>
          <p className={`text-sm ${palette.textSecondary}`}>
            View and manage stock history records
          </p>
        </div>

        {/* Card with Table */}
        <Card
          className={`
            ${palette.cardBg}
            ${palette.card.border}
            ${palette.card?.bg || ""}
            ${palette.card?.text || ""}
            ${palette.card?.border || ""}
            shadow-md
          `}
        >
          <CardHeader>
            <CardTitle className={palette.card.text}>
              Stock History Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stockHistory.length === 0 ? (
              <p className={palette.textSecondary}>
                No records available yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className={palette.tableHeaderBg}>
                    <TableRow>
                      <TableHead className={`${palette.tableHead} uppercase text-xs font-bold`}>
                        Stock ID
                      </TableHead>
                      <TableHead className={`${palette.tableHead} uppercase text-xs font-bold`}>
                        Date & Time
                      </TableHead>
                      <TableHead className={`${palette.tableHead} uppercase text-xs font-bold`}>
                        Total Products
                      </TableHead>
                      <TableHead className={`${palette.tableHead} uppercase text-xs font-bold`}>
                        Total Quantities
                      </TableHead>
                      <TableHead className={`${palette.tableHead} uppercase text-xs font-bold`}>
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockHistory.map((stock) => (
                      <TableRow
                        key={stock._id}
                        className={`${palette.rowHover} transition`}
                      >
                        <TableCell className={`font-mono ${palette.textPrimary}`}>
                          {stock._id}
                        </TableCell>
                        <TableCell className={palette.textPrimary}>
                          {new Date(stock.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell className={palette.textPrimary}>
                          {stock.products.length}
                        </TableCell>
                        <TableCell className={palette.textPrimary}>
                          {stock.products.reduce(
                            (sum, p) => sum + (p.quantity || 0),
                            0
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => router.push(`/stock-history/${stock._id}`)}
                            variant="destructive"
                            size="sm"
                            className="rounded-full px-4"
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StockHistoryPage;