import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/product";
import { getToken } from "next-auth/jwt";


export const GET = async (req: NextRequest) => {
  try {
    await dbConnect();

    // Get user from JWT token
    const token = await getToken({ req });
    if (!token || !token.sub) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const userId = token.sub;

    const { searchParams } = new URL(req.url);
    const p_id = searchParams.get("p_id");

    if (!p_id) {
      return NextResponse.json({ success: false, message: "Product ID (p_id) is required" }, { status: 400 });
    }

    // Find product by id and user
    const product = await ProductModel.findOne({ _id: p_id, user: userId }).populate("category");

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("GET /api/product/get-single-product Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
};
