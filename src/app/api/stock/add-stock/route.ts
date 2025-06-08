import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/dbConnect";
import Stock from "@/models/Stock";
import Product from "@/models/product";


export async function POST(req: NextRequest) {
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
    const { products, note } = await req.json();

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { success: false, message: "No products provided" },
        { status: 400 }
      );
    }

    // Validate all products exist
    const productIds = products.map((p: any) => p.product);
    const foundProducts = await Product.find({ _id: { $in: productIds } });
    if (foundProducts.length !== products.length) {
      return NextResponse.json(
        { success: false, message: "One or more products not found" },
        { status: 404 }
      );
    }

    // Update product stock quantities
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) continue;

      // Only allow positive quantity
      const qty = Math.abs(Number(item.quantity)) || 0;
      if (qty === 0) continue;

      // Always add stock (no OUT operation)
      product.stock += qty;
      await product.save();
    }

    // Create stock log
    const stockLog = await Stock.create({
      user: userId,
      products,
      note,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Stock updated successfully",
        stock: stockLog,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}