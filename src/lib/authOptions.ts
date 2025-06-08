import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect"; // Adjust path if needed

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Your username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ username: credentials?.username });

        if (!user) throw new Error("Invalid username or password");

        const isPasswordCorrect = await bcrypt.compare(
          credentials!.password,
          user.password
        );

        if (!isPasswordCorrect) throw new Error("Invalid username or password");

        // Return minimal user info for the session
        return {
          id: user._id.toString(),
          name: user.name,
          username: user.username,
          storeName: user.storeName,
          ownerName: user.ownerName,
          storeType: user.storeType,
          phone: user.phone,
          email: user.email,
          address: user.address,
          registrationDate: user.registrationDate,
          // role is omitted because single role setup, but you can add if you want
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.username = user.username;
        token.storeName = user.storeName;
        token.ownerName = user.ownerName;
        token.storeType = user.storeType;
        token.phone = user.phone;
        token.email = user.email;
        token.address = user.address;
        token.registrationDate = user.registrationDate;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.username = token.username;
        session.user.storeName = token.storeName;
        session.user.ownerName = token.ownerName;
        session.user.storeType = token.storeType;
        session.user.phone = token.phone;
        session.user.email = token.email;
        session.user.address = token.address;
        session.user.registrationDate = token.registrationDate;
      }
      return session;
    },
  },
  pages: {
    signIn: "/", // your custom sign-in page
  },
  secret: process.env.NEXTAUTH_SECRET,
};
