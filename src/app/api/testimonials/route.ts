import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/testimonials - Get all testimonials or by service
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get('serviceId');
    const approved = searchParams.get('approved');
    const featured = searchParams.get('featured');
    const language = searchParams.get('language') || 'en';

    const where: any = {};
    
    if (serviceId) {
      where.serviceId = serviceId;
    }
    
    if (approved === 'true') {
      where.isApproved = true;
    }
    
    if (featured === 'true') {
      where.isFeatured = true;
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      include: {
        service: {
          select: {
            title: true,
            slug: true
          }
        },
        user: {
          select: {
            name: true,
            image: true
          }
        },
        translations: {
          where: {
            language: language
          }
        }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    const response = NextResponse.json(testimonials);
    
    // Cache for 5 minutes with longer stale-while-revalidate
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=900');
    
    return response;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

// POST /api/testimonials - Create new testimonial
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      name,
      serviceId,
      rating,
      review,
      country,
      photoUrl,
      userId,
      translations
    } = data;

    // Validate required fields
    if (!name || !serviceId || !rating || !review || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Create testimonial
    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        serviceId,
        rating,
        review,
        country,
        photoUrl,
        userId,
        isApproved: false, // Default to false for moderation
        isFeatured: false,
        translations: translations ? {
          create: translations.map((t: any) => ({
            language: t.language,
            review: t.review
          }))
        } : undefined
      },
      include: {
        service: {
          select: {
            title: true,
            slug: true
          }
        },
        translations: true
      }
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}

// Helper function to map category IDs to treatment types
function getServiceCategory(categoryId: string): string {
  // This is a simplified mapping - you might want to fetch actual category data
  const categoryMap: { [key: string]: string } = {
    'dental': 'dental',
    'hair': 'hair-transplant',
    'aesthetic': 'facial',
    'body': 'body'
  };
  
  return categoryMap[categoryId] || 'other';
} 