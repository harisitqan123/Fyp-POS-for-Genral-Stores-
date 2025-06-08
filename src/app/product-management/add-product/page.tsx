'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus } from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';

interface Category {
  _id: string;
  title: string;
}

export default function AddProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category/get-categories');
        setCategories(response.data.categories);
      } catch (error) {
        toast.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      sku: '',
      category: '',
      brand: '',
      purchasePrice: '',
      sellingPrice: '',
      discount: '',
      ownerNotes: '',
      stock: 10,
      minStock: 10,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      sku: Yup.string().required('Required'),
      category: Yup.string().required('Required'),
      brand: Yup.string().required('Required'),
      purchasePrice: Yup.number()
        .typeError('Must be a number')
        .required('Required'),
      sellingPrice: Yup.number()
        .typeError('Must be a number')
        .required('Required'),
      stock: Yup.number()
        .typeError('Must be a number')
        .required('Required'),
      minStock: Yup.number()
        .typeError('Must be a number')
        .required('Required'),
      discount: Yup.number()
        .typeError('Must be a number')
        .min(0, 'Cannot be negative')
        .max(100, 'Cannot exceed 100')
        .notRequired(),
    }),
    onSubmit: async (values) => {
      if (!imageFile) {
        toast.warn('Please upload a product image');
        return;
      }

      try {
        setLoading(true);

        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('sku', values.sku);
        formData.append('category', values.category);
        formData.append('brand', values.brand);
        formData.append('purchasePrice', String(values.purchasePrice));
        formData.append('sellingPrice', String(values.sellingPrice));
        formData.append('discount', String(values.discount || 0));
        formData.append('ownerNotes', values.ownerNotes);
        formData.append('stock', String(values.stock));
        formData.append('minStock', String(values.minStock));
        formData.append('image', imageFile);

        const response = await axios.post('/api/product/add-product', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        toast.success(response.data.message || 'Product added successfully');
        router.push('/product-management');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to add product');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-card border rounded-2xl shadow-sm p-5 space-y-8">
          <h1 className="text-3xl font-semibold flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
            <Plus size={24} /> Add New Product
          </h1>

          <form onSubmit={formik.handleSubmit} className="space-y-8">
            {/* Product Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Product Name" name="name" formik={formik} />
              <InputField label="SKU" name="sku" formik={formik} />
              <InputField label="Brand" name="brand" formik={formik} />

              {/* Category */}
              <div>
                <Label htmlFor="category" className="mb-1 block">
                  Category
                </Label>
                <select
                  id="category"
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full mt-2 border rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.title}
                    </option>
                  ))}
                </select>
                {formik.touched.category && formik.errors.category && (
                  <p className="text-sm text-red-500 mt-1">
                    {formik.errors.category}
                  </p>
                )}
              </div>

              <InputField label="Purchase Price" name="purchasePrice" formik={formik} />
              <InputField label="Selling Price" name="sellingPrice" formik={formik} />
              <InputField label="Discount (%)" name="discount" formik={formik} />
              <InputField label="Stock" name="stock" formik={formik} />
              <InputField label="Min Stock" name="minStock" formik={formik} />
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="ownerNotes" className="mb-1 pb-2 block">
                Owner Notes
              </Label>
              <Textarea
                id="ownerNotes"
                name="ownerNotes"
                value={formik.values.ownerNotes}
                onChange={formik.handleChange}
                placeholder="e.g. Expected high demand during Eid."
                className="bg-background text-foreground min-h-[100px]"
              />
            </div>

            {/* Image Upload */}
            <div>
              <Label htmlFor="productImage" className="mb-1 block pb-2">
                Product Image
              </Label>
              <Input
                id="productImage"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  if (file.size > 1024 * 1024) {
                    toast.error('Image must be less than 1MB');
                    return;
                  }

                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }}
                className="bg-background text-foreground"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-contain mt-4 rounded-lg border border-muted bg-white p-1"
                />
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Plus size={16} />} Add
              Product
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

function InputField({
  label,
  name,
  formik,
}: {
  label: string;
  name: string;
  formik: any;
}) {
  return (
    <div>
      <Label className="pb-2" htmlFor={name}>
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder={label}
        type="text"
        className="bg-background text-foreground"
      />
      {formik.touched[name] && formik.errors[name] && (
        <p className="text-sm text-red-500">{formik.errors[name]}</p>
      )}
    </div>
  );
}
