'use client';

import { useState } from 'react';
import EnhancedArticleForm from '@/components/EnhancedArticleForm';
import { ArticleFormData } from '@/types/article';
import { toast } from 'react-hot-toast';

export default function EnhancedArticleFormPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<ArticleFormData | null>(null);

  const handleSubmit = async (data: ArticleFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store the submitted data for display
      setSubmittedData(data);
      
      toast.success('Article saved successfully!');
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error('Failed to save article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Enhanced Article Form</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Create New Article</h2>
          <EnhancedArticleForm 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
        
        {submittedData && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Submitted Data</h2>
            <div className="prose max-w-full">
              <h3>{submittedData.title}</h3>
              <p className="text-sm text-gray-500">
                By {submittedData.author} in {submittedData.category}
              </p>
              
              {submittedData.imageUrl && (
                <div className="my-4">
                  <p className="font-medium">Featured Image:</p>
                  <img 
                    src={submittedData.imageUrl} 
                    alt="Featured" 
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
              )}
              
              <div className="my-4">
                <p className="font-medium">Excerpt:</p>
                <p className="italic">{submittedData.excerpt}</p>
              </div>
              
              <div className="my-4">
                <p className="font-medium">Content:</p>
                <div dangerouslySetInnerHTML={{ __html: submittedData.content }} />
              </div>
              
              {submittedData.additionalImages && submittedData.additionalImages.length > 0 && (
                <div className="my-4">
                  <p className="font-medium">Gallery Images ({submittedData.additionalImages.length}):</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {submittedData.additionalImages.map((url, index) => (
                      <img 
                        key={index}
                        src={url} 
                        alt={`Gallery ${index + 1}`} 
                        className="w-full h-24 object-cover rounded-md"
                      />
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-4 flex flex-wrap gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  submittedData.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {submittedData.status}
                </span>
                
                {submittedData.featured && (
                  <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                    Featured
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 