'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';
import DashboardLayout from '@/components/layouts/DashboardLayout';

interface Category {
  _id: string;
  title: string;
}

interface Product {
  _id: string;
  name: string;
  sku: string;
  category: { _id: string; title: string };
  brand: string;
  purchasePrice: number;
  sellingPrice: number;
  discount: number;
  ownerNotes: string;
  image: string;
}

export default function EditProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const [initialValues, setInitialValues] = useState({
    name: '',
    sku: '',
    category: '',
    brand: '',
    purchasePrice: '',
    sellingPrice: '',
    discount: '',
    ownerNotes: '',
  });

  const router = useRouter();
  const { id } = useParams() as { id?: string };

  useEffect(() => {
    if (!id) {
      toast.error('Invalid product ID');
      router.push('/product-management');
      return;
    }

    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const categoriesResponse = await axios.get('/api/category/get-categories');
        setCategories(categoriesResponse.data.categories);

        const productResponse = await axios.get(`/api/product/get-single-product?p_id=${id}`);
        if (productResponse.data.success) {
          const product: Product = productResponse.data.product;
          setInitialValues({
            name: product.name,
            sku: product.sku,
            category: product.category._id,
            brand: product.brand,
            purchasePrice: product.purchasePrice.toString(),
            sellingPrice: product.sellingPrice.toString(),
            discount: product.discount ? product.discount.toString() : '',
            ownerNotes: product.ownerNotes || '',
          });
          setImageUrl(product.image);
        } else {
          toast.error('Product not found, redirecting...');
          router.push('/product-management');
        }
      } catch (error) {
        toast.error('Failed to fetch product details, redirecting...');
        router.push('/product-management');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [id, router]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      sku: Yup.string().required('Required'),
      category: Yup.string().required('Required'),
      brand: Yup.string().required('Required'),
      purchasePrice: Yup.number().typeError('Must be a number').positive('Must be positive').required('Required'),
      sellingPrice: Yup.number().typeError('Must be a number').positive('Must be positive').required('Required'),
      discount: Yup.number()
        .typeError('Must be a number')
        .min(0, 'Cannot be negative')
        .max(100, 'Max 100%')
        .notRequired(),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('sku', values.sku);
        formData.append('category', values.category);
        formData.append('brand', values.brand);
        formData.append('purchasePrice', values.purchasePrice.toString());
        formData.append('sellingPrice', values.sellingPrice.toString());
        formData.append('discount', values.discount ? values.discount.toString() : '0');
        formData.append('ownerNotes', values.ownerNotes);

        if (selectedImageFile) {
          formData.append('image', selectedImageFile);
        } else if (imageUrl) {
          formData.append('imageUrl', imageUrl);
        }

        const response = await axios.put(`/api/product/update-product?p_id=${id}`, formData);
        toast.success(response.data.message || 'Product updated successfully');
        router.push('/product-management');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to update product');
      } finally {
        setLoading(false);
      }
    },
  });

  if (isLoadingData) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="animate-spin w-10 h-10 text-yellow-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-card border rounded-2xl shadow-sm p-5 space-y-8">
          <h1 className="text-3xl font-semibold flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
            <Save size={24} /> Edit Product
          </h1>

          <form onSubmit={formik.handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Product Name" name="name" formik={formik} />
              <InputField label="SKU" name="sku" formik={formik} />
              <InputField label="Brand" name="brand" formik={formik} />

              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full mt-2 border rounded-md px-3 py-2 bg-background text-foreground"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.title}
                    </option>
                  ))}
                </select>
                {formik.touched.category && formik.errors.category && (
                  <p className="text-sm text-red-500 mt-1">{formik.errors.category}</p>
                )}
              </div>

              <InputField label="Purchase Price" name="purchasePrice" formik={formik} />
              <InputField label="Selling Price" name="sellingPrice" formik={formik} />
              <InputField label="Discount (%)" name="discount" formik={formik} />
            </div>

            <div>
              <Label htmlFor="ownerNotes">Owner Notes</Label>
              <Textarea
                id="ownerNotes"
                name="ownerNotes"
                value={formik.values.ownerNotes}
                onChange={formik.handleChange}
                className="bg-background text-foreground min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="productImage">Product Image</Label>
              <Input
                id="productImage"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setSelectedImageFile(e.target.files[0]);
                    const previewUrl = URL.createObjectURL(e.target.files[0]);
                    setImageUrl(previewUrl);
                    setIsUploading(true);
                    setTimeout(() => setIsUploading(false), 1000); // Simulate uploading
                  }
                }}
                className="bg-background text-foreground"
              />
              {isUploading && <p className="text-sm text-yellow-500 mt-2">Uploading...</p>}
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Product Preview"
                  className="w-32 h-32 object-contain mt-4 rounded-lg border border-muted bg-white p-1"
                />
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={16} />}
              Save Changes
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
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type="text"
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="bg-background text-foreground"
      />
      {formik.touched[name] && formik.errors[name] && (
        <p className="text-sm text-red-500 mt-1">{formik.errors[name]}</p>
      )}
    </div>
  );
}
