import { NextResponse } from 'next/server';
import { Article } from '@/types/article';
import { articleSchema } from '@/lib/validations';
import { ZodError } from 'zod';
import { articleStore } from '@/lib/store';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const article = articleStore.getArticleById(params.id);

  if (!article) {
    return NextResponse.json(
      { error: 'Article not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(article);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = articleSchema.parse(body);
    const existingArticle = articleStore.getArticleById(params.id);
    
    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    const success = articleStore.updateArticle(params.id, {
      ...validatedData,
      id: params.id, // Ensure ID doesn't change
      date: existingArticle.date, // Keep the original date
    });

    if (!success) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(articleStore.getArticleById(params.id));
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const success = articleStore.deleteArticle(params.id);

  if (!success) {
    return NextResponse.json(
      { error: 'Article not found' },
      { status: 404 }
    );
  }

  return new NextResponse(null, { status: 204 });
} 