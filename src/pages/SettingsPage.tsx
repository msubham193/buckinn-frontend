import React from 'react';
import { User, Bell, Shield, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 mt-16">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500">Manage your account settings and preferences</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
              <User size={24} />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-800">Profile Information</h2>
              <p className="text-sm text-gray-500">Update your account profile information</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={user?.phoneNumber || ''}
                readOnly
              />
              <p className="mt-1 text-xs text-gray-500">Your login phone number</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                value="Administrator"
                readOnly
              />
              <p className="mt-1 text-xs text-gray-500">Your account role</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <Bell size={20} className="text-primary-600" />
              <h2 className="ml-2 text-lg font-medium text-gray-800">Notifications</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Email Notifications</h3>
                  <p className="text-xs text-gray-500">Receive email for important updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={true} onChange={() => {}} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-800">SMS Notifications</h3>
                  <p className="text-xs text-gray-500">Receive text messages for important updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <Shield size={20} className="text-primary-600" />
              <h2 className="ml-2 text-lg font-medium text-gray-800">Security</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-800">Two-Factor Authentication</h3>
                <p className="text-xs text-gray-500 mb-2">Add an extra layer of security</p>
                <button className="px-3 py-1.5 bg-primary-100 text-primary-700 text-xs font-medium rounded hover:bg-primary-200 transition-colors">
                  Enable
                </button>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-800">Change Phone Number</h3>
                <p className="text-xs text-gray-500 mb-2">Update your login phone number</p>
                <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded hover:bg-gray-200 transition-colors">
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <HelpCircle size={20} className="text-primary-600" />
              <h2 className="ml-2 text-lg font-medium text-gray-800">Help & Support</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-800">Documentation</h3>
                <p className="text-xs text-gray-500 mb-2">Learn how to use the admin portal</p>
                <a href="#" className="text-primary-600 text-xs hover:underline">
                  View Documentation
                </a>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-800">Contact Support</h3>
                <p className="text-xs text-gray-500 mb-2">Get help from our support team</p>
                <a href="#" className="text-primary-600 text-xs hover:underline">
                  Open Support Ticket
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;