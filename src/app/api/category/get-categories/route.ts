import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/models/category";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  await dbConnect(); // Connect to MongoDB

  try {
    // Get user from JWT token
    const token = await getToken({ req });
    if (!token || !token.sub) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const userId = token.sub;

    // Find categories for this user only
    const categories = await CategoryModel.find({ user: userId }).sort({
      createdAt: -1,
    }); // Latest first

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Fetch Categories Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
