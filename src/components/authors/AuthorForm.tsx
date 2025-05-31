import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Author } from '../../types';

interface AuthorFormProps {
  author?: Author;
  onSubmit: (data: Partial<Author>) => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  bio: string;
}

const AuthorForm: React.FC<AuthorFormProps> = ({
  author,
  onSubmit,
  onCancel,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: author?.name || '',
      bio: author?.bio || '',
    },
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {author ? 'Edit Author' : 'Add New Author'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Author Name
          </label>
          <input
            id="name"
            type="text"
            className={`w-full px-4 py-2 border ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500`}
            {...register('name', { required: 'Author name is required' })}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Biography
          </label>
          <textarea
            id="bio"
            rows={4}
            className={`w-full px-4 py-2 border ${
              errors.bio ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500`}
            {...register('bio', { required: 'Biography is required' })}
          ></textarea>
          {errors.bio && (
            <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {author ? 'Update Author' : 'Add Author'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthorForm;