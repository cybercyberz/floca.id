'use client';

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp
} from 'firebase/firestore';
import { Article, ArticleFormData } from '@/types/article';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// This is still a temporary in-memory store, but now it's shared across routes
// In a production app, this should be replaced with a proper database
export class ArticleStore {
  private cache: Map<string, Article> = new Map();
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private convertToArticle(doc: QueryDocumentSnapshot<DocumentData>): Article {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      imageUrl: data.imageUrl,
      category: data.category,
      author: data.author,
      status: data.status,
      featured: data.featured,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    };
  }

  private shouldRefreshCache(): boolean {
    return Date.now() - this.lastFetch > this.CACHE_DURATION;
  }

  private clearCache(): void {
    this.cache.clear();
    this.lastFetch = 0;
  }

  async getArticles(options: { 
    status?: 'published' | 'draft',
    featured?: boolean,
    category?: string,
    limit?: number 
  } = {}): Promise<Article[]> {
    try {
      if (this.lastFetch > 0 && !this.shouldRefreshCache()) {
        // Return cached articles if they're still fresh
        return Array.from(this.cache.values());
      }

      const articlesRef = collection(db, 'articles');
      const conditions = [];

      if (options.status) {
        conditions.push(where('status', '==', options.status));
      }
      if (options.featured !== undefined) {
        conditions.push(where('featured', '==', options.featured));
      }
      if (options.category) {
        conditions.push(where('category', '==', options.category));
      }

      conditions.push(orderBy('createdAt', 'desc'));
      
      if (options.limit) {
        conditions.push(limit(options.limit));
      }

      const q = query(articlesRef, ...conditions);
      const querySnapshot = await getDocs(q);
      
      this.clearCache();
      const articles = querySnapshot.docs.map(doc => {
        const article = this.convertToArticle(doc);
        this.cache.set(doc.id, article);
        return article;
      });

      this.lastFetch = Date.now();
      return articles;
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw new Error('Failed to fetch articles');
    }
  }

  async getArticleById(id: string): Promise<Article | null> {
    if (this.cache.has(id) && !this.shouldRefreshCache()) {
      return this.cache.get(id)!;
    }

    try {
      const docRef = doc(db, 'articles', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      const article = this.convertToArticle(docSnap);
      this.cache.set(id, article);
      return article;
    } catch (error) {
      console.error('Error fetching article:', error);
      throw new Error('Failed to fetch article');
    }
  }

  async createArticle(data: ArticleFormData): Promise<Article> {
    try {
      const articleData = {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'articles'), articleData);
      const newArticle = {
        id: docRef.id,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.cache.set(docRef.id, newArticle);
      return newArticle;
    } catch (error) {
      console.error('Error creating article:', error);
      throw new Error('Failed to create article');
    }
  }

  async updateArticle(id: string, data: Partial<ArticleFormData>): Promise<Article> {
    try {
      const docRef = doc(db, 'articles', id);
      const updateData = {
        ...data,
        updatedAt: Timestamp.now()
      };

      await updateDoc(docRef, updateData);
      
      // Update cache if the article exists in it
      if (this.cache.has(id)) {
        const existingArticle = this.cache.get(id)!;
        const updatedArticle = {
          ...existingArticle,
          ...data,
          updatedAt: new Date()
        };
        this.cache.set(id, updatedArticle);
        return updatedArticle;
      }

      // If not in cache, fetch the updated article
      const updated = await this.getArticleById(id);
      if (!updated) {
        throw new Error('Article not found after update');
      }
      return updated;
    } catch (error) {
      console.error('Error updating article:', error);
      throw new Error('Failed to update article');
    }
  }

  async deleteArticle(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'articles', id));
      this.cache.delete(id);
    } catch (error) {
      console.error('Error deleting article:', error);
      throw new Error('Failed to delete article');
    }
  }

  async getFeaturedArticles(limit: number = 5): Promise<Article[]> {
    return this.getArticles({ featured: true, status: 'published', limit });
  }

  async getPublishedArticles(category?: string, limit?: number): Promise<Article[]> {
    return this.getArticles({ status: 'published', category, limit });
  }
}

// Create and export a singleton instance
export const articleStore = new ArticleStore(); 