import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user';
import ProductModel from '@/models/product';
import { getToken } from 'next-auth/jwt';

export async function PUT(req: NextRequest) {
  await dbConnect();

  const token = await getToken({ req });
  if (!token?.sub) {
    console.log('❌ Unauthorized request.');
    return NextResponse.json(
      { success: false, message: 'Unauthorized. Please log in.' },
      { status: 401 }
    );
  }

  const { product_id } = await req.json();
  console.log('🔐 Authenticated user ID:', token.sub);
  console.log('📦 Requested product ID:', product_id);

  const user = await User.findById(token.sub);
  if (!user) {
    console.log('❌ User not found:', token.sub);
    return NextResponse.json(
      { success: false, message: 'User not found.' },
      { status: 404 }
    );
  }

  const product = await ProductModel.findById(product_id);
  if (!product) {
    console.log('❌ Product not found:', product_id);
    return NextResponse.json(
      { success: false, message: 'Product not found.' },
      { status: 404 }
    );
  }

  if (product.stock < 1) {
    console.log('❌ No stock left for product:', product.name);
    return NextResponse.json(
      { success: false, message: 'No more stock available for this product.' },
      { status: 400 }
    );
  }

  const cartItemIndex = user.cart.findIndex(item =>
    item.productId.equals(product._id)
  );

  if (cartItemIndex !== -1) {
    // 🔁 Product already in cart → increase quantity
    user.cart[cartItemIndex].quantity += 1;
    
  } else {
    // 🆕 Product not in cart → push new item
    user.cart.push({
      productId: product._id,
      quantity: 1,
      
    });
    
  }

  // 🛑 Decrease stock
  product.stock -= 1;

  // 💾 Save updates
  await user.save();
  await product.save();

  console.log('✅ Cart and product stock updated.');
  return NextResponse.json(
    {
      success: true,
      message: 'Product added to cart successfully.',
      user: user,
      
    },
    { status: 200 }
  );
}
