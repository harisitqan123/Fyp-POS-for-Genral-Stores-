import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/product";
import { getToken } from "next-auth/jwt";

// ✅ DELETE route to delete a product by ID (via query string) and user ID
export const DELETE = async (req: NextRequest) => {
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

    const searchParams = req.nextUrl.searchParams;
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required in query." },
        { status: 400 }
      );
    }

    // Only delete if the product belongs to the current user
    const deletedProduct = await ProductModel.findOneAndDelete({
      _id: productId,
      user: userId,
    });

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found or not authorized." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error: any) {
    console.error("❌ Delete Product Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
