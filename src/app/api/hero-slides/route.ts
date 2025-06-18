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

    return NextResponse.json(slides);
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero slides' },
      { status: 500 }
    );
  }
} 