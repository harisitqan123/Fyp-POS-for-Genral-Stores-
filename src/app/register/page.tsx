"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaUserPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import React, { useState } from "react";
import Link from "next/link";
import { UserRegisterSchema } from "@/schemas/loginSchema";
import { useRouter } from "next/navigation";
import { FaCashRegister, FaChartBar, FaBarcode, FaBoxOpen } from "react-icons/fa";

const RegisterPage = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (values: any, { resetForm }: any) => {
        setLoading(true);
        try {
            const res = await axios.post("/api/user/new-user", {
                ...values,
                registrationDate: new Date(),
            });

            if (res.data?.success) {
                toast.success(res.data.message || "Registration successful!");
                router.push("/"); // Redirect to login page after successful registration
                resetForm();
            } else {
                toast.error(res.data?.message || "Registration failed.");
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gray-100 p-4">
            {/* Left Section: POS Features */}
            <div className="w-full lg:w-1/2 p-6 space-y-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">POS Features</h2>
                <ul className="space-y-4">
                    <li className="flex items-start gap-3 text-gray-700">
                        <FaCashRegister className="text-yellow-500 mt-1" />
                        <span>
                          <strong>Quick Billing:</strong> Fast and easy sales with product search and barcode/QR scanning.
                        </span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                        <FaBoxOpen className="text-yellow-500 mt-1" />
                        <span>
                          <strong>Stock Management:</strong> Add, update, and track inventory in real time.
                        </span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                        <FaChartBar className="text-yellow-500 mt-1" />
                        <span>
                          <strong>Sales Analytics:</strong> View daily, weekly, and monthly sales reports.
                        </span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                        <FaBarcode className="text-yellow-500 mt-1" />
                        <span>
                          <strong>Barcode & QR Support:</strong> Generate and print product barcodes and QR codes.
                        </span>
                    </li>
                   
                    <li className="flex items-start gap-3 text-gray-700">
                        <FaBoxOpen className="text-yellow-500 mt-1" />
                        <span>
                          <strong>Stock History:</strong> Track all stock additions and changes for full transparency.
                        </span>
                    </li>
                </ul>
            </div>

            {/* Right Section: Registration Form */}
            <div className="w-full lg:w-1/2">
                <Card className="w-full max-w-xl mx-auto shadow-lg border border-gray-300 bg-white">
                    <CardHeader className="flex flex-col items-center gap-2">
                        <FaUserPlus className="text-3xl text-yellow-500" />
                        <CardTitle className="text-2xl font-bold text-gray-800">
                            Register New Shopkeeper
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                            Create your account to access the POS system
                        </p>
                    </CardHeader>

                    <CardContent>
                        <Formik
                            initialValues={{
                                name: "",
                                username: "",
                                password: "",
                                storeName: "",
                                ownerName: "",
                                storeType: "",
                                phone: "",
                                address: "",
                            }}
                            validationSchema={UserRegisterSchema}
                            onSubmit={handleRegister}
                        >
                            {({ isSubmitting }) => (
                                <Form className="space-y-4">
                                    {/* Grid Section 1 */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">
                                                Shopkeeper Full Name
                                            </label>
                                            <Field
                                                name="name"
                                                type="text"
                                                className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-800"
                                                placeholder="Enter full name"
                                            />
                                            <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">
                                                Username (for login)
                                            </label>
                                            <Field
                                                name="username"
                                                type="text"
                                                className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-800"
                                                placeholder="Enter a unique username"
                                            />
                                            <ErrorMessage name="username" component="div" className="text-red-500 text-xs mt-1" />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">
                                                Password
                                            </label>
                                            <Field
                                                name="password"
                                                type="password"
                                                className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-800"
                                                placeholder="Enter a strong password"
                                            />
                                            <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">
                                                Contact Number
                                            </label>
                                            <Field
                                                name="phone"
                                                type="text"
                                                className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-800"
                                                placeholder="Phone number (e.g. 03001234567)"
                                            />
                                            <ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1" />
                                        </div>
                                    </div>

                                    {/* Grid Section 2 */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">
                                                Store Name
                                            </label>
                                            <Field
                                                name="storeName"
                                                type="text"
                                                className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-800"
                                                placeholder="Store Name"
                                            />
                                            <ErrorMessage name="storeName" component="div" className="text-red-500 text-xs mt-1" />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">
                                                Owner Full Name
                                            </label>
                                            <Field
                                                name="ownerName"
                                                type="text"
                                                className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-800"
                                                placeholder="Store owner's full name"
                                            />
                                            <ErrorMessage name="ownerName" component="div" className="text-red-500 text-xs mt-1" />
                                        </div>
                                        <div>
                                            <label className="block mb-1 font-medium text-gray-700">
                                                Type of Store
                                            </label>
                                            <Field
                                                name="storeType"
                                                type="text"
                                                className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-800"
                                                placeholder="e.g. Grocery, Electronics, Clothing"
                                            />
                                            <ErrorMessage name="storeType" component="div" className="text-red-500 text-xs mt-1" />
                                        </div>
                                        <div className="lg:col-span-2">
                                            <label className="block mb-1 font-medium text-gray-700">
                                                Shop Address
                                            </label>
                                            <Field
                                                name="address"
                                                as="textarea"
                                                rows={2}
                                                className="w-full px-3 py-2 rounded border border-gray-300 bg-white text-gray-800"
                                                placeholder="Complete shop address"
                                            />
                                            <ErrorMessage name="address" component="div" className="text-red-500 text-xs mt-1" />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-yellow-500 text-white hover:bg-yellow-600"
                                        disabled={isSubmitting || loading}
                                    >
                                        {loading ? "Registering..." : "Register"}
                                    </Button>

                                    <p className="text-sm text-center mt-3 text-gray-600">
                                        Already have an account?{" "}
                                        <Link href="/" className="text-yellow-600 hover:underline font-medium">
                                            Login here
                                        </Link>
                                    </p>
                                </Form>
                            )}
                        </Formik>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RegisterPage;
