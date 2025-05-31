import React, { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { User, AuthContextType } from "../types";
import { BASE_URL } from "../Constants";

const initialState: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async () => {},
  verifyOtp: async () => false,
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(initialState);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (phoneNumber: string) => {
    setIsLoading(true);
    setError(null);
    console.log("Hello from login function", phoneNumber);
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

      console.log(data);
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setUserId(data.data.userId);
      toast.success(data.data.message || "OTP sent to your phone number");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send OTP";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
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
        id: userId,
        phoneNumber: data.data.phoneNumber || "",
      };

      setUser(userData);
      setIsAuthenticated(true);
      toast.success("Successfully logged in");
      navigate("/dashboard");
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to verify OTP";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setUserId(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
