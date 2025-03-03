import CloudinaryDemo from '@/components/CloudinaryDemo';

export const metadata = {
  title: 'Cloudinary Integration Demo',
  description: 'Showcase of advanced Cloudinary features including multi-image uploads and TinyMCE integration',
};

export default function CloudinaryDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <CloudinaryDemo />
    </div>
  );
} 