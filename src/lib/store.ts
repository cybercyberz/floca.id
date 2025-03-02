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
  DocumentData
} from 'firebase/firestore';

// This is still a temporary in-memory store, but now it's shared across routes
// In a production app, this should be replaced with a proper database
class ArticleStore {
  private articles: Article[] = [];
  private initialized: boolean = false;
  private readonly COLLECTION_NAME = 'articles';

  constructor() {
    console.log('ArticleStore initialized');
    this.loadArticles();
  }

  private async loadArticles() {
    try {
      const articlesRef = collection(db, this.COLLECTION_NAME);
      const q = query(articlesRef, orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      
      this.articles = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Article[];
      
      this.initialized = true;
      console.log('Articles loaded from Firestore:', this.articles);
    } catch (error) {
      console.error('Error loading articles:', error);
      throw error;
    }
  }

  public async addArticle(article: Omit<Article, 'id'>): Promise<Article> {
    try {
      const articlesRef = collection(db, this.COLLECTION_NAME);
      const docRef = await addDoc(articlesRef, {
        ...article,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      });

      const newArticle = { ...article, id: docRef.id } as Article;
      this.articles.unshift(newArticle); // Add to start of array
      console.log('Article added successfully:', newArticle);
      return newArticle;
    } catch (error) {
      console.error('Error adding article:', error);
      throw error;
    }
  }

  public async updateArticle(id: string, updates: Partial<Article>): Promise<boolean> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, id);
      await updateDoc(docRef, updates);
      
      const index = this.articles.findIndex(a => a.id === id);
      if (index !== -1) {
        this.articles[index] = { ...this.articles[index], ...updates };
      }
      
      console.log('Article updated successfully:', id);
      return true;
    } catch (error) {
      console.error('Error updating article:', error);
      throw error;
    }
  }

  public async deleteArticle(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, this.COLLECTION_NAME, id));
      this.articles = this.articles.filter(article => article.id !== id);
      console.log('Article deleted successfully:', id);
      return true;
    } catch (error) {
      console.error('Error deleting article:', error);
      throw error;
    }
  }

  public async getArticleById(id: string): Promise<Article | null> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { ...docSnap.data(), id: docSnap.id } as Article;
      }
      return null;
    } catch (error) {
      console.error('Error getting article:', error);
      throw error;
    }
  }

  public async getArticles(): Promise<Article[]> {
    if (!this.initialized) {
      await this.loadArticles();
    }
    return this.articles;
  }

  public async getPublishedArticles(): Promise<Article[]> {
    try {
      const articlesRef = collection(db, this.COLLECTION_NAME);
      const q = query(
        articlesRef,
        where('status', '==', 'published'),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Article[];
    } catch (error) {
      console.error('Error getting published articles:', error);
      throw error;
    }
  }

  public async getFeaturedArticles(limitCount: number = 3): Promise<Article[]> {
    try {
      const articlesRef = collection(db, this.COLLECTION_NAME);
      const q = query(
        articlesRef,
        where('status', '==', 'published'),
        where('featured', '==', true),
        orderBy('date', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Article[];
    } catch (error) {
      console.error('Error getting featured articles:', error);
      throw error;
    }
  }
}

export const articleStore = new ArticleStore(); 