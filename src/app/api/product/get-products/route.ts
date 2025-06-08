import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/product";
import { getToken } from "next-auth/jwt";

// ✅ API Route to Get Products by User ID
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

    // Find products for this user only
    const products = await ProductModel.find({ user: userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error("❌ Error fetching products:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
};
