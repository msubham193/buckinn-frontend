import { create } from "zustand";
import toast from "react-hot-toast";
import { User } from "../types";
import { BASE_URL } from "../Constants";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  userId: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (phoneNumber: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<boolean>;
  logout: () => void;
}

// Initialize state from localStorage
const getInitialState = () => {
  const storedUser = localStorage.getItem("user");
  const storedAccessToken = localStorage.getItem("accessToken");
  const storedRefreshToken = localStorage.getItem("refreshToken");

  if (storedUser && storedAccessToken && storedRefreshToken) {
    try {
      return {
        user: JSON.parse(storedUser) as User,
        isAuthenticated: true,
        accessToken: storedAccessToken,
        refreshToken: storedRefreshToken,
      };
    } catch {
      // Clear invalid data
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }

  return {
    user: null,
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),
  isLoading: false,
  error: null,
  userId: null,

  login: async (phoneNumber: string) => {
    set({ isLoading: true, error: null });

    try {
      // Validate Indian phone number format
      if (!phoneNumber.match(/^\+91[1-9][0-9]{9}$/)) {
        throw new Error("Invalid Indian phone number format");
      }

      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send OTP");
      }

      set({ userId: data.data.userId });
      toast.success(data.data.message || "OTP sent to your phone number");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send OTP";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  verifyOtp: async (otp: string): Promise<boolean> => {
    set({ isLoading: true, error: null });

    try {
      const userId = useAuthStore.getState().userId;
      if (!userId) {
        throw new Error("No user session found");
      }

      const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, otp }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid OTP");
      }

      const userData: User = {
        id: data.data.user.id,
        phoneNumber: data.data.user.phoneNumber,
        name: data.data.user.name,
        role: data.data.user.role,
      };

      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);

      set({
        user: userData,
        isAuthenticated: true,
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      });
      toast.success(data.data.message || "Successfully logged in");
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to verify OTP";
      set({ error: errorMessage });
      toast.error(errorMessage);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    set({
      user: null,
      isAuthenticated: false,
      userId: null,
      accessToken: null,
      refreshToken: null,
      error: null,
    });
    toast.success("Logged out successfully");
  },
}));
