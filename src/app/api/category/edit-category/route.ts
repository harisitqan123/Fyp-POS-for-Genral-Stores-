import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/models/category";
import { imagekit } from "../create-category/route";
import { getToken } from "next-auth/jwt";

export const PUT = async (req: NextRequest) => {
  try {
    await dbConnect();

    // Get user from JWT token
    const token = await getToken({ req });
    if (!token || !token.sub) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = token.sub;

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("id");

    if (!categoryId) {
      return NextResponse.json({ message: "Category ID is required." }, { status: 400 });
    }

    // Read form data
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const imageFile = formData.get("img") as File | null;

    if (!title) {
      console.log("Title is empty");
      return NextResponse.json({ message: "Title is required." }, { status: 400 });
    }

    let imageUrl;

    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: imageFile.name,
        folder: "/categories",
      });

      imageUrl = uploadResponse.url;
    }

    // Update category only if it belongs to the user
    const updatedCategory = await CategoryModel.findOneAndUpdate(
      { _id: categoryId, user: userId },
      {
        title,
        ...(imageUrl && { img: imageUrl }),
      },
      { new: true }
    );

    if (!updatedCategory) {
      return NextResponse.json({ message: "Category not found or not authorized." }, { status: 404 });
    }

    return NextResponse.json({
      message: "Category updated successfully!",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Edit Category Error:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
};
