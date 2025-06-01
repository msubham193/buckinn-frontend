import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow p-5 transition-all hover:shadow-md animate-fade-in">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit(category._id)}
            className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
          >
            <Edit size={18} />
          </button>
          <button 
            onClick={() => onDelete(category._id)}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{category.description}</p>
      <div className="text-xs text-gray-400">
        Created: {new Date(category.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default CategoryCard;