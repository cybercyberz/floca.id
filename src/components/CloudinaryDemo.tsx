'use client';

import { useState } from 'react';
import AdvancedImageUpload from './AdvancedImageUpload';
import TinyMCECloudinaryEditor from './TinyMCECloudinaryEditor';

export default function CloudinaryDemo() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [editorContent, setEditorContent] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upload' | 'editor'>('upload');

  const handleImagesSelect = (imageUrls: string[]) => {
    setUploadedImages(imageUrls);
  };

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Cloudinary Integration Demo</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-3 px-6 ${activeTab === 'upload' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('upload')}
        >
          Advanced Image Upload
        </button>
        <button
          className={`py-3 px-6 ${activeTab === 'editor' ? 'border-b-2 border-blue-500 text-blue-600 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('editor')}
        >
          TinyMCE with Cloudinary
        </button>
      </div>

      {/* Content */}
      <div className="bg-white p-6 rounded-lg shadow">
        {activeTab === 'upload' && (
          <>
            <h2 className="text-xl font-semibold mb-4">Multi-Image Upload Widget</h2>
            <p className="mb-6 text-gray-600">
              This component demonstrates advanced Cloudinary upload capabilities including multiple file uploads, 
              various sources, customization options, and more.
            </p>
            
            <AdvancedImageUpload
              onImagesSelect={handleImagesSelect}
              currentImages={uploadedImages}
              maxFiles={5}
              folder="demo-uploads"
              tags={['demo', 'test']}
              showAdvancedOptions={true}
              sources={['local', 'url', 'camera', 'dropbox', 'google_drive']}
              theme="default"
              buttonCaption="Upload Images (Advanced)"
            />
            
            {uploadedImages.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-3">Uploaded Image URLs:</h3>
                <div className="bg-gray-50 p-3 rounded overflow-auto max-h-48">
                  <pre className="text-xs">{JSON.stringify(uploadedImages, null, 2)}</pre>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'editor' && (
          <>
            <h2 className="text-xl font-semibold mb-4">TinyMCE Editor with Cloudinary Integration</h2>
            <p className="mb-6 text-gray-600">
              This component demonstrates a TinyMCE editor with Cloudinary integration. Click the cloudinary icon
              in the toolbar to upload images using the Cloudinary widget.
            </p>
            
            <TinyMCECloudinaryEditor
              initialValue={editorContent}
              onChange={handleEditorChange}
              height={400}
              placeholder="Start typing here, or click the Cloudinary icon in the toolbar to insert images..."
            />
            
            {editorContent && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-3">Editor Preview:</h3>
                <div className="border border-gray-200 rounded-lg p-4 prose max-w-full">
                  <div dangerouslySetInnerHTML={{ __html: editorContent }} />
                </div>
                
                <h3 className="text-lg font-medium mt-6 mb-3">HTML Content:</h3>
                <div className="bg-gray-50 p-3 rounded overflow-auto max-h-48">
                  <pre className="text-xs">{editorContent}</pre>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Powered by Cloudinary and TinyMCE. Built with Next.js.</p>
        <p className="mt-1">Images are stored in your Cloudinary account.</p>
      </div>
    </div>
  );
} 