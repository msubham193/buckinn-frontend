import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import SearchInput from '../components/common/SearchInput';
import EbookCard from '../components/ebooks/EbookCard';
import EbookForm from '../components/ebooks/EbookForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { mockEbooks, mockAuthors, mockCategories } from '../services/mockData';
import { Ebook } from '../types';
import toast from 'react-hot-toast';

const EbooksPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentEbook, setCurrentEbook] = useState<Ebook | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filter ebooks based on search term
  const filteredEbooks = mockEbooks.filter(
    (ebook) => ebook.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateEbook = () => {
    setCurrentEbook(undefined);
    setShowForm(true);
  };

  const handleEditEbook = (id: string) => {
    const ebookToEdit = mockEbooks.find((ebook) => ebook.id === id);
    if (ebookToEdit) {
      setCurrentEbook(ebookToEdit);
      setShowForm(true);
    }
  };

  const handleDeleteEbook = (id: string) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    // In a real app, this would call an API to delete the ebook
    toast.success('eBook deleted successfully');
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const handleSubmit = (data: Partial<Ebook>) => {
    // In a real app, this would call an API to create or update the ebook
    if (currentEbook) {
      toast.success('eBook updated successfully');
    } else {
      toast.success('eBook created successfully');
    }
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">eBooks</h1>
          <p className="text-gray-500">Manage your eBook collection</p>
        </div>
        <button
          onClick={handleCreateEbook}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <Plus size={18} className="mr-1" />
          Add New eBook
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-64">
          <SearchInput
            placeholder="Search eBooks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {filteredEbooks.length} {filteredEbooks.length === 1 ? 'eBook' : 'eBooks'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredEbooks.map((ebook) => (
          <EbookCard
            key={ebook.id}
            ebook={ebook}
            onEdit={handleEditEbook}
            onDelete={handleDeleteEbook}
          />
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <EbookForm
              ebook={currentEbook}
              authors={mockAuthors}
              categories={mockCategories}
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete eBook"
        message="Are you sure you want to delete this eBook? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        isDestructive={true}
      />
    </div>
  );
};

export default EbooksPage;