'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Article } from '@/types/article';
import { articleStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import Image from 'next/image';

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is authenticated and has admin privileges
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      try {
        // Get ID token result to check custom claims
        const idTokenResult = await user.getIdTokenResult();
        
        // Check if user has admin claim
        if (idTokenResult.claims.admin === true) {
          setIsAdmin(true);
        } else {
          setError('You do not have admin privileges');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setError('Failed to verify admin privileges');
      }
    };
    
    if (!loading && user) {
      checkAdminStatus();
    }
  }, [user, loading]);

  // Fetch articles when user is authenticated and has admin privileges
  useEffect(() => {
    const fetchArticles = async () => {
      if (!isAdmin) return;
      
      try {
        const fetchedArticles = await articleStore.getArticles();
        setArticles(fetchedArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError('Failed to load articles');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAdmin) {
      fetchArticles();
    } else if (!loading) {
      setIsLoading(false);
    }
  }, [isAdmin, loading]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      await articleStore.deleteArticle(id);
      setArticles(articles.filter(article => article.id !== id));
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article');
    }
  };

  if (loading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Articles</h1>
        <Link
          href="/admin/articles/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          New Article
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {articles.length === 0 ? (
          <div className="px-4 py-6 text-center text-gray-500">
            No articles found. Create your first article by clicking the "New Article" button.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {articles.map(article => (
              <li key={article.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {article.imageUrl && (
                        <div className="relative w-16 h-16">
                          <Image
                            src={article.imageUrl}
                            alt={article.title}
                            fill
                            className="object-cover rounded"
                            sizes="64px"
                          />
                        </div>
                      )}
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">{article.title}</h2>
                        <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                          <span>{article.category}</span>
                          <span>•</span>
                          <span>{article.status}</span>
                          {article.featured && (
                            <>
                              <span>•</span>
                              <span className="text-blue-600">Featured</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 