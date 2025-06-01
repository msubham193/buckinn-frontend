import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import SearchInput from '../components/common/SearchInput';
import CategoryCard from '../components/categories/CategoryCard';
import CategoryForm from '../components/categories/CategoryForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { Category, useCategoryStore } from '../store/categoryStore';
import toast from 'react-hot-toast';
import { BASE_URL } from '../Constants';
import { useAuthStore } from '../store/authStore';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

const CategoriesPage: React.FC = () => {
  const accessToken: string | null = useAuthStore((state) => state.accessToken);
  const { categories, setCategories, updateCategory, addCategory, deleteCategory } = useCategoryStore();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Memoize filtered categories to prevent recalculation on every render
  const filteredCategories: Category[] = useMemo(
    () =>
      categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [categories, searchTerm]
  );

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<{ data: { categories: Category[] } }>(
        `${BASE_URL}/categories`,
        {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
          },
        }
      );
      setCategories(response.data.data.categories);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setError(error.response?.data?.message || 'Failed to fetch categories');
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, [accessToken, setCategories]);

  const handleCreateCategory = useCallback(() => {
    setCurrentCategory(undefined);
    setShowForm(true);
  }, []);

  const handleEditCategory = useCallback(
    (id: string) => {
      const categoryToEdit = categories.find((category) => category._id === id);
      if (categoryToEdit) {
        setCurrentCategory(categoryToEdit);
        setShowForm(true);
      }
    },
    [categories]
  );

  const handleDeleteCategory = useCallback((id: string) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteId) return;

    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/categories/${deleteId}`, {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        },
      });
      deleteCategory(deleteId);
      toast.success('Category deleted successfully');
      setShowDeleteConfirm(false);
      setDeleteId(null);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || 'Failed to delete category');
    } finally {
      setLoading(false);
    }
  }, [accessToken, deleteId, deleteCategory]);

  const handleSubmit = useCallback(
    async (data: Partial<Category>) => {
      setLoading(true);
      setError(null);

      try {
        const headers = {
          'Content-Type': 'application/json',
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        };

        if (currentCategory) {
          // Update existing category
          const response = await axios.put<{ data: { category: Category } }>(
            `${BASE_URL}/categories/${currentCategory._id}`,
            {
              name: data.name,
              description: data.description,
            },
            { headers }
          );
          updateCategory(currentCategory._id, response.data.data.category);
          toast.success('Category updated successfully');
        } else {
          // Create new category
          const response = await axios.post<{ data: { category: Category } }>(
            `${BASE_URL}/categories`,
            {
              name: data.name,
              description: data.description,
            },
            { headers }
          );
          addCategory(response.data.data.category);
          toast.success('Category created successfully');
        }

        setShowForm(false);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        setError(error.response?.data?.message || 'Failed to save category');
        toast.error(error.response?.data?.message || 'Failed to save category');
      } finally {
        setLoading(false);
      }
    },
    [accessToken, currentCategory, updateCategory, addCategory]
  );

  return (
    <div className="space-y-6 mt-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <p className="text-gray-500">Manage your eBook categories</p>
        </div>
        <button
          onClick={handleCreateCategory}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} className="mr-1" />
          Add New Category
        </button>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-64">
          <SearchInput
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {filteredCategories.length}{' '}
            {filteredCategories.length === 1 ? 'category' : 'categories'}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category._id}
              category={category}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
            />
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <CategoryForm
              category={currentCategory}
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
              isLoading={loading}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        isDestructive={true}
      />
    </div>
  );
};

export default CategoriesPage;