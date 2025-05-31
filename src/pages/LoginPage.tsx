import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PhoneForm from '../components/auth/PhoneForm';
import OtpForm from '../components/auth/OtpForm';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [showOtpForm, setShowOtpForm] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 to-primary-600 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md text-center mb-8 animate-fade-in">
        <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-md mb-4">
          <BookOpen size={36} className="text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-white">eBook Admin Portal</h1>
        <p className="text-primary-100 mt-2">Manage your eBook library with ease</p>
      </div>

      {showOtpForm ? (
        <OtpForm />
      ) : (
        <PhoneForm onOtpSent={() => setShowOtpForm(true)} />
      )}

      <div className="mt-8 text-center text-primary-100 text-sm animate-fade-in">
        <p>© 2025 eBook Admin Portal. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LoginPage;