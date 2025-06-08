"use client";

import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-12">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row rounded-3xl shadow-2xl overflow-hidden bg-white/80 dark:bg-gray-900/70 backdrop-blur-lg border border-yellow-200 dark:border-gray-700 transition-all">
        
        {/* Right Side - Login (Order First on Mobile) */}
        <div className="order-1 lg:order-2 w-full lg:w-1/2 flex flex-col justify-center px-8 py-12 sm:px-12 bg-white dark:bg-gray-900 rounded-b-3xl lg:rounded-r-3xl lg:rounded-bl-none">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
            Welcome Back 👋
          </h2>

          <LoginForm />
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300"
            >
              Register here
            </Link>
          </p>

          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} POS Dashboard. All rights reserved.
          </p>
        </div>

        {/* Left Side - Features (Order Second on Mobile) */}
        <div className="order-2 lg:order-1 w-full lg:w-1/2 p-10 lg:p-12 bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 text-gray-900 flex flex-col justify-center relative">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none z-0" />
          <div className="relative z-10">
            <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 drop-shadow-xl">
              POS Shopkeeper Dashboard
            </h1>
            <p className="text-lg font-light leading-relaxed mb-8 max-w-xl">
              Easily manage sales, inventory, and products with a smart and user-friendly POS system.
            </p>
            <ul className="list-disc pl-5 space-y-3 text-md font-medium">
              <li>Secure authentication for shopkeepers</li>
              <li>Quick product scanning via QR code</li>
              <li>Live inventory & sales tracking</li>
              <li>Support for light & dark themes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
