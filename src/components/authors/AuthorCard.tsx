import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Author } from "../../types";

interface AuthorCardProps {
  author: Author;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const AuthorCard: React.FC<AuthorCardProps> = ({
  author,
  onEdit,
  onDelete,
}) => {
  // Generate initials from the author's name
  const initials = author.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="bg-white rounded-lg shadow p-5 transition-all hover:shadow-md animate-fade-in">
      <div className="flex items-start">
        <img
          src={
            typeof author.profileImage === "string"
              ? author.profileImage
              : author.profileImage instanceof File
              ? URL.createObjectURL(author.profileImage)
              : undefined
          }
          className="h-12 w-12 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-bold text-lg"
        />
        <div className="ml-4 flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800">
              {author.name}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(author._id)}
                className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => onDelete(author._id)}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1 mb-3">
            {author.bio}
          </p>
          <div className="text-xs text-gray-400">
            Added: {new Date(author.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorCard;
