'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ArticleForm from '@/components/ArticleForm';
import { articleStore } from '@/lib/store';
import { ArticleFormData } from '@/types/article';

export default function NewArticlePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ArticleFormData) => {
    try {
      setIsSubmitting(true);
      await articleStore.createArticle(data);
      router.push('/admin');
      router.refresh();
    } catch (error) {
      console.error('Error creating article:', error);
      alert('Failed to create article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Article</h1>
      <ArticleForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
} 