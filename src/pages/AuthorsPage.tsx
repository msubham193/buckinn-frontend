import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import SearchInput from '../components/common/SearchInput';
import AuthorCard from '../components/authors/AuthorCard';
import AuthorForm from '../components/authors/AuthorForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { mockAuthors } from '../services/mockData';
import { Author } from '../types';
import toast from 'react-hot-toast';

const AuthorsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState<Author | undefined>(undefined);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filter authors based on search term
  const filteredAuthors = mockAuthors.filter(
    (author) => author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateAuthor = () => {
    setCurrentAuthor(undefined);
    setShowForm(true);
  };

  const handleEditAuthor = (id: string) => {
    const authorToEdit = mockAuthors.find((author) => author.id === id);
    if (authorToEdit) {
      setCurrentAuthor(authorToEdit);
      setShowForm(true);
    }
  };

  const handleDeleteAuthor = (id: string) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    // In a real app, this would call an API to delete the author
    toast.success('Author deleted successfully');
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const handleSubmit = (data: Partial<Author>) => {
    // In a real app, this would call an API to create or update the author
    if (currentAuthor) {
      toast.success('Author updated successfully');
    } else {
      toast.success('Author created successfully');
    }
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Authors</h1>
          <p className="text-gray-500">Manage your eBook authors</p>
        </div>
        <button
          onClick={handleCreateAuthor}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <Plus size={18} className="mr-1" />
          Add New Author
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-64">
          <SearchInput
            placeholder="Search authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {filteredAuthors.length} {filteredAuthors.length === 1 ? 'author' : 'authors'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAuthors.map((author) => (
          <AuthorCard
            key={author.id}
            author={author}
            onEdit={handleEditAuthor}
            onDelete={handleDeleteAuthor}
          />
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <AuthorForm
              author={currentAuthor}
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Author"
        message="Are you sure you want to delete this author? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        isDestructive={true}
      />
    </div>
  );
};

export default AuthorsPage;