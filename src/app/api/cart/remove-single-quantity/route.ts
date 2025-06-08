// File: /app/api/cart/decrease-single-quantity/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';
import ProductModel from '@/models/product';
import { getToken } from 'next-auth/jwt';

export async function PUT(req: NextRequest) {
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

  // ✅ Decrease cart quantity
  const cartItem = user.cart[cartItemIndex];

  if (cartItem.quantity <= 1) {
    // Remove product from cart if quantity is 1 or less
    user.cart.splice(cartItemIndex, 1);
  } else {
    user.cart[cartItemIndex].quantity -= 1;
  }

  // ✅ Increase product stock
  product.stock += 1;

  await user.save();
  await product.save();

  return NextResponse.json(
    {
      success: true,
      message: 'Product quantity decreased in cart.',
      cart: user.cart,
    },
    { status: 200 }
  );
}
