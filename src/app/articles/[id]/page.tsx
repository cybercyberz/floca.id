import Image from 'next/image';
import { Article } from '@/types/article';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getArticle(id: string): Promise<Article | null> {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000' 
        : '';

    const res = await fetch(`${baseUrl}/api/articles/${id}`, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch article');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching article:', error);
    throw error;
  }
}

export default async function ArticlePage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const article = await getArticle(params.id);

  if (!article || article.status !== 'published') {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Link
            href={`/?category=${article.category}`}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
          >
            {article.category}
          </Link>
          <span>•</span>
          <time>{article.date}</time>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          {article.excerpt}
        </p>
        <div className="flex items-center text-sm text-gray-600">
          <span>By {article.author}</span>
        </div>
      </header>

      {/* Featured Image */}
      <div className="relative h-[400px] md:h-[500px] mb-8 rounded-lg overflow-hidden">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover"
          sizes="(max-width: 1200px) 100vw, 1200px"
          priority
        />
      </div>

      {/* Article Content */}
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Back to Home */}
      <div className="mt-12 border-t pt-8">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Home
        </Link>
      </div>
    </article>
  );
} 