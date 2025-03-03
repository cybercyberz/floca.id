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
}

// For creating a new article, we need everything except the id
export type NewArticle = Omit<Article, 'id'>; 