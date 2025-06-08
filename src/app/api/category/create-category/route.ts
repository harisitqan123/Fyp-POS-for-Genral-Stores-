import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/models/category";
import ImageKit from "imagekit";
import { getToken } from "next-auth/jwt";

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    // Get user from JWT token
    const token = await getToken({ req });
    if (!token || !token.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = token.sub;

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const image = formData.get("image") as File;

    if (!title || !image) {
      return NextResponse.json({ error: "Title and image are required" }, { status: 400 });
    }

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: image.name || "category.jpg",
      folder: "categories",
    });

    const newCategory = await CategoryModel.create({
      title,
      img: uploadResponse.url,
      user: userId, // <-- associate category with user
    });

    return NextResponse.json({
      success: true,
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("Create Category Error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
