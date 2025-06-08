import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface IUser extends Document {
  name: string;           // Shopkeeper Name
  username: string;
  password: string;
  
  // Store details
  storeName: string;
  ownerName: string;
  storeType: string;
  phone: string;
  address: string;
  registrationDate: Date;

  cart: ICartItem[];
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: {  // Shopkeeper Name
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    // Store information fields
    storeName: {
      type: String,
      required: true,
      default: 'Noor Superstore',
    },
    ownerName: {
      type: String,
      required: true,
      default: 'Zia Khan',
    },
    storeType: {
      type: String,
      required: true,
      default: 'Grocery & General',
    },
    phone: {
      type: String,
      required: true,
      default: '+92 312 3456789',
    },
   
    address: {
      type: String,
      required: true,
      default: 'Main Bazar, Block A, Karachi',
    },
    registrationDate: {
      type: Date,
      required: true,
      default: new Date(),
    },

    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
