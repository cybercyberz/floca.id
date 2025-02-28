import { z } from 'zod';

export const articleSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  excerpt: z.string()
    .min(10, 'Excerpt must be at least 10 characters')
    .max(200, 'Excerpt must be less than 200 characters'),
  content: z.string()
    .min(50, 'Content must be at least 50 characters'),
  category: z.enum(['Politics', 'Technology', 'Sports', 'Entertainment', 'Business']),
  imageUrl: z.string()
    .url('Please provide a valid image URL'),
  author: z.string()
    .min(2, 'Author name must be at least 2 characters')
    .max(50, 'Author name must be less than 50 characters'),
  status: z.enum(['draft', 'published']),
  featured: z.boolean().default(false),
}); 