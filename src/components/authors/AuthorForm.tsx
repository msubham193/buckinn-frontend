import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { Author } from "../../types";
import { useAuthStore } from "../../store/authStore";

interface AuthorFormProps {
  author?: Author;
  onSubmit: (data: Partial<Author> & { profileImage?: File }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface FormData {
  name: string;
  bio: string;
  profileImage?: File;
}

const AuthorForm: React.FC<AuthorFormProps> = ({
  author,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: author?.name || "",
      bio: author?.bio || "",
    },
  });
  const [previewImage, setPreviewImage] = useState<string | null>(
    author?.profileImage || null
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        alert("Please upload a valid image (JPEG, PNG, or GIF)");
        return;
      }
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }
      // Create preview URL
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  };

  const onSubmitForm = (data: FormData) => {
    const fileInput = document.querySelector<HTMLInputElement>(
      'input[name="profileImage"]'
    );
    const file = fileInput?.files?.[0];
    onSubmit({
      ...data,
      profileImage: file,
    });
    // Clean up preview URL to avoid memory leaks
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {author ? "Edit Author" : "Add New Author"}
        </h2>
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Author Name
          </label>
          <input
            id="name"
            type="text"
            disabled={isLoading}
            className={`w-full px-4 py-2 border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50`}
            {...register("name", { required: "Author name is required" })}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="bio"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Biography
          </label>
          <textarea
            id="bio"
            rows={4}
            disabled={isLoading}
            className={`w-full px-4 py-2 border ${
              errors.bio ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50`}
            {...register("bio", { required: "Biography is required" })}
          ></textarea>
          {errors.bio && (
            <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="profileImage"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Profile Image
          </label>
          <input
            id="profileImage"
            name="profileImage"
            type="file"
            accept="image/jpeg,image/png,image/gif"
            disabled={isLoading}
            className={`w-full px-4 py-2 border ${
              errors.profileImage ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none disabled:opacity-50`}
            onChange={handleFileChange}
          />
          {previewImage && (
            <div className="mt-2">
              <img
                src={previewImage}
                alt="Profile preview"
                className="h-32 w-32 object-cover rounded-md"
              />
            </div>
          )}
          {errors.profileImage && (
            <p className="mt-1 text-sm text-red-600">
              {errors.profileImage.message}
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : author ? "Update Author" : "Add Author"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthorForm;
