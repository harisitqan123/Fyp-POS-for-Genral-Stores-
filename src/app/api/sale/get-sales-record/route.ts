import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import SalesTransaction from "@/models/sale";
import { getToken } from "next-auth/jwt";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  getMonth,
} from "date-fns";

export const GET = async (req: NextRequest) => {
  try {
    await dbConnect();

    // Get user from JWT token
    const token = await getToken({ req });
    if (!token || !token.sub) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const userId = token.sub;

    const now = new Date();

    // Time Ranges
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const yearStart = startOfYear(now);
    const yearEnd = endOfYear(now);

    // Get all transactions for this user, latest first
    const allTransactions = await SalesTransaction.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("products.productId");

    function getAmount(t: any) {
      return typeof t.netAmount === "number"
        ? t.netAmount
        : typeof t.totalAmount === "number"
        ? t.totalAmount
        : typeof t.amount === "number"
        ? t.amount
        : 0;
    }

    const todaySales = allTransactions
      .filter((t) => t.createdAt >= todayStart && t.createdAt <= todayEnd)
      .reduce((sum, t) => sum + getAmount(t), 0);

    const weeklySales = allTransactions
      .filter((t) => t.createdAt >= weekStart && t.createdAt <= weekEnd)
      .reduce((sum, t) => sum + getAmount(t), 0);

    const monthlySales = allTransactions
      .filter((t) => t.createdAt >= monthStart && t.createdAt <= monthEnd)
      .reduce((sum, t) => sum + getAmount(t), 0);

    const yearlySales = allTransactions
      .filter((t) => t.createdAt >= yearStart && t.createdAt <= yearEnd)
      .reduce((sum, t) => sum + getAmount(t), 0);

    // Monthly Chart Data: Jan - Dec
    const monthlySalesChart: number[] = Array(12).fill(0);
    allTransactions.forEach((t) => {
      const monthIndex = getMonth(t.createdAt);
      monthlySalesChart[monthIndex] += getAmount(t);
    });

    // Most Sold Products with image, brand, category, stock
    const productMap: Record<
      string,
      {
        name: string;
        quantity: number;
        image?: string;
        brand?: string;
        category?: string;
        stock?: number;
      }
    > = {};

    allTransactions.forEach((t) => {
      t.products.forEach((p) => {
        const prod = p.productId;
        const prodId = typeof prod === "object" && prod._id ? prod._id.toString() : p.productId?.toString();

        if (!prodId) return;

        const name = prod?.name || p.name || "Unknown";
        const image = prod?.image || "";
        const brand = prod?.brand || "";
        const category = prod?.category || "";
        const stock = prod?.stock || 0;

        if (productMap[prodId]) {
          productMap[prodId].quantity += p.quantity;
        } else {
          productMap[prodId] = {
            name,
            quantity: p.quantity,
            image,
            brand,
            category,
            stock,
          };
        }
      });
    });

    const mostSoldProducts = Object.entries(productMap)
      .map(([productId, data]) => ({
        productId,
        ...data,
        quantitySold: data.quantity,
      }))
      .sort((a, b) => b.quantitySold - a.quantitySold);

    // Sort all sales history latest first (already sorted above)
    const salesHistory = [...allTransactions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      success: true,
      todaySales,
      weeklySales,
      monthlySales,
      yearlySales,
      monthlySalesChart,
      mostSoldProducts,
      allTransactions: salesHistory, // <-- send all sales history, latest first
    });
  } catch (error) {
    console.error("Sales overview error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
