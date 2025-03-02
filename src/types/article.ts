export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string;
  author: string;
  date: string;
  status: 'draft' | 'published';
  featured: boolean;
}

// ArticleFormData is what we get from the form, without id and date
export type ArticleFormData = Omit<Article, 'id' | 'date'>;

// For creating a new article, we need everything except the id
export type NewArticle = Omit<Article, 'id'>; 