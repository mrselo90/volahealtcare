import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        services: {
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            featured: true,
            images: true,
            categoryId: true,
            anesthesia: true,
            // Package Details
            timeInTurkey: true,
            operationTime: true,
            hospitalStay: true,
            recovery: true,
            accommodation: true,
            transportation: true,
            // Include translations for multilingual support
            translations: {
              select: {
                language: true,
                title: true,
                description: true,
                content: true,
              },
            },
          },
        },
      },
    });
    
    const response = NextResponse.json(categories);
    
    // Cache categories for 5 minutes with stale-while-revalidate
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=900');
    
    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
