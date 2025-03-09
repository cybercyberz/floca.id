# Floca.id Web Application

## Project Overview

Floca.id is a modern web application built with Next.js, Firebase, and various other technologies to provide a robust content management system with rich media capabilities. The application is deployed on both Vercel (for production) and Google Cloud VM (for staging/development).

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

## Technology Stack

### Frontend
- **Next.js**: React framework for server-rendered applications
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For responsive and utility-first styling

### Backend & Infrastructure
- **Firebase**: 
  - Authentication
  - Firestore Database
  - Cloud Storage
  - Admin SDK for server-side operations
- **Vercel**: Primary deployment platform
- **Google Cloud VM**: Secondary deployment for staging/testing
- **PM2**: Process manager for Node.js applications on the VM

### Media Management
- **Cloudinary**: Cloud-based image and video management
- **TinyMCE**: Rich text editor integration for content creation

## Environment Setup

The application uses several environment variables to configure various services:

### Firebase Configuration
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

### Cloudinary Configuration
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
```

### TinyMCE Configuration
```
NEXT_PUBLIC_TINYMCE_API_KEY
```

### Admin Configuration
```
FIREBASE_SERVICE_ACCOUNT_KEY
ADMIN_EMAILS
FIREBASE_ADMIN_EMAIL
FIREBASE_ADMIN_PASSWORD
```

## Deployment Infrastructure

### Vercel Deployment
- Production environment with automatic deployments from the main branch
- Environment variables managed through Vercel dashboard

### Google Cloud VM Deployment
- Manual deployment using SSH
- Environment variables managed through `.env.production` file
- Application managed with PM2 for process monitoring and automatic restarts

## Recent Updates

1. **Environment Synchronization**: Ensured that all API keys and environment variables are consistent between Vercel and Google Cloud VM deployments.
   
2. **Firebase Configuration**: Updated Firebase service account key and configuration for proper backend functionality.

3. **Media Integration**: Added Cloudinary for image upload and management, with TinyMCE integration for rich content editing.

## Application Features

### Authentication
- User authentication via Firebase
- Admin role management and permissions
- Secure API routes with server-side validation

### Content Management
- Rich text editing with TinyMCE
- Image upload and management with Cloudinary
- Article/content creation and publishing workflow

### Admin Features
- User management
- Content moderation
- Analytics and reporting

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/cybercyberz/floca.id.git
cd floca.id
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables by creating a `.env.local` file based on `.env.example`

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application

## Deployment Instructions

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy from the main branch

### Google Cloud VM Deployment
1. SSH into your VM:
```bash
gcloud compute ssh floca-web --zone=asia-southeast2-a (i use this for jakarta server)
```

2. Navigate to your project directory:
```bash
cd /home/YOUR_USER_NAME/floca.id
```

3. Pull the latest changes:
```bash
git pull
```

4. Install dependencies:
```bash
npm install
```

5. Build the application:
```bash
npm run build
```

6. Restart the application with PM2:
```bash
pm2 restart floca-app --update-env
```

## Maintenance

### Updating Environment Variables
1. Edit the `.env.production` file on the VM
2. Use `pm2 restart floca-app --update-env` to apply changes

### Monitoring
1. Check application status: `pm2 list`
2. View logs: `pm2 logs floca-app`
3. Monitor resources: `pm2 monit`

## License

This project is licensed under the [MIT License](LICENSE).
