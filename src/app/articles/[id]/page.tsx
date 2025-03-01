'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { articleStore } from '@/lib/store';

export default function ArticlePage({ params }: { params: { id: string } }) {
  const article = articleStore.getArticleById(params.id);

  if (!article || article.status !== 'published') {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/" className="text-blue-600 hover:text-blue-800 mb-8 inline-block">
        ← Back to Home
      </Link>
      
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
          <div className="flex items-center text-gray-600 mb-4">
            <span>By {article.author}</span>
            <span className="mx-2">•</span>
            <span>{article.date}</span>
            <span className="mx-2">•</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {article.category}
            </span>
          </div>
          <p className="text-xl text-gray-600">
            {article.excerpt}
          </p>
        </header>

        <div className="relative h-[400px] mb-8">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 896px) 100vw, 896px"
            priority
          />
        </div>

        <div className="prose prose-lg max-w-none">
          {article.content}
        </div>
      </article>
    </div>
  );
} 