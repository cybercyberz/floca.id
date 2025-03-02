'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Article } from '@/types/article';
import { articleStore } from '@/lib/store';

export default function ArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadArticle() {
      try {
        setLoading(true);
        setError(null);
        const foundArticle = await articleStore.getArticle(params.id as string);
        if (!foundArticle) {
          throw new Error('Article not found');
        }
        setArticle(foundArticle);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {article.imageUrl && (
        <div className="mb-8">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-64 object-cover rounded-lg shadow-lg"
          />
        </div>
      )}
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
      <div className="flex items-center text-gray-600 mb-8">
        <span>{new Date(article.date).toLocaleDateString()}</span>
        <span className="mx-2">•</span>
        <span>{article.author}</span>
        <span className="mx-2">•</span>
        <span>{article.category}</span>
      </div>
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
} 