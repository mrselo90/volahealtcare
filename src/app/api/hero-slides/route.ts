import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET - Fetch active hero slides for public display
export async function GET() {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: {
        isActive: true
      },
      include: {
        translations: true
      },
      orderBy: {
        orderIndex: 'asc'
      }
    });

    const response = NextResponse.json(slides);
    
    // Cache for 5 minutes
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    
    return response;
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero slides' },
      { status: 500 }
    );
  }
} 