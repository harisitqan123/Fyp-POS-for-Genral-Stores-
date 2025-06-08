import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/product";
import QRCode from "qrcode";
import bwipjs from "bwip-js";
import { imagekit } from "../../category/create-category/route";
import { getToken } from "next-auth/jwt"; // <-- Add this import

// Helper to upload buffer to ImageKit
const uploadToImageKit = async (
  buffer: Buffer,
  fileName: string,
  folder = "products"
) => {
  return await imagekit.upload({
    file: buffer,
    fileName,
    folder,
  });
};

// API Route to Add Product
export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();

    // Get user from JWT token
    const token = await getToken({ req });
    if (!token || !token.sub) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = token.sub;

    console.log("➡️ Reading formData from request...");
    const formData = await req.formData();

    const name = formData.get("name")?.toString();
    const sku = formData.get("sku")?.toString();
    const category = formData.get("category")?.toString();
    const brand = formData.get("brand")?.toString();
    const purchasePrice = Number(formData.get("purchasePrice"));
    const sellingPrice = Number(formData.get("sellingPrice"));
    const stock = Number(formData.get("stock")); // <-- stock field
    const minStock = Number(formData.get("minStock") || 0); // <-- minStock field
    const discount = Number(formData.get("discount") || 0);
    const ownerNotes = formData.get("ownerNotes")?.toString();

    console.log("📦 Form Data:", {
      name,
      sku,
      category,
      brand,
      purchasePrice,
      sellingPrice,
      stock,
      minStock,
      discount,
      ownerNotes,
    });

    const imageFile = formData.get("image") as File;
    if (!imageFile || !(imageFile instanceof File)) {
      console.log("❌ Missing product image.");
      return NextResponse.json({ message: "Product image is required." }, { status: 400 });
    }

    // Check required fields (allow 0 values)
    if (
      !name ||
      !sku ||
      !category ||
      !brand ||
      purchasePrice === undefined ||
      sellingPrice === undefined ||
      stock === undefined
    ) {
      console.log("❌ Missing required fields (after explicit check).");
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    // Upload main product image
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const imageUpload = await uploadToImageKit(imageBuffer, `${sku}-product-image`);
    console.log("✅ Product image uploaded:", imageUpload.url);

    // Generate QR Code from SKU
    const qrBuffer = await QRCode.toBuffer(sku, { type: "png" });
    const qrUpload = await uploadToImageKit(qrBuffer, `${sku}-qr`);
    console.log("✅ QR code generated and uploaded:", qrUpload.url);

    // Generate Barcode using bwip-js
    const barcodeBuffer = await new Promise<Buffer>((resolve, reject) => {
      bwipjs.toBuffer(
        {
          bcid: "code128",
          text: sku,
          scale: 3,
          height: 10,
          includetext: true,
          textxalign: "center",
        },
        (err: Error | null, png: Buffer) => {
          if (err) return reject(err);
          resolve(png);
        }
      );
    });
    const barcodeUpload = await uploadToImageKit(barcodeBuffer, `${sku}-barcode`);
    console.log("✅ Barcode generated and uploaded:", barcodeUpload.url);

    // Create Product in DB including stock and minStock and user
    const newProduct = await ProductModel.create({
      name,
      sku,
      category,
      brand,
      purchasePrice,
      sellingPrice,
      stock,     // <--- saved in DB
      minStock,  // <--- saved in DB
      discount,
      ownerNotes,
      image: imageUpload.url,
      qrCodeUrl: qrUpload.url,
      barcode: sku,
      user: userId, // <-- associate product with user
    });

    console.log("✅ Product created successfully in DB:", newProduct._id);

    return NextResponse.json({ message: "Product added successfully", product: newProduct });
  } catch (error: any) {
    console.error("❌ Product Creation Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};
