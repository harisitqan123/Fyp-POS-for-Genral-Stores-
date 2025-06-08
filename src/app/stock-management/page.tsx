"use client";
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { IProduct } from '@/models/product';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { toast } from "react-toastify"; // Make sure you have react-toastify installed and imported



/* in these page there will be showing three tabs in which we 
 show avaible stock low stock and out of stock items
 and there will be one modal at top to add new stock item
 when user click on add stock item button
 it will open a modal with in modal there will be product dropdown and 
 and quantity input field to add stock and below in modal there will product 
 selected to be added in stock and there will be a button to add stock
*/
const StockManagementPage = () => {
  const [activeTab, setActiveTab] = useState<string>("Available");
  const [stockItems, setStockItems] = useState<IProduct[]>([]);
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState<boolean>(false);

  // here will be api from which we will get stock items and update stock items

  const onCloseModal = () => {
    setIsAddStockModalOpen(false);
  }

  const fetchStockItems = async () => {
    try {
      const response = await axios.get('/api/product/get-products');
      if (response.status === 200) {
        setStockItems(response.data.products || response.data);
      }
    } catch (error) {
      console.error("Failed to fetch stock items:", error);
    }
  };

  // Make sure these filters are correct for your business logic
  const lowStockItems = stockItems.filter(item => item.stock > 0 && item.stock <= 5);
  const outOfStockItems = stockItems.filter(item => item.stock === 0);
  const availableStockItems = stockItems.filter(item => item.stock > 1);

  useEffect(() => {
    fetchStockItems();
  }, []);

  // Add stock API handler to be passed to modal
  const handleAddStockApi = async (products: { product: string; quantity: number }[]) => {
    try {
      const res = await axios.post("/api/stock/add-stock", { products });
      if (res.data?.success) {
        toast.success(res.data.message || "Stock added successfully!");
        await fetchStockItems(); // Refresh stock items after adding
        return true;
      } else {
        toast.error(res.data?.message || "Failed to add stock.");
        return false;
      }
    } catch (error) {
      toast.error("Failed to add stock.");
      return false;
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen px-6 md:px-12 py-10 bg-white dark:bg-gray-900 transition-all">
        {/* Page Heading */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-1">📦 Stock Management</h1>
          <p className="text-sm text-muted-foreground">Manage your stock efficiently</p>
        </div>
        {/* button through we open add stock modal  */}
        <button onClick={() => setIsAddStockModalOpen(true)} className="ml-auto cursor-pointer rounded-md block px-4 py-2 bg-green-600 text-white  mb-6">
          + Add Stock Item
        </button>

        {/* Tabs and Add Stock Button */}
        <div className="flex gap-2 mb-6">
          {["Available", "Low", "Out"].map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 rounded ${activeTab === tab ? "bg-yellow-400 text-black" : "bg-gray-200 rounded-md dark:bg-gray-800 text-gray-700 dark:text-gray-200"}`}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {tab} Stock
            </button>
          ))}
        </div>
        {/* tabs which are dynamically displyed by active tab state */}
        {activeTab === "Available" && <StockTab items={availableStockItems} label="✔️ Available Stock" />}
        {activeTab === "Low" && <StockTab items={lowStockItems} label="⚠️ Low Stock" />}
        {activeTab === "Out" && <StockTab items={outOfStockItems} label="🟥 Out of Stock" />}
      </div>

      {/* here is our modal  */}
      {isAddStockModalOpen && (
        <AddStockModal
          isOpen={isAddStockModalOpen}
          onClose={onCloseModal}
          stock={stockItems}
          onAddStock={handleAddStockApi} // Pass the API handler as prop
        />
      )}
      {/* Modal for adding stock */}
    </DashboardLayout>
  );
}

export default StockManagementPage;

// Tab component for all stock types
const StockTab = ({ items, label }: { items: IProduct[]; label: string }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">{label}</h2>
    {items.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map(item => {
          // Determine line color
          let lineColor = "bg-green-500";
          if (item.stock === 0) lineColor = "bg-red-500";
          else if (item.stock <= 5) lineColor = "bg-yellow-400";

          return (
            <div
              key={item._id}
              className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
            >
              {/* Colored Line */}
              <div className={`h-16 w-1 rounded-full ${lineColor}`} />
              {/* Product Image */}
              <img
                src={item.image || "/no-image.png"}
                alt={item.name}
                className="w-14 h-14 object-contain rounded"
                onError={e => (e.currentTarget.src = "/no-image.png")}
              />
              {/* Product Info */}
              <div className="flex-1 flex flex-col gap-1 py-4">
                <span className="font-bold text-base truncate">{item.name}</span>
                <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                  PKR {item.sellingPrice?.toLocaleString() || "-"}
                </span>
                <span className="text-xs font-medium text-blue-600 dark:text-blue-300">
                  Available Stock: {item.stock}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <p className="text-gray-600 dark:text-gray-400">No items found.</p>
    )}
  </div>
);


// here below is shadcn modal for add stock 
interface AddStockModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  stock?: IProduct[];
  onAddStock: (products: { product: string; quantity: number }[]) => Promise<boolean>;
}



const AddStockModal = ({ isOpen, onClose, stock, onAddStock }: AddStockModalProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<{ product: IProduct; quantity: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const sortedStock = stock?.sort((a, b) => (a.stock || 0) - (b.stock || 0)) || [];
  const outOfStock = sortedStock.filter(item => item.stock === 0);
  const lowStock = sortedStock.filter(item => item.stock > 0 && item.stock <= 5);
  const sufficientStock = sortedStock.filter(item => item.stock > 5);

  const isSelected = (item: IProduct) =>
    selectedProducts.some(p => p.product._id === item._id);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.6 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: -20 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  const handleProductSelect = (item: IProduct) => {
    if (isSelected(item)) return;
    setSelectedProducts(prev => [...prev, { product: item, quantity: 1 }]);
    setIsDropdownOpen(false);
  };

  const handleQuantityChange = (index: number, value: number) => {
    const updated = [...selectedProducts];
    updated[index].quantity = value;
    setSelectedProducts(updated);
  };

  const handleDeleteSelected = (id: string) => {
    setSelectedProducts(prev => prev.filter(p => p.product._id !== id));
  };

  const handleAddStockSubmit = async () => {
    setLoading(true);
    try {
      const products = selectedProducts.map(({ product, quantity }) => ({
        product: product._id,
        quantity,
      }));

      const success = await onAddStock(products);
      if (success) {
        setSelectedProducts([]);
        onClose?.();
      }
    } finally {
      setLoading(false);
    }
  };

  const renderGroup = (label: string, items: IProduct[], color: string) => {
    const availableItems = items.filter(item => !isSelected(item));
    if (availableItems.length === 0) return null;

    return (
      <div className="mb-3">
        <h4 className={`text-sm font-semibold px-4 py-1 text-${color}-600 dark:text-${color}-400`}>
          {label}
        </h4>
        <ul>
          {availableItems.map(item => (
            <li
              key={item._id}
              className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition"
              onClick={() => handleProductSelect(item)}
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.image || "/no-image.png"}
                  alt={item.name}
                  className="w-8 h-8 object-contain rounded"
                  onError={e => (e.currentTarget.src = "/no-image.png")}
                />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Brand: {item.brand || "-"}</p>
                </div>
              </div>
              <div className="flex flex-col items-end text-xs">
                <span className="text-green-700 dark:text-green-400">
                  PKR {item.sellingPrice?.toLocaleString() || "-"}
                </span>
                <span className="text-blue-600 dark:text-blue-300">
                  Stock: {item.stock}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalVariants}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl relative p-6">
              <h2 className="text-xl font-bold mb-4">📦 Add Stock Item</h2>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-red-500 text-2xl"
              >
                ×
              </button>

              {/* Dropdown */}
              <div className="relative mb-6">
                <motion.button
                  onClick={() => setIsDropdownOpen(prev => !prev)}
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md flex justify-between items-center"
                  type="button"
                >
                  <span>Select Product</span>
                  {isDropdownOpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
                </motion.button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      className="absolute mt-2 z-10 w-full max-h-60 overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {outOfStock.filter(item => !isSelected(item)).length === 0 &&
                        lowStock.filter(item => !isSelected(item)).length === 0 &&
                        sufficientStock.filter(item => !isSelected(item)).length === 0 ? (
                        <div className="p-4 text-center text-gray-600 dark:text-gray-300 text-sm">
                          🎉 All products selected — No more products to add.
                        </div>
                      ) : (
                        <>
                          {renderGroup("🟥 Out of Stock", outOfStock, "red")}
                          {renderGroup("⚠️ Low Stock", lowStock, "yellow")}
                          {renderGroup("✔️ Sufficient Stock", sufficientStock, "green")}
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Selected Product List */}
              {selectedProducts.length > 0 && (
                <div className="space-y-4 mb-4">
                  {selectedProducts.map((item, idx) => (
                    <div
                      key={item.product._id}
                      className="flex items-center justify-between gap-4 bg-gray-100 dark:bg-gray-700 p-3 rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image || "/no-image.png"}
                          alt={item.product.name}
                          className="w-10 h-10 object-contain rounded"
                          onError={e => (e.currentTarget.src = "/no-image.png")}
                        />
                        <div>
                          <p className="font-semibold text-sm">{item.product.name}</p>
                          <p className="text-xs text-gray-500">Stock: {item.product.stock}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={e => handleQuantityChange(idx, Number(e.target.value))}
                          className="w-20 text-sm px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                        />
                        <button
                          onClick={() => handleDeleteSelected(item.product._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleAddStockSubmit}
                disabled={selectedProducts.length === 0 || loading}
                className={`w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50 flex items-center justify-center`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Adding...
                  </span>
                ) : (
                  "✅ Add Stock"
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
