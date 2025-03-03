import Image from 'next/image';
import Link from 'next/link';
import { Article } from '@/types/article';

interface NewsCardProps {
  article: Article;
}

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <Link href={`/articles/${article.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
            onError={(e) => {
              console.error('Error loading image:', article.imageUrl);
              const imgElement = e.target as HTMLImageElement;
              imgElement.style.display = 'none';
            }}
          />
        </div>
        <div className="p-4">
          <div className="text-sm text-blue-600 mb-2">{article.category}</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{article.author}</span>
            <span>{article.date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
} 