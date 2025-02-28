import { Article } from '@/types/article';

// This is still a temporary in-memory store, but now it's shared across routes
// In a production app, this should be replaced with a proper database
class ArticleStore {
  private static instance: ArticleStore;
  private articles: Article[] = [
    {
      id: '1',
      title: 'Breaking: Major Technology Breakthrough in Renewable Energy',
      excerpt: 'Scientists have discovered a new method to improve solar panel efficiency by 40%, potentially revolutionizing renewable energy production.',
      content: 'Full article content here...',
      category: 'Technology',
      imageUrl: 'https://picsum.photos/800/600?random=1',
      date: 'Feb 28, 2024',
      author: 'John Doe',
      status: 'published',
      featured: true
    },
    {
      id: '2',
      title: 'Global Economic Summit Addresses Climate Change',
      excerpt: 'World leaders gather to discuss economic policies aimed at combating climate change and promoting sustainable development.',
      content: 'Full article content here...',
      category: 'Politics',
      imageUrl: 'https://picsum.photos/800/600?random=2',
      date: 'Feb 28, 2024',
      author: 'Jane Smith',
      status: 'draft',
      featured: false
    },
  ];

  private constructor() {
    console.log('ArticleStore initialized with articles:', this.articles);
  }

  public static getInstance(): ArticleStore {
    if (!ArticleStore.instance) {
      ArticleStore.instance = new ArticleStore();
    }
    return ArticleStore.instance;
  }

  public getArticles(): Article[] {
    console.log('Getting all articles:', this.articles);
    return this.articles;
  }

  public getArticleById(id: string): Article | undefined {
    console.log(`Looking for article with id: ${id}`);
    const article = this.articles.find(article => article.id === id);
    console.log('Found article:', article);
    return article;
  }

  public addArticle(article: Article): void {
    console.log('Adding new article:', article);
    this.articles.push(article);
    console.log('Current articles:', this.articles);
  }

  public updateArticle(id: string, updatedArticle: Article): boolean {
    console.log(`Updating article with id: ${id}`, updatedArticle);
    const index = this.articles.findIndex(article => article.id === id);
    if (index === -1) {
      console.log('Article not found for update');
      return false;
    }
    this.articles[index] = { ...updatedArticle, id }; // Ensure ID doesn't change
    console.log('Article updated successfully');
    return true;
  }

  public deleteArticle(id: string): boolean {
    console.log(`Deleting article with id: ${id}`);
    const index = this.articles.findIndex(article => article.id === id);
    if (index === -1) {
      console.log('Article not found for deletion');
      return false;
    }
    this.articles.splice(index, 1);
    console.log('Article deleted successfully');
    return true;
  }
}

export const articleStore = ArticleStore.getInstance(); 