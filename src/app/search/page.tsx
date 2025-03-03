'use client';

import { useState } from 'react';
import { Article } from '@/types/article';
import NewsCard from '@/components/NewsCard';
import Link from 'next/link';

// Mock search results for now - will be replaced with actual search functionality
const mockSearchResults: Article[] = [
  {
    id: '1',
    title: 'The Future of AI in Healthcare',
    excerpt: 'Exploring how artificial intelligence is revolutionizing medical diagnosis and treatment.',
    content: 'Full article content here...',
    category: 'Technology',
    imageUrl: '/images/ai-healthcare.jpg',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-15'),
    author: 'Dr. Sarah Chen',
    status: 'published',
    featured: false
  },
  {
    id: '2',
    title: 'Global Climate Summit 2024',
    excerpt: 'World leaders gather to discuss urgent climate action and sustainable solutions.',
    content: 'Full article content here...',
    category: 'Politics',
    imageUrl: '/images/climate-summit.jpg',
    createdAt: new Date('2024-03-14'),
    updatedAt: new Date('2024-03-14'),
    author: 'James Wilson',
    status: 'published',
    featured: false
  },
  {
    id: '3',
    title: 'The Rise of Remote Work Culture',
    excerpt: 'How companies are adapting to the permanent shift towards flexible work arrangements.',
    content: 'Full article content here...',
    category: 'Business',
    imageUrl: '/images/remote-work.jpg',
    createdAt: new Date('2024-03-13'),
    updatedAt: new Date('2024-03-13'),
    author: 'Emma Rodriguez',
    status: 'published',
    featured: false
  }
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Search Articles</h1>

      <form onSubmit={handleSearch} className="mb-12">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for articles..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Search
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSearchResults.map((article) => (
          <Link key={article.id} href={`/articles/${article.id}`}>
            <NewsCard article={article} />
          </Link>
        ))}
      </div>
    </div>
  );
} 