'use client';

import { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';
import Script from 'next/script';

interface AdvancedImageUploadProps {
  onImagesSelect: (imageUrls: string[]) => void;
  currentImages?: string[];
  folder?: string;
  tags?: string[];
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  minImageWidth?: number;
  minImageHeight?: number;
  maxImageWidth?: number;
  maxImageHeight?: number;
  allowedFormats?: string[];
  clientAllowedFormats?: string[];
  showAdvancedOptions?: boolean;
  cropping?: boolean;
  croppingAspectRatio?: number;
  autoMinimize?: boolean;
  defaultSource?: string;
  buttonCaption?: string;
  buttonClass?: string;
  sources?: string[];
  theme?: 'default' | 'minimal' | 'purple';
}

// Define a type for the widget configuration
interface CloudinaryWidgetConfig {
  cloudName: string | undefined;
  uploadPreset: string | undefined;
  sources: string[];
  multiple: boolean;
  maxFiles: number;
  folder?: string;
  tags?: string[];
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  context?: any;
  showAdvancedOptions?: boolean;
  cropping?: boolean;
  defaultSource?: string;
  styles?: any;
  autoMinimize?: boolean;
  language?: string;
  text?: any;
  // Add the optional properties that were causing TypeScript errors
  maxFileSize?: number;
  minImageWidth?: number;
  minImageHeight?: number;
  maxImageWidth?: number;
  maxImageHeight?: number;
  allowedFormats?: string[];
  clientAllowedFormats?: string[];
  croppingAspectRatio?: number;
  croppingShowDimensions?: boolean;
  croppingValidateDimensions?: boolean;
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function AdvancedImageUpload({
  onImagesSelect,
  currentImages = [],
  folder,
  tags = [],
  resourceType = 'image',
  maxFiles = 10,
  maxFileSize,
  minImageWidth,
  minImageHeight,
  maxImageWidth,
  maxImageHeight,
  allowedFormats,
  clientAllowedFormats,
  showAdvancedOptions = true,
  cropping = false,
  croppingAspectRatio,
  autoMinimize = false,
  defaultSource = 'local',
  buttonCaption = 'Upload Images',
  buttonClass = '',
  sources = ['local', 'url', 'camera', 'dropbox', 'google_drive', 'facebook', 'instagram'],
  theme = 'default',
}: AdvancedImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>(currentImages || []);
  const [isWidgetReady, setIsWidgetReady] = useState(false);

  useEffect(() => {
    if (currentImages?.length) {
      setUploadedImages(currentImages);
    }
  }, [currentImages]);

  // Handle script load
  const handleScriptLoad = useCallback(() => {
    if (typeof window !== 'undefined' && window.cloudinary) {
      setIsWidgetReady(true);
    }
  }, []);

  // Remove an image from the uploaded list
  const handleRemoveImage = (indexToRemove: number) => {
    const updatedImages = uploadedImages.filter((_, index) => index !== indexToRemove);
    setUploadedImages(updatedImages);
    onImagesSelect(updatedImages);
  };

  const handleUpload = useCallback(() => {
    if (typeof window === 'undefined' || !window.cloudinary || !isWidgetReady) return;

    // Get custom palette based on theme
    const getPalette = () => {
      switch (theme) {
        case 'minimal':
          return {
            window: '#FFFFFF',
            windowBorder: '#DDDDDD',
            tabIcon: '#000000',
            menuIcons: '#555555',
            textDark: '#000000',
            textLight: '#FFFFFF',
            link: '#000000',
            action: '#000000',
            inactiveTabIcon: '#999999',
            error: '#FF0000',
            inProgress: '#000000',
            complete: '#000000',
            sourceBg: '#F8F8F8'
          };
        case 'purple':
          return {
            window: '#4A1A6E',
            windowBorder: '#6B24A6',
            tabIcon: '#FFFFFF',
            menuIcons: '#CCCCFF',
            textDark: '#FFFFFF',
            textLight: '#FFFFFF',
            link: '#FFFFFF',
            action: '#8E49CF',
            inactiveTabIcon: '#A37FCE',
            error: '#FF729D',
            inProgress: '#A37FCE',
            complete: '#90CF49',
            sourceBg: '#341356'
          };
        default:
          return {
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
          };
      }
    };

    // Prepare widget configuration
    const widgetConfig: CloudinaryWidgetConfig = {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      sources: sources,
      multiple: maxFiles > 1,
      maxFiles: maxFiles,
      folder: folder,
      tags: tags,
      resourceType: resourceType,
      context: {
        alt: 'User uploaded content',
        caption: 'Uploaded via website'
      },
      showAdvancedOptions: showAdvancedOptions,
      cropping: cropping,
      defaultSource: defaultSource,
      styles: {
        palette: getPalette(),
        frame: {
          background: theme === 'purple' ? '#4A1A6E' : '#ffffff'
        },
        fonts: {
          default: {
            active: true,
            font: {
              url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
              family: 'Inter'
            }
          }
        }
      },
      autoMinimize: autoMinimize,
      language: 'en',
      text: {
        en: {
          queue: {
            title: 'Files to upload',
            done_button: 'Done',
            close_button: 'Close',
            upload_error: 'Error during upload. Please try again.'
          }
        }
      }
    };

    // Add optional configuration parameters only if they are defined
    if (maxFileSize) widgetConfig.maxFileSize = maxFileSize;
    if (minImageWidth) widgetConfig.minImageWidth = minImageWidth;
    if (minImageHeight) widgetConfig.minImageHeight = minImageHeight;
    if (maxImageWidth) widgetConfig.maxImageWidth = maxImageWidth;
    if (maxImageHeight) widgetConfig.maxImageHeight = maxImageHeight;
    if (allowedFormats) widgetConfig.allowedFormats = allowedFormats;
    if (clientAllowedFormats) widgetConfig.clientAllowedFormats = clientAllowedFormats;
    if (cropping && croppingAspectRatio) {
      widgetConfig.croppingAspectRatio = croppingAspectRatio;
      widgetConfig.croppingShowDimensions = true;
      widgetConfig.croppingValidateDimensions = true;
    }

    const uploadWidget = window.cloudinary.createUploadWidget(
      widgetConfig,
      (error: any, result: any) => {
        if (error) {
          console.error('Upload error:', error);
          return;
        }
        
        if (result.event === 'success') {
          const secureUrl = result.info.secure_url;
          console.log('Upload successful:', secureUrl);
          
          // Add the new image to the existing uploaded images
          const updatedImages = [...uploadedImages, secureUrl];
          setUploadedImages(updatedImages);
          onImagesSelect(updatedImages);
          
          // If we've reached the maximum number of files, close the widget
          if (updatedImages.length >= maxFiles) {
            uploadWidget.close();
          }
        }

        // Close widget after user clicks "done" in queue view
        if (result.event === 'queues-end') {
          uploadWidget.close();
        }
      }
    );

    uploadWidget.open();
  }, [
    isWidgetReady,
    onImagesSelect,
    uploadedImages,
    folder,
    tags,
    resourceType,
    maxFiles,
    maxFileSize,
    minImageWidth,
    minImageHeight,
    maxImageWidth,
    maxImageHeight,
    allowedFormats,
    clientAllowedFormats,
    showAdvancedOptions,
    cropping,
    croppingAspectRatio,
    autoMinimize,
    defaultSource,
    sources,
    theme,
  ]);

  return (
    <div className="space-y-4">
      <Script 
        src="https://upload-widget.cloudinary.com/global/all.js" 
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
      
      {/* Upload Button */}
      <button
        type="button"
        onClick={handleUpload}
        disabled={!isWidgetReady}
        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${buttonClass}`}
      >
        {buttonCaption}
      </button>
      
      {/* Image Gallery */}
      {uploadedImages.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images ({uploadedImages.length}/{maxFiles})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {uploadedImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <div className="relative h-32 w-full rounded-md overflow-hidden border border-gray-200">
                  <Image
                    src={imageUrl}
                    alt={`Uploaded image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Upload Area (only show if no images or less than max) */}
      {uploadedImages.length < maxFiles && (
        <div
          onClick={handleUpload}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            hover:border-gray-400 border-gray-300 mt-4`}
        >
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
              Click to upload images ({uploadedImages.length}/{maxFiles})
            </p>
            <p className="text-xs text-gray-400">
              Drag and drop or click to select files
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 