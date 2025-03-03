'use client';

import { Article } from '@/types/article';
import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  query, 
  where,
  orderBy,
  limit,
  DocumentData,
  QuerySnapshot,
  setDoc,
  writeBatch
} from 'firebase/firestore';

// This is still a temporary in-memory store, but now it's shared across routes
// In a production app, this should be replaced with a proper database
export class ArticleStore {
  private articlesCollection = collection(db, 'articles');
  private cache: Map<string, Article> = new Map();
  private lastCacheUpdate: number = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

  private isCacheValid(): boolean {
    return Date.now() - this.lastCacheUpdate < this.CACHE_TTL;
  }

  private updateCacheTimestamp(): void {
    this.lastCacheUpdate = Date.now();
  }

  async getArticles(): Promise<Article[]> {
    try {
      // Always fetch fresh data in SSR
      if (typeof window === 'undefined' || !this.isCacheValid()) {
        this.clearCache();
      }

      const snapshot = await getDocs(this.articlesCollection);
      const articles = snapshot.docs.map(doc => {
        const article = { id: doc.id, ...doc.data() } as Article;
        this.cache.set(doc.id, article);
        return article;
      });
      this.updateCacheTimestamp();
      return articles;
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  }

  async getPublishedArticles(): Promise<Article[]> {
    try {
      // Always fetch fresh data in SSR
      if (typeof window === 'undefined' || !this.isCacheValid()) {
        this.clearCache();
      }

      const querySnapshot = await getDocs(
        query(
          this.articlesCollection,
          where('status', '==', 'published'),
          orderBy('date', 'desc')
        )
      );
      
      const articles = querySnapshot.docs.map(doc => {
        const article = { id: doc.id, ...doc.data() } as Article;
        this.cache.set(doc.id, article);
        return article;
      });
      this.updateCacheTimestamp();
      return articles;
    } catch (error) {
      console.error('Error fetching published articles:', error);
      throw error;
    }
  }

  async getFeaturedArticles(limitCount: number = 5): Promise<Article[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          this.articlesCollection,
          where('status', '==', 'published'),
          where('featured', '==', true),
          orderBy('date', 'desc'),
          limit(limitCount)
        )
      );
      
      const articles = querySnapshot.docs.map(doc => {
        const article = { id: doc.id, ...doc.data() } as Article;
        this.cache.set(doc.id, article);
        return article;
      });
      return articles;
    } catch (error) {
      console.error('Error fetching featured articles:', error);
      throw error;
    }
  }

  async getArticle(id: string): Promise<Article | null> {
    try {
      // Check cache first if we're in the browser and cache is valid
      if (typeof window !== 'undefined' && this.isCacheValid() && this.cache.has(id)) {
        return this.cache.get(id)!;
      }

      const docRef = doc(this.articlesCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const article = { id: docSnap.id, ...docSnap.data() } as Article;
        this.cache.set(id, article);
        this.updateCacheTimestamp();
        return article;
      }
      return null;
    } catch (error) {
      console.error('Error fetching article:', error);
      throw error;
    }
  }

  async createArticle(article: Omit<Article, 'id'>): Promise<Article> {
    try {
      const docRef = await addDoc(this.articlesCollection, article);
      const newArticle = { id: docRef.id, ...article };
      this.cache.set(docRef.id, newArticle);
      return newArticle;
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  }

  async updateArticle(id: string, article: Partial<Article>): Promise<void> {
    try {
      console.log('Updating article with data:', { id, article });
      
      // Ensure imageUrl is included in the update
      if (!article.imageUrl && this.cache.has(id)) {
        const existingArticle = this.cache.get(id)!;
        article.imageUrl = existingArticle.imageUrl;
      }

      const docRef = doc(this.articlesCollection, id);
      await setDoc(docRef, article, { merge: true });
      
      // Update cache
      if (this.cache.has(id)) {
        const existingArticle = this.cache.get(id)!;
        this.cache.set(id, { ...existingArticle, ...article });
      }
      
      console.log('Article updated successfully with data:', article);
    } catch (error) {
      console.error('Error updating article:', error);
      throw error;
    }
  }

  async deleteArticle(id: string): Promise<void> {
    try {
      console.log('Deleting article with ID:', id);
      const docRef = doc(this.articlesCollection, id);
      
      // Create a batch
      const batch = writeBatch(db);
      
      // Add delete operation to batch
      batch.delete(docRef);
      
      // Commit the batch
      await batch.commit();
      
      // Remove from cache
      this.cache.delete(id);
      
      console.log('Article successfully deleted');
    } catch (error) {
      console.error('Error deleting article:', error);
      throw error;
    }
  }

  async fixAllArticleImageUrls(): Promise<void> {
    try {
      console.log('Starting to fix all article image URLs...');
      const snapshot = await getDocs(this.articlesCollection);
      const batch = writeBatch(db);
      let updateCount = 0;

      for (const docSnapshot of snapshot.docs) {
        const article = docSnapshot.data() as Article;
        if (article.imageUrl) {
          // Check if the URL needs to be updated
          if (!article.imageUrl.includes('res.cloudinary.com')) {
            const updatedUrl = article.imageUrl.replace(/\/\/[^/]+\//, '//res.cloudinary.com/');
            console.log(`Updating article ${docSnapshot.id}:`, {
              oldUrl: article.imageUrl,
              newUrl: updatedUrl
            });
            
            const docRef = doc(this.articlesCollection, docSnapshot.id);
            batch.update(docRef, { imageUrl: updatedUrl });
            updateCount++;
          }
        }
      }

      if (updateCount > 0) {
        await batch.commit();
        console.log(`Successfully updated ${updateCount} articles`);
        // Clear cache to ensure fresh data on next fetch
        this.clearCache();
      } else {
        console.log('No articles needed URL updates');
      }
    } catch (error) {
      console.error('Error fixing article URLs:', error);
      throw error;
    }
  }

  // Clear cache and reset timestamp
  clearCache(): void {
    this.cache.clear();
    this.lastCacheUpdate = 0;
  }
}

export const articleStore = new ArticleStore(); 