import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User, { ICartItem } from '@/models/user';
import Product from '@/models/product';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  await dbConnect();

  const token = await getToken({ req });
  if (!token?.sub) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized. Please log in.' },
      { status: 401 }
    );
  }

  const user = await User.findById(token.sub).lean();
  if (!user) {
    return NextResponse.json(
      { success: false, message: 'User not found.' },
      { status: 404 }
    );
  }

  // Populate cart products manually
  const populatedCart = await Promise.all(
    user.cart.map(async (cartItem:ICartItem) => {
      const product = await Product.findById(cartItem.productId).lean();
      return {
        product,
        quantity: cartItem.quantity,
      };
    })
  );

  return NextResponse.json(
    {
      success: true,
      cart: populatedCart,
    },
    { status: 200 }
  );
}
