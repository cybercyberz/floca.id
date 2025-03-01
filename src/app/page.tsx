'use client';

import { useState } from 'react';
import NewsCard from '@/components/NewsCard';
import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/types/article';
import { articleStore } from '@/lib/store';

function filterArticles(articles: Article[], category: string): Article[] {
  return articles.filter((article: Article) => 
    article.status === 'published' && 
    (category === 'All' || article.category === category)
  );
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const articles = articleStore.getArticles();
  const publishedArticles = filterArticles(articles, selectedCategory);
  const featuredArticle = publishedArticles.find((article: Article) => article.featured) || publishedArticles[0];

  if (articles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-600">
          No articles found. Create some articles in the admin dashboard.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Featured Article Section */}
      {featuredArticle && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured Story</h2>
          <Link href={`/articles/${featuredArticle.id}`} className="block">
            <div className="relative h-[500px] rounded-xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
              <Image
                src={featuredArticle.imageUrl}
                alt={featuredArticle.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                <span className="inline-block bg-blue-500 text-white text-sm px-3 py-1 rounded-full mb-3">
                  {featuredArticle.category}
                </span>
                <h1 className="text-4xl font-bold mb-2 group-hover:text-blue-200 transition-colors">
                  {featuredArticle.title}
                </h1>
                <p className="text-lg mb-4">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center text-sm">
                  <span>By {featuredArticle.author}</span>
                  <span className="mx-2">•</span>
                  <span>{featuredArticle.date}</span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Latest News Grid with Category Filter */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-2xl font-bold text-gray-900">Latest News</h2>
          <div className="flex flex-wrap gap-2">
            {['All', 'Politics', 'Technology', 'Sports', 'Entertainment', 'Business'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedArticles
            .filter((article: Article) => article.id !== featuredArticle?.id)
            .map((article: Article) => (
              <Link key={article.id} href={`/articles/${article.id}`}>
                <NewsCard {...article} />
              </Link>
            ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Trending Now</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <ul className="space-y-4">
            {publishedArticles
              .slice(0, 5)
              .map((article: Article, index: number) => (
                <li key={article.id}>
                  <Link 
                    href={`/articles/${article.id}`}
                    className="flex items-center space-x-4 group"
                  >
                    <span className="text-2xl font-bold text-blue-500 group-hover:text-blue-700">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {article.date} • By {article.author}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
