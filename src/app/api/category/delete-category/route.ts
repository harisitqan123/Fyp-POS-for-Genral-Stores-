import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/models/category";
import { getToken } from "next-auth/jwt";

export async function DELETE(req: NextRequest) {
  await dbConnect(); // Connect to MongoDB

  // Get user from JWT token
  const token = await getToken({ req });
  if (!token || !token.sub) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  const userId = token.sub;

  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("id");

  if (!categoryId) {
    return NextResponse.json(
      { success: false, message: "Category ID is required" },
      { status: 400 }
    );
  }

  try {
    // Only delete if the category belongs to the current user
    const deleted = await CategoryModel.findOneAndDelete({
      _id: categoryId,
      user: userId,
    });

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Category not found or not authorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete Category Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete category" },
      { status: 500 }
    );
  }
}
