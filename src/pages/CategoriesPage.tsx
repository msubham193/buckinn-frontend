import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import SearchInput from '../components/common/SearchInput';
import CategoryCard from '../components/categories/CategoryCard';
import CategoryForm from '../components/categories/CategoryForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { mockCategories } from '../services/mockData';
import { Category } from '../types';
import toast from 'react-hot-toast';

const CategoriesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filter categories based on search term
  const filteredCategories = mockCategories.filter(
    (category) => category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCategory = () => {
    setCurrentCategory(undefined);
    setShowForm(true);
  };

  const handleEditCategory = (id: string) => {
    const categoryToEdit = mockCategories.find((category) => category.id === id);
    if (categoryToEdit) {
      setCurrentCategory(categoryToEdit);
      setShowForm(true);
    }
  };

  const handleDeleteCategory = (id: string) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    // In a real app, this would call an API to delete the category
    toast.success('Category deleted successfully');
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const handleSubmit = (data: Partial<Category>) => {
    // In a real app, this would call an API to create or update the category
    if (currentCategory) {
      toast.success('Category updated successfully');
    } else {
      toast.success('Category created successfully');
    }
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <p className="text-gray-500">Manage your eBook categories</p>
        </div>
        <button
          onClick={handleCreateCategory}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <Plus size={18} className="mr-1" />
          Add New Category
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-64">
          <SearchInput
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
          />
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <CategoryForm
              category={currentCategory}
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
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