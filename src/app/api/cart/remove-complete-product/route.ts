// File: /app/api/cart/delete-product/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';
import ProductModel from '@/models/product';
import { getToken } from 'next-auth/jwt';

export async function DELETE(req: NextRequest) {
  await dbConnect();

  const token = await getToken({ req });
  if (!token?.sub) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized. Please log in.' },
      { status: 401 }
    );
  }

  const { product_id } = await req.json();
  if (!product_id) {
    return NextResponse.json(
      { success: false, message: 'Product ID is required.' },
      { status: 400 }
    );
  }

  const user = await User.findById(token.sub);
  if (!user) {
    return NextResponse.json(
      { success: false, message: 'User not found.' },
      { status: 404 }
    );
  }

  const product = await ProductModel.findById(product_id);
  if (!product) {
    return NextResponse.json(
      { success: false, message: 'Product not found.' },
      { status: 404 }
    );
  }

  const cartItemIndex = user.cart.findIndex(item =>
    item.productId.equals(product._id)
  );

  if (cartItemIndex === -1) {
    return NextResponse.json(
      { success: false, message: 'Product not found in cart.' },
      { status: 404 }
    );
  }

  const cartItem = user.cart[cartItemIndex];

  // ✅ Add the cart quantity back to product stock
  product.stock += cartItem.quantity;

  // ✅ Remove the product from user's cart
  user.cart.splice(cartItemIndex, 1);

  await product.save();
  await user.save();

  return NextResponse.json(
    {
      success: true,
      message: 'Product removed from cart and stock updated.',
      cart: user.cart,
    },
    { status: 200 }
  );
}
