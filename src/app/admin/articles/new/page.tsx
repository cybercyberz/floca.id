'use client';

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArticleFormData } from '@/types/article';
import { articleStore } from '@/lib/store';
import { useState } from 'react';

// Dynamically import ArticleForm with no SSR
const ArticleForm = dynamic(() => import('@/components/ArticleForm'), {
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

const testArticle: ArticleFormData = {
  title: "Test Article Title",
  excerpt: "This is a test article excerpt that meets the minimum length requirement.",
  content: "This is the main content of the test article. It needs to be at least 50 characters long to pass validation. This text should be sufficient.",
  category: "Technology",
  imageUrl: "https://picsum.photos/800/600?random=3",
  author: "Test Author",
  status: "draft",
  featured: false
};

export default function NewArticlePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ArticleFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const newArticle = {
        ...data,
        id: Date.now().toString(), // This will be replaced by Firestore's auto-generated ID
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      };

      await articleStore.addArticle(newArticle);
      router.push('/admin');
      router.refresh();
    } catch (err) {
      console.error('Error creating article:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while creating the article');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Test function to create an article with valid data
  const handleTestArticle = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await handleSubmit(testArticle);
    } catch (err) {
      console.error('Error creating test article:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while creating the test article');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Article</h1>
        <button
          onClick={handleTestArticle}
          disabled={isSubmitting}
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Test Article'}
        </button>
      </div>

      {error && (
        <div className="mb-8 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <ArticleForm
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
} 