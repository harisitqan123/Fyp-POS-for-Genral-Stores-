"use client";

import { useEffect, useState } from "react";
import { useThemePalette } from "@/hooks/useThemePalette";
import { useFormik } from "formik";
import * as Yup from "yup";

// Define the CartItem type for your API shape
export type CartItem = {
  product: {
    _id: string;
    name: string;
    sellingPrice: number;
    // ...add other fields if needed
  };
  quantity: number;
};

// Props for the Cart component
type CartProps = {
  cartItems: CartItem[];
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onDelete: (id: string) => void;
  createSale: (customerName: string, phoneNumber: string) => void;
  LoadingProductId:string | null; // Optional loading state for product actions
  isCreateSaleLoading:boolean
};

export default function RightSideCart({
  cartItems,
  onIncrement,
  onDecrement,
  onDelete,
  LoadingProductId,
  createSale,
  isCreateSaleLoading
}: CartProps) {
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleString());
  const theme = useThemePalette();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const light = {
    bg: "bg-yellow-50",
    card: "bg-white",
    border: "border-yellow-300",
    text: "text-red-700",
    total: "text-yellow-800",
    btn: "bg-red-600 hover:bg-red-700 text-white",
    inputBg: "bg-yellow-100",
    inputBorder: "border-yellow-400",
    placeholder: "placeholder-yellow-700",
  };

  const dark = {
    bg: "bg-gray-900",
    card: "bg-gray-800",
    border: "border-gray-700",
    text: "text-yellow-300",
    total: "text-yellow-100",
    btn: "bg-yellow-600 hover:bg-yellow-700 text-black",
    inputBg: "bg-gray-700",
    inputBorder: "border-yellow-600",
    placeholder: "placeholder-yellow-300",
  };

  const styles = theme === "dark" ? dark : light;

  // Calculate total using sellingPrice
  const total = cartItems.reduce(
    (sum, item) => sum + (item.product.sellingPrice || 0) * item.quantity,
    0
  );

  // Formik + Yup
  const formik = useFormik({
    initialValues: {
      customerName: "",
      phoneNumber: "",
    },
    validationSchema: Yup.object({
      customerName: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .required("Required"),
      phoneNumber: Yup.string()
        .matches(/^\d{11}$/, "Phone number must be 11 digits")
        .required("Required"),
    }),
    onSubmit: (values) => {
      console.log("Form submitted with values:", values);
       createSale(values.customerName, values.phoneNumber);
      // Reset form after submission
      formik.resetForm();
    },
  });

  return (
    <aside
      className={`w-[300px] h-screen sticky top-0 right-0 z-10 shadow-md ${styles.bg} ${styles.border} border-l flex flex-col`}
    >
      {/* Header */}
      <div className={`p-4 border-b ${styles.border}`}>
        <h2 className={`text-xl font-bold ${styles.text}`}>🛒 Cart Summary</h2>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-500">Cart is empty</div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.product._id}
              className={`flex items-center justify-between rounded-md shadow-sm p-3 ${styles.card}`}
            >
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {item.product.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ₹{item.product.sellingPrice} × {item.quantity} = ₹
                  {item.product.sellingPrice * item.quantity}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onDecrement(item.product._id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  type="button"
                  aria-label={`Decrease quantity of ${item.product.name}`}
                  disabled={item.quantity <= 1 || LoadingProductId === item.product._id || isCreateSaleLoading}
                >
                  −
                </button>
                <span className="text-sm text-gray-800 dark:text-gray-100">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onIncrement(item.product._id)}
                  className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  type="button"
                  aria-label={`Increase quantity of ${item.product.name}`}
                  disabled={LoadingProductId === item.product._id || isCreateSaleLoading}
                >
                  +
                </button>
                <button
                  onClick={() => onDelete(item.product._id)}
                  className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                  type="button"
                  aria-label={`Delete ${item.product.name} from cart`}
                  title="Delete"
                  disabled={LoadingProductId === item.product._id || isCreateSaleLoading}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form and Footer */}
      <form
        onSubmit={formik.handleSubmit}
        className={`p-4 border-t ${styles.border} flex flex-col space-y-4`}
      >
        {/* Current Time */}
        <div className={`text-sm font-medium ${styles.text}`}>
          🕒 Current Time: <span className="font-semibold">{currentTime}</span>
        </div>

        {/* Customer Name */}
        <div className="flex flex-col">
          <label htmlFor="customerName" className={`mb-1 ${styles.text}`}>
            Customer Name
          </label>
          <input
            id="customerName"
            name="customerName"
            type="text"
            placeholder="Enter customer name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.customerName}
            className={`p-2 rounded border ${styles.inputBorder} ${styles.inputBg} ${styles.text} ${styles.placeholder} focus:outline-none focus:ring-2 focus:ring-yellow-400`}
          />
          {formik.touched.customerName && formik.errors.customerName ? (
            <div className="text-red-600 text-xs mt-1">
              {formik.errors.customerName}
            </div>
          ) : null}
        </div>

        {/* Phone Number */}
        <div className="flex flex-col">
          <label htmlFor="phoneNumber" className={`mb-1 ${styles.text}`}>
            Phone Number
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            placeholder="Enter 10-digit phone number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phoneNumber}
            className={`p-2 rounded border ${styles.inputBorder} ${styles.inputBg} ${styles.text} ${styles.placeholder} focus:outline-none focus:ring-2 focus:ring-yellow-400`}
          />
          {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
            <div className="text-red-600 text-xs mt-1">
              {formik.errors.phoneNumber}
            </div>
          ) : null}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center mt-2">
          <span className={`text-lg font-semibold ${styles.total}`}>Total:</span>
          <span className={`text-lg font-bold ${styles.total}`}>₹{total}</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded ${styles.btn} transition duration-200 disabled:opacity-50`}
          disabled={!formik.isValid || !formik.dirty || cartItems.length === 0 || isCreateSaleLoading}
        >
          {isCreateSaleLoading ? "Processing..." : "Create Sale"}
        </button>
      </form>
    </aside>
  );
}
