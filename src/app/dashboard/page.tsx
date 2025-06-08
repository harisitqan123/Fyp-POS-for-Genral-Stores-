"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';

import DashboardLayout from "@/components/layouts/DashboardLayout";
import RightSideCart from "@/components/Cart";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { ICategory } from "@/models/category";
import { IProduct } from "@/models/product";
import Image from "next/image";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function DashboardPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<IProduct[]>([]);
  const [isCreateSaleLoading,setIsCreateSaleLoading] = useState<boolean>(false);
  const isExpanded = useSelector((state: any) => state.sidebar.isExpanded);

  const getCartItems = async () => {
    try {
      const response = await axios.get("/api/cart/get-cart-items");
      if (response.data.success) {
        // Handle cart items if needed

        setCartItems(response.data.cart);
        console.log("Cart items fetched successfully:", response.data.cart);
      } else {
        console.error("Failed to fetch cart items");
      }
    }
    catch (error) {
      console.error("Failed to fetch cart items:", error);
    }
  }

  const add_to_Card = async (productId: string) => {
    setLoadingProductId(productId)
    console.log("Adding product to cart:", productId);
    try {
      const response = await axios.put("/api/cart/add-to-cart", { product_id: productId });
      if (response.data.success) {

        setLoadingProductId(null);
        getProducts()
        getCartItems(); // Refresh cart items after adding



      } else {
        // Handle error, e.g., show a toast notification
        console.error("Failed to add product to cart");
      }
    }
    catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product to cart");
    }
  }

  const addSingleItemToCart = async (productId: string) => {
    try {
      setLoadingProductId(productId);

      const { data } = await axios.put("/api/cart/add-single-quantity", {
        product_id: productId,
      });

      if (data.success) {
        getCartItems(); // ✅ Refresh cart after update
        getProducts(); // ✅ Refresh products to update stock
      } else {
        toast.error(data.message || "Failed to update product quantity");
        console.error("Cart update failed:", data.message);
      }
    } catch (error: any) {
      console.error("❌ Error updating cart:", error?.response?.data || error);
      toast.error(
        error?.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoadingProductId(null);
    }
  };

  const removeSingleItemFromCart = async (productId: string) => {
    try {
      setLoadingProductId(productId);

      const { data } = await axios.put("/api/cart/remove-single-quantity", {
        product_id: productId,
      });

      if (data.success) {
        getCartItems(); // ✅ Refresh cart after update
        getProducts(); // ✅ Refresh products to update stock
        setLoadingProductId(null);
      } else {
        toast.error(data.message || "Failed to update product quantity");
        console.error("Cart update failed:", data.message);
      }
    }
    catch (error: any) {
      console.error("❌ Error updating cart:", error?.response?.data || error);
      toast.error(
        error?.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoadingProductId(null);
    }
  }

  const removeCompleteProductFromCart = async (productId: string) => {
    try {
      setLoadingProductId(productId);

      const { data } = await axios.delete("/api/cart/remove-complete-product", {
        data: { product_id: productId },
      });

      if (data.success) {
        getCartItems(); // ✅ Refresh cart after removal
        getProducts(); // ✅ Refresh products to update stock

      } else {
        toast.error(data.message || "Failed to remove product from cart");
        console.error("Cart removal failed:", data.message);
      }
    }
    catch (error: any) {
      console.error("❌ Error removing product from cart:", error?.response?.data || error);
      toast.error(
        error?.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoadingProductId(null);
    }
  }

  // these above logic is for create sale 

  const createSale = async (customerName: string,PhoneNo:string, paymentType: string="cash") => {
    try {
      if (cartItems.length === 0) {
        toast.error("Cart is empty. Please add products to cart before creating a sale.");
        return;
      }
      setIsCreateSaleLoading(true);
      const response = await axios.post("/api/sale/create-sale", {customerName,phoneNumber:PhoneNo,paymentType });
      if (response.data.success) {
        toast.success("Sale created successfully!");
        // Clear cart after successful sale
        setIsCreateSaleLoading(false);
        setCartItems([]);
        getProducts(); // Refresh products to update stock
      } else {
        setIsCreateSaleLoading(false);
        toast.error(response.data.message || "Failed to create sale");
      }
    }
    catch (error) {
      console.error("Error creating sale:", error);
      toast.error("Failed to create sale. Please try again.");
    }
  }






  const getCategories = async () => {
    try {
      const res = await axios.get("/api/category/get-categories");
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const getProducts = async () => {
    try {
      const res = await axios.get("/api/product/get-products");
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    getCartItems();
    getCategories();
    getProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate main content width based on sidebar expand state
  const mainWidth = isExpanded
    ? "calc(100vw - 620px)"
    : "calc(100vw - 400px)";

  return (
    <DashboardLayout>
      <div className="flex">
        {/* Left: Main content */}
        <main
          className="min-h-screen bg-muted transition-all duration-300"
          style={{ width: mainWidth }}
        >
          {/* Sticky Header */}
          <div className="sticky mx-auto w-[98%] top-0 z-50 bg-muted ">
            <HeaderSection
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>

          {/* Product List */}
          <div className="mt-4 mx-4">
            {(!products || products.length === 0) && (
              <div className="w-full text-center text-gray-500 py-12">
                No products found.<br />
                <span className="text-sm">
                  Go to <b>Inventory &gt; Product Management</b> to add products.
                </span>
              </div>
            )}

            <ProductList
              loadingProductId={loadingProductId}
              add_to_Card={add_to_Card}
              products={filteredProducts}
            />
          </div>
        </main>

        {/* Right: Cart */}
        <RightSideCart
          cartItems={cartItems}
          onDelete={removeCompleteProductFromCart}
          onIncrement={addSingleItemToCart}
          onDecrement={removeSingleItemFromCart}
          LoadingProductId={loadingProductId}
          createSale={createSale}
          isCreateSaleLoading={isCreateSaleLoading}
        />
      </div>
    </DashboardLayout>
  );
}

/* ===================== Sub Components Below ===================== */

// Header Section
function HeaderSection({
  categories,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
}: {
  categories: ICategory[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}) {
  return (
    <div className="h-[200px] bg-background border rounded-lg p-4 shadow">
      <div className="flex justify-between items-center mb-4">
        <StoreTitle />
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      {/* Category Slider with Image */}
      {categories.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No categories found.<br />
          <span className="text-sm">
            Go to <b>Inventory &gt; Category Management</b> to add a category.
          </span>
        </div>
      ) : (
        <CategorySlider
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      )}
    </div>
  );
}


// Store Title
function StoreTitle() {
  return <h1 className="text-2xl font-bold text-primary">POS Superstore</h1>;
}

// Search Bar
function SearchBar({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}) {
  return (
    <Input
      placeholder="Search products..."
      className="w-64"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}


{/* Category Slider with Image */}
function CategorySlider({
  categories,
  selectedCategory,
  setSelectedCategory,
}: {
  categories: ICategory[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}) {
  return (
    <Swiper
      slidesPerView="auto"
      spaceBetween={10}
      className=" px-1"
    >
      <SwiperSlide className="!w-auto max-w-[120px] sm:max-w-[150px] md:max-w-[180px]">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`flex flex-col items-center gap-1 px-4 py-2 text-sm rounded transition ${selectedCategory === null
            ? "bg-primary text-white"
            : "bg-secondary hover:bg-primary hover:text-white"
            }`}
        >
          <span>All</span>
        </button>
      </SwiperSlide>
      {categories.map((category) => (
        <SwiperSlide key={category._id} className="!w-fit">
          <button
            onClick={() => setSelectedCategory(category._id)}
            className={`flex flex-col items-center gap-1 px-4 py-2 text-sm rounded transition ${selectedCategory === category._id
              ? "bg-primary text-white"
              : "bg-secondary hover:bg-primary hover:text-white"
              }`}
          >
            <Image
              src={category.img}
              width={48}
              height={48}
              alt={category.title}
              className="w-12 h-12 object-contain"
            />
            <span>{category.title}</span>
          </button>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}


// Product List
function ProductList({ products, add_to_Card, loadingProductId }:
  { products: IProduct[], add_to_Card?: void | any, loadingProductId: string | null }) {
  return (
    <div className="flex flex-wrap gap-4 ">
      {products.map((item) => (
        <div
          key={item.sku}
          className="w-[220px] bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-200"
        >
          {/* Image Section */}
          <div className="bg-yellow-100 rounded-t-lg flex justify-center items-center">
            <Image
              src={item.image}
              alt={item.name}
              width={130}
              height={100}
              className="object-contain h-[100px] w-[130px]"
            />
          </div>

          {/* Product Content */}
          <div className="px-3 py-2 space-y-1">
            {/* Name */}
            <h3 className="text-sm font-semibold text-gray-800 truncate">
              {item.name}
            </h3>

            {/* Brand & Stock */}
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{item.brand}</span>
              <span
                className={`font-medium ${item.stock > 0 ? "text-green-600" : "text-red-500"
                  }`}
              >
                {item.stock > 0 ? `Stock: ${item.stock}` : "Out of Stock"}
              </span>
            </div>

            {/* Price */}
            <p className="text-sm font-bold text-red-700">
              Rs {item.sellingPrice.toLocaleString("en-PK")}
            </p>

            {/* Add to Cart Button */}
            <button
              onClick={() => add_to_Card(item._id)}
              disabled={item.stock === 0 || loadingProductId === item._id}
              className={`mt-2 w-full text-sm font-semibold py-1.5 rounded-md transition-all 
    ${item.stock === 0 || loadingProductId === item._id
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 text-white"
                }`}
            >
              {item.stock === 0
                ? "Out of Stock"

                : "Add to Cart"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

