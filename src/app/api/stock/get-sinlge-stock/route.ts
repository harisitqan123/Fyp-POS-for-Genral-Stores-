import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/dbConnect";
import Stock from "@/models/Stock";

export async function GET(req: NextRequest) {
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

  // Get stock_id from query params
  const { searchParams } = new URL(req.url);
  const stockId = searchParams.get("stock_id");

  if (!stockId) {
    return NextResponse.json(
      { success: false, message: "Stock ID is required" },
      { status: 400 }
    );
  }

  try {
    const stockDetail = await Stock.findOne({ _id: stockId, user: userId }).populate("products.product");

    if (!stockDetail) {
      return NextResponse.json(
        { success: false, message: "Stock not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Stock detail fetched successfully", stockDetail },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}