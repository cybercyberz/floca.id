'use client';

import { useEffect, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Script from 'next/script';

interface TinyMCECloudinaryPluginProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
}

declare global {
  interface Window {
    cloudinary: any;
    tinymce: any;
  }
}

export default function TinyMCECloudinaryPlugin({ 
  value, 
  onChange,
  height = 500 
}: TinyMCECloudinaryPluginProps) {
  const editorRef = useRef<any>(null);
  const cloudinaryScriptLoaded = useRef<boolean>(false);

  // Setup Cloudinary plugin for TinyMCE
  useEffect(() => {
    if (typeof window === 'undefined' || !window.tinymce || !window.cloudinary || cloudinaryScriptLoaded.current) {
      return;
    }

    // Mark as loaded so we don't register it twice
    cloudinaryScriptLoaded.current = true;

    // Register the Cloudinary plugin
    window.tinymce.PluginManager.add('cloudinary', function(editor: any) {
      // Add button to toolbar
      editor.ui.registry.addButton('cloudinary', {
        icon: 'image',
        tooltip: 'Insert image from Cloudinary',
        onAction: function() {
          openCloudinaryWidget(editor);
        }
      });

      // Add menu item to Insert menu
      editor.ui.registry.addMenuItem('cloudinary', {
        text: 'Image from Cloudinary...',
        icon: 'image',
        onAction: function() {
          openCloudinaryWidget(editor);
        }
      });

      function openCloudinaryWidget(editor: any) {
        const uploadWidget = window.cloudinary.createUploadWidget(
          {
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
            sources: ['local', 'url', 'camera', 'dropbox', 'google_drive'],
            multiple: false,
            styles: {
              palette: {
                window: '#F5F5F5',
                sourceBg: '#FFFFFF',
                windowBorder: '#90A0B3',
                tabIcon: '#0078FF',
                inactiveTabIcon: '#0E2F5A',
                menuIcons: '#5A616A',
                link: '#0078FF',
                action: '#0078FF',
                inProgress: '#0078FF',
                complete: '#20B832',
                error: '#EA2727',
                textDark: '#000000',
                textLight: '#FFFFFF',
              }
            }
          },
          (error: any, result: any) => {
            if (error) {
              console.error('Error in Cloudinary upload:', error);
              return;
            }

            if (result.event === 'success') {
              const imageUrl = result.info.secure_url;
              const alt = result.info.original_filename || 'Image';
              
              // Insert image at cursor position
              editor.insertContent(`<img src="${imageUrl}" alt="${alt}" />`);
              uploadWidget.close();
            }
          }
        );

        uploadWidget.open();
      }
    });
  }, []);

  const handleEditorInit = (evt: any, editor: any) => {
    editorRef.current = editor;
  };

  return (
    <>
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        strategy="afterInteractive"
      />
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        onInit={handleEditorInit}
        value={value}
        init={{
          height: height,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
            'cloudinary' // Our custom Cloudinary plugin
          ],
          toolbar: 'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | link image cloudinary | help',
          content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif; font-size: 16px; line-height: 1.6; }',
          images_upload_handler: async function(blobInfo: any, progress: any) {
            return new Promise((resolve, reject) => {
              const uploadWidget = window.cloudinary.createUploadWidget(
                {
                  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
                  sources: ['local'],
                  multiple: false,
                },
                (error: any, result: any) => {
                  if (error) {
                    reject('Image upload failed');
                    return;
                  }
          
                  if (result.event === 'success') {
                    resolve(result.info.secure_url);
                    uploadWidget.close();
                  }
                }
              );
          
              // Convert blob to file
              const file = new File([blobInfo.blob()], blobInfo.filename(), {
                type: blobInfo.blob().type
              });
          
              // Create a FormData and upload directly
              const formData = new FormData();
              formData.append('file', file);
              formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');
          
              fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
                method: 'POST',
                body: formData
              })
                .then(response => response.json())
                .then(data => {
                  resolve(data.secure_url);
                })
                .catch(err => {
                  reject('Image upload failed: ' + err.message);
                });
            });
          }
        }}
        onEditorChange={onChange}
      />
    </>
  );
} 