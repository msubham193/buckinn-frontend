import React from 'react';
import { BookOpen, Users, Tag, BookMarked } from 'lucide-react';
import StatCard from '../components/common/StatCard';
import { mockEbooks, mockAuthors, mockCategories } from '../services/mockData';

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Welcome to your eBook admin portal</p>
        </div>
        <div>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
            Upload New eBook
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total eBooks" 
          value={mockEbooks.length} 
          icon={BookOpen}
          trend="up"
          trendValue="2 this week"
          color="primary"
        />
        <StatCard 
          title="Authors" 
          value={mockAuthors.length} 
          icon={Users}
          trend="neutral"
          trendValue="Same as last week"
          color="secondary"
        />
        <StatCard 
          title="Categories" 
          value={mockCategories.length} 
          icon={Tag}
          trend="up"
          trendValue="1 this week"
          color="accent"
        />
        <StatCard 
          title="Published" 
          value={mockEbooks.length} 
          icon={BookMarked}
          trend="up"
          trendValue="2 this week"
          color="primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent eBooks</h2>
          <div className="space-y-4">
            {mockEbooks.slice(0, 3).map((ebook) => (
              <div key={ebook.id} className="flex items-center border-b border-gray-100 pb-4">
                <div className="h-12 w-12 overflow-hidden rounded">
                  <img src={ebook.coverImage} alt={ebook.title} className="h-full w-full object-cover" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-800">{ebook.title}</h3>
                  <p className="text-xs text-gray-500">
                    Added {new Date(ebook.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <a href="/ebooks" className="text-sm text-primary-600 hover:text-primary-700">
              View all eBooks →
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Authors</h2>
          <div className="space-y-4">
            {mockAuthors.map((author) => (
              <div key={author.id} className="flex items-center border-b border-gray-100 pb-4">
                <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-bold text-sm">
                  {author.name.split(' ').map(name => name[0]).join('').toUpperCase().substring(0, 2)}
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-800">{author.name}</h3>
                  <p className="text-xs text-gray-500">
                    Added {new Date(author.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <a href="/authors" className="text-sm text-primary-600 hover:text-primary-700">
              View all authors →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;