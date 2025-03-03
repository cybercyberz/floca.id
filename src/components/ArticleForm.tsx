'use client';

import { useState } from 'react';
import { Article, ArticleFormData } from '@/types/article';
import { Editor } from '@tinymce/tinymce-react';
import { CldUploadWidget } from 'next-cloudinary';

interface ArticleFormProps {
  initialData?: Article;
  onSubmit: (data: ArticleFormData) => void;
}

interface CloudinaryInfo {
  secure_url: string;
}

interface CloudinaryResult {
  event: string;
  info: CloudinaryInfo;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ initialData, onSubmit }) => {
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
    
    console.log('Form submission started with data:', JSON.stringify(formData, null, 2));
    
    // Validate form data before submission
    const submissionData = {
      ...formData,
      // Use both field names to ensure compatibility
      imgUrl: formData.imageUrl ? formData.imageUrl.trim() : (initialData?.imageUrl || ''),
      imageUrl: formData.imageUrl ? formData.imageUrl.trim() : (initialData?.imageUrl || '')
    };

    console.log('Preparing submission with data:', JSON.stringify(submissionData, null, 2));
    console.log('Image URL status:', {
      hasNewImage: !!formData.imageUrl,
      hasInitialImage: !!initialData?.imageUrl,
      finalImageUrl: submissionData.imageUrl,
      finalImgUrl: submissionData.imgUrl
    });

    if (!submissionData.imgUrl && initialData?.imageUrl) {
      console.log('Using initial image URL:', initialData.imageUrl);
      submissionData.imgUrl = initialData.imageUrl;
      submissionData.imageUrl = initialData.imageUrl;
    }

    console.log('Final submission data:', JSON.stringify(submissionData, null, 2));
    onSubmit(submissionData);
  };

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

  const handleImageUpload = (result: CloudinaryResult) => {
    console.log('Cloudinary upload callback received:', result);
    if (result.event === 'success') {
      const imageUrl = result.info.secure_url;
      console.log('Setting image URL in form data:', imageUrl);
      
      // Ensure the URL is using res.cloudinary.com
      const updatedUrl = imageUrl.replace(/\/\/[^/]+\//, '//res.cloudinary.com/');
      console.log('Updated image URL:', updatedUrl);
      
      setFormData(prev => {
        const updated = {
          ...prev,
          imageUrl: updatedUrl
        };
        console.log('Updated form data:', updated);
        return updated;
      });
    } else {
      console.error('Upload event was not successful:', result);
    }
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
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
          value={formData.content}
          init={{
            height: 500,
            menubar: true,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
              'quickbars'
            ],
            toolbar: [
              'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify',
              'bullist numlist outdent indent | removeformat | image media link | help'
            ].join(' | '),
            content_style: `
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                font-size: 16px;
                line-height: 1.6;
                color: #374151;
              }
              p { margin: 0 0 1em 0; }
              h1, h2, h3, h4, h5, h6 { 
                font-weight: 600;
                line-height: 1.25;
                margin: 1.5em 0 0.5em 0;
              }
              h1 { font-size: 2em; }
              h2 { font-size: 1.5em; }
              h3 { font-size: 1.25em; }
              img {
                max-width: 100%;
                height: auto;
                border-radius: 0.5rem;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              }
              ul, ol {
                margin: 0 0 1em 0;
                padding-left: 2em;
              }
              li { margin: 0.5em 0; }
              a { color: #2563eb; }
              blockquote {
                margin: 1em 0;
                padding-left: 1em;
                border-left: 4px solid #e5e7eb;
                font-style: italic;
              }
            `,
            formats: {
              h1: { block: 'h1' },
              h2: { block: 'h2' },
              h3: { block: 'h3' },
              h4: { block: 'h4' },
              h5: { block: 'h5' },
              h6: { block: 'h6' }
            },
            quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
            quickbars_insert_toolbar: 'image media table',
            automatic_uploads: true,
            images_upload_handler: async (blobInfo: { blob: Blob }) => {
              // Here you can implement image upload to your server/Cloudinary
              // For now, we'll use base64
              return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.readAsDataURL(blobInfo.blob);
              });
            },
            paste_data_images: true,
            image_advtab: true,
            image_dimensions: false,
            image_class_list: [
              { title: 'Responsive', value: 'w-full h-auto rounded-lg shadow-lg' }
            ],
            style_formats: [
              { title: 'Paragraph', format: 'p' },
              { title: 'Heading 1', format: 'h1' },
              { title: 'Heading 2', format: 'h2' },
              { title: 'Heading 3', format: 'h3' },
              { title: 'Heading 4', format: 'h4' },
              { title: 'Quote', format: 'blockquote' }
            ]
          }}
          onEditorChange={handleEditorChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          onUpload={(result: any, widget: any) => {
            console.log('Raw upload result:', JSON.stringify(result, null, 2));
            
            if (!result) {
              console.error('No result from Cloudinary upload');
              return;
            }

            if (result.event !== 'success') {
              console.error('Upload event was not successful:', result.event);
              return;
            }

            if (!result.info?.secure_url) {
              console.error('No secure URL in upload result:', result);
              return;
            }

            const imageUrl = result.info.secure_url;
            console.log('Received image URL from Cloudinary:', imageUrl);
              
            // Ensure the URL is properly formatted and trimmed
            const cleanImageUrl = imageUrl.trim();
            console.log('Cleaned image URL:', cleanImageUrl);
              
            setFormData(prev => {
              const updated = {
                ...prev,
                imageUrl: cleanImageUrl
              };
              console.log('Updated form data with new image:', JSON.stringify(updated, null, 2));
              return updated;
            });

            // Close the widget after successful upload
            if (widget) {
              console.log('Closing Cloudinary widget');
              widget.close();
            }
          }}
          options={{
            maxFiles: 1,
            resourceType: "image",
            clientAllowedFormats: ["jpeg", "png", "jpg", "webp"],
            maxFileSize: 10000000, // 10MB
            sources: ["local", "url"],
            multiple: false,
            styles: {
              palette: {
                window: "#FFFFFF",
                windowBorder: "#90A0B3",
                tabIcon: "#0078FF",
                menuIcons: "#5A616A",
                textDark: "#000000",
                textLight: "#FFFFFF",
                link: "#0078FF",
                action: "#FF620C",
                inactiveTabIcon: "#0E2F5A",
                error: "#F44235",
                inProgress: "#0078FF",
                complete: "#20B832",
                sourceBg: "#E4EBF1"
              }
            }
          }}
        >
          {({ open }) => (
            <div className="space-y-4">
              {formData.imageUrl && (
                <div className="mt-2">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full max-w-md h-auto rounded-lg shadow-lg"
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  console.log('Opening Cloudinary upload widget');
                  open();
                }}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {formData.imageUrl ? 'Change Image' : 'Upload Image'}
              </button>
            </div>
          )}
        </CldUploadWidget>
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

export type { ArticleFormProps };
export default ArticleForm; 