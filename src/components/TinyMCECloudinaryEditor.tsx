'use client';

import { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Script from 'next/script';

interface TinyMCECloudinaryEditorProps {
  initialValue?: string;
  onChange: (content: string) => void;
  height?: number;
  apiKey?: string;
  editorId?: string;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
}

// Define types for TinyMCE callbacks
interface FilepickerCallback {
  (value: string, meta?: { alt: string }): void;
}

interface ImageUploadHandler {
  (blobInfo: { blob: () => Blob }, success: (url: string) => void, failure: (msg: string) => void, progress?: (percent: number) => void): void;
}

interface FilePickerMeta {
  filetype: string;
  title?: string;
}

interface ContentAreaContainer extends HTMLElement {
  setAttribute(name: string, value: string): void;
  classList: DOMTokenList;
}

export default function TinyMCECloudinaryEditor({
  initialValue = '',
  onChange,
  height = 500,
  apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY,
  editorId = 'tiny-mce-editor',
  placeholder = 'Start typing...',
  minHeight = 400,
  maxHeight = 800,
}: TinyMCECloudinaryEditorProps) {
  const [editorInitialized, setEditorInitialized] = useState(false);
  const [cloudinaryReady, setCloudinaryReady] = useState(false);
  const editorRef = useRef<any>(null);

  // Function to handle Cloudinary plugin initialization
  const setupCloudinaryPlugin = () => {
    if (typeof window === 'undefined' || !window.tinymce) return;

    window.tinymce.PluginManager.add('cloudinary', function(editor: any) {
      // Add a button that opens a window
      editor.ui.registry.addButton('cloudinary', {
        icon: 'image',
        tooltip: 'Insert/edit image via Cloudinary',
        onAction: function() {
          openCloudinaryWidget(editor);
        }
      });

      // Add a menu item to the tools menu
      editor.ui.registry.addMenuItem('cloudinary', {
        text: 'Insert/edit image via Cloudinary',
        icon: 'image',
        onAction: function() {
          openCloudinaryWidget(editor);
        }
      });

      // Return metadata for the plugin
      return {
        getMetadata: function() {
          return {
            name: 'Cloudinary Plugin',
            url: 'https://cloudinary.com'
          };
        }
      };
    });
  };

  // Function to open Cloudinary widget
  const openCloudinaryWidget = (editor: any) => {
    if (typeof window === 'undefined' || !window.cloudinary) return;

    const uploadWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'url', 'camera', 'dropbox', 'google_drive', 'facebook', 'instagram'],
        multiple: true,
        cropping: false,
        defaultSource: 'local',
        styles: {
          palette: {
            window: '#FFFFFF',
            windowBorder: '#90A0B3',
            tabIcon: '#0078FF',
            menuIcons: '#5A616A',
            textDark: '#000000',
            textLight: '#FFFFFF',
            link: '#0078FF',
            action: '#FF620C',
            inactiveTabIcon: '#0E2F5A',
            error: '#F44235',
            inProgress: '#0078FF',
            complete: '#20B832',
            sourceBg: '#E4EBF1'
          }
        }
      },
      (error: any, result: any) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return;
        }
        
        if (result.event === 'success') {
          const imageUrl = result.info.secure_url;
          const imageAlt = result.info.original_filename || 'Image';
          
          // Insert the image into the editor
          editor.insertContent(
            `<img src="${imageUrl}" alt="${imageAlt}" style="max-width: 100%; height: auto;" />`
          );
        }
      }
    );

    uploadWidget.open();
  };

  // Handle Cloudinary script loading
  const handleCloudinaryScriptLoad = () => {
    if (typeof window !== 'undefined' && window.cloudinary) {
      setCloudinaryReady(true);
    }
  };

  // Initialize editor plugins once cloudinary is ready
  useEffect(() => {
    if (cloudinaryReady) {
      setupCloudinaryPlugin();
      setEditorInitialized(true);
    }
  }, [cloudinaryReady]);

  // Save editor reference
  const handleEditorInit = (evt: any, editor: any) => {
    editorRef.current = editor;
  };

  return (
    <div className="relative">
      <Script 
        src="https://upload-widget.cloudinary.com/global/all.js" 
        strategy="afterInteractive"
        onLoad={handleCloudinaryScriptLoad}
      />
      
      {editorInitialized && (
        <Editor
          id={editorId}
          apiKey={apiKey}
          onInit={handleEditorInit}
          value={initialValue}
          init={{
            height: height,
            min_height: minHeight,
            max_height: maxHeight,
            menubar: true,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
              'cloudinary' // Custom Cloudinary plugin
            ],
            setup: function(editor: any) {
              editor.on('init', function() {
                // Add custom CSS for placeholder when content is empty
                if (editor.getContent() === '') {
                  const contentAreaContainer = editor.getContentAreaContainer() as ContentAreaContainer;
                  if (contentAreaContainer) {
                    contentAreaContainer.setAttribute('data-placeholder', placeholder);
                    contentAreaContainer.classList.add('mce-placeholder');
                  }
                }
              });
              editor.on('blur', function() {
                if (editor.getContent() === '') {
                  const contentAreaContainer = editor.getContentAreaContainer() as ContentAreaContainer;
                  if (contentAreaContainer) {
                    contentAreaContainer.classList.add('mce-placeholder');
                  }
                }
              });
              editor.on('focus', function() {
                const contentAreaContainer = editor.getContentAreaContainer() as ContentAreaContainer;
                if (contentAreaContainer) {
                  contentAreaContainer.classList.remove('mce-placeholder');
                }
              });
            },
            toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | link image cloudinary | media table | code help',
            content_style: `
              body { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif; font-size: 16px; line-height: 1.6; }
              img { max-width: 100%; height: auto; }
              .mce-placeholder:before {
                content: attr(data-placeholder);
                position: absolute;
                opacity: 0.6;
                color: #888;
                font-style: italic;
                padding: 0 10px;
              }
            `,
            file_picker_callback: function(callback: FilepickerCallback, value: string, meta: FilePickerMeta) {
              // Trigger cloudinary widget when the user wants to add an image
              if (meta.filetype === 'image') {
                openCloudinaryWidget(editorRef.current);
              }
            },
            images_upload_handler: function(
              blobInfo: { blob: () => Blob }, 
              success: (url: string) => void, 
              failure: (msg: string) => void, 
              progress?: (percent: number) => void
            ) {
              // This is a fallback for when the image is uploaded via the default TinyMCE upload handler
              // We'll convert it to base64 and then upload to Cloudinary
              const reader = new FileReader();
              reader.onload = function() {
                const base64 = reader.result as string;
                
                // Upload to Cloudinary
                fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    file: base64,
                    upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
                  }),
                })
                .then(response => response.json())
                .then(data => {
                  success(data.secure_url);
                })
                .catch(err => {
                  failure('Image upload failed: ' + (err.message || 'Unknown error'));
                });
              };
              reader.readAsDataURL(blobInfo.blob());
            }
          }}
          onEditorChange={onChange}
        />
      )}
      
      {!editorInitialized && (
        <div className="h-64 flex items-center justify-center border border-gray-300 rounded-md bg-gray-50">
          <div className="text-center text-gray-500">
            <svg className="mx-auto h-12 w-12 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2">Loading editor...</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Type definition for the global TinyMCE object
declare global {
  interface Window {
    tinymce: any;
    cloudinary: any;
  }
} 