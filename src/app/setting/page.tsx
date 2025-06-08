'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '@/Redux Store/themeSlice';
import { RootState } from '@/Redux Store';
import { themePalette } from '@/lib/themePalette';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function SettingsPage() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const theme = isDarkMode ? themePalette.dark.settings : themePalette.light.settings;

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <DashboardLayout>
      <div className={`min-h-screen px-6 md:px-12 py-10 ${theme.background} ${theme.text} transition-all`}>
        {/* Page Heading */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-1">⚙️ Settings</h1>
          <p className="text-sm text-muted-foreground">Manage store and personal settings</p>
        </div>

        <div className="grid grid-cols-1  gap-8">
          {/* Appearance Settings */}
          <Card className="rounded-2xl border shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">🌓 Appearance</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between px-4 py-2">
              <div>
                <p className="text-sm font-medium">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Toggle between Light and Dark Theme</p>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={handleThemeToggle}
                className="data-[state=checked]:bg-orange-500"
              />
            </CardContent>
          </Card>

          {/* Store Information */}
          <Card className="rounded-2xl border shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">🏪 Store Info</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 py-2 text-sm">
              <InfoItem label="Store Name" value="Noor Superstore" />
              <InfoItem label="Shopkeeper Name" value="Noman Khan" />
              <InfoItem label="Owner Name" value="Zia Khan" />
              <InfoItem label="Store Type" value="Grocery & General" />
              <InfoItem label="Phone" value="+92 312 3456789" />
              <InfoItem label="Email" value="noorshop@pos.com" />
              <InfoItem label="Address" value="Main Bazar, Block A, Karachi" />
              <InfoItem label="Registration Date" value="24 May, 2024" />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
