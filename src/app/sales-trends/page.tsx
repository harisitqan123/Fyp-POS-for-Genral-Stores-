'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Loader } from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useThemePalette } from '@/hooks/useThemePalette';

export default function SalesTrendsPage() {
  const [salesData, setSalesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  const router = useRouter();
  const theme = useThemePalette();

  useEffect(() => {
    async function fetchSalesData() {
      try {
        const response = await axios.get('/api/sale/get-sales-record');
        if (response.status === 200) {
          setSalesData(response.data);
          console.log('Sales Data:', response.data);
        }
      } catch (error) {
        console.error('Error fetching sales data:', error);
        router.push('/error');
      } finally {
        setLoading(false);
      }
    }

    async function fetchCategories() {
      try {
        const response = await axios.get('/api/category/get-categories');
        if (response.status === 200) {
          setCategories(response.data.categories || response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchSalesData();
    fetchCategories();
  }, []);

  useEffect(() => {
    const map: Record<string, string> = {};
    categories.forEach((cat: any) => {
      map[cat._id] = cat.title;
    });
    setCategoryMap(map);
  }, [categories]);

  return (
    <DashboardLayout>
      {loading ? (
        <div className="flex justify-center items-center min-h-[100vh]" style={{ background: theme.background, color: theme.text }}>
          <Loader className="animate-spin text-yellow-500 w-10 h-10" />
        </div>
      ) : (
        <div
          className="container mx-auto py-6 px-4"
          style={{ background: theme.background, color: theme.text }}
        >
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card className={`${theme.cardBg} shadow-md rounded-2xl`}>
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold mb-1" style={{ color: theme.text }}>
                  Today's Sales
                </h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {salesData.todaySales} PKR
                </p>
              </CardContent>
            </Card>
            <Card className={`${theme.cardBg} shadow-md rounded-2xl`}>
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold mb-1" style={{ color: theme.text }}>
                  Weekly Sales
                </h3>
                <p className="text-3xl font-bold text-red-600">
                  {salesData.weeklySales} PKR
                </p>
              </CardContent>
            </Card>
            <Card className={`${theme.cardBg} shadow-md rounded-2xl`}>
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold mb-1" style={{ color: theme.text }}>
                  Monthly Sales
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {salesData.monthlySales} PKR
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Sales Overview Chart */}
            <Card className={`${theme.cardBg} shadow-lg rounded-2xl`}>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text }}>
                  Sales Overview
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={[
                      { label: 'Today', amount: salesData.todaySales },
                      { label: 'Week', amount: salesData.weeklySales },
                      { label: 'Month', amount: salesData.monthlySales },
                    ]}
                  >
                    <XAxis dataKey="label" stroke={theme.text} />
                    <YAxis stroke={theme.text} />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#facc15" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Sales Chart */}
            <Card className={`${theme.cardBg} shadow-lg rounded-2xl`}>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text }}>
                  Monthly Sales Chart
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={salesData.monthlySalesChart.map(
                      (value: number, index: number) => ({
                        month: new Date(0, index).toLocaleString('default', {
                          month: 'short',
                        }),
                        sales: value,
                      })
                    )}
                  >
                    <XAxis dataKey="month" stroke={theme.text} />
                    <YAxis stroke={theme.text} />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Most Sold Products Table */}
          <Card className={`${theme.cardBg} shadow-lg rounded-2xl mt-6`}>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4" style={{ color: theme.text }}>
                Most Sold Products
              </h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Product ID</TableHead>
                      <TableHead className="min-w-[80px]">Image</TableHead>
                      <TableHead className="min-w-[160px]">Name</TableHead>
                      <TableHead className="min-w-[120px]">Brand</TableHead>
                      <TableHead className="min-w-[120px]">Category</TableHead>
                      <TableHead className="min-w-[80px] text-center">Sold</TableHead>
                      <TableHead className="min-w-[80px] text-center">Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesData.mostSoldProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                          No products found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      salesData.mostSoldProducts.map((product: any) => (
                        <TableRow key={product.productId}>
                          <TableCell className="text-xs text-gray-500">{product.productId}</TableCell>
                          <TableCell>
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-contain rounded border"
                              onError={e => (e.currentTarget.src = "/no-image.png")}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.brand || "-"}</TableCell>
                          <TableCell>
                            {categoryMap[product.category] || product.category || "-"}
                          </TableCell>
                          <TableCell className="text-yellow-800 font-semibold text-center">
                            {product.quantitySold}
                          </TableCell>
                          <TableCell className="text-green-700 font-semibold text-center">
                            {product.stock}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
