'use client';

import { useState } from 'react';
import { Article, ArticleFormData } from '@/types/article';

interface ArticleFormProps {
  initialData?: Article;
  onSubmit: (data: ArticleFormData) => void;
}

const ArticleForm = ({ initialData, onSubmit }: ArticleFormProps) => {
  const [formData, setFormData] = useState<ArticleFormData>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    imageUrl: initialData?.imageUrl || '',
    category: initialData?.category || '',
    author: initialData?.author || '',
    status: initialData?.status || 'draft',
    featured: initialData?.featured || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">Excerpt</label>
        <textarea
          name="excerpt"
          id="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          required
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          name="content"
          id="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="url"
          name="imageUrl"
          id="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <select
          name="category"
          id="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a category</option>
          <option value="Technology">Technology</option>
          <option value="Science">Science</option>
          <option value="Sports">Sports</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Business">Business</option>
        </select>
      </div>

      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
        <input
          type="text"
          name="author"
          id="author"
          value={formData.author}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
        <select
          name="status"
          id="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="featured"
          id="featured"
          checked={formData.featured}
          onChange={handleChange}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
          Featured Article
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {initialData ? 'Update Article' : 'Create Article'}
        </button>
      </div>
    </form>
  );
};

export default ArticleForm; 