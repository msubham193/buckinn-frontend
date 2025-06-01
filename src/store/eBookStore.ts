import { create } from "zustand";

export interface Chapter {
  title: string;
  content: string;
  order: number;
  wordCount: number;
  estimatedReadingTime: number;
}

export interface Ebook {
  _id: string;
  title: string;
  description: string;
  author: { _id: string; name: string };
  categories: { _id: string; name: string }[];
  contentStatus: "draft" | "published" | "archived";
  coverImage?: string;
  chapters: Chapter[];
}

interface EbookStore {
  ebooks: Ebook[];
  setEbooks: (ebooks: Ebook[]) => void;
  addEbook: (ebook: Ebook) => void;
  updateEbook: (id: string, updatedEbook: Partial<Ebook>) => void;
  deleteEbook: (id: string) => void;
}

export const useEbookStore = create<EbookStore>((set) => ({
  ebooks: [],
  setEbooks: (ebooks) => set({ ebooks }),
  addEbook: (ebook) => set((state) => ({ ebooks: [...state.ebooks, ebook] })),
  updateEbook: (id, updatedEbook) =>
    set((state) => ({
      ebooks: state.ebooks.map((ebook) =>
        ebook._id === id ? { ...ebook, ...updatedEbook } : ebook
      ),
    })),
  deleteEbook: (id) =>
    set((state) => ({
      ebooks: state.ebooks.filter((ebook) => ebook._id !== id),
    })),
}));
