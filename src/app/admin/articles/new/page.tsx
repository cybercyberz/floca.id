'use client';

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArticleFormData } from '@/types/article';

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

  const handleSubmit = async (data: ArticleFormData) => {
    try {
      console.log('Creating article:', data);
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log('Server response:', result);

      if (!response.ok) {
        console.error('Server response:', result);
        if (result.error === 'Validation failed') {
          throw new Error(
            'Validation failed: ' + 
            result.details.map((err: any) => `${err.path}: ${err.message}`).join(', ')
          );
        }
        throw new Error(result.error || 'Failed to create article');
      }

      router.push('/admin');
      router.refresh();
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  };

  // Test function to create an article with valid data
  const handleTestArticle = () => {
    handleSubmit(testArticle);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Article</h1>
        <button
          onClick={handleTestArticle}
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Create Test Article
        </button>
      </div>
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <ArticleForm
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
          />
        </div>
      </div>
    </div>
  );
} 