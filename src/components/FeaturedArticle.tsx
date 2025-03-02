import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/types/article';

interface FeaturedArticleProps {
  article: Article;
}

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <section>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured Story</h2>
      <Link href={`/articles/${article.id}`} className="block">
        <div className="relative h-[500px] rounded-xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 1200px) 100vw, 1200px"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
            <span className="inline-block bg-blue-500 text-white text-sm px-3 py-1 rounded-full mb-3">
              {article.category}
            </span>
            <h1 className="text-4xl font-bold mb-2 group-hover:text-blue-200 transition-colors">
              {article.title}
            </h1>
            <p className="text-lg mb-4">
              {article.excerpt}
            </p>
            <div className="flex items-center text-sm">
              <span>By {article.author}</span>
              <span className="mx-2">•</span>
              <span>{article.date}</span>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
} 