'use client';

import { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';
import Script from 'next/script';

interface CloudinaryUploadWidgetProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
  buttonText?: string;
  className?: string;
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function CloudinaryUploadWidget({
  onImageUpload,
  currentImage,
  buttonText = 'Upload Image',
  className = '',
}: CloudinaryUploadWidgetProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if the script is already loaded
    if (typeof window !== 'undefined' && window.cloudinary) {
      setScriptLoaded(true);
    }
  }, []);

  const handleScriptLoad = useCallback(() => {
    setScriptLoaded(true);
  }, []);

  const handleUpload = useCallback(() => {
    if (!scriptLoaded) return;

    const uploadWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'url', 'camera', 'dropbox', 'google_drive'],
        multiple: false,
        cropping: true,
        croppingAspectRatio: 16 / 9,
        showSkipCropButton: false,
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
          },
          fonts: {
            default: null,
            "'Poppins', sans-serif": {
              url: 'https://fonts.googleapis.com/css?family=Poppins',
              active: true,
            },
          },
        },
      },
      (error: any, result: any) => {
        if (error) {
          console.error('Error in Cloudinary upload:', error);
          return;
        }

        if (result.event === 'success') {
          onImageUpload(result.info.secure_url);
        }
      }
    );

    uploadWidget.open();
  }, [scriptLoaded, onImageUpload]);

  return (
    <div className="w-full">
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />

      <div className="space-y-4">
        {currentImage && (
          <div className="relative w-full h-64 rounded-lg overflow-hidden">
            <Image
              src={currentImage}
              alt="Uploaded image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleUpload}
          disabled={!scriptLoaded}
          className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
            !scriptLoaded ? 'opacity-50 cursor-not-allowed' : ''
          } ${className}`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
} 