import { NextRequest, NextResponse } from 'next/server';
import { Article } from '@/types/article';
import { articleSchema } from '@/lib/validations';
import { z } from 'zod';
import { articleStore } from '@/lib/store';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const article = await articleStore.getArticleById(params.id);
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = articleSchema.parse(body);

    const existingArticle = await articleStore.getArticleById(params.id);
    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    await articleStore.updateArticle(params.id, {
      ...validatedData,
      // No need to set createdAt as it will be preserved by the store
    });

    return NextResponse.json({ message: 'Article updated successfully' });
  } catch (error) {
    console.error('Error updating article:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid article data', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await articleStore.deleteArticle(params.id);
    
    return NextResponse.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
} 