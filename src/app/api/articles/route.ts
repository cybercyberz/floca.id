import { NextResponse } from 'next/server';
import { Article, NewArticle } from '@/types/article';
import { articleSchema } from '@/lib/validations';
import { ZodError } from 'zod';
import { articleStore } from '@/lib/store';

export async function GET() {
  try {
    const articles = await articleStore.getArticles();
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received article data:', body);
    
    // Validate the request body
    try {
      const validatedData = articleSchema.parse(body);
      console.log('Validation successful:', validatedData);
      
      const newArticle: NewArticle = {
        ...validatedData,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
      };

      const createdArticle = await articleStore.createArticle(newArticle);
      console.log('Article created successfully:', createdArticle);
      return NextResponse.json(createdArticle, { status: 201 });
    } catch (validationError) {
      console.error('Validation error:', validationError);
      if (validationError instanceof ZodError) {
        return NextResponse.json(
          { error: 'Validation failed', details: validationError.errors },
          { status: 400 }
        );
      }
      throw validationError;
    }
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 