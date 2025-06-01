import { create } from "zustand";

export interface Author {
  _id: string;
  name: string;
  bio: string;
    createdAt: string;
  profileImage?: string;
}

interface AuthorStore {
  authors: Author[];
  setAuthors: (authors: Author[]) => void;
  addAuthor: (author: Author) => void;
  updateAuthor: (id: string, updatedAuthor: Partial<Author>) => void;
  deleteAuthor: (id: string) => void;
}

export const useAuthorStore = create<AuthorStore>((set) => ({
  authors: [],
  setAuthors: (authors) => set({ authors }),
  addAuthor: (author) =>
    set((state) => ({ authors: [...state.authors, author] })),
  updateAuthor: (id, updatedAuthor) =>
    set((state) => ({
      authors: state.authors.map((author) =>
        author._id === id ? { ...author, ...updatedAuthor } : author
      ),
    })),
  deleteAuthor: (id) =>
    set((state) => ({
      authors: state.authors.filter((author) => author._id !== id),
    })),
}));
