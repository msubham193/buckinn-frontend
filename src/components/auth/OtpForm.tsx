import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

interface FormData {
  otp: string;
}

const OtpForm: React.FC = () => {
  const { verifyOtp, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const success = await verifyOtp(data.otp);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg animate-fade-in">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full">
          <KeyRound size={32} />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Verify OTP
      </h2>
      <p className="text-gray-600 text-center mb-8">
        Enter the 6-digit code sent to your phone
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            OTP Code
          </label>
          <input
            id="otp"
            type="text"
            placeholder="123456"
            className={`w-full px-4 py-3 border ${
              errors.otp || error ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500`}
            {...register("otp", {
              required: "OTP is required",
              pattern: {
                value: /^[0-9]{6}$/,
                message: "Please enter a valid 6-digit OTP",
              },
            })}
          />
          {errors.otp && (
            <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
          )}
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          <p className="mt-2 text-xs text-gray-500">
            <span className="block font-medium">For demo purposes:</span>
            Use "123456" as the OTP code
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
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};

export default OtpForm;
