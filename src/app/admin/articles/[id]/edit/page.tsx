'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Article, ArticleFormData } from '@/types/article';
import { articleStore } from '@/lib/store';
import dynamic from 'next/dynamic';
import type { ArticleFormProps } from '@/components/ArticleForm';
import { toast } from 'react-hot-toast';

// Dynamically import ArticleForm with no SSR
const DynamicArticleForm = dynamic(() => import('@/components/ArticleForm'), {
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

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (formData: ArticleFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Ensure we're not overwriting existing image URL with empty string
      const updatedArticle = {
        ...formData,
        imageUrl: formData.imageUrl || article?.imageUrl || '',
        date: article?.date || new Date().toISOString()
      };

      console.log('Submitting article update with data:', {
        id: params.id,
        imageUrl: updatedArticle.imageUrl,
        hasExistingImage: !!article?.imageUrl,
        isNewImage: formData.imageUrl !== article?.imageUrl
      });

      await articleStore.updateArticle(params.id as string, updatedArticle);
      
      console.log('Article updated successfully with image:', updatedArticle.imageUrl);
      router.push('/admin/articles');
      toast.success('Article updated successfully');
    } catch (err) {
      console.error('Error updating article:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast.error('Failed to update article');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

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

  if (!article) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Article</h1>
      <DynamicArticleForm
        initialData={article}
        onSubmit={handleSubmit}
      />
    </div>
  );
} 