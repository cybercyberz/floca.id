import Link from 'next/link';
import { Article } from '@/types/article';
import NewsCard from '@/components/NewsCard';

interface ArticleGridProps {
  articles: Article[];
}

export default function ArticleGrid({ articles }: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <p className="text-center text-gray-600">No articles found in this category.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map(article => (
        <Link key={article.id} href={`/articles/${article.id}`}>
          <NewsCard article={article} />
        </Link>
      ))}
    </div>
  );
} 