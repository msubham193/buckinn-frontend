import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import axios, { AxiosError } from "axios";
import SearchInput from "../components/common/SearchInput";
import AuthorCard from "../components/authors/AuthorCard";
import AuthorForm from "../components/authors/AuthorForm";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { useAuthorStore } from "../store/authorStore";
import type { Author } from "../types"; // Or the correct path to your central Author type
import toast from "react-hot-toast";
import { BASE_URL } from "../Constants";
import { useAuthStore } from "../store/authStore";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

const AuthorsPage: React.FC = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { authors, setAuthors } = useAuthorStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState<Author | undefined>(
    undefined
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter authors based on search term
  const filteredAuthors = authors.filter((author) =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch authors on component mount
  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/authors`, {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        },
      });
      setAuthors(response.data.data.authors);
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage =
        error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? (error.response.data as { message: string }).message
          : "Failed to fetch authors";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAuthor = () => {
    setCurrentAuthor(undefined);
    setShowForm(true);
  };

  const handleEditAuthor = (id: string) => {
    const authorToEdit = authors.find((author) => author._id === id);
    if (authorToEdit) {
      setCurrentAuthor(authorToEdit);
      setShowForm(true);
    }
  };

  const handleDeleteAuthor = (id: string) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/authors/${deleteId}`, {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        },
      });
      useAuthorStore.getState().deleteAuthor(deleteId);
      toast.success("Author deleted successfully");
      setShowDeleteConfirm(false);
      setDeleteId(null);
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage =
        error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? (error.response.data as { message: string }).message
          : "Failed to delete author";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (
    data: Partial<Author> & { profileImage?: File }
  ) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", data.name || "");
      formData.append("bio", data.bio || "");
      if (data.profileImage) {
        formData.append("profileImage", data.profileImage);
      }

      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
      };

      if (currentAuthor) {
        // Update existing author
        const response = await axios.put(
          `${BASE_URL}/authors/${currentAuthor._id}`,
          formData,
          {
            headers,
          }
        );
        useAuthorStore
          .getState()
          .updateAuthor(currentAuthor._id, response.data.data);
        toast.success("Author updated successfully");
      } else {
        // Create new author
        const response = await axios.post(`${BASE_URL}/authors`, formData, {
          headers,
        });
        useAuthorStore.getState().addAuthor(response.data.data.author);
        toast.success("Author created successfully");
      }

      setShowForm(false);
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage =
        error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? (error.response.data as { message: string }).message
          : "Failed to save author";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 mt-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Authors</h1>
          <p className="text-gray-500">Manage your eBook authors</p>
        </div>
        <button
          onClick={handleCreateAuthor}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} className="mr-1" />
          Add New Author
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
            placeholder="Search authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {filteredAuthors.length}{" "}
            {filteredAuthors.length === 1 ? "author" : "authors"}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAuthors.map((author) => (
            <AuthorCard
              key={author._id}
              author={author}
              onEdit={handleEditAuthor}
              onDelete={handleDeleteAuthor}
            />
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <AuthorForm
              author={currentAuthor}
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
              isLoading={loading}
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
