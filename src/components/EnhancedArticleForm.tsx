'use client';

import { useState } from 'react';
import { Article, ArticleFormData } from '@/types/article';
import AdvancedImageUpload from './AdvancedImageUpload';
import TinyMCECloudinaryEditor from './TinyMCECloudinaryEditor';

interface EnhancedArticleFormProps {
  initialData?: Article;
  onSubmit: (data: ArticleFormData) => void;
  isSubmitting?: boolean;
}

const EnhancedArticleForm: React.FC<EnhancedArticleFormProps> = ({ initialData, onSubmit, isSubmitting }) => {
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

  // Store multiple images (main featured image will be the first one)
  const [additionalImages, setAdditionalImages] = useState<string[]>(
    initialData?.additionalImages || []
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleEditorChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleMainImageSelect = (imageUrls: string[]) => {
    if (imageUrls.length > 0) {
      // Use the first image as the main image
      setFormData(prev => ({ ...prev, imageUrl: imageUrls[0] }));
      
      // Store any additional images
      if (imageUrls.length > 1) {
        setAdditionalImages(imageUrls.slice(1));
      }
    } else {
      setFormData(prev => ({ ...prev, imageUrl: '' }));
      setAdditionalImages([]);
    }
  };

  const handleGalleryImageSelect = (imageUrls: string[]) => {
    setAdditionalImages(imageUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Include additional images in the form data for submission
    const enhancedFormData = {
      ...formData,
      additionalImages
    };
    
    onSubmit(enhancedFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder="Article title"
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
          Excerpt
        </label>
        <textarea
          name="excerpt"
          id="excerpt"
          rows={3}
          value={formData.excerpt}
          onChange={handleChange}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder="Brief summary of the article"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          >
            <option value="">Select a category</option>
            <option value="news">News</option>
            <option value="technology">Technology</option>
            <option value="business">Business</option>
            <option value="health">Health</option>
            <option value="science">Science</option>
            <option value="sports">Sports</option>
            <option value="arts">Arts & Culture</option>
          </select>
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
            Author
          </label>
          <input
            type="text"
            name="author"
            id="author"
            value={formData.author}
            onChange={handleChange}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Article author"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="flex items-center h-full pt-8">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            checked={formData.featured}
            onChange={handleChange as any}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
            Featured article
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="mainImage" className="block text-sm font-medium text-gray-700 mb-2">
          Main Image
        </label>
        <AdvancedImageUpload
          onImagesSelect={handleMainImageSelect}
          currentImages={formData.imageUrl ? [formData.imageUrl] : []}
          maxFiles={1}
          folder="article-featured-images"
          tags={['featured', 'article']}
          showAdvancedOptions={true}
          cropping={true}
          croppingAspectRatio={1.91}
          sources={['local', 'url', 'camera']}
          buttonCaption="Upload Featured Image"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Content
        </label>
        <TinyMCECloudinaryEditor
          initialValue={formData.content}
          onChange={handleEditorChange}
          height={500}
          placeholder="Write your article content here..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image Gallery (Optional)
        </label>
        <AdvancedImageUpload
          onImagesSelect={handleGalleryImageSelect}
          currentImages={additionalImages}
          maxFiles={10}
          folder="article-gallery-images"
          tags={['gallery', 'article']}
          showAdvancedOptions={true}
          sources={['local', 'url', 'camera', 'dropbox', 'google_drive']}
          buttonCaption="Upload Gallery Images"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-md text-white ${
            isSubmitting 
              ? 'bg-indigo-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
        >
          {isSubmitting ? 'Saving...' : 'Save Article'}
        </button>
      </div>
    </form>
  );
};

export default EnhancedArticleForm; 