'use client';

import { notFound } from 'next/navigation';
import NewsCard from '@/components/NewsCard';
import Link from 'next/link';
import { articleStore } from '@/lib/store';

const validCategories = ['politics', 'technology', 'sports', 'entertainment', 'business'];

// Temporary mock data - will be replaced with actual API calls
const getMockCategoryArticles = (category: string) => [
  {
    id: '1',
    title: `Latest ${category.charAt(0).toUpperCase() + category.slice(1)} News`,
    excerpt: `Important developments in the world of ${category}.`,
    category: category.charAt(0).toUpperCase() + category.slice(1),
    imageUrl: `https://picsum.photos/800/600?random=${category}1`,
    date: 'Feb 28, 2024',
    author: 'John Doe',
  },
  {
    id: '2',
    title: `Breaking ${category.charAt(0).toUpperCase() + category.slice(1)} Story`,
    excerpt: `Another significant update in ${category}.`,
    category: category.charAt(0).toUpperCase() + category.slice(1),
    imageUrl: `https://picsum.photos/800/600?random=${category}2`,
    date: 'Feb 28, 2024',
    author: 'Jane Smith',
  },
  // Add more mock articles as needed
];

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = params.category.toLowerCase();

  if (!validCategories.includes(category)) {
    notFound();
  }

  const articles = articleStore.getArticles().filter(
    article => article.status === 'published' && 
    article.category.toLowerCase() === category
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 capitalize mb-2">
          {category} News
        </h1>
        <p className="text-gray-600">
          Stay updated with the latest {category} news and developments
        </p>
      </header>

      {/* Category Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {['Latest', 'Most Read', 'Featured', 'Trending'].map((filter) => (
            <button
              key={filter}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link key={article.id} href={`/articles/${article.id}`}>
            <NewsCard {...article} />
          </Link>
        ))}
      </div>

      {/* Load More Button */}
      <div className="mt-8 text-center">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Load More Articles
        </button>
      </div>
    </div>
  );
} 