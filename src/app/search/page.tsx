'use client';

import { useSearchParams } from 'next/navigation';
import NewsCard from '@/components/NewsCard';

// Temporary mock search results - will be replaced with actual API calls
const mockSearchResults = [
  {
    id: '1',
    title: 'Search Result: Technology Innovation',
    excerpt: 'Latest developments in technology sector showing promising results.',
    category: 'Technology',
    imageUrl: 'https://picsum.photos/800/600?random=10',
    date: 'Feb 28, 2024',
    author: 'John Doe',
  },
  {
    id: '2',
    title: 'Search Result: Political Updates',
    excerpt: 'Recent political developments and their impact on global affairs.',
    category: 'Politics',
    imageUrl: 'https://picsum.photos/800/600?random=11',
    date: 'Feb 28, 2024',
    author: 'Jane Smith',
  },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Search Results for "{query}"
        </h1>
        <p className="text-gray-600">
          Found {mockSearchResults.length} results matching your search
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSearchResults.map((article) => (
          <NewsCard key={article.id} {...article} />
        ))}
      </div>

      {mockSearchResults.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No results found
          </h2>
          <p className="text-gray-600">
            Try adjusting your search terms or browse our categories
          </p>
        </div>
      )}
    </div>
  );
} 