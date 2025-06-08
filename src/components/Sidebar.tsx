'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { signOut } from 'next-auth/react';

import {
  FiMenu,
  FiChevronDown,
  FiChevronRight,
  FiHome,
  FiTrendingUp,
  FiClock,
  FiArchive,
  FiBookOpen,
  FiSettings,
  FiBox,
  FiLayers,
  FiLogOut,
} from 'react-icons/fi';

import { RootState } from '@/Redux Store';
import { toggleSidebar, toggleInventory } from '@/Redux Store/sidebar';
import { useThemePalette } from '@/hooks/useThemePalette';

export default function Sidebar() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const sidebartheme = useThemePalette().sidebar;

  const isExpanded = useSelector((state: RootState) => state.sidebar.isExpanded);
  const inventoryExpanded = useSelector((state: RootState) => state.sidebar.inventoryExpended);

  const sidebarLinks = [
    { href: '/dashboard', icon: <FiHome size={22} />, label: 'POS Register' },
    { href: '/sales-trends', icon: <FiTrendingUp size={22} />, label: 'Sales Trends' },
    { href: '/sales-history', icon: <FiClock size={22} />, label: 'Sales History' },
    { href: '/stock-management', icon: <FiArchive size={22} />, label: 'Stock Management' },
    { href: '/stock-history', icon: <FiBookOpen size={22} />, label: 'Stock History' },
  ];

  return (
    <motion.aside
      initial={{ width: isExpanded ? 320 : 88 }}
      animate={{ width: isExpanded ? 320 : 88 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`sticky top-0 min-h-screen max-h-screen z-20 p-4 shadow-lg flex flex-col items-center overflow-hidden ${sidebartheme.background} ${sidebartheme.text}`}
    >
      {/* Toggle Sidebar Button */}
      <button
        aria-label="Toggle Sidebar"
        onClick={() => dispatch(toggleSidebar())}
        className={`absolute top-4 right-[-20px] p-2 rounded-full shadow-md transition ${sidebartheme.toggleBg} ${sidebartheme.toggleText} ${sidebartheme.toggleHoverBg} ${sidebartheme.toggleHoverText} focus:outline-none focus:ring-2 focus:ring-yellow-500`}
      >
        <FiMenu size={24} />
      </button>

      {/* Navigation Links */}
      <nav className="mt-10 flex flex-col gap-4 w-full">
        {sidebarLinks.map((link) => (
          <SidebarItem key={link.href} {...link} isExpanded={isExpanded} sidebarTheme={sidebartheme} />
        ))}

        {/* Inventory Dropdown */}
        <div className="w-full">
          <button
            aria-expanded={inventoryExpanded}
            onClick={() => dispatch(toggleInventory())}
            className={`flex items-center justify-between w-full p-3 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-yellow-500 ${sidebartheme.itemHoverBg} ${sidebartheme.itemHoverText}`}
          >
            <div className="flex items-center space-x-3">
              <FiLayers size={22} />
              {isExpanded && <span className="text-lg pr-6">Inventory</span>}
            </div>
            {inventoryExpanded ? <FiChevronDown /> : <FiChevronRight />}
          </button>

          {inventoryExpanded && (
            <div className={`flex flex-col gap-2 mt-2 ${isExpanded ? 'pl-8' : 'items-end'}`}>
              <SidebarItem
                href="/product-management"
                icon={<FiBox size={18} />}
                label="Product Management"
                isExpanded={isExpanded}
                sidebarTheme={sidebartheme}
                small
              />
              <SidebarItem
                href="/category-management"
                icon={<FiLayers size={18} />}
                label="Category Management"
                isExpanded={isExpanded}
                sidebarTheme={sidebartheme}
                small
              />
            </div>
          )}
        </div>
      </nav>

      {/* Settings */}
      <div className="mt-6 w-full">
        <SidebarItem
          href="/setting"
          icon={<FiSettings size={22} />}
          label="Settings"
          isExpanded={isExpanded}
          sidebarTheme={sidebartheme}
        />
      </div>

      {/* Logout */}
      <div className="mt-auto mb-5 w-full">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className={`flex items-center space-x-3 p-3 rounded-lg w-full cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-red-500 ${sidebartheme.itemHoverBg} ${sidebartheme.itemHoverText}`}
        >
          <FiLogOut size={22} />
          {isExpanded && <span className="text-lg">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}

const SidebarItem = ({
  href,
  icon,
  label,
  isExpanded,
  sidebarTheme,
  small = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isExpanded: boolean;
  sidebarTheme: any;
  small?: boolean;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  const activeClasses = `${sidebarTheme.itemActiveBg} ${sidebarTheme.itemActiveText} font-bold`;
  const hoverClasses = `${sidebarTheme.itemHoverBg} ${sidebarTheme.itemHoverText}`;
  const textSize = small ? 'text-sm' : 'text-lg';

  return (
    <Link href={href} passHref>
      <div
        className={`flex items-center space-x-3 p-3 rounded-lg transition w-full cursor-pointer ${
          isActive ? activeClasses : hoverClasses
        }`}
        tabIndex={0}
      >
        {icon}
        {isExpanded && <span className={textSize}>{label}</span>}
      </div>
    </Link>
  );
};
