"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, Search, LayoutGrid, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";


import AddCategoryModal from "@/components/AddCategoryModal";
import DeleteCategoryModal from "@/components/DeleteCategoryModal";
import EditCategoryModal from "@/components/EditCategoryModal";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import Image from "next/image";

interface Category {
  _id: string;
  title: string;
  img: string;
}

const CategoriesPage: React.FC = () => {
  const isDarkMode = useSelector((state: any) => state.theme.isDarkMode);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [deleteCategoryModalOpen, setDeleteCategoryModalOpen] = useState(false);
  const [editCategoryModalOpen, setEditCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get("/api/category/get-categories");
      setCategories(data.categories || []);
    } catch {
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [addCategoryModalOpen, deleteCategoryModalOpen, editCategoryModalOpen]);

  const openDeleteModal = (id: string) => {
    setSelectedCategory({ _id: id, title: "", img: "" });
    setDeleteCategoryModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setEditCategoryModalOpen(true);
  };

  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className={`p-6 min-h-screen transition-all ${isDarkMode ? "bg-black text-white" : "bg-gray-50 text-black"}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <LayoutGrid className="text-yellow-500 w-6 h-6" />
            <h1 className="text-3xl font-bold">Manage Categories</h1>
          </div>
          <Button onClick={() => setAddCategoryModalOpen(true)} className="bg-yellow-500 hover:bg-yellow-600 text-white">
            <Plus className="w-4 h-4 mr-2" /> Add Category
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-lg mx-auto">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className={`pl-10 ${isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white"}`}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <Loader2 className="w-6 h-6 text-yellow-500 animate-spin" />
            </div>
          ) : error ? (
            <p className="text-center col-span-full text-red-600">{error}</p>
          ) : filteredCategories.length === 0 ? (
            <p className="text-center col-span-full text-gray-500">No categories found.</p>
          ) : (
            filteredCategories.map((category) => (
              <Card key={category._id} className="text-center">
                <CardContent className="flex flex-col items-center ">
                  <div className="h-24 w-full overflow-hidden mb-3">
                    {category.img ? (
                      <Image
                      height={96}
                      width={96}
                        src={category.img}
                        alt={category.title}
                        className="w-full h-full object-fit rounded"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-xs text-center px-2">
                        No Image
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{category.title}</h3>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-yellow-500 hover:bg-yellow-600 text-white"
                      onClick={() => openEditModal(category)}
                    >
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => openDeleteModal(category._id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Modals */}
         <div className="relative">
            <AddCategoryModal
          isOpen={addCategoryModalOpen}
          onClose={() => setAddCategoryModalOpen(false)}
        />
         </div>
        <DeleteCategoryModal
          id={selectedCategory?._id || ""}
          isOpen={deleteCategoryModalOpen}
          onClose={() => setDeleteCategoryModalOpen(false)}
          onCategoryDeleted={fetchCategories}
        />
        {selectedCategory && (
          <EditCategoryModal
            isOpen={editCategoryModalOpen}
            onClose={() => setEditCategoryModalOpen(false)}
            category={selectedCategory}
            onCategoryUpdated={fetchCategories}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default CategoriesPage;
