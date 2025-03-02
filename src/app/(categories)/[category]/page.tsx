'use client';

import { useParams } from 'next/navigation';
import { articleStore } from '@/lib/store';
import NewsCard from '@/components/NewsCard';
import { useEffect, useState } from 'react';
import { Article } from '@/types/article';

const validCategories = ['Politics', 'Technology', 'Sports', 'Entertainment', 'Business'];

export default function CategoryPage() {
  const params = useParams();
  const category = (params.category as string).toLowerCase();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadArticles() {
      try {
        setLoading(true);
        setError(null);
        const allArticles = await articleStore.getArticles();
        const filteredArticles = allArticles.filter(
          article => 
            article.status === 'published' &&
            article.category.toLowerCase() === category
        );
        setArticles(filteredArticles);
      } catch (err) {
        console.error('Error loading articles:', err);
        setError('Failed to load articles');
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, [category]);

  // Check if the category is valid
  if (!validCategories.map(c => c.toLowerCase()).includes(category)) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Invalid Category</h1>
        <p className="text-gray-600">
          The category "{category}" does not exist. Please check the URL and try again.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 capitalize">
        {category} Articles
      </h1>

      {articles.length === 0 ? (
        <p className="text-gray-600">No articles found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
} 