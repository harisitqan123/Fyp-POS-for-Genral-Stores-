"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: {
    _id: string;
    title: string;
    img: string;
  } | null;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  isOpen,
  onClose,
  category,
}) => {
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titleChanged, setTitleChanged] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && category) {
      setTitle(category.title || "");
      setPreviewUrl(category.img || null);
      setImageFile(null);
      setTitleChanged(false);
      setImageChanged(false);
    }
  }, [category, isOpen]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // show preview
    setImageChanged(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setTitleChanged(true);
  };

 const handleSubmit = async () => {
  if (!category?._id) {
    toast.error("Category ID is required.");
    return;
  }

  setIsSubmitting(true);

  try {
    const formData = new FormData();
    formData.append("title", titleChanged ? title : category.title); // use new or old
    if (imageChanged && imageFile) {
      formData.append("img", imageFile); // only send new image if changed
    }

    await axios.put(`/api/category/edit-category?id=${category._id}`, formData);

    toast.success("Category updated successfully!");
    onClose();
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Failed to update category");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Category Title</Label>
            <Input
              id="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter category name"
            />
          </div>

          <div>
            <Label>Category Image</Label>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={isSubmitting}
            />
            <img
              src={previewUrl || "/placeholder.png"}
              alt="Category"
              className="w-full h-48 object-contain rounded-md border cursor-pointer"
              onClick={handleImageClick}
              title="Click to upload new image"
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || (!titleChanged && !imageChanged)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                Updating Category...
              </>
            ) : (
              "Update Category"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryModal;
