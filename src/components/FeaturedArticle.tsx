import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { Article } from '@/types/article';

interface FeaturedArticleProps {
  articles: Article[];
  autoplaySpeed?: number;
}

export default function FeaturedArticle({ articles, autoplaySpeed = 5000 }: FeaturedArticleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
  }, [articles.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + articles.length) % articles.length);
  }, [articles.length]);

  useEffect(() => {
    if (!isPaused && articles.length > 1) {
      const slideInterval = setInterval(nextSlide, autoplaySpeed);
      return () => clearInterval(slideInterval);
    }
    return undefined;
  }, [nextSlide, isPaused, articles.length, autoplaySpeed]);

  if (articles.length === 0) return null;

  const article = articles[currentIndex];

  return (
    <section>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured Stories</h2>
      <div 
        className="relative h-[500px] rounded-xl overflow-hidden group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
        
        {/* Slideshow navigation buttons */}
        {articles.length > 1 && (
          <>
            <button 
              onClick={prevSlide} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button 
              onClick={nextSlide} 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        )}

        {/* Dots navigation */}
        {articles.length > 1 && (
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
            {articles.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  idx === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        <Link href={`/articles/${article.id}`} className="block h-full">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 1200px) 100vw, 1200px"
            priority
            quality={90}
            onError={(e) => {
              console.error('Error loading featured image:', article.imageUrl);
              const imgElement = e.target as HTMLImageElement;
              imgElement.style.display = 'none';
            }}
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
              <span>{article.createdAt.toLocaleDateString()}</span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
} 