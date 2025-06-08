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

  try {
    // Find all stock logs for this user, most recent first
    const stockHistory = await Stock.find({ user: userId })
      .populate("products.product")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        message: "Stock history fetched successfully",
        stockHistory,
      },
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