// models/Sale.ts

import mongoose, { Schema, Document, Types } from 'mongoose';

interface ISaleProduct {
  productId: Types.ObjectId;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

export interface ISale extends Document {
  user: Types.ObjectId; // The shopkeeper or user who created the sale
  customerName: string;
  PhoneNO: string;
  products: ISaleProduct[];
  totalAmount: number;
  paymentType: 'cash' | 'card' | 'easypaisa' | 'jazzcash';
  createdAt: Date;
  updatedAt: Date;
}

const SaleProductSchema = new Schema<ISaleProduct>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    pricePerUnit: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  { _id: true }
);

const SaleSchema = new Schema<ISale>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // <-- Changed from userId to user
    customerName: { type: String, required: true },
    PhoneNO: { type: String, required: true },
    products: { type: [SaleProductSchema], required: true },
    totalAmount: { type: Number, required: true },
    paymentType: {
      type: String,
      enum: ['cash', 'card', 'easypaisa', 'jazzcash'],
      default: 'cash',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

export default mongoose.models.Sale || mongoose.model<ISale>('Sale', SaleSchema);
