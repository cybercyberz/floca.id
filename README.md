# floca.id - Modern News Platform

A modern, responsive news website built with Next.js, TypeScript, and Tailwind CSS. Features a full-featured admin dashboard for managing articles and content.

## Features

- 🚀 Built with Next.js 14 and TypeScript
- 💅 Styled with Tailwind CSS
- 📝 Rich text editing with TinyMCE
- 🖼️ Image upload and management with Cloudinary
- ✨ Modern, responsive design
- 🔍 Search functionality
- 📱 Mobile-friendly interface
- 🔐 Admin dashboard for content management
- ✅ Form validation with Zod

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/floca.id.git
cd floca.id
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
NEXT_PUBLIC_TINY_MCE_API_KEY=your_tinymce_api_key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/app` - Next.js app router pages and layouts
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and validations
- `/src/types` - TypeScript type definitions
- `/public` - Static assets

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
