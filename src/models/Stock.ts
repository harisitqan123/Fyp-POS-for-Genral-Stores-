import mongoose, { Schema, Document, Types } from "mongoose";

export interface IStockProduct {
  product: Types.ObjectId; // Product reference
  quantity: number; // Quantity added
}

export interface IStock extends Document {
  user: Types.ObjectId; // User who performed the stock operation
  products: IStockProduct[]; // Array of products and their quantities
  note?: string; // Optional note for the stock movement
  createdAt: Date;
  updatedAt: Date;
}

const StockProductSchema = new Schema<IStockProduct>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const StockSchema = new Schema<IStock>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: { type: [StockProductSchema], required: true },
    note: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Stock || mongoose.model<IStock>("Stock", StockSchema);