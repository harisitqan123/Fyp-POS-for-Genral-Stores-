"use client";

import { useState } from "react";
import axios from "axios";
import { Loader2, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useThemePalette } from "@/hooks/useThemePalette";

interface DeleteCategoryModalProps {
  id: string | null;
  isOpen: boolean;
  onClose: () => void;
  onCategoryDeleted: () => void;
}

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  id,
  isOpen,
  onClose,
  onCategoryDeleted,
}) => {
  const [loading, setLoading] = useState(false);
  const theme = useThemePalette();

  const handleDelete = async () => {
    if (!id) return;
    setLoading(true);
    try {
      await axios.delete(`/api/category/delete-category?id=${id}`);
      toast.success("Category deleted successfully!", { autoClose: 2000 });
      onCategoryDeleted();
      onClose();
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`rounded-xl sm:max-w-md ${
          theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-black"
        }`}
      >
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-xl flex justify-between items-center text-red-600">
            Delete Category
            
          </DialogTitle>
        </DialogHeader>

        <p className="text-center py-3 text-base">
          Are you sure you want to delete this category? This action cannot be undone.
        </p>

        <div className="flex justify-between w-full gap-4 mt-4">
          <Button
            onClick={onClose}
            disabled={loading}
            variant="outline"
            className="w-1/2"
          >
            Cancel
          </Button>

          <Button
            onClick={handleDelete}
            disabled={loading}
            className="w-1/2 bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCategoryModal;
