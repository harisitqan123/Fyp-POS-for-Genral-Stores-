"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux Store";
import { toast } from "react-toastify";
import axios from "axios";
import { X, Loader2, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useThemePalette } from "@/hooks/useThemePalette";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCategoryModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const theme = useThemePalette();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const initialValues = {
    title: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Category title is required"),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    if (!imageFile) {
      toast.error("Please upload an image.");
      setSubmitting(false);
      return;
    }

    try {
      setIsUploading(true);

      // Prepare FormData for Cloudinary upload
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("title", values.title); // <-- replace with your actual preset

    

   

      // Create new category via your API
      await axios.post("/api/category/create-category",formData);

      toast.success("Category added successfully!");
      resetForm();
      setImageUrl(null);
      setImageFile(null);
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add category.");
    } finally {
      setIsUploading(false);
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className={`relative w-full max-w-lg p-6 rounded-xl shadow-xl border
        ${isDarkMode ? "bg-gray-900 text-white border-gray-700" : "bg-white text-black border-gray-200"}`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:text-red-600 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-center" style={{ color: theme.error }}>
          Add Category
        </h2>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="mt-6 space-y-4">
              <div>
                <Label className="text-yellow-600">Category Title</Label>
                <Field
                  name="title"
                  as={Input}
                  placeholder="Enter category title"
                  className={isDarkMode ? "bg-gray-800 text-white" : ""}
                />
                <ErrorMessage name="title" component="div" className="text-sm text-red-500 mt-1" />
              </div>

              <div>
                <Label className="text-yellow-600">Category Image</Label>
                <Input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                  className={
                    isDarkMode ? "bg-gray-800 text-white file:text-white file:bg-yellow-600" : ""
                  }
                />
              </div>

              {imageUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Image Preview:</p>
                  <div
                    className={`mt-2 w-full h-48 rounded-lg overflow-hidden border shadow-md flex items-center justify-center ${
                      isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100"
                    }`}
                  >
                    {isUploading ? (
                      <Loader2 className="w-10 h-10 animate-spin text-yellow-500" />
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full h-full flex items-center justify-center"
                      >
                        <img src={imageUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <CheckCircle className="text-green-500 w-8 h-8" />
                          <span className="text-white font-semibold ml-2">Image ready to upload</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || !imageFile}
                className={`w-full mt-6 py-3 font-medium flex items-center justify-center gap-2 ${
                  isSubmitting ? "cursor-not-allowed opacity-80" : ""
                }`}
                variant="default"
                style={{ backgroundColor: theme.error }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Adding Category...
                  </>
                ) : (
                  "Add Category"
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
};

export default AddCategoryModal;
