import React, { useState, useEffect, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { X, Upload, GripVertical, Plus, Trash2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Select from "react-select";
import {
  GroupBase,
  StylesConfig,

} from "react-select";
import axios, { AxiosError } from "axios";
import { Ebook, Chapter } from "../../store/eBookStore";
import { Author, useAuthorStore } from "../../store/authorStore";
import { Category, useCategoryStore } from "../../store/categoryStore";
import { useAuthStore } from "../../store/authStore";
import { BASE_URL } from "../../Constants";
import toast from "react-hot-toast";

interface EbookFormProps {
  ebook?: Ebook;
  onSubmit: (data: Partial<Ebook>, coverImage?: File) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface FormData {
  title: string;
  description: string;
  author: string;
  categories: { value: string; label: string }[];
  contentStatus: "draft" | "published" | "archived";
  chapters: Chapter[];
}

// Default category options if none are fetched from the API
const defaultCategoryOptions = [
  { value: "fiction", label: "Fiction" },
  { value: "non-fiction", label: "Non-Fiction" },
  { value: "mystery", label: "Mystery & Thriller" },
  { value: "romance", label: "Romance" },
  { value: "science-fiction", label: "Science Fiction" },
  { value: "fantasy", label: "Fantasy" },
  { value: "biography", label: "Biography & Memoir" },
  { value: "history", label: "History" },
  { value: "self-help", label: "Self-Help" },
  { value: "business", label: "Business & Economics" },
  { value: "technology", label: "Technology & Computing" },
  { value: "health", label: "Health & Fitness" },
  { value: "travel", label: "Travel" },
  { value: "cooking", label: "Cooking & Food" },
  { value: "art", label: "Art & Design" },
  { value: "education", label: "Education & Teaching" },
  { value: "children", label: "Children's Books" },
  { value: "young-adult", label: "Young Adult" },
  { value: "poetry", label: "Poetry" },
  { value: "drama", label: "Drama & Plays" },
  { value: "philosophy", label: "Philosophy" },
  { value: "psychology", label: "Psychology" },
  { value: "religion", label: "Religion & Spirituality" },
  { value: "politics", label: "Politics & Social Sciences" },
  { value: "sports", label: "Sports & Recreation" },
  { value: "humor", label: "Humor & Entertainment" },
  { value: "reference", label: "Reference" },
  { value: "academic", label: "Academic & Textbooks" },
  { value: "professional", label: "Professional & Technical" },
  { value: "lifestyle", label: "Lifestyle" },
];

const SortableChapter = ({
  chapter,
  index,
  onRemove,
  register,
  errors,
}: {
  chapter: Chapter;
  index: number;
  onRemove: () => void;
  register: import("react-hook-form").UseFormRegister<FormData>;
  errors: import("react-hook-form").FieldErrors<FormData>;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: chapter.order.toString(),
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start space-x-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4"
    >
      <button
        type="button"
        className="mt-2 text-gray-400 hover:text-gray-600"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={20} />
      </button>
      <div className="flex-1 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Chapter {index + 1} Title
          </label>
          <input
            {...register(`chapters.${index}.title`, {
              required: "Chapter title is required",
            })}
            className={`mt-1 h-10 pl-3 border  block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
              errors.chapters?.[index]?.title ? "border-red-500" : ""
            }`}
          />
          {errors.chapters?.[index]?.title && (
            <p className="mt-1 text-sm text-red-600">
              {errors.chapters[index].title.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            {...register(`chapters.${index}.content`, {
              required: "Chapter content is required",
            })}
            rows={4}
            className={`mt-1 block w-full rounded-md border pl-2 border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
              errors.chapters?.[index]?.content ? "border-red-500" : ""
            }`}
          />
          {errors.chapters?.[index]?.content && (
            <p className="mt-1 text-sm text-red-600">
              {errors.chapters[index].content.message}
            </p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

const EbookForm: React.FC<EbookFormProps> = ({
  ebook,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { authors, setAuthors } = useAuthorStore();
  const { categories, setCategories } = useCategoryStore();
  const [coverImage, setCoverImage] = useState<string | undefined>(
    ebook?.coverImage
  );
  const [coverImageFile, setCoverImageFile] = useState<File | undefined>(
    undefined
  );
  const [isFetchingAuthors, setIsFetchingAuthors] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      title: ebook?.title || "",
      description: ebook?.description || "",
      author: ebook?.author._id || "",
      categories:
        ebook?.categories.map((c) => ({ value: c._id, label: c.name })) || [],
      contentStatus: ebook?.contentStatus || "draft",
      chapters: ebook?.chapters || [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "chapters",
  });

  const selectedCategories = watch("categories");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch authors if not in global state
  const fetchAuthors = useCallback(async () => {
    if (authors.length > 0) return;
    setIsFetchingAuthors(true);
    try {
      const response = await axios.get<{ data: { authors: Author[] } }>(
        `${BASE_URL}/authors`,
        {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
          },
        }
      );
      setAuthors(response.data.data.authors);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message || "Failed to fetch authors");
    } finally {
      setIsFetchingAuthors(false);
    }
  }, [accessToken, authors.length, setAuthors]);

  // Fetch categories if not in global state
  const fetchCategories = useCallback(async () => {
    if (categories.length > 0) return;
    setIsFetchingCategories(true);
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
      toast.error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    } finally {
      setIsFetchingCategories(false);
    }
  }, [accessToken, categories.length, setCategories]);

  useEffect(() => {
    fetchAuthors();
    fetchCategories();
  }, [fetchAuthors, fetchCategories]);

  const handleDragEnd = useCallback(
    (event: import("@dnd-kit/core").DragEndEvent) => {
      const { active, over } = event;
      if (active && over && active.id !== over.id) {
        const oldIndex = fields.findIndex(
          (item) => item.order.toString() === active.id
        );
        const newIndex = fields.findIndex(
          (item) => item.order.toString() === over.id
        );
        move(oldIndex, newIndex);
        // Update order in form data
        const updatedChapters = arrayMove(fields, oldIndex, newIndex).map(
          (chapter, idx) => ({
            ...chapter,
            order: idx + 1,
          })
        );
        setValue("chapters", updatedChapters);
      }
    },
    [fields, move, setValue]
  );

  const handleCoverImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setCoverImageFile(file);
        const fakeUrl = URL.createObjectURL(file);
        setCoverImage(fakeUrl);
      }
    },
    []
  );

  const addChapter = useCallback(() => {
    append({
      title: "",
      content: "",
      order: fields.length + 1,
      wordCount: 0,
      estimatedReadingTime: 0,
    });
  }, [append, fields.length]);

  const onFormSubmit = useCallback(
    (data: FormData) => {
      const formattedData: Partial<Ebook> = {
        title: data.title,
        description: data.description,
        author: {
          _id: data.author,
          name: authors.find((a) => a._id === data.author)?.name || "",
        },
        categories: data.categories.map((c) => ({
          _id: c.value,
          name: categories.find((cat) => cat._id === c.value)?.name || c.label,
        })),
        contentStatus: data.contentStatus,
        chapters: data.chapters.map((chapter, index) => ({
          ...chapter,
          order: index + 1,
        })),
      };
      onSubmit(formattedData, coverImageFile);
    },
    [onSubmit, coverImageFile, authors, categories]
  );

  // Get category options (API categories + default options)
  const getCategoryOptions = useCallback(() => {
    const apiCategories = categories.map((c) => ({
      value: c._id,
      label: c.name,
    }));
    // If we have API categories, use them; otherwise use default options
    return apiCategories.length > 0 ? apiCategories : defaultCategoryOptions;
  }, [categories]);

  // Custom styles for react-select

  const selectStyles: StylesConfig<
    { value: string; label: string },
    true,
    GroupBase<{ value: string; label: string }>
  > = {
    control: (base, state) => ({
      ...base,
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
      boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
      "&:hover": {
        borderColor: "#3b82f6",
      },
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#eff6ff",
      borderRadius: "4px",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#1e40af",
      fontSize: "14px",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#6b7280",
      ":hover": {
        backgroundColor: "#fee2e2",
        color: "#dc2626",
      },
    }),
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in w-[80vw] max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {ebook ? "Edit eBook" : "Add New eBook"}
        </h2>
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 disabled:opacity-50"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 2,
                  message: "Title must be at least 2 characters",
                },
                maxLength: {
                  value: 100,
                  message: "Title cannot exceed 100 characters",
                },
              })}
              disabled={isLoading}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 ${
                errors.title ? "border-red-500" : ""
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <select
              {...register("author", { required: "Author is required" })}
              disabled={isLoading || isFetchingAuthors}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 ${
                errors.author ? "border-red-500" : ""
              }`}
            >
              <option value="">Select an author</option>
              {authors.map((author) => (
                <option key={author._id} value={author._id}>
                  {author.name}
                </option>
              ))}
            </select>
            {errors.author && (
              <p className="mt-1 text-sm text-red-600">
                {errors.author.message}
              </p>
            )}
            {isFetchingAuthors && (
              <p className="mt-1 text-sm text-gray-500">Fetching authors...</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register("description", {
              maxLength: {
                value: 1000,
                message: "Description cannot exceed 1000 characters",
              },
            })}
            disabled={isLoading}
            rows={4}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 ${
              errors.description ? "border-red-500" : ""
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categories
          </label>
          <Select
            isMulti
            options={getCategoryOptions()}
            value={selectedCategories}
            onChange={(selected) =>
              setValue("categories", Array.from(selected || []))
            }
            isDisabled={isLoading || isFetchingCategories}
            classNamePrefix="react-select"
            placeholder="Select categories..."
            styles={selectStyles}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            isSearchable={true}
            menuPlacement="auto"
            maxMenuHeight={200}
            noOptionsMessage={() => "No categories found"}
          />
          {selectedCategories && selectedCategories.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Selected:{" "}
                {selectedCategories.map((cat) => cat.label).join(", ")}
              </p>
            </div>
          )}
          {isFetchingCategories && (
            <p className="mt-1 text-sm text-gray-500">Fetching categories...</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content Status
          </label>
          <select
            {...register("contentStatus")}
            disabled={isLoading}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cover Image
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            {coverImage ? (
              <div className="relative">
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCoverImage(undefined);
                    setCoverImageFile(undefined);
                  }}
                  disabled={isLoading}
                  className="absolute top-0 right-0 p-1 bg-white rounded-full shadow"
                >
                  <X size={16} className="text-gray-500" />
                </button>
              </div>
            ) : (
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      onChange={handleCoverImageChange}
                      accept="image/*"
                      disabled={isLoading}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-lg font-medium text-gray-700">
              Chapters
            </label>
            <button
              type="button"
              onClick={addChapter}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              <Plus size={16} className="mr-1" />
              Add Chapter
            </button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={fields.map((f) => f.order.toString())}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((chapter, index) => (
                <SortableChapter
                  key={chapter.order}
                  chapter={chapter}
                  index={index}
                  onRemove={() => remove(index)}
                  register={register}
                  errors={errors}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : ebook ? "Update eBook" : "Create eBook"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EbookForm;
