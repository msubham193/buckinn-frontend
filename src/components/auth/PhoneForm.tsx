import React from "react";
import { useForm } from "react-hook-form";
import { Phone } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

interface PhoneFormProps {
  onOtpSent: () => void;
}

interface FormData {
  phoneNumber: string;
}

const PhoneForm: React.FC<PhoneFormProps> = ({ onOtpSent }) => {
  const { login, isLoading, error } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    await login(data.phoneNumber);
    const currentError = useAuthStore.getState().error;
    if (!currentError) {
      onOtpSent();
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg animate-fade-in">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full">
          <Phone size={32} />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Admin Login
      </h2>
      <p className="text-gray-600 text-center mb-8">
        Enter your Indian phone number to receive an OTP
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone Number
          </label>
          <div className="relative">
            <input
              id="phoneNumber"
              type="tel"
              placeholder="+91 98765 43210"
              className={`w-full px-4 py-3 border ${
                errors.phoneNumber || error
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500`}
              {...register("phoneNumber", {
                required: "Phone number is required",
                pattern: {
                  value: /^\+91[1-9][0-9]{9}$/,
                  message:
                    "Please enter a valid Indian phone number starting with +91",
                },
              })}
            />
          </div>
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">
              {errors.phoneNumber.message}
            </p>
          )}
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          <p className="mt-2 text-xs text-gray-500">
            Format: +91 followed by 10 digits
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-md transition duration-300 ease-in-out flex justify-center items-center disabled:opacity-50"
        >
          {isLoading ? (
            <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
          ) : null}
          {isLoading ? "Sending OTP..." : "Get OTP"}
        </button>
      </form>
    </div>
  );
};

export default PhoneForm;
