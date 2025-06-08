import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';
import ProductModel from '@/models/product';
import { getToken } from 'next-auth/jwt';

export async function PUT(req: NextRequest) {
  await dbConnect();

  const token = await getToken({ req });
  if (!token?.sub) {
    console.log('❌ No token found');
    return NextResponse.json({ success: false, message: 'Unauthorized. Please log in.' }, { status: 401 });
  }

  const { product_id } = await req.json();
  if (!product_id) {
    console.log('❌ No product_id provided in request body');
    return NextResponse.json({ success: false, message: 'Product ID is required.' }, { status: 400 });
  }

  const user = await User.findById(token.sub);
  if (!user) {
    console.log('❌ User not found with ID:', token.sub);
    return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
  }

  const product = await ProductModel.findById(product_id);
  if (!product) {
    console.log('❌ Product not found with ID:', product_id);
    return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 404 });
  }

  if (product.stock < 1) {
    console.log('⚠️ Product is out of stock:', product.name);
    return NextResponse.json({ success: false, message: `No more stock available for "${product.name}".` }, { status: 400 });
  }

  const cartItemIndex = user.cart.findIndex(item => item.productId.equals(product._id));
  if (cartItemIndex === -1) {
    console.log('❌ Product not in user cart:', product.name);
    return NextResponse.json({ success: false, message: 'Product not found in cart.' }, { status: 404 });
  }

  // ✅ Increase quantity in cart
  user.cart[cartItemIndex].quantity += 1;

  // ✅ Decrease product stock
  product.stock -= 1;

  await user.save();
  await product.save();

  const totalItems = user.cart.length;
  const totalQty = user.cart.reduce((sum, item) => sum + item.quantity, 0);

  console.log('✅ Cart updated. Product:', product.name, '| New quantity:', user.cart[cartItemIndex].quantity);

  return NextResponse.json({
    success: true,
    message: `Quantity of "${product.name}" increased in cart.`,
    cart: user.cart,
    totalItems,
    totalQty,
  }, { status: 200 });
}
