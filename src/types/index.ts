export interface User {
  id: string;
  phoneNumber: string;
  name: string;
  role: string;
}

export interface Author {
  _id: string;
  name: string;
  bio: string;
  createdAt: string;

  profileImage?: string | File;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Chapter {
  title: string;
  content: string;
  order: number;
  wordCount: number;
  estimatedReadingTime: number;
}

export interface BookStatistics {
  totalReads: number;
  averageRating: number;
  totalReviews: number;
  totalWordCount: number;
  totalEstimatedReadingTime: number;
}

export interface Ebook {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  author: Author;
  categories: Category[];
  contentStatus: "draft" | "published" | "archived";
  chapters: Chapter[];
  statistics: BookStatistics;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  fileUrl: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (phoneNumber: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<boolean>;
  logout: () => void;
}
