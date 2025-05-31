import React from 'react';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import { Ebook } from '../../types';

interface EbookCardProps {
  ebook: Ebook;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const EbookCard: React.FC<EbookCardProps> = ({ ebook, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden transition-all hover:shadow-md animate-fade-in">
      <div className="h-48 overflow-hidden">
        <img 
          src={ebook.coverImage} 
          alt={ebook.title} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">{ebook.title}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{ebook.description}</p>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
              eBook
            </span>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => onEdit(ebook.id)}
              className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
            >
              <Edit size={18} />
            </button>
            <button 
              onClick={() => onDelete(ebook.id)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash2 size={18} />
            </button>
            <a 
              href={ebook.fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-1.5 text-gray-500 hover:text-secondary-600 hover:bg-secondary-50 rounded-full transition-colors"
            >
              <ExternalLink size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EbookCard;