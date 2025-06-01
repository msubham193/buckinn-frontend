import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Plus } from "lucide-react";
import axios, { AxiosError } from "axios";
import SearchInput from "../components/common/SearchInput";
import EbookCard from "../components/ebooks/EbookCard";
import EbookForm from "../components/ebooks/EbookForm";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { Ebook } from "../store/eBookStore";
import { useEbookStore } from "../store/eBookStore";
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

const EbooksPage: React.FC = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { ebooks, setEbooks, addEbook, updateEbook, deleteEbook } =
    useEbookStore();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [currentEbook, setCurrentEbook] = useState<Ebook | undefined>(
    undefined
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Memoize filtered ebooks to prevent recalculation on every render
  const filteredEbooks = useMemo(
    () =>
      ebooks.filter((ebook) =>
        ebook.title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [ebooks, searchTerm]
  );

  // Fetch ebooks on component mount
  useEffect(() => {
    fetchEbooks();
  }, []);

  const fetchEbooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<{ data: { books: Ebook[] } }>(
        `${BASE_URL}/books`,
        {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
          },
        }
      );
      setEbooks(response.data.data.books);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setError(error.response?.data?.message || "Failed to fetch eBooks");
      toast.error("Failed to fetch eBooks");
    } finally {
      setLoading(false);
    }
  }, [accessToken, setEbooks]);

  const handleCreateEbook = useCallback(() => {
    setCurrentEbook(undefined);
    setShowForm(true);
  }, []);

  const handleEditEbook = useCallback(
    (id: string) => {
      const ebookToEdit = ebooks.find((ebook) => ebook._id === id);
      if (ebookToEdit) {
        setCurrentEbook(ebookToEdit);
        setShowForm(true);
      }
    },
    [ebooks]
  );

  const handleDeleteEbook = useCallback((id: string) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteId) return;

    setLoading(true);
    try {
      await axios.delete(`${BASE_URL}/books/${deleteId}`, {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        },
      });
      deleteEbook(deleteId);
      toast.success("eBook deleted successfully");
      setShowDeleteConfirm(false);
      setDeleteId(null);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Failed to delete eBook");
    } finally {
      setLoading(false);
    }
  }, [accessToken, deleteId, deleteEbook]);

  const handleSubmit = useCallback(
    async (data: Partial<Ebook>, coverImage?: File) => {
      setLoading(true);
      setError(null);

      try {
        const headers = {
          "Content-Type": "multipart/form-data",
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
        };

        const formData = new FormData();
        formData.append("title", data.title || "");
        formData.append("description", data.description || "");
        formData.append("author", data.author?._id || "");
        data.categories?.forEach((category, index) => {
          formData.append(`categories[${index}]`, category._id);
        });
        formData.append("contentStatus", data.contentStatus || "draft");
        data.chapters?.forEach((chapter, index) => {
          formData.append(`chapters[${index}][title]`, chapter.title);
          formData.append(`chapters[${index}][content]`, chapter.content);
          formData.append(
            `chapters[${index}][order]`,
            chapter.order.toString()
          );
        });
        if (coverImage) {
          formData.append("coverImage", coverImage);
        }

        if (currentEbook) {
          // Update existing ebook
          const response = await axios.put<{ data: { book: Ebook } }>(
            `${BASE_URL}/books/${currentEbook._id}`,
            formData,
            { headers }
          );
          updateEbook(currentEbook._id, response.data.data.book);
          toast.success("eBook updated successfully");
        } else {
          // Create new ebook
          const response = await axios.post<{ data: { book: Ebook } }>(
            `${BASE_URL}/books`,
            formData,
            { headers }
          );
          addEbook(response.data.data.book);
          toast.success("eBook created successfully");
        }

        setShowForm(false);
      } catch (err) {
        const error = err as AxiosError<{ message?: string }>;
        setError(error.response?.data?.message || "Failed to save eBook");
        toast.error(error.response?.data?.message || "Failed to save eBook");
      } finally {
        setLoading(false);
      }
    },
    [accessToken, currentEbook, updateEbook, addEbook]
  );

  return (
    <div className="space-y-6 mt-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">eBooks</h1>
          <p className="text-gray-500">Manage your eBook collection</p>
        </div>
        <button
          onClick={handleCreateEbook}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} className="mr-1" />
          Add New eBook
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
            placeholder="Search eBooks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {filteredEbooks.length}{" "}
            {filteredEbooks.length === 1 ? "eBook" : "eBooks"}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEbooks.map((ebook) => (
            <EbookCard
              key={ebook._id}
              ebook={ebook}
              onEdit={handleEditEbook}
              onDelete={handleDeleteEbook}
            />
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[80vw] max-h-[90vh] overflow-y-auto">
            <EbookForm
              ebook={currentEbook}
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
              isLoading={loading}
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
