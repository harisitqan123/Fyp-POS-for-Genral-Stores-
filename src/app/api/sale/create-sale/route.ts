import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { getToken } from 'next-auth/jwt';
import User from '@/models/user';
import Sale from '@/models/sale';

export async function POST(req: NextRequest) {
  await dbConnect();

  const token = await getToken({ req });
  if (!token?.sub) {
    return NextResponse.json({ success: false, message: 'Unauthorized. Please log in.' }, { status: 401 });
  }

  const { customerName, paymentType, phoneNumber } = await req.json();

  if (!customerName) {
    return NextResponse.json({ success: false, message: 'Customer name is required.' }, { status: 400 });
  }

  if (!phoneNumber) {
    return NextResponse.json({ success: false, message: 'Phone number is required.' }, { status: 400 });
  }

  const user = await User.findById(token.sub).populate('cart.productId');
  if (!user) {
    return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
  }

  if (!user.cart || user.cart.length === 0) {
    return NextResponse.json({ success: false, message: 'Cart is empty.' }, { status: 400 });
  }

  let totalAmount = 0;
  const saleProducts = [];

  for (const item of user.cart) {
    const product = item.productId;
    if (!product || typeof product.sellingPrice !== 'number') {
      return NextResponse.json({
        success: false,
        message: `Invalid product or missing price for item with ID ${item.productId}`,
      }, { status: 400 });
    }

    const quantity = item.quantity;
    const pricePerUnit = product.sellingPrice;
    const totalPrice = quantity * pricePerUnit;

    saleProducts.push({
      productId: product._id,
      quantity,
      pricePerUnit,
      totalPrice,
    });

    totalAmount += totalPrice;
  }

  // Use user field (not userId) for Sale model
  const sale = await Sale.create({
    user: user._id, // <-- associate sale with user
    customerName,
    PhoneNO: phoneNumber,
    products: saleProducts,
    totalAmount,
    paymentType: paymentType || 'cash',
  });

  // ✅ Clear the cart after recording the sale
  user.cart = [];
  await user.save();

  return NextResponse.json({
    success: true,
    message: 'Sale recorded successfully.',
    sale,
  }, { status: 201 });
}
