"use client";

import React, { ReactNode, useState } from "react";
import { HomeIcon, ShoppingCartIcon, CubeIcon, CogIcon, Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button"; // shadcn Button component
import Sidebar from "../Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: "Dashboard", icon: HomeIcon, href: "/dashboard" },
  { label: "Sales", icon: ShoppingCartIcon, href: "/sales" },
  { label: "Products", icon: CubeIcon, href: "/products" },
  { label: "Settings", icon: CogIcon, href: "/settings" },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  
  
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">

      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-h-screen">
       

        <main className="flex-1 ">{children}</main>
      </div>
    </div>
  );
}
