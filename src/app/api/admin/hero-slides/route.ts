import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET - Fetch all hero slides
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || 
        (session.user.email !== 'admin@volahealthistanbul.com' &&
         session.user.email !== 'admin@example.com' &&
         session.user.email !== 'admin@volahealth.com')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const slides = await prisma.heroSlide.findMany({
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

// POST - Create new hero slide
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || 
        (session.user.email !== 'admin@volahealthistanbul.com' &&
         session.user.email !== 'admin@example.com' &&
         session.user.email !== 'admin@volahealth.com')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      title, 
      subtitle, 
      category, 
      imageUrl, 
      videoUrl,
      mediaType = 'image',
      videoPoster,
      orderIndex, 
      isActive,
      translations = []
    } = body;

    // Create the slide
    const slide = await prisma.heroSlide.create({
      data: {
        title,
        subtitle,
        category,
        imageUrl,
        videoUrl,
        mediaType,
        videoPoster,
        orderIndex,
        isActive,
        translations: {
          create: translations.map((translation: any) => ({
            language: translation.language,
            title: translation.title,
            subtitle: translation.subtitle,
            category: translation.category,
          }))
        }
      },
      include: {
        translations: true
      }
    });

    return NextResponse.json(slide);
  } catch (error) {
    console.error('Error creating hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to create hero slide' },
      { status: 500 }
    );
  }
} 