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
  private collection = collection(db, 'articles');

  async getArticles(): Promise<Article[]> {
    try {
      const querySnapshot = await getDocs(
        query(this.collection, orderBy('date', 'desc'))
      );
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Article[];
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  }

  async getPublishedArticles(): Promise<Article[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          this.collection,
          where('status', '==', 'published'),
          orderBy('date', 'desc')
        )
      );
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Article[];
    } catch (error) {
      console.error('Error fetching published articles:', error);
      throw error;
    }
  }

  async getFeaturedArticles(limitCount: number = 5): Promise<Article[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          this.collection,
          where('status', '==', 'published'),
          where('featured', '==', true),
          orderBy('date', 'desc')
        )
      );
      
      return querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Article[];
    } catch (error) {
      console.error('Error fetching featured articles:', error);
      throw error;
    }
  }

  async getArticleById(id: string): Promise<Article | null> {
    try {
      const docRef = doc(this.collection, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }

      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Article;
    } catch (error) {
      console.error('Error fetching article:', error);
      throw error;
    }
  }

  async createArticle(article: Omit<Article, 'id'>): Promise<Article> {
    try {
      const docRef = await addDoc(this.collection, article);
      return {
        id: docRef.id,
        ...article
      };
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  }

  async updateArticle(id: string, article: Partial<Article>): Promise<boolean> {
    try {
      const docRef = doc(this.collection, id);
      await updateDoc(docRef, article);
      return true;
    } catch (error) {
      console.error('Error updating article:', error);
      throw error;
    }
  }

  async deleteArticle(id: string): Promise<boolean> {
    try {
      const docRef = doc(this.collection, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting article:', error);
      throw error;
    }
  }
}

export const articleStore = new ArticleStore(); 