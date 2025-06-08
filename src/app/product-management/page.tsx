"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteProductModal from "@/components/DeleteProductModal";
import { useThemePalette } from "@/hooks/useThemePalette";
import { useSelector } from "react-redux";



const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const isDarkMode = useSelector((state: any) => state.theme.isDarkMode);
  const theme = useThemePalette();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("api/product/get-products");
      setProducts(res.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('api/category/get-categories');
      const categoryMap = { All: "All" };
      res.data.categories.forEach((cat) => {
        categoryMap[cat._id] = cat.title;
      });
      setCategories(categoryMap);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const openDeleteModal = (id: string, name: string) => {
    setSelectedProduct({ id, name });
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  const refreshProducts = () => {
    fetchProducts();
  };

  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === "All" || product.category === categoryFilter)
    );
  });

  return (
    <DashboardLayout>
      <div
        className={`space-y-6 p-4`}
        style={{ backgroundColor: theme.background, color: theme.text }}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold">📦 Product Management</h1>
          <Link href="/product-management/add-product">
            <Button variant="default" className="gap-2">
              <FaPlus /> Add New Product
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative w-full md:w-1/3">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              style={{
                backgroundColor: theme.background,
                color: theme.text,
              }}
            />
            <FaSearch
              className="absolute left-3 top-3"
              style={{ color: theme.muted }}
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger
              className="w-full md:w-48"
              style={{
                backgroundColor: theme.background,
                color: theme.text,
              }}
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(categories).map(([id, title]) => (
                <SelectItem key={id} value={id}>
                  {title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div
          className="rounded-lg overflow-x-auto"
          style={{
            backgroundColor: theme.background,
            color: theme.text,
            border: `1px solid ${theme.border}`,
          }}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Purchase</TableHead>
                <TableHead>Selling</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>QR</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <img
                      src={product.image || "/default-image.png"}
                      alt={product.name}
                      className="w-14 h-14 object-contain rounded"
                      style={{ backgroundColor: theme.muted }}
                      onError={(e) =>
                        (e.currentTarget.src = "/default-image.png")
                      }
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>
                    {categories[product.category] || "Unknown"}
                  </TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>{product.purchasePrice}</TableCell>
                  <TableCell>{product.sellingPrice}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.minStock}</TableCell>
                  <TableCell>{product.taxRate}%</TableCell>
                  <TableCell>{product.discount}%</TableCell>
                  <TableCell>
                    <img
                      src={product.qrCodeUrl || "/default-qr.png"}
                      alt="QR Code"
                      className="w-10 h-10 object-contain"
                      style={{ backgroundColor: theme.muted }}
                      onError={(e) =>
                        (e.currentTarget.src = "/default-qr.png")
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <Link
                        href={`/product-management/edit-product/${product._id}`}
                      >
                        <Button
                          variant="secondary"
                          size="sm"
                          className="gap-1"
                          style={{ backgroundColor: theme.accent }}
                        >
                          <FaEdit /> Edit
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="gap-1"
                        onClick={() =>
                          openDeleteModal(product._id, product.name)
                        }
                        style={{ backgroundColor: theme.destructive }}
                      >
                        <FaTrash /> Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={13}
                    className="text-center"
                    style={{ color: theme.muted }}
                  >
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {selectedProduct && (
          <DeleteProductModal
            isOpen={isDeleteModalOpen}
            onClose={closeDeleteModal}
            productId={selectedProduct.id}
            productName={selectedProduct.name}
            onDeleteSuccess={refreshProducts}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProductManagement;
