import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { X, Upload, GripVertical, Plus, Trash2 } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Ebook, Author, Category, Chapter } from '../../types';

interface EbookFormProps {
  ebook?: Ebook;
  authors: Author[];
  categories: Category[];
  onSubmit: (data: Partial<Ebook>) => void;
  onCancel: () => void;
}

interface FormData {
  title: string;
  description: string;
  author: string;
  categories: string[];
  contentStatus: 'draft' | 'published' | 'archived';
  chapters: Chapter[];
}

const SortableChapter = ({ chapter, index, onRemove }: { 
  chapter: Chapter; 
  index: number;
  onRemove: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: chapter.order.toString() });

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
            type="text"
            name={`chapters.${index}.title`}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            name={`chapters.${index}.content`}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
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
  authors,
  categories,
  onSubmit,
  onCancel,
}) => {
  const [coverImage, setCoverImage] = useState<string>(ebook?.coverImage || '');
  
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: ebook?.title || '',
      description: ebook?.description || '',
      author: ebook?.author.id || '',
      categories: ebook?.categories.map(c => c.id) || [],
      contentStatus: ebook?.contentStatus || 'draft',
      chapters: ebook?.chapters || [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "chapters",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = fields.findIndex(item => item.order.toString() === active.id);
      const newIndex = fields.findIndex(item => item.order.toString() === over.id);
      move(oldIndex, newIndex);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fakeUrl = URL.createObjectURL(file);
      setCoverImage(fakeUrl);
    }
  };

  const addChapter = () => {
    append({
      title: '',
      content: '',
      order: fields.length + 1,
      wordCount: 0,
      estimatedReadingTime: 0,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {ebook ? 'Edit eBook' : 'Add New eBook'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              {...register('title', { 
                required: 'Title is required',
                minLength: { value: 2, message: 'Title must be at least 2 characters' },
                maxLength: { value: 100, message: 'Title cannot exceed 100 characters' }
              })}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <select
              {...register('author', { required: 'Author is required' })}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select an author</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
            {errors.author && (
              <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register('description', {
              maxLength: { value: 1000, message: 'Description cannot exceed 1000 characters' }
            })}
            rows={4}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categories
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('categories')}
                  value={category.id}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content Status
          </label>
          <select
            {...register('contentStatus')}
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
                <img src={coverImage} alt="Cover preview" className="h-32 object-cover" />
                <button
                  type="button"
                  onClick={() => setCoverImage('')}
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
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
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
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
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
              items={fields.map(f => f.order.toString())}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((chapter, index) => (
                <SortableChapter
                  key={chapter.order}
                  chapter={chapter}
                  index={index}
                  onRemove={() => remove(index)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            {ebook ? 'Update eBook' : 'Create eBook'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EbookForm;