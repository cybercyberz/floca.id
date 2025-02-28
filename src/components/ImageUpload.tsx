'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import Script from 'next/script';

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void;
  currentImage?: string;
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function ImageUpload({ onImageSelect, currentImage }: ImageUploadProps) {
  const handleUpload = useCallback(() => {
    if (typeof window === 'undefined' || !window.cloudinary) return;

    const uploadWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: 'cloudinarycursor',
        sources: ['local', 'url', 'camera'],
        multiple: false,
        maxFiles: 1,
        showAdvancedOptions: false,
        cropping: true,
        croppingAspectRatio: 1.5,
        croppingShowDimensions: true,
        croppingValidateDimensions: true,
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
          console.error('Upload error:', error);
          return;
        }
        
        if (result.event === 'success') {
          const secureUrl = result.info.secure_url;
          console.log('Upload successful:', secureUrl);
          onImageSelect(secureUrl);
          uploadWidget.close();
        }
      }
    );

    uploadWidget.open();
  }, [onImageSelect]);

  return (
    <div className="space-y-4">
      <Script 
        src="https://upload-widget.cloudinary.com/global/all.js" 
        strategy="afterInteractive"
      />
      
      <div
        onClick={handleUpload}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          hover:border-gray-400 border-gray-300`}
      >
        {currentImage ? (
          <div className="space-y-2">
            <div className="relative h-32 w-full">
              <Image
                src={currentImage}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-sm text-gray-500">
              Click to change image
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-sm text-gray-500">
              Click to upload an image
            </p>
          </div>
        )}
      </div>
      {currentImage && (
        <p className="text-xs text-gray-500">
          Click above to change the current image
        </p>
      )}
    </div>
  );
} 