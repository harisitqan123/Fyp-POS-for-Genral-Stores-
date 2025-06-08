import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/dbConnect';
import User from '@/models/user';

connectDB();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      username,
      password,
      storeName,
      ownerName,
      storeType,
      phone,
      address,
      registrationDate,
    } = body;

    if (
      !name ||
      !username ||
      !password ||
      !storeName ||
      !ownerName ||
      !storeType ||
      !phone ||
      !address
    ) {
      return NextResponse.json(
        { success: false, message: 'All required fields must be provided.' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Username already taken.' },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      username,
      password: hashedPassword,
      storeName,
      ownerName,
      storeType,
      phone,
      address,
      registrationDate: registrationDate ? new Date(registrationDate) : new Date(),
      cart: [],
    });

    await newUser.save();

    const userObj = newUser.toObject();
    delete userObj.password;

    return NextResponse.json({ success: true, user: userObj }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
