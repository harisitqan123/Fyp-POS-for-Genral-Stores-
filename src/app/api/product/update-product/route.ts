import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/models/product";
import QRCode from "qrcode";
import bwipjs from "bwip-js";
import { imagekit } from "../../category/create-category/route";
import { Types } from "mongoose";
import { getToken } from "next-auth/jwt"; // <-- Add this import

// ✅ Helper to upload buffer to ImageKit
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

// ✅ API Route to Update Product
export const PUT = async (req: NextRequest) => {
  try {
    await dbConnect();

    // Get user from JWT token
    const token = await getToken({ req });
    if (!token || !token.sub) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = token.sub;

    // ⬇️ Extract `p_id` from query
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("p_id");

    if (!productId || !Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ message: "Invalid or missing product ID" }, { status: 400 });
    }

    const formData = await req.formData();

    // Find product by id and user
    const existingProduct = await ProductModel.findOne({ _id: productId, user: userId });
    if (!existingProduct) {
      return NextResponse.json({ message: "Product not found or not authorized" }, { status: 404 });
    }

    const name = formData.get("name")?.toString();
    const sku = formData.get("sku")?.toString();
    const category = formData.get("category")?.toString();
    const brand = formData.get("brand")?.toString();
    const purchasePrice = Number(formData.get("purchasePrice"));
    const sellingPrice = Number(formData.get("sellingPrice"));
    const stock = Number(formData.get("stock"));
    const minStock = Number(formData.get("minStock") || 0);
    const discount = Number(formData.get("discount") || 0);
    const ownerNotes = formData.get("ownerNotes")?.toString();

    // ✅ Check required fields
    if (!name || !sku || !category || !brand || isNaN(purchasePrice) || isNaN(sellingPrice) || isNaN(stock)) {
      return NextResponse.json({ message: "Missing or invalid required fields." }, { status: 400 });
    }

    // ✅ Handle optional image upload
    let updatedImageUrl = existingProduct.image;
    const imageFile = formData.get("image") as File;

    if (imageFile && imageFile instanceof File) {
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      const imageUpload = await uploadToImageKit(imageBuffer, `${sku}-product-image`);
      updatedImageUrl = imageUpload.url;
    }

    // ✅ Regenerate QR and barcode if SKU has changed
    let updatedQRUrl = existingProduct.qrCodeUrl;
    let updatedBarcode = existingProduct.barcode;

    if (sku !== existingProduct.sku) {
      const qrBuffer = await QRCode.toBuffer(sku, { type: "png" });
      const qrUpload = await uploadToImageKit(qrBuffer, `${sku}-qr`);
      updatedQRUrl = qrUpload.url;

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
          (err, png) => {
            if (err) return reject(err);
            resolve(png);
          }
        );
      });

      await uploadToImageKit(barcodeBuffer, `${sku}-barcode`);
      updatedBarcode = sku;
    }

    // ✅ Update product in DB (ensure user matches)
    const updatedProduct = await ProductModel.findOneAndUpdate(
      { _id: productId, user: userId },
      {
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
        image: updatedImageUrl,
        qrCodeUrl: updatedQRUrl,
        barcode: updatedBarcode,
      },
      { new: true }
    );

    return NextResponse.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error: any) {
    console.error("❌ Product Update Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
};
