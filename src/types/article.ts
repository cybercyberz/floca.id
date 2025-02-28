export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  date: string;
  author: string;
  status: 'draft' | 'published';
  featured: boolean;
}

export interface ArticleFormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  author: string;
  status: 'draft' | 'published';
  featured: boolean;
} 