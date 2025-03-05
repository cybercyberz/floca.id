'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Article, ArticleFormData } from '@/types/article';
import ArticleForm from '@/components/ArticleForm';
import { articleStore } from '@/lib/store';

export default function EditArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const fetchedArticle = await articleStore.getArticleById(params.id);
        if (fetchedArticle) {
          setArticle(fetchedArticle);
        } else {
          setError('Article not found');
        }
      } catch (err) {
        setError('Failed to fetch article');
        console.error('Error fetching article:', err);
      }
    };

    fetchArticle();
  }, [params.id]);

  const handleSubmit = async (formData: ArticleFormData) => {
    try {
      if (!article) return;
      
      const updatedArticle = {
        ...article,
        ...formData,
        date: new Date().toISOString()
      };

      await articleStore.updateArticle(params.id, updatedArticle);
      router.push('/admin');
    } catch (err) {
      setError('Failed to update article');
      console.error('Error updating article:', err);
    }
  };

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Article</h1>
      <ArticleForm
        initialData={article}
        onSubmit={handleSubmit}
      />
    </div>
  );
} 