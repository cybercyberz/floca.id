import Image from 'next/image';
import Link from 'next/link';

// This will be replaced with actual API call
const getMockArticle = (id: string) => ({
  id,
  title: 'Historic Climate Agreement Reached at International Summit',
  content: `
    In a landmark decision that will shape the future of global climate action, world leaders have reached a groundbreaking agreement at the International Climate Summit. The accord, which comes after intense negotiations spanning several days, sets ambitious targets for reducing greenhouse gas emissions and promotes sustainable development across all nations.

    The agreement, dubbed the "Global Climate Accord," commits participating nations to:
    
    • Reduce carbon emissions by 50% by 2030
    • Achieve carbon neutrality by 2050
    • Establish a $100 billion annual fund for climate adaptation
    • Implement strict regulations on industrial emissions
    
    Environmental experts have hailed this as a significant step forward in the fight against climate change, though some critics argue that even stronger measures are needed.
    
    The impact of this agreement will be far-reaching, affecting industries from energy to transportation, and requiring substantial changes in how businesses operate globally.
  `,
  category: 'Politics',
  imageUrl: 'https://picsum.photos/1200/600?random=0',
  date: 'Feb 28, 2024',
  author: 'Sarah Johnson',
  authorRole: 'Senior Environmental Correspondent',
  readTime: '5 min read',
});

export default function ArticlePage({ params }: { params: { id: string } }) {
  const article = getMockArticle(params.id);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <Link
            href={`/category/${article.category.toLowerCase()}`}
            className="text-blue-600 hover:underline"
          >
            {article.category}
          </Link>
          <span>•</span>
          <time>{article.date}</time>
          <span>•</span>
          <span>{article.readTime}</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gray-200" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{article.author}</div>
            <div className="text-sm text-gray-500">{article.authorRole}</div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="relative h-[400px] mb-8 rounded-lg overflow-hidden">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        {article.content.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Share Buttons */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h2>
        <div className="flex space-x-4">
          {['Twitter', 'Facebook', 'LinkedIn', 'Email'].map((platform) => (
            <button
              key={platform}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              {platform}
            </button>
          ))}
        </div>
      </div>
    </article>
  );
} 