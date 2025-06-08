// models/category.ts
import mongoose, { Schema, model, Document, models, Types } from "mongoose";

// 1. Define the category interface
export interface ICategory extends Document {
  title: string;
  img: string;
  user: Types.ObjectId; // <-- Add user field
  createdAt: Date;
  updatedAt: Date;
}

// 2. Define the schema
const categorySchema = new Schema<ICategory>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    img: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// 3. Check if model exists to prevent redefinition during hot-reload in Next.js
const CategoryModel = models.Category as mongoose.Model<ICategory> || model<ICategory>("Category", categorySchema);

// 4. Export the model
export default CategoryModel;
