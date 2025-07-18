import mongoose, { Schema, model, Document, models, Types } from "mongoose";

// ✅ Define Product Interface
export interface IProduct extends Document {
  name: string;
  sku: string;
  category: mongoose.Schema.Types.ObjectId;
  brand: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  minStock: number;
  barcode?: string;
  qrCodeUrl?: string;
  image?: string;
  discount?: number;
  ownerNotes?: string;
  user: Types.ObjectId; // <-- Added user field
  createdAt?: Date;
  updatedAt?: Date;
}

// ✅ Define Product Schema
const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, unique: true, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: String, required: true, trim: true },
    purchasePrice: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    minStock: { type: Number, default: 10 },
    barcode: { type: String, unique: true, sparse: true },
    qrCodeUrl: { type: String },
    image: { type: String, default: "" },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    ownerNotes: { type: String, trim: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // <-- Added user field
  },
  {
    timestamps: true, // ✅ Adds createdAt & updatedAt automatically
  }
);

// ✅ Ensure we do not recompile the model if it already exists
const ProductModel = models.Product || model<IProduct>("Product", productSchema);

export default ProductModel;
