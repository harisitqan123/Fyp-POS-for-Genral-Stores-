"use client";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { IStock } from "@/models/Stock";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {useThemePalette} from "@/hooks/useThemePalette";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaBoxOpen } from "react-icons/fa";
import { Loader } from "lucide-react";

const StockDetailPage = () => {
  const palette = useThemePalette();
  const params = useParams();
  const stockId: string = params?.id as string;
  const [stockDetail, setStockDetail] = useState<IStock | null>(null);
  const [loading, setLoading] = useState(false);

  const getStockDetail = async (stockId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/stock/get-sinlge-stock?stock_id=${stockId}`);
      if (response.data.success) {
        setStockDetail(response.data.stockDetail);
      }
    } catch (error) {
      console.error("Error fetching stock detail:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (stockId) {
      getStockDetail(stockId);
    }
  }, [stockId]);

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 border-b border-yellow-500 pb-4 flex items-center gap-3">
          <FaBoxOpen className="text-3xl text-yellow-500" />
          <div>
            <h1 className={`text-3xl font-bold ${palette.heading}`}>Stock Detail</h1>
            <p className={`text-sm ${palette.textSecondary}`}>Detailed view of selected stock entry.</p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[70vh]">
             <Loader className=" text-xl text-orange-400 animate-spin" />
          </div>
        ) : !stockDetail ? (
          <p className="text-red-500">No stock detail found.</p>
        ) : (
          <div className={`rounded-2xl shadow-md p-6 space-y-4 border ${palette.card.border} ${palette.cardBg}`}>
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <span className="text-gray-600 font-semibold">Stock ID:</span>{" "}
                <span className={palette.textPrimary}>{stockDetail._id}</span>
              </div>
              <div>
                <span className="text-gray-600 font-semibold">Date:</span>{" "}
                <span className={palette.textPrimary}>
                  {new Date(stockDetail.createdAt).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600 font-semibold">Total Products:</span>{" "}
                <span className={palette.textPrimary}>{stockDetail.products.length}</span>
              </div>
            </div>

            {/* Products Table */}
            <div>
              <span className="text-gray-600 font-semibold block mb-2">Products:</span>
              <div className="overflow-x-auto rounded-lg border border-yellow-200">
                <Table>
                  <TableHeader className={palette.tableHeaderBg}>
                    <TableRow>
                      <TableHead className={palette.tableHead}>Image</TableHead>
                      <TableHead className={palette.tableHead}>Name</TableHead>
                      <TableHead className={palette.tableHead}>Brand</TableHead>
                      <TableHead className={palette.tableHead}>SKU/Barcode</TableHead>
                      <TableHead className={palette.tableHead}>Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockDetail.products.map((p, idx) => {
                      const product: any = p.product;
                      return (
                        <TableRow key={idx} className={palette.rowHover}>
                          <TableCell className="tableBodyText">
                            <img
                              src={product?.image || "/no-image.png"}
                              alt={product?.name || "Product"}
                              className="w-12 h-12 object-contain rounded bg-gray-100"
                              onError={e => (e.currentTarget.src = "/no-image.png")}
                            />
                          </TableCell>
                          <TableCell className={`font-medium  ${palette.textPrimary}`}>
                            {product?.name || "Unnamed Product"}
                          </TableCell>
                          <TableCell className={`font-medium  ${palette.textPrimary}`}>
                            {product?.brand || <span className="text-gray-400">-</span>}
                          </TableCell>
                          <TableCell className={`font-medium  ${palette.textPrimary}`}>
                            {product?.sku || product?.barcode || <span className="text-gray-400">-</span>}
                          </TableCell>
                          <TableCell className={`font-medium  ${palette.textPrimary}`}>
                            {p.quantity}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            {stockDetail.note && (
              <div>
                <span className="text-gray-600 font-semibold">Note:</span>{" "}
                <span className={palette.textPrimary}>{stockDetail.note}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StockDetailPage;
