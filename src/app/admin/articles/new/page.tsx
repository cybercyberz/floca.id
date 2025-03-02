'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Article, ArticleFormData } from '@/types/article';
import { articleStore } from '@/lib/store';
import dynamic from 'next/dynamic';
import type { ArticleFormProps } from '@/components/ArticleForm';

// Dynamically import ArticleForm with no SSR
const ArticleForm = dynamic(() => import('@/components/ArticleForm').then(mod => mod.default), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
        <div className="h-40 bg-gray-200 rounded"></div>
      </div>
    </div>
  ),
});

export default function NewArticlePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: ArticleFormData) => {
    try {
      setError(null);
      const newArticle: Omit<Article, 'id'> = {
        ...formData,
        date: new Date().toISOString()
      };

      await articleStore.createArticle(newArticle);
      router.push('/admin');
    } catch (err) {
      console.error('Error creating article:', err);
      setError(err instanceof Error ? err.message : 'Failed to create article');
    }
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold mb-6">Create New Article</h1>
      <ArticleForm onSubmit={handleSubmit} />
    </div>
  );
} 