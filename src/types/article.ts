export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  author: string;
  status: 'draft' | 'published';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  additionalImages?: string[]; // Array of additional image URLs for galleries
}

// ArticleFormData is what we get from the form, without id and date
export interface ArticleFormData {
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  author: string;
  status: 'draft' | 'published';
  featured: boolean;
  additionalImages?: string[]; // Array of additional image URLs for galleries
}

// For creating a new article, we need everything except the id
export type NewArticle = Omit<Article, 'id'>; 